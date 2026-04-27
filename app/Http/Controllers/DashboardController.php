<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();
        $period = request('period', 'week');

        if ($user->isAdmin()) {
            return $this->adminDashboard($period);
        }

        // Courier overlaps with Staff in User model role checks sometimes, so check Courier first!
        if ($user->isCourier()) {
            return $this->courierDashboard();
        }

        if ($user->isStaff()) {
            return $this->staffDashboard($period);
        }

        // Default or Customer fall-back if needed
        return redirect()->route('home');
    }

    private function courierDashboard()
    {
        $user = Auth::user();
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

    private function adminDashboard(string $period)
    {
        $today = Carbon::today();

        // Determine start date and grouping based on period
        $days = match ($period) {
            'month' => 30,
            'year' => 365,
            'day' => 1,
            default => 7,
        };
        $startDate = Carbon::today()->subDays($days - 1);

        // Basic Stats
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $activeOrders = Order::whereIn('order_status', ['pending', 'waiting_for_payment', 'preparing', 'delivering'])->count();
        $totalMenus = Menu::count();
        $todayRevenue = (float) Order::whereDate('created_at', $today)
            ->where('order_status', 'complete')
            ->sum('total_price');

        // 1. Optimized Revenue Analytics
        $groupByRaw = match ($period) {
            'year' => "DATE_FORMAT(created_at, '%Y-%m')",
            'day' => "HOUR(created_at)",
            default => "DATE(created_at)",
        };

        $dailyRevenue = Order::where('created_at', '>=', $startDate->startOfDay())
            ->where('order_status', 'complete')
            ->select(
                DB::raw("$groupByRaw as day"),
                DB::raw('SUM(total_price) as total_revenue'),
                DB::raw('COUNT(*) as total_sales')
            )
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $revenueChart = [];
        if ($period === 'year') {
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::today()->subMonths($i)->format('Y-m');
                $dayData = $dailyRevenue->get($date);
                $revenueChart[] = [
                    'name' => Carbon::parse($date)->format('M'),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        } elseif ($period === 'day') {
            for ($i = 0; $i < 24; $i++) {
                $dayData = $dailyRevenue->get($i);
                $revenueChart[] = [
                    'name' => str_pad($i, 2, '0', STR_PAD_LEFT) . ':00',
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        } else {
            for ($i = 0; $i < $days; $i++) {
                $date = $startDate->copy()->addDays($i)->toDateString();
                $dayData = $dailyRevenue->get($date);
                $revenueChart[] = [
                    'name' => Carbon::parse($date)->format($period === 'month' ? 'd M' : 'D'),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        }

        // 2. Optimized Reservation Analytics
        $dailyReservations = Reservation::where('created_at', '>=', $startDate->startOfDay())
            ->select(
                DB::raw("$groupByRaw as day"),
                DB::raw('COUNT(*) as total_reservations'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN COALESCE(total_after_discount, booking_fee, 0) ELSE 0 END) as total_revenue')
            )
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $reservationChart = [];
        if ($period === 'year') {
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::today()->subMonths($i)->format('Y-m');
                $dayData = $dailyReservations->get($date);
                $reservationChart[] = [
                    'name' => Carbon::parse($date)->format('M'),
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        } elseif ($period === 'day') {
            for ($i = 0; $i < 24; $i++) {
                $dayData = $dailyReservations->get($i);
                $reservationChart[] = [
                    'name' => str_pad($i, 2, '0', STR_PAD_LEFT) . ':00',
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        } else {
            for ($i = 0; $i < $days; $i++) {
                $date = $startDate->copy()->addDays($i)->toDateString();
                $dayData = $dailyReservations->get($date);
                $reservationChart[] = [
                    'name' => Carbon::parse($date)->format($period === 'month' ? 'd M' : 'D'),
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        }

        // 3. Best Selling Menus (Top 5)
        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->where('orders.order_status', 'complete')
            ->where('orders.created_at', '>=', $startDate->startOfDay())
            ->select('menus.name', 'menus.id', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'sold' => (int) $item->total_sold,
            ]);

        return Inertia::render('dashboard/admin', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'active_orders' => $activeOrders,
                'today_revenue' => $todayRevenue,
                'total_menus' => $totalMenus,
            ],
            'filters' => [
                'period' => $period,
            ],
            'revenue_chart' => $revenueChart,
            'reservation_chart' => $reservationChart,
            'best_sellers' => $bestSellers,
            'recent_activity' => $this->getRecentReservations(),
        ]);
    }

    private function staffDashboard(string $period)
    {
        $today = Carbon::today();

        // Determine start date and grouping based on period
        $days = match ($period) {
            'month' => 30,
            'year' => 365,
            'day' => 1,
            default => 7,
        };
        $startDate = Carbon::today()->subDays($days - 1);

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

        // Analytics Data (Optimized)
        $groupByRaw = match ($period) {
            'year' => "DATE_FORMAT(created_at, '%Y-%m')",
            'day' => "HOUR(created_at)",
            default => "DATE(created_at)",
        };

        // 1. Revenue Analytics
        $dailyRevenue = Order::where('created_at', '>=', $startDate->startOfDay())
            ->where('order_status', 'complete')
            ->select(
                DB::raw("$groupByRaw as day"),
                DB::raw('SUM(total_price) as total_revenue'),
                DB::raw('COUNT(*) as total_sales')
            )
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $revenueChart = [];
        if ($period === 'year') {
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::today()->subMonths($i)->format('Y-m');
                $dayData = $dailyRevenue->get($date);
                $revenueChart[] = [
                    'name' => Carbon::parse($date)->format('M'),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        } elseif ($period === 'day') {
            for ($i = 0; $i < 24; $i++) {
                $dayData = $dailyRevenue->get($i);
                $revenueChart[] = [
                    'name' => str_pad($i, 2, '0', STR_PAD_LEFT) . ':00',
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        } else {
            for ($i = 0; $i < $days; $i++) {
                $date = $startDate->copy()->addDays($i)->toDateString();
                $dayData = $dailyRevenue->get($date);
                $revenueChart[] = [
                    'name' => Carbon::parse($date)->format($period === 'month' ? 'd M' : 'D'),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                    'sales' => (int) ($dayData?->total_sales ?? 0),
                ];
            }
        }

        // 2. Reservation Analytics
        $dailyReservations = Reservation::where('created_at', '>=', $startDate->startOfDay())
            ->select(
                DB::raw("$groupByRaw as day"),
                DB::raw('COUNT(*) as total_reservations'),
                DB::raw('SUM(CASE WHEN payment_status = "paid" THEN COALESCE(total_after_discount, booking_fee, 0) ELSE 0 END) as total_revenue')
            )
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $reservationChart = [];
        if ($period === 'year') {
            for ($i = 11; $i >= 0; $i--) {
                $date = Carbon::today()->subMonths($i)->format('Y-m');
                $dayData = $dailyReservations->get($date);
                $reservationChart[] = [
                    'name' => Carbon::parse($date)->format('M'),
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        } elseif ($period === 'day') {
            for ($i = 0; $i < 24; $i++) {
                $dayData = $dailyReservations->get($i);
                $reservationChart[] = [
                    'name' => str_pad($i, 2, '0', STR_PAD_LEFT) . ':00',
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        } else {
            for ($i = 0; $i < $days; $i++) {
                $date = $startDate->copy()->addDays($i)->toDateString();
                $dayData = $dailyReservations->get($date);
                $reservationChart[] = [
                    'name' => Carbon::parse($date)->format($period === 'month' ? 'd M' : 'D'),
                    'reservations' => (int) ($dayData?->total_reservations ?? 0),
                    'revenue' => (float) ($dayData?->total_revenue ?? 0),
                ];
            }
        }

        $bestSellers = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menus', 'order_items.menu_id', '=', 'menus.id')
            ->where('orders.order_status', 'complete')
            ->where('orders.created_at', '>=', $startDate->startOfDay())
            ->select('menus.name', 'menus.id', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'sold' => (int) $item->total_sold,
            ]);

        return Inertia::render('dashboard/staff', [
            'stats' => [
                'pending_reservations' => $pendingReservations,
                'active_orders' => $activeOrders,
                'total_food_sold' => (int) $totalFoodSold,
                'today_revenue' => (float) $todayRevenue,
            ],
            'filters' => [
                'period' => $period,
            ],
            'revenue_chart' => $revenueChart,
            'reservation_chart' => $reservationChart,
            'best_sellers' => $bestSellers,
            'todays_schedule' => $this->getTodaysSchedule(),
            'recent_activity' => $this->getRecentReservations(),
        ]);
    }

    private function getTodaysSchedule()
    {
        return Reservation::query()->whereDate('date', Carbon::today()->toDateString())
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
