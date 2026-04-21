<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (! auth()->user()->isAdmin()) {
            abort(403);
        }

        $users = User::where('role', '!=', Role::ADMIN)->latest()->get();

        return Inertia::render('accounts/index', [
            'staffs' => $users->where('role.value', 'staff')->values(),
            'kurirs' => $users->where('role.value', 'kurir')->values(),
            'customers' => $users->where('role.value', 'customer')->values(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (! auth()->user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,staff,kurir',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_verified' => true,
        ]);

        return back()->with('success', 'Akun berhasil dibuat.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $account)
    {
        if (! auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($account->isAdmin()) {
            abort(403, 'Tidak dapat memodifikasi akun Owner.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($account->id)],
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,staff,kurir',
            'password' => 'nullable|string|min:8',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $account->update($updateData);

        return back()->with('success', 'Akun berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $account)
    {
        if (! auth()->user()->isAdmin()) {
            abort(403);
        }

        if ($account->isAdmin()) {
            abort(403, 'Tidak dapat menghapus akun Owner.');
        }

        $account->delete();

        return back()->with('success', 'Akun berhasil dihapus.');
    }
}
