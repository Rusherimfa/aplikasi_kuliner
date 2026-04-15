<?php

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('renders user dashboard for user role', function () {
    $user = User::factory()->create([
        'role' => UserRole::User,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->component('dashboard/user'));
});

it('renders cashier dashboard for kasir role', function () {
    $user = User::factory()->create([
        'role' => UserRole::Kasir,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->component('dashboard/kasir'));
});

it('renders staff dashboard for admin roles', function (UserRole $role) {
    $user = User::factory()->create([
        'role' => $role,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->component('dashboard'));
})->with([
    UserRole::Admin,
    UserRole::SuperAdmin,
]);
