<?php

use App\Enums\TeamRole;
use App\Enums\UserRole;
use App\Events\ReservationCreated;
use App\Models\AdminNotification;
use App\Models\RestaurantTable;
use App\Models\TableSeat;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

it('broadcasts reservation created event when user submits reservation', function () {
    Broadcast::fake();

    $user = User::factory()->create();
    $team = $user->currentTeam;
    $admin = User::factory()->create([
        'role' => UserRole::Admin,
    ]);

    $team->members()->attach($admin, [
        'role' => TeamRole::Admin->value,
    ]);
    $admin->switchTeam($team);

    $table = RestaurantTable::query()->create([
        'team_id' => $team->id,
        'code' => 'T99',
        'name' => 'Meja Test',
        'seat_count' => 1,
    ]);
    $seat = TableSeat::query()->create([
        'team_id' => $team->id,
        'restaurant_table_id' => $table->id,
        'seat_number' => 1,
        'label' => 'T99-S1',
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('reservations.store'), [
            'date' => now()->addDay()->toDateString(),
            'time' => '19:30',
            'guest_count' => 4,
            'table_seat_id' => $seat->id,
            'special_requests' => 'Dekat jendela',
        ]);

    $response->assertRedirect(route('dashboard', ['current_team' => $team->slug]));

    Broadcast::assertBroadcasted(ReservationCreated::class, function (ReservationCreated $event) use ($user): bool {
        return $event->reservation->user_id === $user->id
            && $event->reservation->status === 'pending';
    });

    expect(AdminNotification::query()->count())->toBe(1);

    $notification = AdminNotification::query()->first();
    expect($notification)->not->toBeNull();
    expect($notification->team_id)->toBe($team->id)
        ->and($notification->recipient_user_id)->toBe($admin->id)
        ->and($notification->actor_user_id)->toBe($user->id)
        ->and($notification->reservation_id)->not->toBeNull()
        ->and($notification->is_read)->toBeFalse()
        ->and($notification->type)->toBe('reservation_created');
});
