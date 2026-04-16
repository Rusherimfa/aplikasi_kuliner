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
        $user = auth()->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        // Courier overlaps with Staff in User model role checks sometimes, so check Courier first!
        if ($user->isCourier()) {
            return $this->courierDashboard();
        }

        if ($user->isStaff()) {
            return $this->staffDashboard();
        }

        // Default or Customer fall-back if needed
        return redirect()->route('home');
    }

    private function courierDashboard()
    {
        $user = auth()->user();

        $deliveries = Reservation::where('courier_id', $user->id)
            ->with(['restoTable', 'menus'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'customer_name' => $r->customer_name ?: ($r->user ? $r->user->name : 'Guest'),
                'address' => $r->delivery_address ?? 'No Address Provided',
                'status' => $r->delivery_status,
                'time' => $r->time,
                'date' => $r->date,
                'items_count' => $r->menus->count(),
            ]);

        return Inertia::render('dashboard/courier', [
            'stats' => [
                'pending_deliveries' => $deliveries->whereIn('status', ['preparing', 'on_delivery'])->count(),
                'completed_deliveries' => $deliveries->where('status', 'delivered')->count(),
            ],
            'deliveries' => $deliveries,
        ]);
    }

    private function adminDashboard()
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
            ->map(fn ($menu) => [
                'id' => $menu->id,
                'name' => $menu->name,
                'sold' => (int) $menu->total_sold,
            ]);

        $recentReservations = $this->getRecentReservations();

        return Inertia::render('dashboard/admin', [
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

    private function staffDashboard()
    {
        $today = Carbon::today();

        // Focused Operational Stats
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $todayReservations = Reservation::whereDate('date', $today)->whereIn('status', ['confirmed', 'completed'])->count();
        $confirmedToday = Reservation::whereDate('date', $today)->where('status', 'confirmed')->count();

        $todaysSchedule = Reservation::whereDate('date', $today)
            ->with('user', 'restoTable')
            ->orderBy('time', 'asc')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'customer_name' => $r->customer_name ?: ($r->user ? $r->user->name : 'Guest'),
                'time' => Carbon::parse($r->time)->format('H:i'),
                'status' => $r->status,
                'guests' => $r->guest_count,
                'table' => $r->restoTable ? $r->restoTable->name : 'Unassigned',
            ]);

        $recentReservations = $this->getRecentReservations();

        return Inertia::render('dashboard/staff', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'today_reservations' => $todayReservations,
                'confirmed_today' => $confirmedToday,
            ],
            'todays_schedule' => $todaysSchedule,
            'recent_activity' => $recentReservations,
        ]);
    }

    private function getRecentReservations()
    {
        return Reservation::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'customer_name' => $r->customer_name ?: ($r->user ? $r->user->name : 'Unknown'),
                'status' => $r->status,
                'date' => $r->date,
                'time' => $r->time,
                'created_at' => $r->created_at->diffForHumans(),
            ]);
    }
}
