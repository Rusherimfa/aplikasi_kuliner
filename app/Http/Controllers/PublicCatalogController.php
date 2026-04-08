<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Http\Request;
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

        // 4 Menus for the landing page (random or latest)
        $bestSellers = [];
        if ($defaultTeam) {
            $bestSellers = $defaultTeam->menus()
                ->where('is_available', true)
                ->inRandomOrder()
                ->take(4)
                ->get();
        }

        return Inertia::render('welcome/index', [
            'canRegister' => Features::enabled(Features::registration()),
            'bestSellers' => $bestSellers,
        ]);
    }

    /**
     * Display the full menu catalog.
     */
    public function catalog(Request $request)
    {
        $defaultTeam = Team::first();

        $menus = [];
        if ($defaultTeam) {
            $menus = $defaultTeam->menus()
                ->where('is_available', true)
                ->when($request->query('category'), function ($query, $category) {
                    $query->where('category', $category);
                })
                ->when($request->query('search'), function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->get(); // Using get for frontend grid display instead of heavy pagination for now, or we can use pagination.
        }

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
}
