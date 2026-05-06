<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\Menu;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ->withSum(['orderItems as total_sold' => function ($query) {
                $query->whereHas('order', function ($q) {
                    $q->where('order_status', 'complete');
                });
            }], 'quantity')
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
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $team = Team::first();
        $messages = [
            'image.image' => 'File harus berupa gambar.',
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
            'image' => 'nullable|image',
        ], $messages);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $validated['image_path'] = '/storage/'.$path;
        }

        $team->menus()->create($validated);

        return back()->with('success', 'Menu ditambahkan berhasil.');
    }

    /**
     * Update the specified menu in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $messages = [
            'image.image' => 'File harus berupa gambar.',
        ];

        if ($request->user()->role === Role::STAFF) {
            $validated = $request->validate([
                'is_available' => 'boolean',
                'is_best_seller' => 'boolean',
            ], $messages);
            $menu->update($validated);

            return back()->with('success', 'Status menu diperbarui.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
            'image' => 'nullable|image',
        ], $messages);

        if ($request->hasFile('image')) {
            if ($menu->image_path) {
                $oldPath = str_replace('/storage/', '', $menu->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('menus', 'public');
            $validated['image_path'] = '/storage/'.$path;
        }

        $menu->update($validated);

        return back()->with('success', 'Menu diperbarui berhasil.');
    }

    /**
     * Remove the specified menu from storage.
     */
    public function destroy(Request $request, Menu $menu)
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $menu->delete();

        return back()->with('success', 'Menu berhasil dihapus.');
    }
}
