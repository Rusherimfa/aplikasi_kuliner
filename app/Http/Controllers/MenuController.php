<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display a listing of the menus for the team.
     */
    public function index(Request $request)
    {
        $team = Team::first();
        if (! $team) {
            abort(500, 'Master team not found');
        }

        $menus = $team->menus()
            ->when($request->query('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->query('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->get();

        return Inertia::render('menus/index', [
            'menus' => $menus,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Store a newly created menu in storage.
     */
    public function store(Request $request)
    {
        $team = Team::first();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
        ]);

        $team->menus()->create($validated);

        return back()->with('success', 'Menu ditambahkan berhasil.');
    }

    /**
     * Update the specified menu in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
        ]);

        $menu->update($validated);

        return back()->with('success', 'Menu diperbarui berhasil.');
    }

    /**
     * Remove the specified menu from storage.
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return back()->with('success', 'Menu berhasil dihapus.');
    }
}
