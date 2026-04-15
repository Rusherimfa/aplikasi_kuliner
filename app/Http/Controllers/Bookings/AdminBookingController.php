<?php

namespace App\Http\Controllers\Bookings;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\TableSeat;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBookingController extends Controller
{
    /**
     * Display all booking requests for admin.
     */
    public function index(Request $request): Response
    {
        $team = $this->teamFromRequest($request);

        $bookings = Reservation::query()
            ->with(['user', 'table', 'seat', 'items.menu', 'payment'])
            ->where('team_id', $team->id)
            ->latest()
            ->get();

        return Inertia::render('dashboard/reservations', [
            'reservations' => $bookings->map(fn (Reservation $booking) => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'user_name' => $booking->user?->name,
                'user_email' => $booking->user?->email,
                'date' => $booking->date,
                'time' => $booking->time,
                'guest_count' => $booking->guest_count,
                'table_code' => $booking->table?->code,
                'seat_label' => $booking->seat?->label,
                'status' => $booking->status?->value,
                'admin_note' => $booking->admin_note,
                'payment_status' => $booking->payment?->status?->value,
            ])->values(),
            'seatingLayout' => $this->seatingLayoutData($team),
        ]);
    }

    public function availability(Request $request, TableSeat $seat)
    {
        $team = $this->teamFromRequest($request);
        abort_if($seat->team_id !== $team->id, 404);

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $seat->update([
            'is_active' => (bool) $validated['is_active'],
        ]);

        return back()->with('success', 'Status kursi berhasil diperbarui.');
    }

    public function confirm(Request $request, Reservation $reservation)
    {
        $team = $this->teamFromRequest($request);
        abort_if($reservation->team_id !== $team->id, 404);

        $reservation->update([
            'status' => BookingStatus::WaitingPayment,
            'confirmed_at' => now(),
        ]);

        return back()->with('success', 'Booking dikonfirmasi dan menunggu pembayaran.');
    }

    public function reject(Request $request, Reservation $reservation)
    {
        $team = $this->teamFromRequest($request);
        abort_if($reservation->team_id !== $team->id, 404);

        $request->validate([
            'admin_note' => 'nullable|string|max:500',
        ]);

        $reservation->update([
            'status' => BookingStatus::Rejected,
            'rejected_at' => now(),
            'admin_note' => $request->input('admin_note'),
        ]);

        return back()->with('success', 'Booking ditolak.');
    }

    public function updateSeat(Request $request, Reservation $reservation)
    {
        $team = $this->teamFromRequest($request);
        abort_if($reservation->team_id !== $team->id, 404);

        $validated = $request->validate([
            'table_seat_id' => 'required|integer|exists:table_seats,id',
        ]);

        $seat = TableSeat::query()
            ->where('id', $validated['table_seat_id'])
            ->where('team_id', $team->id)
            ->where('is_active', true)
            ->firstOrFail();

        $reservation->update([
            'table_seat_id' => $seat->id,
            'restaurant_table_id' => $seat->restaurant_table_id,
        ]);

        return back()->with('success', 'Kursi booking berhasil diubah.');
    }

    public function note(Request $request, Reservation $reservation)
    {
        $team = $this->teamFromRequest($request);
        abort_if($reservation->team_id !== $team->id, 404);

        $validated = $request->validate([
            'admin_note' => 'required|string|max:1000',
        ]);

        $reservation->update([
            'admin_note' => $validated['admin_note'],
        ]);

        return back()->with('success', 'Catatan booking berhasil disimpan.');
    }

    private function teamFromRequest(Request $request): Team
    {
        $team = $request->route('current_team');

        if ($team instanceof Team) {
            return $team;
        }

        return Team::query()->where('slug', (string) $team)->firstOrFail();
    }

    /**
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
}
