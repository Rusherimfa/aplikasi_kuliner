<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
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
        // Fetch reservations that are confirmed or pending and have menus NOT yet served
        $activeOrders = Reservation::whereIn('status', ['confirmed', 'pending'])
            ->whereHas('menus', function ($query) {
                $query->where('menu_reservation.status', '!=', 'served');
            })
            ->with(['menus' => function ($query) {
                $query->withPivot('id', 'quantity', 'notes', 'status');
            }, 'restoTable', 'user'])
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($res) {
                return [
                    'id' => $res->id,
                    'customer_name' => $res->customer_name ?? $res->user?->name ?? 'Guest',
                    'table' => $res->restoTable?->name ?? '?',
                    'time' => $res->time,
                    'items' => $res->menus->map(function ($menu) {
                        return [
                            'pivot_id' => $menu->pivot->id,
                            'name' => $menu->name,
                            'quantity' => $menu->pivot->quantity,
                            'notes' => $menu->pivot->notes,
                            'status' => $menu->pivot->status,
                        ];
                    }),
                ];
            });

        return Inertia::render('kitchen/index', [
            'orders' => $activeOrders,
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

        return back()->with('success', 'Item status updated.');
    }
}
