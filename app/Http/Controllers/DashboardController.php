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
        $startDate = Carbon::today()->subDays(6);

        // Basic Stats
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $todayReservations = Reservation::whereDate('date', $today)->whereIn('status', ['confirmed', 'completed'])->count();

        $totalMenus = Menu::count();
        $totalCustomers = User::where('role', 'customer')->count();

        // Estimated Revenue Today
        $reservationsToday = Reservation::whereDate('date', $today)
            ->where('status', '!=', 'rejected')
            ->with('menus')
            ->get();

        $estimatedRevenue = 0;
        foreach ($reservationsToday as $res) {
            foreach ($res->menus as $m) {
                $estimatedRevenue += $m->price * $m->pivot->quantity;
            }
        }

        // 1. Revenue Analytics (Last 7 Days)
        $revenueChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyRes = Reservation::whereDate('date', $date)
                ->where('status', '!=', 'rejected')
                ->with('menus')
                ->get();

            $dailyTotal = 0;
            foreach ($dailyRes as $res) {
                foreach ($res->menus as $m) {
                    $dailyTotal += $m->price * $m->pivot->quantity;
                }
            }

            $revenueChart[] = [
                'name' => $date->format('D'),
                'revenue' => $dailyTotal,
                'reservations' => $dailyRes->count(),
            ];
        }

        // 2. Best Selling Menus (Top 5)
        $bestSellers = Menu::withSum('reservations as total_sold', 'menu_reservation.quantity')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'sold' => (int) $menu->total_sold,
                ];
            });

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
            'revenue_chart' => $revenueChart,
            'best_sellers' => $bestSellers,
            'recent_activity' => $recentReservations,
        ]);
    }
}
