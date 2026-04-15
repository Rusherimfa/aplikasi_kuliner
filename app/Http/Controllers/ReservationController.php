<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Events\ReservationCreated;
use App\Models\AdminNotification;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\TableSeat;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource for the staff dashboard.
     */
    public function index(Request $request)
    {
        $team = $this->resolveTeam($request);
        $this->markReservationNotificationsAsRead($request, $team);

        $reservations = Reservation::with(['user', 'table', 'seat'])
            ->where('team_id', $team->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'user_name' => $reservation->user->name,
                    'user_email' => $reservation->user->email,
                    'table_code' => $reservation->table?->code,
                    'seat_label' => $reservation->seat?->label,
                    'date' => $reservation->date,
                    'time' => $reservation->time,
                    'guest_count' => $reservation->guest_count,
                    'status' => $reservation->status?->value ?? BookingStatus::Pending->value,
                    'special_requests' => $reservation->special_requests,
                    'table_id' => $reservation->restaurant_table_id,
                ];
            });

        return Inertia::render('dashboard/reservations', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Show the form for creating a new public reservation.
     */
    public function create(Request $request)
    {
        $defaultTeam = Team::query()->first();

        return Inertia::render('reservations/create', [
            'seatingLayout' => $defaultTeam ? $this->seatingLayoutData($defaultTeam) : [],
        ]);
    }

    /**
     * Store a newly created public reservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:20',
            'table_seat_id' => 'required|integer|exists:table_seats,id',
            'special_requests' => 'nullable|string|max:500',
            'resto_table_id' => 'required|exists:resto_tables,id',
            'menus' => 'nullable|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.quantity' => 'required|integer|min:1',
        ]);

        $defaultTeam = Team::first();
        if (! $defaultTeam) {
            abort(500, 'System misconfiguration: No master team found.');
        }

        $reservation = DB::transaction(function () use ($validated, $defaultTeam) {
            $seat = TableSeat::query()
                ->where('id', $validated['table_seat_id'])
                ->where('team_id', $defaultTeam->id)
                ->where('is_active', true)
                ->lockForUpdate()
                ->first();

            if (! $seat) {
                throw ValidationException::withMessages([
                    'table_seat_id' => 'Kursi yang dipilih tidak tersedia.',
                ]);
            }

            $alreadyBooked = Reservation::query()
                ->where('team_id', $defaultTeam->id)
                ->where('table_seat_id', $seat->id)
                ->where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->whereIn('status', BookingStatus::activeSeatLocks())
                ->exists();

            if ($alreadyBooked) {
                throw ValidationException::withMessages([
                    'table_seat_id' => 'Kursi ini sudah dipesan pada tanggal dan waktu tersebut.',
                ]);
            }

            return Reservation::create([
                'team_id' => $defaultTeam->id,
                'restaurant_table_id' => $seat->restaurant_table_id,
                'table_seat_id' => $seat->id,
                'user_id' => Auth::id(),
                'date' => $validated['date'],
                'time' => $validated['time'],
                'guest_count' => $validated['guest_count'],
                'special_requests' => $validated['special_requests'],
                'status' => BookingStatus::Pending,
            ]);
        });

        $this->notifyAdminsForNewReservation($reservation, $defaultTeam);
        broadcast(new ReservationCreated($reservation));

        return redirect()
            ->route('dashboard')
            ->with('success', 'Reservasi berhasil ditambahkan. Tim admin akan segera meninjau pesanan Anda.');
    }

    /**
     * Update the specified reservation status (Dashboard).
     */
    public function update(Request $request, Reservation|string $reservation)
    {
        $team = $this->resolveTeam($request);

        if (is_string($reservation)) {
            $reservation = Reservation::query()
                ->where('id', $reservation)
                ->where('team_id', $team->id)
                ->firstOrFail();
        } else {
            abort_if($reservation->team_id !== $team->id, 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:'.collect(BookingStatus::cases())->map(fn (BookingStatus $status) => $status->value)->implode(','),
        ]);

        $newStatus = BookingStatus::from($validated['status']);

        $payload = ['status' => $newStatus];

        if ($newStatus === BookingStatus::Confirmed) {
            $payload['status'] = BookingStatus::WaitingPayment;
            $payload['confirmed_at'] = now();

            Payment::query()->firstOrCreate(
                ['reservation_id' => $reservation->id],
                [
                    'invoice_number' => 'INV-'.($reservation->booking_number ?: now()->format('YmdHis').'-'.$reservation->id),
                    'amount' => (int) $reservation->items()->sum('subtotal'),
                    'status' => PaymentStatus::WaitingPayment,
                    'deadline_at' => now()->addHours(2),
                ],
            );
        }

        if ($newStatus === BookingStatus::Rejected) {
            $payload['rejected_at'] = now();
        }

        if ($newStatus === BookingStatus::Completed) {
            $payload['completed_at'] = now();
        }

        if ($newStatus === BookingStatus::Occupied) {
            $payload['occupied_at'] = now();
        }

        if ($newStatus === BookingStatus::Cancelled) {
            $payload['cancelled_at'] = now();
        }

        if ($newStatus === BookingStatus::Expired) {
            $payload['expired_at'] = now();
        }

        if ($newStatus === BookingStatus::Paid) {
            $payload['paid_at'] = now();
        }

        $reservation->update($payload);

        return back()->with('success', 'Reservation status updated.');
    }

    /**
     * Resolve active team from route binding or authenticated user.
     */
    private function resolveTeam(Request $request): Team
    {
        $team = $request->route('current_team');

        if ($team instanceof Team) {
            return $team;
        }

        if (is_string($team)) {
            $resolvedTeam = Team::query()->where('slug', $team)->first();

            if ($resolvedTeam) {
                return $resolvedTeam;
            }
        }

        /** @var User|null $user */
        $user = $request->user();
        $fallbackTeam = $user?->currentTeam ?? $user?->personalTeam();

        abort_if(! $fallbackTeam, 403);

        return $fallbackTeam;
    }

    /**
     * Build seating layout data for user/admin rendering.
     *
     * @return array<int, array<string, mixed>>
     */
    private function seatingLayoutData(Team $team): array
    {
        $tableIds = $team->restaurantTables()->pluck('id');
        $reservedSeatIds = Reservation::query()
            ->where('team_id', $team->id)
            ->whereIn('status', BookingStatus::activeSeatLocks())
            ->whereIn('restaurant_table_id', $tableIds)
            ->pluck('table_seat_id')
            ->filter()
            ->map(fn ($seatId) => (int) $seatId)
            ->all();

        return $team->restaurantTables()
            ->with(['seats' => fn ($query) => $query->orderBy('seat_number')])
            ->orderBy('code')
            ->get()
            ->map(function ($table) use ($reservedSeatIds) {
                return [
                    'id' => $table->id,
                    'code' => $table->code,
                    'name' => $table->name,
                    'seat_count' => $table->seat_count,
                    'seats' => $table->seats->map(fn ($seat) => [
                        'id' => $seat->id,
                        'label' => $seat->label,
                        'seat_number' => $seat->seat_number,
                        'is_active' => (bool) $seat->is_active,
                        'is_reserved' => in_array((int) $seat->id, $reservedSeatIds, true),
                    ])->values()->all(),
                ];
            })
            ->values()
            ->all();
    }

    private function notifyAdminsForNewReservation(Reservation $reservation, Team $team): void
    {
        if (! Schema::hasTable('admin_notifications')) {
            return;
        }

        $adminIds = User::query()
            ->whereIn('role', [UserRole::Admin->value, UserRole::SuperAdmin->value])
            ->whereHas('teams', fn ($query) => $query->where('teams.id', $team->id))
            ->pluck('id');

        if ($adminIds->isEmpty()) {
            return;
        }

        $timestamp = now();

        AdminNotification::insert(
            $adminIds
                ->map(fn (int $recipientUserId) => [
                    'team_id' => $team->id,
                    'recipient_user_id' => $recipientUserId,
                    'actor_user_id' => $reservation->user_id,
                    'reservation_id' => $reservation->id,
                    'type' => 'reservation_created',
                    'is_read' => false,
                    'read_at' => null,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ])
                ->all(),
        );
    }

    private function markReservationNotificationsAsRead(Request $request, Team $team): void
    {
        if (! Schema::hasTable('admin_notifications')) {
            return;
        }

        $recipientUserId = $request->user()?->id;

        if (! $recipientUserId) {
            return;
        }

        AdminNotification::query()
            ->where('team_id', $team->id)
            ->where('recipient_user_id', $recipientUserId)
            ->where('type', 'reservation_created')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }
}
