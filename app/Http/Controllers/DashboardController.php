<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $pendingReservations = Reservation::where('status', 'pending')->count();
        $todayReservations = Reservation::whereDate('date', $today)->whereIn('status', ['confirmed', 'completed'])->count();

        $reservationsToday = Reservation::whereDate('date', $today)
            ->where('status', '!=', 'rejected')
            ->with('menus')
            ->get();

        $estimatedRevenue = 0;
        foreach ($reservationsToday as $res) {
            foreach ($res->menus as $m) {
                $qty = $m->pivot->quantity;
                $estimatedRevenue += $m->price * $qty;
            }
        }

        $totalMenus = Menu::count();
        $totalCustomers = User::where('role', 'customer')->count();

        $recentReservations = Reservation::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'customer_name' => $r->customer_name ?: ($r->user ? $r->user->name : 'Unknown'),
                    'status' => $r->status,
                    'date' => $r->date,
                    'time' => $r->time,
                    'created_at' => $r->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'today_reservations' => $todayReservations,
                'estimated_revenue' => $estimatedRevenue,
                'total_menus' => $totalMenus,
                'total_customers' => $totalCustomers,
            ],
            'recent_activity' => $recentReservations,
        ]);
    }
}
