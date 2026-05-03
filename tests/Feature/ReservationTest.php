<?php

use App\Mail\ReservationConfirmedMail;
use App\Models\Reservation;
use App\Models\RestoTable;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

// ─────────────────────────────────────────────
// Reservation Creation (Public)
// ─────────────────────────────────────────────

test('guests can view the reservation creation form', function () {
    RestoTable::factory()->create();

    get(route('reservations.create'))
        ->assertOk();
});

test('a guest can create a reservation and is redirected to payment', function () {
    Mail::fake();

    $team = Team::factory()->create();
    $table = RestoTable::factory()->create();

    $response = post(route('reservations.store'), [
        'customer_name' => 'Budi Santoso',
        'customer_email' => 'budi@example.com',
        'customer_phone' => '081234567890',
        'date' => now()->addDays(3)->format('Y-m-d'),
        'time' => '19:00',
        'guest_count' => 2,
        'special_requests' => null,
        'resto_table_id' => $table->id,
        'type' => 'dine_in',
        'menus' => [],
    ]);

    $response->assertRedirect(route('reservations.history'));

    $reservation = Reservation::where('customer_email', 'budi@example.com')->first();
    expect($reservation)->not->toBeNull();
    expect($reservation->status)->toBe('pending');
    expect($reservation->payment_status)->toBe('unpaid');
    expect($reservation->check_in_token)->not->toBeNull();
});

test('cannot create a reservation for a date in the past', function () {
    $table = RestoTable::factory()->create();

    post(route('reservations.store'), [
        'customer_name' => 'Budi Santoso',
        'customer_email' => 'budi@example.com',
        'customer_phone' => '081234567890',
        'date' => now()->subDay()->format('Y-m-d'),
        'time' => '19:00',
        'guest_count' => 2,
        'resto_table_id' => $table->id,
        'type' => 'dine_in',
    ])->assertSessionHasErrors(['date']);
});

test('cannot double-book a table at the same date and time', function () {
    $table = RestoTable::factory()->create();
    $team = Team::factory()->create();
    $date = now()->addDays(5)->format('Y-m-d');

    // First booking occupies the table
    Reservation::factory()->create([
        'team_id' => $team->id,
        'resto_table_id' => $table->id,
        'date' => $date,
        'time' => '19:00',
        'status' => 'pending',
    ]);

    $response = post(route('reservations.store'), [
        'customer_name' => 'Andi Saputra',
        'customer_email' => 'andi@example.com',
        'customer_phone' => '089876543210',
        'date' => $date,
        'time' => '19:00',
        'guest_count' => 2,
        'resto_table_id' => $table->id,
        'type' => 'dine_in',
    ]);

    $response->assertSessionHasErrors(['resto_table_id']);
});

// ─────────────────────────────────────────────
// Payment Flow (Auth required)
// ─────────────────────────────────────────────

test('authenticated user can view the payment page for their own reservation', function () {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->awaitingPayment()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('reservations.payment', $reservation))
        ->assertOk();
});

test('user cannot view payment page of another user\'s reservation', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $reservation = Reservation::factory()->awaitingPayment()->create([
        'team_id' => $owner->currentTeam->id,
        'user_id' => $owner->id,
    ]);

    actingAs($other)
        ->get(route('reservations.payment', $reservation))
        ->assertForbidden();
});

test('processing payment marks reservation as paid and sends confirmation email', function () {
    Mail::fake();

    $user = User::factory()->create();
    $reservation = Reservation::factory()->awaitingPayment()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->post(route('reservations.payment.process', $reservation))
        ->assertRedirect(route('reservations.history'));

    $reservation->refresh();
    expect($reservation->payment_status)->toBe('paid');
    expect($reservation->status)->toBe('confirmed');

    Mail::assertQueued(ReservationConfirmedMail::class, fn ($mail) => $mail->hasTo($reservation->customer_email));
});

// ─────────────────────────────────────────────
// Reservation History (Auth required)
// ─────────────────────────────────────────────

test('authenticated user can view their reservation history', function () {
    $user = User::factory()->create();
    Reservation::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
    ]);

    actingAs($user)
        ->get(route('reservations.history'))
        ->assertOk();
});

test('guests are redirected to login when visiting reservation history', function () {
    get(route('reservations.history'))
        ->assertRedirect(route('login'));
});

// ─────────────────────────────────────────────
// QR Code Check-in (Staff only)
// ─────────────────────────────────────────────

test('staff can check in a guest via QR token', function () {
    $staff = User::factory()->create(['role' => 'admin']);
    $reservation = Reservation::factory()->create([
        'team_id' => $staff->currentTeam->id,
        'status' => 'pending',
        'checked_in_at' => null,
    ]);

    actingAs($staff)
        ->get(route('reservations.checkin', $reservation->check_in_token))
        ->assertRedirect(route('reservations.index'));

    $reservation->refresh();
    expect($reservation->checked_in_at)->not->toBeNull();
    expect($reservation->status)->toBe('confirmed');
});

test('checking in an already checked-in guest redirects with info message', function () {
    $staff = User::factory()->create(['role' => 'admin']);
    $reservation = Reservation::factory()->checkedIn()->create([
        'team_id' => $staff->currentTeam->id,
    ]);

    actingAs($staff)
        ->get(route('reservations.checkin', $reservation->check_in_token))
        ->assertRedirect(route('reservations.index'));
});

test('checkin with an invalid token returns 404', function () {
    $staff = User::factory()->create(['role' => 'admin']);

    actingAs($staff)
        ->get(route('reservations.checkin', 'invalid-token-xyz'))
        ->assertNotFound();
});

// ─────────────────────────────────────────────
// Role-based Access Control
// ─────────────────────────────────────────────

test('customers cannot access the staff reservations dashboard', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    actingAs($customer)
        ->get(route('reservations.index'))
        ->assertForbidden();
});

test('staff can access the reservations dashboard', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    actingAs($staff)
        ->get(route('reservations.index'))
        ->assertOk();
});

test('admin can update reservation status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $reservation = Reservation::factory()->create([
        'team_id' => $admin->currentTeam->id,
        'status' => 'pending',
    ]);

    actingAs($admin)
        ->put(route('reservations.update', $reservation), ['status' => 'confirmed'])
        ->assertRedirect();

    expect($reservation->fresh()->status)->toBe('confirmed');
});

// ─────────────────────────────────────────────
// Customer Reservation Management
// ─────────────────────────────────────────────

test('customer can cancel their own pending reservation', function () {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    actingAs($user)
        ->from(route('reservations.history'))
        ->delete(route('reservations.destroy', $reservation))
        ->assertRedirect(route('reservations.history'));

    expect(Reservation::find($reservation->id))->toBeNull();
});

test('customer cannot cancel a confirmed reservation', function () {
    $user = User::factory()->create();
    $reservation = Reservation::factory()->create([
        'team_id' => $user->currentTeam->id,
        'user_id' => $user->id,
        'status' => 'confirmed',
    ]);

    actingAs($user)
        ->delete(route('reservations.destroy', $reservation))
        ->assertRedirect();

    expect(Reservation::find($reservation->id))->not->toBeNull();
});
