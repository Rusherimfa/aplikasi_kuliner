<?php

namespace App\Http\Controllers\Bookings;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Events\ReservationCreated;
use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\BookingItem;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\TableSeat;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Show booking form for user with seating map and food list.
     */
    public function create(Request $request): Response
    {
        $team = $this->teamFromRequest($request);

        return Inertia::render('reservations/create', [
            'seatingLayout' => $this->seatingLayoutData($team),
            'foods' => Menu::query()
                ->where('team_id', $team->id)
                ->where('is_available', true)
                ->orderBy('name')
                ->get(['id', 'name', 'price', 'category']),
        ]);
    }

    /**
     * Store new booking from user.
     */
    public function store(Request $request)
    {
        $team = $this->teamFromRequest($request);
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:20',
            'table_seat_id' => 'required|integer|exists:table_seats,id',
            'special_requests' => 'nullable|string|max:500',
            'items' => 'nullable|array',
            'items.*.menu_id' => 'required_with:items|integer|exists:menus,id',
            'items.*.quantity' => 'required_with:items|integer|min:1|max:20',
        ]);

        $reservation = DB::transaction(function () use ($validated, $request, $team) {
            $seat = TableSeat::query()
                ->where('id', $validated['table_seat_id'])
                ->where('team_id', $team->id)
                ->where('is_active', true)
                ->lockForUpdate()
                ->first();

            if (! $seat) {
                throw ValidationException::withMessages([
                    'table_seat_id' => 'Kursi tidak tersedia.',
                ]);
            }

            $isLocked = Reservation::query()
                ->where('team_id', $team->id)
                ->where('table_seat_id', $seat->id)
                ->where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->whereIn('status', BookingStatus::activeSeatLocks())
                ->exists();

            if ($isLocked) {
                throw ValidationException::withMessages([
                    'table_seat_id' => 'Kursi sudah dipesan untuk slot tersebut.',
                ]);
            }

            $reservation = Reservation::query()->create([
                'booking_number' => $this->generateBookingNumber(),
                'team_id' => $team->id,
                'restaurant_table_id' => $seat->restaurant_table_id,
                'table_seat_id' => $seat->id,
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'time' => $validated['time'],
                'guest_count' => $validated['guest_count'],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => BookingStatus::Pending,
            ]);

            if (! empty($validated['items'])) {
                $menuMap = Menu::query()
                    ->where('team_id', $team->id)
                    ->whereIn('id', collect($validated['items'])->pluck('menu_id'))
                    ->get()
                    ->keyBy('id');

                foreach ($validated['items'] as $item) {
                    $menu = $menuMap->get($item['menu_id']);

                    if (! $menu) {
                        continue;
                    }

                    $quantity = (int) $item['quantity'];
                    $unitPrice = (int) $menu->price;

                    BookingItem::query()->create([
                        'reservation_id' => $reservation->id,
                        'menu_id' => $menu->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'subtotal' => $unitPrice * $quantity,
                    ]);
                }
            }

            return $reservation;
        });

        $this->notifyAdminsForNewReservation($reservation, $team);
        broadcast(new ReservationCreated($reservation));

        return redirect()
            ->route('bookings.history')
            ->with('success', 'Booking berhasil dibuat dengan nomor '.$reservation->booking_number.'.');
    }

    /**
     * Show booking history for current user.
     */
    public function history(Request $request): Response
    {
        $team = $this->teamFromRequest($request);

        $bookings = Reservation::query()
            ->with(['seat', 'table', 'items.menu', 'payment'])
            ->where('team_id', $team->id)
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('dashboard/user', [
            'roleLabel' => 'User',
            'history' => $bookings->map(fn (Reservation $booking) => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'date' => $booking->date,
                'time' => $booking->time,
                'status' => $booking->status?->value,
                'table_code' => $booking->table?->code,
                'seat_label' => $booking->seat?->label,
                'total_items' => $booking->items->count(),
                'payment_status' => $booking->payment?->status?->value,
            ])->values(),
        ]);
    }

    private function generateBookingNumber(): string
    {
        return 'BK-'.now()->format('YmdHis').'-'.str_pad((string) random_int(0, 999), 3, '0', STR_PAD_LEFT);
    }

    private function teamFromRequest(Request $request): Team
    {
        $team = $request->route('current_team');

        if ($team instanceof Team) {
            return $team;
        }

        if (is_string($team)) {
            $foundTeam = Team::query()->where('slug', $team)->first();

            if ($foundTeam) {
                return $foundTeam;
            }
        }

        $user = $request->user();
        $fallbackTeam = $user?->currentTeam ?? $user?->personalTeam();
        abort_if(! $fallbackTeam, 403);

        return $fallbackTeam;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function seatingLayoutData(Team $team): array
    {
        $reservedSeatIds = Reservation::query()
            ->where('team_id', $team->id)
            ->whereIn('status', BookingStatus::activeSeatLocks())
            ->pluck('table_seat_id')
            ->filter()
            ->map(fn ($seatId) => (int) $seatId)
            ->all();

        return $team->restaurantTables()
            ->with(['seats' => fn ($query) => $query->where('is_active', true)->orderBy('seat_number')])
            ->orderBy('code')
            ->get()
            ->map(fn ($table) => [
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
            ])
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
}
