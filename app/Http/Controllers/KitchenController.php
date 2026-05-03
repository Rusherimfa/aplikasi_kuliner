<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Events\DishStatusUpdated;
use App\Events\OrderStatusUpdated;
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
            ->map(fn (Order $order) => $this->mapOrder($order));

        // Removed Dine-in Reservations as per user request (handled outside order dashboard)
        $allOrders = $allOrders->sortByDesc('time')->values();

        $couriers = User::where('role', Role::KURIR->value)->get(['id', 'name']);

        return Inertia::render('kitchen/index', [
            'online_active' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['pending', 'confirmed', 'waiting_for_payment', 'preparing', 'ready', 'delivering', 'delivered', 'active']))->values(),
            'online_completed' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['complete', 'completed', 'served']))->values(),
            'online_cancelled' => $allOrders->filter(fn ($o) => in_array($o['order_status'], ['cancelled', 'rejected']))->values(),
            'couriers' => $couriers,
        ]);
    }

    /**
     * Map Order model to KDS format.
     */
    private function mapOrder(Order $order): array
    {
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
                    'notes' => $item->notes,
                    'type' => 'order',
                ];
            }),
        ];
    }

    /**
     * Map Reservation model to KDS format.
     */
    private function mapReservation(Reservation $res): array
    {
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
    }

    /**
     * Update the status of a specific menu item within a reservation.
     */
    public function updateItemStatus(Request $request, int $pivotId)
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
            ->select(['menus.name', 'menu_reservation.reservation_id'])
            ->first();

        if ($item) {
            event(new DishStatusUpdated($item->reservation_id, $pivotId, $validated['status'], $item->name));

            // Auto-complete reservation if all items are served
            $reservation = Reservation::with('menus')->find($item->reservation_id);
            if ($reservation && $validated['status'] === 'served') {
                $allServed = $reservation->menus->every(fn ($m) => $m->pivot->status === 'served');
                if ($allServed) {
                    $reservation->update(['status' => 'completed']);
                }
            }

            // WA Simulation if Ready
            if ($validated['status'] === 'ready') {
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

    public function updateOrderItemStatus(Request $request, int $itemId)
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

        // Auto-complete order if all items are ready
        $order = Order::with('items')->find($item->order_id);
        if ($order && ($validated['status'] === 'ready' || $validated['status'] === 'served')) {
            $allReady = $order->items->every(fn ($i) => $i->status === 'ready' || $i->status === 'served');
            if ($allReady) {
                // If it's delivery, we might want to wait for courier pickup,
                // but for simplicity, we mark it as ready for pickup/delivery
                $order->update(['order_status' => $order->order_type === 'delivery' ? 'preparing' : ($order->order_type === 'pickup' ? 'ready' : 'complete')]);
            }
        }

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
            'status' => 'nullable|string',
            'courier_id' => 'nullable|exists:users,id',
            'payment_status' => 'nullable|in:unpaid,paid,failed',
        ]);

        $updateData = [];
        if (isset($validated['status'])) {
            $updateData['order_status'] = $validated['status'];
        }
        if (isset($validated['courier_id'])) {
            $updateData['courier_id'] = $validated['courier_id'];
        }
        if (isset($validated['payment_status'])) {
            $updateData['payment_status'] = $validated['payment_status'];

            // OTOMATISASI: Jika dibayar, otomatis status menjadi preparing agar mulai dimasak
            if ($validated['payment_status'] === 'paid' && $order->order_status === 'waiting_for_payment') {
                $updateData['order_status'] = 'preparing';
            }
        }

        $order->update($updateData);

        // Refresh model to get updated order_status for the event
        $order->refresh();

        event(new OrderStatusUpdated($order));

        // OTOMATISASI: Jika status pesanan berubah, update semua item di dalamnya
        $newStatus = $validated['status'] ?? ($updateData['order_status'] ?? null);
        if ($newStatus) {
            if ($newStatus === 'preparing') {
                $order->items()->update(['status' => 'preparing']);
            } elseif (in_array($newStatus, ['complete', 'delivering', 'delivered'])) {
                $order->items()->update(['status' => 'ready']);
            }
        }

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Update Status Pesanan'),
            __('Pesanan #:order Anda telah diperbarui.', ['order' => $order->order_number]),
            'info',
            route('orders.track', [$order->id], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} berhasil diperbarui.");
    }

    public function acceptOrder(Order $order)
    {
        // Berubah: Tunggu pembayaran dulu sebelum dimasak
        $order->update(['order_status' => 'waiting_for_payment']);
        event(new OrderStatusUpdated($order));

        // Note: Tidak otomatis tandai item sedang dimasak, biarkan pending

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Pesanan Dikonfirmasi'),
            __('Pesanan #:order Anda telah dikonfirmasi. Silakan lakukan pembayaran agar pesanan dapat segera disiapkan.', ['order' => $order->order_number]),
            'success',
            route('orders.history', [], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} dikonfirmasi, menunggu pembayaran.");
    }

    public function rejectOrder(Order $order)
    {
        $order->update(['order_status' => 'rejected']);
        event(new OrderStatusUpdated($order));

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Pesanan Ditolak'),
            __('Maaf, pesanan #:order Anda ditolak karena alasan operasional.', ['order' => $order->order_number]),
            'error',
            route('orders.history', [], false)
        ));

        return back()->with('success', "Pesanan #{$order->order_number} ditolak.");
    }

    public function readyAll(Order $order)
    {
        $order->items()->update(['status' => 'ready']);

        if ($order->order_type === 'pickup' && $order->order_status !== 'ready') {
            $order->update(['order_status' => 'ready']);
        }

        // Refresh to get the latest item statuses
        $order->load('items');
        event(new OrderStatusUpdated($order));

        // Notify Customer
        $order->user?->notify(new AppNotification(
            __('Pesanan Selesai Disiapkan'),
            __('Kabar baik! Semua hidangan untuk pesanan #:order Anda sudah siap.', ['order' => $order->order_number]),
            'success',
            route('orders.track', [$order->id], false)
        ));

        return back()->with('success', 'Semua item pesanan telah ditandai Selesai Dimasak.');
    }
}
