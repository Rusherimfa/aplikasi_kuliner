<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourierController extends Controller
{
    /**
     * Toggle courier availability.
     */
    public function toggleAvailability(Request $request, int $id)
    {
        $user = Auth::user();

        // Only the courier himself or an admin can change the status
        if ($user->id !== $id && ! $user->isAdmin()) {
            abort(403);
        }

        $courier = User::findOrFail($id);
        $courier->is_available = $request->boolean('is_available');
        $courier->save();

        // Optional broadcast can be added later
        return response()->json([
            'id' => $courier->id,
            'is_available' => $courier->is_available,
        ]);
    }

    /**
     * Show list of couriers for admin/staff.
     */
    public function index()
    {
        $couriers = User::where('role', Role::KURIR)->select('id', 'name', 'is_available')->get();

        return Inertia::render('admin/couriers/Index', [
            'couriers' => $couriers,
        ]);
    }
}
