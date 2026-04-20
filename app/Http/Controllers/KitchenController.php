<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Events\DishStatusUpdated;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KitchenController extends Controller
{
    /**
     * Display the Kitchen Display System (KDS).
     */
    public function index()
    {
        // 1. Fetch all online orders for today
        $allOrders = Order::whereDate('created_at', now()->toDateString())
            ->with(['items.menu', 'courier'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'type' => 'order',
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer_name,
                    'order_type' => $order->order_type,
                    'payment_status' => $order->payment_status,
                    'order_status' => $order->order_status,
                    'total_price' => $order->total_price,
                    'courier' => $order->courier ? $order->courier->name : null,
                    'time' => $order->created_at->format('H:i'),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->menu->name,
                            'quantity' => $item->quantity,
                            'status' => $item->status ?? 'pending',
                        ];
                    }),
                ];
            });

        $couriers = User::where('role', Role::KURIR->value)->get(['id', 'name']);

        return Inertia::render('kitchen/index', [
            'online_active' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['pending', 'confirmed', 'waiting_for_payment', 'preparing', 'delivering', 'delivered'])),
            'online_completed' => $allOrders->filter(fn ($o) => $o['order_status'] === 'complete'),
            'online_cancelled' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['cancelled', 'rejected'])),
            'couriers' => $couriers,
        ]);
    }

    /**
     * Update the status of a specific menu item within a reservation.
     */
    public function updateItemStatus(Request $request, $pivotId)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,served',
        ]);

        DB::table('menu_reservation')
            ->where('id', $pivotId)
            ->update([
                'status' => $validated['status'],
                'updated_at' => now(),
            ]);

        // Fetch item name and reservation_id for broadcasting
        $item = DB::table('menu_reservation')
            ->join('menus', 'menu_reservation.menu_id', '=', 'menus.id')
            ->where('menu_reservation.id', $pivotId)
            ->select('menus.name', 'menu_reservation.reservation_id')
            ->first();

        if ($item) {
            event(new DishStatusUpdated($item->reservation_id, $pivotId, $validated['status'], $item->name));

            // WA Simulation if Ready
            if ($validated['status'] === 'ready') {
                $reservation = Reservation::find($item->reservation_id);
                if ($reservation) {
                    WhatsAppService::send(
                        $reservation->customer_phone,
                        "Chef Insight: Piring '{$item->name}' Anda sudah siap saji! Pelayan kami akan segera mengantarkannya ke meja Anda."
                    );
                }
            }
        }

        return back()->with('success', 'Item status updated.');
    }

    /**
     * Manage Online Order workflow.
     */
    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'courier_id' => 'nullable|exists:users,id',
        ]);

        $updateData = ['order_status' => $validated['status']];
        if (isset($validated['courier_id'])) {
            $updateData['courier_id'] = $validated['courier_id'];
        }

        $order->update($updateData);

        return back()->with('success', "Pesanan #{$order->order_number} diperbarui ke ".ucfirst($validated['status']));
    }

    public function acceptOrder(Order $order)
    {
        $order->update(['order_status' => 'waiting_for_payment']);

        return back()->with('success', "Pesanan #{$order->order_number} diterima.");
    }

    public function rejectOrder(Order $order)
    {
        $order->update(['order_status' => 'rejected']);

        return back()->with('success', "Pesanan #{$order->order_number} ditolak.");
    }
}
