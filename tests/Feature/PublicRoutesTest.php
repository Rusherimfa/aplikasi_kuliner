<?php

use App\Models\Menu;
use App\Models\Team;

use function Pest\Laravel\get;

// ─────────────────────────────────────────────
// Public pages — accessible without auth
// ─────────────────────────────────────────────

test('welcome page is accessible to guests', function () {
    get(route('home'))
        ->assertOk();
});

test('catalog page is accessible to guests', function () {
    get(route('catalog'))
        ->assertOk();
});

test('experience page is accessible to guests', function () {
    get(route('experience'))
        ->assertOk();
});

test('checkout page redirects guests to login', function () {
    get(route('checkout'))
        ->assertRedirect(route('login'));
});

test('reservation creation form is accessible to guests', function () {
    get(route('reservations.create'))
        ->assertOk();
});

// ─────────────────────────────────────────────
// Catalog filtering
// ─────────────────────────────────────────────

test('catalog can be filtered by category', function () {
    $team = Team::factory()->create();
    Menu::factory()->create(['team_id' => $team->id, 'category' => 'Main Course', 'is_available' => true]);
    Menu::factory()->create(['team_id' => $team->id, 'category' => 'Beverage', 'is_available' => true]);

    get(route('catalog', ['category' => 'Main Course']))
        ->assertOk();
});

test('catalog can be searched by name', function () {
    $team = Team::factory()->create();
    Menu::factory()->create(['team_id' => $team->id, 'name' => 'Wagyu Steak', 'is_available' => true]);

    get(route('catalog', ['search' => 'wagyu']))
        ->assertOk();
});
