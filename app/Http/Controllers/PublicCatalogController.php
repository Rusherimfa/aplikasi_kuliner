<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Review;
use App\Models\Team;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class PublicCatalogController extends Controller
{
    /**
     * Display the welcome/landing page with best seller menus.
     */
    public function welcome()
    {
        $defaultTeam = Team::first();

        // 4 Menus for the landing page
        $bestSellers = $defaultTeam ? $defaultTeam->menus()
            ->where('is_available', true)
            ->orderBy('is_best_seller', 'desc')
            ->inRandomOrder()
            ->take(4)
            ->get()->toArray() : [];

        // 3 Real Reviews - now filtered by is_approved
        $reviews = Cache::remember('welcome_reviews', 3600, function () {
            return Review::with('user:id,name,avatar')
                ->where('is_approved', true)
                ->where('rating', '>=', 4)
                ->whereNotNull('message')
                ->orderBy('rating', 'desc')
                ->latest()
                ->take(3)
                ->get()
                ->toArray();
        });

        $testimonials = Testimonial::where('is_approved', true)
            ->orderBy('rating', 'desc')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('welcome/index', [
            'canRegister' => Features::enabled(Features::registration()),
            'bestSellers' => $bestSellers,
            'testimonials' => $testimonials,
            'reviews' => $reviews,
        ]);
    }

    /**
     * Display the full menu catalog.
     */
    public function catalog(Request $request)
    {
        $defaultTeam = Team::first();

        $menus = $defaultTeam ? $defaultTeam->menus()
            ->when($request->query('category'), function ($query, $category) {
                if ($category === 'Best Seller') {
                    $query->where('is_best_seller', true);
                } else {
                    $query->where('category', $category);
                }
            })
            ->when($request->query('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('is_best_seller', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()->toArray() : [];

        return Inertia::render('catalog/index', [
            'menus' => $menus,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Display the Experience static page.
     */
    public function experience()
    {
        return Inertia::render('experience/index');
    }

    /**
     * Display the Checkout static page.
     */
    public function checkout()
    {
        return Inertia::render('checkout/index');
    }
}
