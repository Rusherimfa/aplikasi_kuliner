<?php

namespace App\Http\Controllers;

use App\Events\CourierLocationUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Notifications\AppNotification;
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
            'cart_total' => 'required|numeric|min:0',
            'customer_lat' => 'nullable|numeric',
            'customer_lng' => 'nullable|numeric',
            'delivery_method' => 'nullable|string|in:resto,gojek,grab',
            'delivery_service' => 'nullable|string',
            'delivery_fee' => 'nullable|numeric',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $deliveryFee = $validated['delivery_fee'] ?? 0;
            $totalPrice = $validated['cart_total'] + $deliveryFee;

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-'.date('YmdHis').'-'.rand(1000, 9999),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'customer_lat' => $validated['customer_lat'] ?? null,
                'customer_lng' => $validated['customer_lng'] ?? null,
                'order_type' => $validated['order_type'],
                'delivery_method' => $validated['delivery_method'] ?? null,
                'delivery_service' => $validated['delivery_service'] ?? null,
                'delivery_fee' => $deliveryFee,
                'payment_status' => 'unpaid',
                'order_status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'total_price' => $item['quantity'] * $item['price'],
                ]);
            }

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

        return redirect()->route('orders.history')->with('success', 'Pesanan Anda telah berhasil dibuat!');
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

        $order->load(['items.menu']);

        return Inertia::render('orders/payment', [
            'order' => $order,
        ]);
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
}
