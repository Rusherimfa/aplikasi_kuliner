<?php

namespace App\Http\Controllers;

use App\Mail\ReservationConfirmedMail;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\RestoTable;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource for the staff dashboard.
     */
    public function index(Request $request)
    {
        $reservations = Reservation::with(['user', 'restoTable', 'menus'])
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'customer_name' => $reservation->customer_name ?? $reservation->user?->name ?? 'Guest',
                    'customer_email' => $reservation->customer_email ?? $reservation->user?->email,
                    'customer_phone' => $reservation->customer_phone,
                    'date' => $reservation->date,
                    'time' => $reservation->time,
                    'guest_count' => $reservation->guest_count,
                    'status' => $reservation->status,
                    'payment_status' => $reservation->payment_status,
                    'booking_fee' => $reservation->booking_fee,
                    'menus_count' => $reservation->menus ? $reservation->menus->count() : 0,
                    'special_requests' => $reservation->special_requests,
                    'table_id' => $reservation->resto_table_id,
                    'table_name' => $reservation->restoTable ? $reservation->restoTable->name : null,
                ];
            });

        $tables = RestoTable::where('is_active', true)->get();

        return Inertia::render('dashboard/reservations', [
            'reservations' => $reservations,
            'tables' => $tables,
        ]);
    }

    /**
     * Update table position from the visual map.
     */
    public function updateTablePosition(Request $request, RestoTable $table)
    {
        $validated = $request->validate([
            'pos_x' => 'required|integer',
            'pos_y' => 'required|integer',
        ]);

        $table->update($validated);

        return back()->with('success', 'Table layout updated.');
    }

    /**
     * Show the user's reservation history (Customer Portal).
     */
    public function history(Request $request)
    {
        $reservations = Reservation::where('user_id', Auth::id())
            ->with(['menus', 'restoTable'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get();

        return Inertia::render('reservations/history', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Display a specific reservation details.
     */
    public function show(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() && ! Auth::user()->isStaff()) {
            abort(403, 'Unauthorized access to reservation details.');
        }

        $reservation->load(['menus', 'restoTable']);

        $availableMenus = Menu::where('is_available', true)->get();

        return Inertia::render('reservations/show', [
            'reservation' => $reservation,
            'availableMenus' => $availableMenus,
        ]);
    }

    /**
     * Show the form for creating a new public reservation.
     */
    public function create(Request $request)
    {
        $tables = RestoTable::where('is_active', true)->get();

        $bookedTableIds = [];
        if ($request->has('date') && $request->has('time')) {
            $bookedTableIds = Reservation::where('date', $request->date)
                ->where('time', $request->time)
                ->whereIn('status', ['pending', 'confirmed'])
                ->pluck('resto_table_id')
                ->filter()
                ->toArray();
        }

        return Inertia::render('reservations/create', [
            'tables' => $tables,
            'bookedTableIds' => array_values($bookedTableIds),
            'queries' => $request->only(['date', 'time']), // Pass back to remember
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
            'special_requests' => 'nullable|string|max:500',
            'resto_table_id' => 'required|exists:resto_tables,id',
            'menus' => 'nullable|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.quantity' => 'required|integer|min:1',
        ]);

        // Validate table availability to prevent double booking
        $isBooked = Reservation::where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->where('resto_table_id', $validated['resto_table_id'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($isBooked) {
            return back()->withErrors(['resto_table_id' => 'Maaf, meja ini baru saja dipesan oleh orang lain pada waktu tersebut.']);
        }

        $defaultTeam = Team::first();
        if (! $defaultTeam) {
            abort(500, 'System misconfiguration: No master team found.');
        }

        // Calculation logic for DP securely using DB prices
        $foodTotal = 0;
        $syncData = [];
        if (! empty($validated['menus'])) {
            $menuIds = collect($validated['menus'])->pluck('id');
            $dbMenus = Menu::whereIn('id', $menuIds)->get()->keyBy('id');

            foreach ($validated['menus'] as $menuItem) {
                if ($dbMenu = $dbMenus->get($menuItem['id'])) {
                    $foodTotal += ($dbMenu->price * $menuItem['quantity']);
                    $syncData[$menuItem['id']] = ['quantity' => $menuItem['quantity'], 'notes' => null];
                }
            }
        }

        $dpAmount = $foodTotal > 0 ? $foodTotal * 0.5 : 50000;

        $reservation = Reservation::create([
            'team_id' => $defaultTeam->id,
            'user_id' => Auth::id(),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'guest_count' => $validated['guest_count'],
            'special_requests' => $validated['special_requests'] ?? null,
            'resto_table_id' => $validated['resto_table_id'],
            'status' => 'awaiting_payment',
            'booking_fee' => $dpAmount,
            'payment_status' => 'unpaid',
            'check_in_token' => Str::uuid()->toString(),
        ]);

        if (! empty($syncData)) {
            $reservation->menus()->sync($syncData);
        }

        return redirect()->route('reservations.payment', $reservation->id);
    }

    /**
     * Show the simulated payment gateway page.
     */
    public function payment(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->payment_status === 'paid' && in_array($reservation->status, ['pending', 'confirmed'])) {
            return redirect()->route('reservations.history')->with('success', 'Reservasi ini sudah dibayar.');
        }

        $reservation->load(['menus', 'restoTable']);

        return Inertia::render('reservations/payment', [
            'reservation' => $reservation,
        ]);
    }

    /**
     * Process the simulated payment.
     */
    public function processPayment(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) {
            abort(403);
        }

        $reservation->update([
            'payment_status' => 'paid',
            'status' => 'pending',
        ]);

        // Queue confirmation email with QR code (avoids HTTP timeout)
        $reservation->load(['menus', 'restoTable']);
        Mail::to($reservation->customer_email)->queue(new ReservationConfirmedMail($reservation));

        return redirect()->route('reservations.history')->with('success', 'Pembayaran DP berhasil! Email konfirmasi telah dikirim.');
    }

    /**
     * Handle QR Code check-in scan by staff.
     */
    public function checkin(string $token)
    {
        $reservation = Reservation::where('check_in_token', $token)
            ->with('restoTable')
            ->firstOrFail();

        if ($reservation->checked_in_at) {
            return redirect()->route('reservations.index')
                ->with('info', "Tamu {$reservation->customer_name} sudah check-in sebelumnya pada ".$reservation->checked_in_at->format('d M Y H:i').'.');
        }

        $reservation->update([
            'checked_in_at' => now(),
            'status' => 'confirmed',
        ]);

        return redirect()->route('reservations.index')
            ->with('success', "✅ Check-in berhasil! {$reservation->customer_name} telah tiba — Meja {$reservation->restoTable?->name}.");
    }

    /**
     * Update the specified reservation status (Dashboard).
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,rejected,completed',
        ]);

        $reservation->update(['status' => $validated['status']]);

        return back()->with('success', 'Reservation status updated.');
    }

    /**
     * Update the reservation details as a customer.
     */
    public function updateCustomer(Request $request, Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== 'pending') {
            return back()->with('error', 'Pesanan yang sudah diproses tidak dapat diubah.');
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:500',
            'menus' => 'nullable|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.quantity' => 'required|integer|min:1',
            'menus.*.notes' => 'nullable|string|max:255',
        ]);

        $reservation->update([
            'date' => $validated['date'],
            'time' => $validated['time'],
            'guest_count' => $validated['guest_count'],
            'special_requests' => $validated['special_requests'],
        ]);

        if (isset($validated['menus'])) {
            $syncData = [];
            foreach ($validated['menus'] as $menu) {
                $syncData[$menu['id']] = ['quantity' => $menu['quantity'], 'notes' => $menu['notes'] ?? null];
            }
            $reservation->menus()->sync($syncData);
        } else {
            $reservation->menus()->detach();
        }

        return back()->with('success', 'Reservasi berhasil diperbarui.');
    }

    /**
     * Remove the specified reservation.
     */
    public function destroy(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id()) {
            abort(403);
        }

        if ($reservation->status !== 'pending') {
            return back()->with('error', 'Hanya pesanan berstatus pending yang dapat dibatalkan.');
        }

        $reservation->delete();

        return redirect()->route('reservations.history')->with('success', 'Reservasi berhasil dibatalkan.');
    }
}
