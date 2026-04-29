<?php

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;

test('users can list their notifications', function () {
    /** @var User $user */
    $user = User::factory()->create();

    actingAs($user)
        ->getJson(route('notifications.index'))
        ->assertOk();
});

test('users can mark a notification as read', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\TestNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->id,
        'data' => ['message' => 'Test'],
    ]);

    actingAs($user)
        ->patchJson(route('notifications.read', $notification->id))
        ->assertOk();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('users can mark all notifications as read', function () {
    /** @var User $user */
    $user = User::factory()->create();
    DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\TestNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->id,
        'data' => ['message' => 'Test 1'],
    ]);

    actingAs($user)
        ->postJson(route('notifications.read-all'))
        ->assertOk();

    expect($user->unreadNotifications()->count())->toBe(0);
});

test('users can delete a notification', function () {
    /** @var User $user */
    $user = User::factory()->create();
    $notification = DatabaseNotification::create([
        'id' => Str::uuid()->toString(),
        'type' => 'App\Notifications\TestNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->id,
        'data' => ['message' => 'Test'],
    ]);

    actingAs($user)
        ->deleteJson(route('notifications.destroy', $notification->id))
        ->assertOk();

    expect(DatabaseNotification::find($notification->id))->toBeNull();
});
