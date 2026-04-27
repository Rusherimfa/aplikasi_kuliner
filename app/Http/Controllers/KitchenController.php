<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Events\DishStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Reservation;
use App\Models\User;
use App\Notifications\AppNotification;
use App\Services\WhatsAppService;
use Carbon\Carbon;
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
        // 1. Fetch ALL online orders
        $allOrders = Order::with(['items.menu', 'courier'])
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
                    'elapsed_minutes' => now()->diffInMinutes($order->created_at),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->menu ? $item->menu->name : 'Menu Tidak Tersedia',
                            'quantity' => $item->quantity,
                            'status' => $item->status ?? 'pending',
                            'type' => 'order',
                        ];
                    }),
                ];
            });

        // 2. Fetch Dine-in Reservations
        $reservations = Reservation::with(['menus', 'restoTable'])
            ->latest()
            ->get()
            ->map(function ($res) {
                return [
                    'id' => $res->id,
                    'type' => 'reservation',
                    'order_number' => 'RES-'.$res->id,
                    'customer_name' => $res->customer_name,
                    'order_type' => 'dine-in',
                    'table_number' => $res->restoTable ? $res->restoTable->name : null,
                    'payment_status' => $res->status == 'completed' ? 'paid' : 'pending',
                    'order_status' => $res->status, // pending, confirmed, active, completed, cancelled
                    'total_price' => $res->menus->sum(fn ($m) => $m->price * $m->pivot->quantity),
                    'courier' => null,
                    'time' => $res->reservation_time ? Carbon::parse($res->reservation_time)->format('H:i') : $res->created_at->format('H:i'),
                    'elapsed_minutes' => now()->diffInMinutes($res->created_at),
                    'items' => $res->menus->map(function ($item) {
                        return [
                            'id' => $item->pivot->id,
                            'name' => $item->name,
                            'quantity' => $item->pivot->quantity,
                            'status' => $item->pivot->status ?? 'pending',
                            'notes' => $item->pivot->notes,
                            'type' => 'reservation',
                        ];
                    }),
                    'special_requests' => $res->special_requests,
                ];
            });

        $allOrders = $allOrders->concat($reservations)->sortByDesc('time')->values();

        $couriers = User::where('role', Role::KURIR->value)->get(['id', 'name']);

        return Inertia::render('kitchen/index', [
            'online_active' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['pending', 'confirmed', 'waiting_for_payment', 'preparing', 'delivering', 'delivered', 'active']))->values(),
            'online_completed' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['complete', 'completed', 'served']))->values(),
            'online_cancelled' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['cancelled', 'rejected']))->values(),
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

                // Notify Customer via Website
                $reservation?->user?->notify(new AppNotification(
                    __('Hidangan Siap'),
                    __('Hidangan ":name" Anda sudah siap dan akan segera disajikan.', ['name' => $item->name]),
                    'success',
                    route('reservations.show', [$item->reservation_id], false)
                ));
            }
        }

        return back()->with('success', 'Item status updated.');
    }

    public function updateOrderItemStatus(Request $request, $itemId)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,served',
        ]);

        $item = OrderItem::with(['menu', 'order.user'])->find($itemId);
        if (! $item) {
            return back();
        }

        $item->update(['status' => $validated['status']]);

        event(new DishStatusUpdated($item->order_id, $itemId, $validated['status'], $item->menu ? $item->menu->name : 'Item'));

        if ($validated['status'] === 'ready' && $item->order && $item->order->user) {
            $item->order->user->notify(new AppNotification(
                __('Hidangan Siap'),
                __('Hidangan ":name" Anda sudah siap dan akan segera dikemas/disajikan.', ['name' => $item->menu ? $item->menu->name : 'Menu']),
                'success',
                route('orders.track', [$item->order_id], false)
            ));
        }

        return back()->with('success', 'Order Item status updated.');
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

        // OTOMATISASI: Jika status pesanan berubah, update semua item di dalamnya
        if ($validated['status'] === 'preparing') {
            $order->items()->update(['status' => 'preparing']);
        } elseif (in_array($validated['status'], ['complete', 'delivering', 'delivered'])) {
            $order->items()->update(['status' => 'ready']);
        }

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Update Status Pesanan'),
            __('Pesanan #:order Anda sekarang berstatus: :status', ['order' => $order->order_number, 'status' => ucfirst($validated['status'])]),
            'info',
            route('orders.track', [$order->id], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} diperbarui ke ".ucfirst($validated['status']));
    }

    public function acceptOrder(Order $order)
    {
        // Langsung masuk ke tahap memasak tanpa menunggu pembayaran
        $order->update(['order_status' => 'preparing']);

        // Otomatis tandai semua item sebagai sedang dimasak
        $order->items()->update(['status' => 'preparing']);

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Pesanan Diterima'),
            __('Kabar baik! Pesanan #:order Anda telah diterima dan koki kami mulai memasak sekarang.', ['order' => $order->order_number]),
            'success',
            route('orders.track', [$order->id], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} diterima dan mulai dimasak.");
    }

    public function rejectOrder(Order $order)
    {
        $order->update(['order_status' => 'rejected']);

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Pesanan Ditolak'),
            __('Maaf, pesanan #:order Anda ditolak karena alasan operasional.', ['order' => $order->order_number]),
            'error',
            route('orders.history', [], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} ditolak.");
    }
}
