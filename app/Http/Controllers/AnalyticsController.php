<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    /**
     * Display the analytics dashboard.
     */
    public function index()
    {
        // 1. Total Revenue from Booking Fees
        $totalRevenue = Reservation::where('payment_status', 'paid')->sum('booking_fee');

        // 2. Top 5 Best Selling Menus
        $topMenus = DB::table('menu_reservation')
            ->join('menus', 'menu_reservation.menu_id', '=', 'menus.id')
            ->select('menus.name', DB::raw('SUM(menu_reservation.quantity) as total_sold'))
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // 3. Reservation Stats (Monthly)
        $monthlyReservations = Reservation::select(
            DB::raw('COUNT(id) as count'),
            DB::raw('MONTH(date) as month')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // 4. User Stats
        $userStats = [
            'total' => User::count(),
            'customers' => User::where('role', 'customer')->count(),
            'staff' => User::where('role', 'staff')->count(),
            'couriers' => User::where('role', 'kurir')->count(),
        ];

        // 5. Peak Hours Data
        $peakHours = Reservation::select(
            DB::raw('HOUR(time) as hour'),
            DB::raw('COUNT(id) as count')
        )
            ->whereIn('status', ['confirmed', 'completed'])
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // 6. Service Type Distribution
        $serviceDistribution = Reservation::select(
            'type',
            DB::raw('COUNT(id) as count')
        )
            ->groupBy('type')
            ->get();

        // 7. Loyalty Usage Stats
        $loyaltyStats = [
            'total_points_redeemed' => Reservation::sum('points_used') ?? 0,
            'total_discounts_given' => Reservation::sum('discount_amount') ?? 0,
        ];

        // 8. Recent Reviews
        $recentReviews = Review::with('user', 'reservation')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('dashboard/analytics', [
            'stats' => [
                'revenue' => $totalRevenue,
                'topMenus' => $topMenus,
                'monthlyReservations' => $monthlyReservations,
                'userStats' => $userStats,
                'recentReviews' => $recentReviews,
                'peakHours' => $peakHours,
                'serviceDistribution' => $serviceDistribution,
                'loyaltyStats' => $loyaltyStats,
            ],
        ]);
    }
}
