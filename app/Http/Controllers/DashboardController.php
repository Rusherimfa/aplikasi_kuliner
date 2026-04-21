<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
        $today = Carbon::today();

        $deliveries = Order::where('courier_id', $user->id)
            ->where('order_type', 'delivery')
            ->with(['items.menu'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'customer_name' => $o->customer_name,
                'address' => $o->delivery_address ?? 'Alamat tidak tersedia',
                'status' => $o->order_status,
                'time' => $o->created_at->format('H:i'),
                'date' => $o->created_at->format('d M Y'),
                'items_count' => $o->items->sum('quantity'),
                'items' => $o->items->map(fn ($item) => [
                    'name' => $item->menu ? $item->menu->name : 'Unknown Item',
                    'quantity' => $item->quantity,
                ]),
                'updated_at' => $o->updated_at,
            ]);

        return Inertia::render('dashboard/courier', [
            'stats' => [
                'pending_deliveries' => $deliveries->whereIn('status', ['preparing', 'delivering'])->count(),
                'completed_today' => $deliveries->whereIn('status', ['delivered', 'complete'])->filter(fn ($d) => Carbon::parse($d['updated_at'])->isToday())->count(),
                'total_completed' => $deliveries->whereIn('status', ['delivered', 'complete'])->count(),
            ],
            'deliveries' => $deliveries->whereIn('status', ['preparing', 'delivering', 'delivered', 'complete'])->values(),
        ]);
    }

    private function adminDashboard()
    {
        $today = Carbon::today();
        $startDate = Carbon::today()->subDays(6);

        // Basic Stats
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $activeOrders = Order::whereIn('order_status', ['pending', 'waiting_for_payment', 'preparing', 'delivering'])->count();

        $totalMenus = Menu::count();
        $totalCustomers = User::where('role', 'customer')->count();

        // Estimated Revenue Today from Orders
        $todayRevenue = Order::whereDate('created_at', $today)
            ->where('order_status', 'complete')
            ->sum('total_price');

        // 1. Revenue Analytics (Last 7 Days) from Orders
        $revenueChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyOrders = Order::whereDate('created_at', $date)
                ->where('order_status', 'complete')
                ->get(['id', 'total_price']);

            $revenueChart[] = [
                'name' => $date->format('D'),
                'revenue' => $dailyOrders->sum('total_price'),
                'sales' => $dailyOrders->count(),
            ];
        }

        $reservationChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyReservations = Reservation::whereDate('created_at', $date)->get();

            $reservationChart[] = [
                'name' => $date->format('D'),
                'reservations' => $dailyReservations->count(),
                'revenue' => $dailyReservations->where('payment_status', 'paid')->sum(function($r) {
                    return $r->total_after_discount ?? $r->booking_fee;
                }),
            ];
        }

        // 2. Best Selling Menus (Top 5) from Order Items
        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->where('orders.order_status', 'complete')
            ->select('menus.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->name,
                'sold' => (int) $item->total_sold,
            ]);

        $recentReservations = $this->getRecentReservations();

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'active_orders' => $activeOrders,
                'today_revenue' => $todayRevenue,
                'total_menus' => $totalMenus,
                'total_customers' => $totalCustomers,
            ],
            'revenue_chart' => $revenueChart,
            'reservation_chart' => $reservationChart,
            'best_sellers' => $bestSellers,
            'recent_activity' => $recentReservations,
        ]);
    }

    private function staffDashboard()
    {
        $today = Carbon::today();
        $startDate = Carbon::today()->subDays(6);

        // Focused Operational Stats
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $activeOrders = Order::whereIn('order_status', ['pending', 'waiting_for_payment', 'preparing', 'delivering'])->count();

        $totalFoodSold = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereDate('orders.created_at', $today)
            ->where('orders.order_status', 'complete')
            ->sum('order_items.quantity');

        $todayRevenue = Order::whereDate('created_at', $today)
            ->where('order_status', 'complete')
            ->sum('total_price');

        // Revenue Analytics & Best Sellers
        $revenueChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyOrders = Order::whereDate('created_at', $date)
                ->where('order_status', 'complete')
                ->get(['id', 'total_price']);

            $revenueChart[] = [
                'name' => $date->format('D'),
                'revenue' => $dailyOrders->sum('total_price'),
                'sales' => $dailyOrders->count(),
            ];
        }

        $reservationChart = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyReservations = Reservation::whereDate('created_at', $date)->get();

            $reservationChart[] = [
                'name' => $date->format('D'),
                'reservations' => $dailyReservations->count(),
                'revenue' => $dailyReservations->where('payment_status', 'paid')->sum(function($r) {
                    return $r->total_after_discount ?? $r->booking_fee;
                }),
            ];
        }

        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->where('orders.order_status', 'complete')
            ->select('menus.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->name,
                'sold' => (int) $item->total_sold,
            ]);

        $todaysSchedule = Reservation::whereDate('date', $today)
            ->with(['user', 'restoTable', 'menus'])
            ->orderBy('time', 'asc')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'customer_name' => $r->customer_name ?: ($r->user ? $r->user->name : 'Guest'),
                'customer_phone' => $r->customer_phone,
                'date' => $r->date,
                'time' => Carbon::parse($r->time)->format('H:i'),
                'status' => $r->status,
                'payment_status' => $r->payment_status,
                'booking_fee' => $r->booking_fee,
                'total_after_discount' => $r->total_after_discount,
                'discount_amount' => $r->discount_amount,
                'type' => $r->type,
                'guests' => $r->guest_count,
                'table' => $r->restoTable ? $r->restoTable->name : 'Unassigned',
                'table_id' => $r->resto_table_id,
                'menus' => $r->menus,
                'special_requests' => $r->special_requests,
            ]);

        $recentReservations = $this->getRecentReservations();

        return Inertia::render('dashboard/staff', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'active_orders' => $activeOrders,
                'total_food_sold' => (int) $totalFoodSold,
                'today_revenue' => $todayRevenue,
            ],
            'revenue_chart' => $revenueChart,
            'reservation_chart' => $reservationChart,
            'best_sellers' => $bestSellers,
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
