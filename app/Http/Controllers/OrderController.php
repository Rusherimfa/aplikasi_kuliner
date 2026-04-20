<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        ]);

        $order = DB::transaction(function () use ($validated) {
            $totalPrice = $validated['cart_total'];

            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-'.date('YmdHis').'-'.rand(1000, 9999),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'order_type' => $validated['order_type'],
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

        return redirect()->route('orders.history')->with('success', 'Pesanan Anda telah berhasil dibuat!');
    }

    public function history(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.menu'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('orders/history', [
            'orders' => $orders,
        ]);
    }

    public function payment(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
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
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->update([
            'payment_status' => 'paid',
            'order_status' => 'preparing',
        ]);

        return redirect()->route('orders.history')->with('success', 'Pembayaran berhasil! Pesanan Anda sedang diproses.');
    }

    public function destroy(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if ($order->order_status !== 'cancelled') {
            return back()->withError('Hanya pesanan yang dibatalkan yang dapat dihapus.');
        }

        $order->delete();

        return redirect()->route('orders.history');
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
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
}
