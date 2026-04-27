<?php

use App\Models\Message;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\Event;

test('customer can send a reservation chat message to staff', function () {
    $customer = User::factory()->customer()->create();
    $reservation = Reservation::factory()->create([
        'team_id' => $customer->currentTeam->id,
        'user_id' => $customer->id,
    ]);

    Event::fake();

    $this->actingAs($customer)
        ->postJson(route('chat.store', $reservation), [
            'content' => 'Butuh bantuan staff untuk reservasi saya.',
        ])
        ->assertSuccessful()
        ->assertJsonPath('content', 'Butuh bantuan staff untuk reservasi saya.')
        ->assertJsonPath('sender.id', $customer->id);

    expect(Message::where('reservation_id', $reservation->id)
        ->where('sender_id', $customer->id)
        ->where('content', 'Butuh bantuan staff untuk reservasi saya.')
        ->exists())->toBeTrue();
});

test('staff can reply to a customer reservation chat', function () {
    $customer = User::factory()->customer()->create();
    $staff = User::factory()->staff()->create();
    $reservation = Reservation::factory()->create([
        'team_id' => $customer->currentTeam->id,
        'user_id' => $customer->id,
    ]);

    Event::fake();

    $this->actingAs($staff)
        ->postJson(route('chat.store', $reservation), [
            'content' => 'Siap, staff akan bantu sekarang.',
        ])
        ->assertSuccessful()
        ->assertJsonPath('content', 'Siap, staff akan bantu sekarang.')
        ->assertJsonPath('sender.id', $staff->id);
});

test('assigned courier can reply to a customer chat', function () {
    $customer = User::factory()->customer()->create();
    $courier = User::factory()->create(['role' => 'kurir']);
    $reservation = Reservation::factory()->create([
        'team_id' => $customer->currentTeam->id,
        'user_id' => $customer->id,
        'courier_id' => $courier->id,
    ]);

    Event::fake();

    $this->actingAs($courier)
        ->postJson(route('chat.store', $reservation), [
            'content' => 'Kurir sudah menuju lokasi.',
        ])
        ->assertSuccessful()
        ->assertJsonPath('content', 'Kurir sudah menuju lokasi.')
        ->assertJsonPath('sender.id', $courier->id);
});

test('unassigned courier cannot access another customer chat', function () {
    $customer = User::factory()->customer()->create();
    $assignedCourier = User::factory()->create(['role' => 'kurir']);
    $otherCourier = User::factory()->create(['role' => 'kurir']);
    $reservation = Reservation::factory()->create([
        'team_id' => $customer->currentTeam->id,
        'user_id' => $customer->id,
        'courier_id' => $assignedCourier->id,
    ]);

    Event::fake();

    $this->actingAs($otherCourier)
        ->postJson(route('chat.store', $reservation), [
            'content' => 'Saya tidak boleh masuk chat ini.',
        ])
        ->assertForbidden();
});

test('chat threads expose customer staff and courier conversations for home', function () {
    $customer = User::factory()->customer()->create();
    $courier = User::factory()->create(['role' => 'kurir']);
    $reservation = Reservation::factory()->create([
        'team_id' => $customer->currentTeam->id,
        'user_id' => $customer->id,
        'courier_id' => $courier->id,
    ]);

    Message::create([
        'reservation_id' => $reservation->id,
        'sender_id' => $courier->id,
        'content' => 'Saya stand by di chat kurir.',
        'is_chatbot' => false,
    ]);

    $this->actingAs($customer)
        ->getJson(route('chat.threads'))
        ->assertSuccessful()
        ->assertJsonPath('threads.0.type', 'reservations')
        ->assertJsonPath('threads.0.record_id', $reservation->id)
        ->assertJsonPath('threads.0.badge', 'Customer, Staff & Kurir')
        ->assertJsonPath('threads.0.unread_count', 1);
});
