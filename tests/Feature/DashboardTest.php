<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    get(route('dashboard'))
        ->assertRedirect(route('login'));
});

test('customers cannot access the staff dashboard', function () {
    $user = User::factory()->create(['role' => 'customer']);

    actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});

test('admin can access the dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk();
});

test('staff can access the dashboard', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    actingAs($staff)
        ->get(route('dashboard'))
        ->assertOk();
});
