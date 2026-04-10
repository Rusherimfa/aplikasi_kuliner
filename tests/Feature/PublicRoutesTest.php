<?php

use App\Models\Menu;
use App\Models\Team;

// ─────────────────────────────────────────────
// Public pages — accessible without auth
// ─────────────────────────────────────────────

test('welcome page is accessible to guests', function () {
    $this->get(route('home'))
        ->assertOk();
});

test('catalog page is accessible to guests', function () {
    $this->get(route('catalog'))
        ->assertOk();
});

test('experience page is accessible to guests', function () {
    $this->get(route('experience'))
        ->assertOk();
});

test('checkout page is accessible to guests', function () {
    $this->get(route('checkout'))
        ->assertOk();
});

test('reservation creation form is accessible to guests', function () {
    $this->get(route('reservations.create'))
        ->assertOk();
});

// ─────────────────────────────────────────────
// Catalog filtering
// ─────────────────────────────────────────────

test('catalog can be filtered by category', function () {
    $team = Team::factory()->create();
    Menu::factory()->create(['team_id' => $team->id, 'category' => 'Main Course', 'is_available' => true]);
    Menu::factory()->create(['team_id' => $team->id, 'category' => 'Beverage', 'is_available' => true]);

    $this->get(route('catalog', ['category' => 'Main Course']))
        ->assertOk();
});

test('catalog can be searched by name', function () {
    $team = Team::factory()->create();
    Menu::factory()->create(['team_id' => $team->id, 'name' => 'Wagyu Steak', 'is_available' => true]);

    $this->get(route('catalog', ['search' => 'wagyu']))
        ->assertOk();
});
