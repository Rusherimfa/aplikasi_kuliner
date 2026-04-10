<?php

use App\Models\Menu;
use App\Models\Team;
use App\Models\User;

// ─────────────────────────────────────────────
// Menu Index (Admin + Staff only)
// ─────────────────────────────────────────────

test('staff can view the menus management page', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->get(route('menus.index'))
        ->assertOk();
});

test('customers cannot access menu management', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('menus.index'))
        ->assertForbidden();
});

test('guests are redirected to login for menu management', function () {
    $this->get(route('menus.index'))
        ->assertRedirect(route('login'));
});

// ─────────────────────────────────────────────
// Menu Store (Admin + Staff)
// ─────────────────────────────────────────────

test('admin can create a new menu item', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Team::factory()->create();

    $this->actingAs($admin)
        ->post(route('menus.store'), [
            'name' => 'Sate Ayam Premium',
            'description' => 'Sate ayam pilihan dengan bumbu kacang spesial.',
            'category' => 'Main Course',
            'price' => 55000,
            'is_available' => true,
        ])
        ->assertRedirect();

    expect(Menu::where('name', 'Sate Ayam Premium')->exists())->toBeTrue();
});

test('creating a menu requires a name, category, and valid price', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('menus.store'), [
            'name' => '',
            'category' => '',
            'price' => -100,
        ])
        ->assertSessionHasErrors(['name', 'category', 'price']);
});

test('customers cannot create a menu item', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->post(route('menus.store'), [
            'name' => 'Test Menu',
            'category' => 'Beverage',
            'price' => 20000,
        ])
        ->assertForbidden();
});

// ─────────────────────────────────────────────
// Menu Update (Admin + Staff)
// ─────────────────────────────────────────────

test('admin can update an existing menu item', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $menu = Menu::factory()->create();

    $this->actingAs($admin)
        ->put(route('menus.update', $menu), [
            'name' => 'Nama Baru',
            'description' => 'Deskripsi baru.',
            'category' => 'Appetizer',
            'price' => 99000,
            'is_available' => false,
        ])
        ->assertRedirect();

    expect($menu->fresh()->name)->toBe('Nama Baru');
    expect($menu->fresh()->is_available)->toBeFalse();
});

test('customers cannot update a menu item', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $menu = Menu::factory()->create();

    $this->actingAs($customer)
        ->put(route('menus.update', $menu), [
            'name' => 'Coba Ubah',
            'category' => 'Appetizer',
            'price' => 50000,
        ])
        ->assertForbidden();
});

// ─────────────────────────────────────────────
// Menu Destroy (Admin + Staff)
// ─────────────────────────────────────────────

test('admin can delete a menu item', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $menu = Menu::factory()->create();

    $this->actingAs($admin)
        ->delete(route('menus.destroy', $menu))
        ->assertRedirect();

    expect(Menu::find($menu->id))->toBeNull();
});

test('customers cannot delete a menu item', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $menu = Menu::factory()->create();

    $this->actingAs($customer)
        ->delete(route('menus.destroy', $menu))
        ->assertForbidden();
});
