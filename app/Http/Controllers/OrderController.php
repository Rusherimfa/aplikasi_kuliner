<?php

namespace App\Http\Controllers;

use App\Events\CourierLocationUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Notifications\AppNotification;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'order_type' => 'required|in:delivery,pickup',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string|max:500',
            'cart_total' => 'required|numeric|min:0',
            'customer_lat' => 'nullable|numeric',
            'customer_lng' => 'nullable|numeric',
            'delivery_address' => 'nullable|string',
            'delivery_method' => 'nullable|string|in:resto,gojek,grab',
            'delivery_service' => 'nullable|string',
            'delivery_fee' => 'nullable|numeric',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = $validated['cart_total'];
            $taxAmount = $subtotal * 0.10; // PB1 10%
            $serviceAmount = 0;

            // Calculate Delivery Fee on Backend
            $deliveryFee = 0;
            if ($validated['order_type'] === 'delivery') {
                $restoLat = config('services.resto.lat', -1.2654);
                $restoLng = config('services.resto.lng', 116.8312);
                $feePerKm = config('services.delivery.fee_per_km', 5000);

                if (isset($validated['customer_lat']) && isset($validated['customer_lng'])) {
                    $distance = $this->calculateDistance(
                        $restoLat, $restoLng,
                        $validated['customer_lat'], $validated['customer_lng']
                    );

                    // Cap distance at 50km for safety, otherwise it might be a GPS error or very far
                    $safeDistance = min(50, $distance);
                    $deliveryFee = max(5000, round($safeDistance * $feePerKm));

                    // Add surcharge for 3rd party
                    if (($validated['delivery_method'] ?? 'resto') !== 'resto') {
                        $deliveryFee += 5000;
                    }
                } else {
                    $deliveryFee = $validated['delivery_fee'] ?? 0;
                }
            }

            $totalPrice = $subtotal + $taxAmount + $serviceAmount + $deliveryFee;

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-'.date('YmdHis').'-'.rand(1000, 9999),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'customer_lat' => $validated['customer_lat'] ?? null,
                'customer_lng' => $validated['customer_lng'] ?? null,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'order_type' => $validated['order_type'],
                'delivery_method' => $validated['delivery_method'] ?? null,
                'delivery_service' => $validated['delivery_service'] ?? null,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'service_amount' => $serviceAmount,
                'delivery_fee' => $deliveryFee,
                'payment_status' => 'unpaid',
                'order_status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            // Generate Midtrans Snap Token
            try {
                $midtrans = new MidtransService;
                $snapToken = $midtrans->getSnapToken($order);
                $order->update(['midtrans_snap_token' => $snapToken]);
            } catch (\Exception $e) {
                Log::error('Midtrans Error: '.$e->getMessage());
            }

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'total_price' => $item['quantity'] * $item['price'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            Log::info('Order Created Successfully', ['id' => $order->id, 'number' => $order->order_number]);

            return $order;
        });

        // Notify Staff about new order
        $staff = User::whereIn('role', ['admin', 'staff'])->get();
        foreach ($staff as $s) {
            /** @var User $s */
            $s->notify(new AppNotification(
                __('Pesanan Baru'),
                __('Ada pesanan masuk #:order dari :name.', ['order' => $order->order_number, 'name' => $order->customer_name]),
                'info',
                route('kitchen.index', [], false)
            ));
        }

        Log::info('Redirecting to History Page', ['order_id' => $order->id]);

        return redirect()->route('orders.history')->with('success', 'Pesanan berhasil dibuat. Silakan cek riwayat untuk melanjutkan pembayaran atau melacak pesanan.');
    }

    public function history(Request $request)
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.menu'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('orders/history', [
            'orders' => $orders,
        ]);
    }

    public function payment(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->payment_status === 'paid') {
            return redirect()->route('orders.history')->with('success', 'Pesanan ini sudah dibayar.');
        }

        // Jika token belum ada (misal gagal digenerate saat store), generate sekarang
        if (! $order->midtrans_snap_token) {
            try {
                $midtrans = new MidtransService;
                $snapToken = $midtrans->getSnapToken($order);
                $order->update(['midtrans_snap_token' => $snapToken]);
            } catch (\Exception $e) {
                Log::error('Midtrans Retry Error: '.$e->getMessage());
            }
        }

        $order->load(['items.menu']);

        return Inertia::render('orders/payment', [
            'order' => $order,
        ]);
    }

    public function refreshPayment(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        if ($order->payment_status === 'paid') {
            return back()->with('error', 'Pesanan ini sudah dibayar.');
        }

        try {
            $midtrans = new MidtransService;
            $snapToken = $midtrans->getSnapToken($order);
            $order->update(['midtrans_snap_token' => $snapToken]);

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans Refresh Error: '.$e->getMessage());

            return response()->json(['error' => 'Gagal memperbarui token pembayaran.'], 500);
        }
    }

    public function processPayment(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->update([
            'payment_status' => 'paid',
            'order_status' => 'preparing',
        ]);

        // Notify Customer about payment
        $order->user?->notify(new AppNotification(
            __('Pembayaran Pesanan Berhasil'),
            __('Terima kasih! Pembayaran untuk pesanan #:order telah kami terima.', ['order' => $order->order_number]),
            'success',
            route('orders.track', [$order->id], false)
        ));

        // Notify Staff
        $staff = User::whereIn('role', ['admin', 'staff'])->get();
        foreach ($staff as $s) {
            /** @var User $s */
            $s->notify(new AppNotification(
                __('Pesanan Dibayar'),
                __('Pelanggan :name telah membayar pesanan #:order.', ['name' => $order->customer_name, 'order' => $order->order_number]),
                'success',
                route('kitchen.index', [], false)
            ));
        }

        return redirect()->route('orders.history')->with('success', 'Pembayaran berhasil! Pesanan Anda sedang diproses.');
    }

    public function destroy(Order $order)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($order->user_id !== $user->id && ! $user->isStaff()) {
            abort(403);
        }

        // For customers, only allow deleting cancelled orders
        if (! $user->isStaff() && $order->order_status !== 'cancelled') {
            return back()->with('error', 'Hanya pesanan yang dibatalkan yang dapat dihapus.');
        }

        $order->delete();

        return back()->with('success', 'Riwayat pesanan berhasil dihapus.');
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        // Allow cancellation if not yet paid and not yet processed
        if (! in_array($order->order_status, ['pending', 'waiting_for_payment']) || $order->payment_status === 'paid') {
            return back()->withError('Pesanan ini sudah tidak dapat dibatalkan.');
        }

        $order->update([
            'order_status' => 'cancelled',
        ]);

        return redirect()->route('orders.history')->with('success', 'Pesanan berhasil dibatalkan.');
    }

    public function updateDeliveryStatus(Request $request, Order $order)
    {
        if ($order->courier_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'delivery_status' => 'required|in:delivering,delivered',
        ]);

        $order->update([
            'order_status' => $request->delivery_status,
        ]);

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Update Status Pengiriman'),
            __('Pesanan #:order Anda sekarang berstatus: :status', ['order' => $order->order_number, 'status' => ucfirst($request->delivery_status)]),
            'info',
            route('orders.track', [$order->id], false)
        ));

        return back()->with('success', 'Status pengiriman berhasil diupdate.');
    }

    public function simulateTracking(Request $request, Order $order)
    {
        $lat = $request->input('latitude');
        $lng = $request->input('longitude');

        if ($lat && $lng) {
            $order->update([
                'courier_lat' => $lat,
                'courier_lng' => $lng,
            ]);
        }

        Log::info('Broadcasting Courier Location', ['order' => $order->id, 'lat' => $lat, 'lng' => $lng]);

        broadcast(new CourierLocationUpdated($order->id, $lat, $lng));

        return response()->json(['message' => 'Location updated and broadcasted', 'lat' => $lat, 'lng' => $lng]);
    }

    public function track(Order $order)
    {
        /** @var User $user */
        $user = Auth::user();
        if ($order->user_id !== $user->id && ! $user->isStaff()) {
            abort(403);
        }

        $order->load(['items.menu', 'courier']);

        return Inertia::render('orders/track', [
            'order' => $order,
        ]);
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // KM

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
