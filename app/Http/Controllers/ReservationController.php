<?php

namespace App\Http\Controllers;

use App\Events\CourierLocationUpdated;
use App\Events\ReservationStatusUpdated;
use App\Mail\ReservationConfirmedMail;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\RestoTable;
use App\Models\ServiceRequest;
use App\Models\Team;
use App\Models\User;
use App\Notifications\AppNotification;
use App\Services\MidtransService;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
        $reservations = Reservation::with(['user', 'restoTable', 'menus', 'courier'])
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
                    'total_after_discount' => $reservation->total_after_discount,
                    'discount_amount' => $reservation->discount_amount,
                    'type' => $reservation->type,
                    'menus' => $reservation->menus,
                    'menus_count' => $reservation->menus ? $reservation->menus->count() : 0,
                    'special_requests' => $reservation->special_requests,
                    'table_id' => $reservation->resto_table_id,
                    'table_name' => $reservation->restoTable ? $reservation->restoTable->name : null,
                    'courier_id' => $reservation->courier_id,
                    'courier_name' => $reservation->courier?->name,
                    'delivery_status' => $reservation->delivery_status,
                    'delivery_address' => $reservation->delivery_address,
                ];
            });

        $tables = RestoTable::where('is_active', true)->get();
        $couriers = User::where('role', 'kurir')->select('id', 'name')->get();
        $serviceRequests = ServiceRequest::with(['reservation' => function ($q) {
            $q->with('restoTable');
        }])
            ->where('status', '!=', 'resolved')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('dashboard/reservations', [
            'reservations' => $reservations,
            'tables' => $tables,
            'couriers' => $couriers,
            'serviceRequests' => $serviceRequests,
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
        /** @var User $user */
        $user = Auth::user();

        if ($reservation->user_id !== $user->id && ! $user->isStaff()) {
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
        $availableMenus = Menu::where('is_available', true)->get();

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
            'availableMenus' => $availableMenus,
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
            'resto_table_id' => 'required_if:type,dine_in|nullable|exists:resto_tables,id',
            'type' => 'required|in:dine_in,delivery,takeaway',
            'delivery_address' => 'required_if:type,delivery|nullable|string|max:500',
            'menus' => 'nullable|array',
            'menus.*.id' => 'required|exists:menus,id',
            'menus.*.quantity' => 'required|integer|min:1',
            'use_points' => 'nullable|boolean',
        ]);

        // Validate table availability only for dine_in
        if ($validated['type'] === 'dine_in') {
            $isBooked = Reservation::where('date', $validated['date'])
                ->where('time', $validated['time'])
                ->where('resto_table_id', $validated['resto_table_id'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($isBooked) {
                return back()->withErrors(['resto_table_id' => 'Maaf, meja ini baru saja dipesan oleh orang lain pada waktu tersebut.']);
            }
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
        $taxAmount = $dpAmount * 0.10; // PB1 10%
        $serviceAmount = 0;

        // Loyalty Logic
        $pointsUsed = 0;
        $discountAmount = 0;
        if ($request->boolean('use_points') && Auth::check()) {
            $user = Auth::user();
            $maxPossibleDiscount = $dpAmount * 0.5; // Max 50% discount from DP
            $pointsNeeded = floor($maxPossibleDiscount / 100);

            $pointsUsed = min($user->points, $pointsNeeded);
            $discountAmount = $pointsUsed * 100;
        }

        $finalAmount = ($dpAmount + $taxAmount + $serviceAmount) - $discountAmount;

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
            'resto_table_id' => $validated['type'] === 'dine_in' ? $validated['resto_table_id'] : null,
            'type' => $validated['type'],
            'delivery_address' => $validated['type'] === 'delivery' ? $validated['delivery_address'] : null,
            'status' => 'pending',
            'subtotal' => $dpAmount,
            'tax_amount' => $taxAmount,
            'service_amount' => $serviceAmount,
            'booking_fee' => $dpAmount,
            'points_used' => $pointsUsed,
            'discount_amount' => $discountAmount,
            'total_after_discount' => $finalAmount,
            'payment_status' => 'unpaid',
            'check_in_token' => Str::uuid()->toString(),
        ]);

        // Generate Midtrans Snap Token
        try {
            $midtrans = new MidtransService;
            $snapToken = $midtrans->getSnapToken($reservation);
            $reservation->update(['midtrans_snap_token' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans Error: '.$e->getMessage());
        }

        if (! empty($syncData)) {
            $reservation->menus()->sync($syncData);
        }

        // Notify Admin/Staff about new reservation
        $staff = User::whereIn('role', ['admin', 'staff'])->get();
        foreach ($staff as $s) {
            /** @var User $s */
            $s->notify(new AppNotification(
                __('Reservasi Baru'),
                __('Ada reservasi baru dari :name untuk tanggal :date.', ['name' => $reservation->customer_name, 'date' => $reservation->date]),
                'info',
                route('reservations.index', [], false)
            ));
        }

        return redirect()->route('reservations.history')->with('success', 'Reservasi berhasil diajukan. Kami akan segera mengonfirmasi ketersediaan kursi dan menu Anda.');
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

        // Jika token belum ada (misal gagal digenerate saat store), generate sekarang
        if (! $reservation->midtrans_snap_token) {
            try {
                $midtrans = new MidtransService;
                $snapToken = $midtrans->getSnapToken($reservation);
                $reservation->update(['midtrans_snap_token' => $snapToken]);
            } catch (\Exception $e) {
                Log::error('Midtrans Retry Error: '.$e->getMessage());
            }
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
            'status' => 'confirmed',
        ]);

        if ($reservation->points_used > 0 && $user = $reservation->user) {
            $user->decrement('points', $reservation->points_used);
        }

        // Queue confirmation email with QR code (avoids HTTP timeout)
        $reservation->load(['menus', 'restoTable']);
        Mail::to($reservation->customer_email)->queue(new ReservationConfirmedMail($reservation));

        // Broadcast real-time update
        event(new ReservationStatusUpdated($reservation));

        // WA Simulation
        WhatsAppService::send(
            $reservation->customer_phone,
            "Halo {$reservation->customer_name}, Pembayaran DP sebesar Rp ".number_format((float) $reservation->booking_fee, 0, ',', '.').' telah kami terima. Reservasi Anda sedang diverifikasi. Cek progress live di: '.route('reservations.show', $reservation->id)
        );

        // Award Loyalty Points (1 point per 10k IDR)
        $points = floor($reservation->booking_fee / 10000);
        if ($points > 0 && $user = $reservation->user) {
            $user->increment('points', $points);
            WhatsAppService::send(
                $reservation->customer_phone,
                "Selamat! Anda mendapatkan {$points} fpt poin dari transaksi ini. Total poin Anda sekarang: ".($user->points)
            );
        }

        // Notify Customer about payment
        $reservation->user?->notify(new AppNotification(
            __('Pembayaran Diterima'),
            __('Terima kasih! Pembayaran DP Anda untuk reservasi #:id telah kami terima.', ['id' => $reservation->id]),
            'success',
            route('reservations.show', [$reservation->id], false)
        ));

        // Notify Staff about payment
        $staff = User::whereIn('role', ['admin', 'staff'])->get();
        foreach ($staff as $s) {
            /** @var User $s */
            $s->notify(new AppNotification(
                __('DP Reservasi Dibayar'),
                __('Pelanggan :name telah membayar DP untuk reservasi #:id.', ['name' => $reservation->customer_name, 'id' => $reservation->id]),
                'success',
                route('reservations.index', [], false)
            ));
        }

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
            'status' => 'nullable|in:pending,awaiting_payment,confirmed,rejected,completed',
            'payment_status' => 'nullable|in:unpaid,paid,failed',
        ]);

        if (isset($validated['status'])) {
            $reservation->status = $validated['status'];

            // OTOMATISASI: Update status menu jika status reservasi berubah
            if ($validated['status'] === 'completed') {
                $reservation->menus()->updateExistingPivot($reservation->menus->pluck('id'), ['status' => 'ready']);
            } elseif ($validated['status'] === 'confirmed') {
                // Jika dikonfirmasi (aktif), bisa dianggap mulai dimasak
                $reservation->menus()->updateExistingPivot($reservation->menus->pluck('id'), ['status' => 'preparing']);
            }
        }

        if (isset($validated['payment_status'])) {
            $reservation->payment_status = $validated['payment_status'];

            // Jika dibayar oleh staff, biasanya status otomatis confirmed
            if ($validated['payment_status'] === 'paid' && $reservation->status === 'awaiting_payment') {
                $reservation->status = 'confirmed';
            }
        }

        $reservation->save();

        // Broadcast real-time update
        event(new ReservationStatusUpdated($reservation->load(['menus', 'restoTable'])));

        // Notify Customer about status change
        $reservation->user?->notify(new AppNotification(
            __('Update Status Reservasi'),
            __('Status reservasi Anda telah diperbarui menjadi: :status (:payment)', [
                'status' => ucfirst($reservation->status),
                'payment' => strtoupper($reservation->payment_status),
            ]),
            'info',
            route('reservations.show', [$reservation->id], false)
        ));

        return back()->with('success', 'Reservation updated successfully.');
    }

    /**
     * Assign a courier to a reservation and update delivery status.
     */
    public function assignCourier(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'courier_id' => 'required|exists:users,id',
            'delivery_address' => 'nullable|string|max:500',
        ]);

        $reservation->update([
            'courier_id' => $validated['courier_id'],
            'delivery_status' => 'preparing', // Start as preparing when assigned
            'delivery_address' => $validated['delivery_address'],
        ]);

        // Broadcast update so courier and customer see it
        event(new ReservationStatusUpdated($reservation->load(['menus', 'restoTable', 'courier'])));

        return back()->with('success', 'Kurir berhasil ditugaskan.');
    }

    /**
     * Update the delivery status of a reservation.
     */
    public function updateDeliveryStatus(Request $request, Reservation $reservation)
    {
        /** @var User $user */
        $user = Auth::user();

        // Only the assigned courier or staff can update the status
        if ($user->isCourier() && $reservation->courier_id !== $user->id) {
            abort(403, 'Unauthorized access to this delivery.');
        }

        $validated = $request->validate([
            'delivery_status' => 'required|in:pending,preparing,on_delivery,arrived,delivered',
        ]);

        $reservation->update(['delivery_status' => $validated['delivery_status']]);

        // Broadcast real-time update
        event(new ReservationStatusUpdated($reservation->load(['menus', 'restoTable', 'courier'])));

        return back()->with('success', 'Status pengiriman diperbarui.');
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
        /** @var User $user */
        $user = Auth::user();

        if ($reservation->user_id !== $user->id && ! $user->isStaff()) {
            abort(403);
        }

        // For customers, only allow deleting pending
        if (! $user->isStaff() && $reservation->status !== 'pending') {
            return back()->with('error', 'Hanya pesanan berstatus pending yang dapat dibatalkan.');
        }

        $reservation->delete();

        return back()->with('success', 'Reservasi berhasil dihapus.');
    }

    /**
     * Simulate courier movement for demonstration.
     */
    public function simulateTracking(Reservation $reservation)
    {
        $startLat = -6.2088;
        $startLng = 106.8456;
        $endLat = -6.2188;
        $endLng = 106.8556;

        // In a real world, this would be a background job
        // But for demo, we'll just broadcast the start point immediately
        broadcast(new CourierLocationUpdated($reservation->id, $startLat, $startLng));

        return response()->json(['message' => 'Simulation started']);
    }
}
