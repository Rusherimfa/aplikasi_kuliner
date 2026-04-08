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
    public function index(Request $request, Team $team)
    {
        $menus = $team->menus()
            ->when($request->query('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->query('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('menus/index', [
            'menus' => $menus,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Store a newly created menu in storage.
     */
    public function store(Request $request, Team $team)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
        ]);

        $team->menus()->create($validated);

        return back()->with('success', 'Menu added successfully.');
    }

    /**
     * Update the specified menu in storage.
     */
    public function update(Request $request, Team $team, Menu $menu)
    {
        // Ensure menu belongs to team
        if ($menu->team_id !== $team->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
        ]);

        $menu->update($validated);

        return back()->with('success', 'Menu updated successfully.');
    }

    /**
     * Remove the specified menu from storage.
     */
    public function destroy(Team $team, Menu $menu)
    {
        if ($menu->team_id !== $team->id) {
            abort(403);
        }

        $menu->delete();

        return back()->with('success', 'Menu deleted successfully.');
    }
}
