<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertGuest;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'current_password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
            'current_password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('profile avatar can be uploaded', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $avatar = UploadedFile::fake()->image('profile-photo.jpg');

    $response = actingAs($user)
        ->patch(route('profile.update'), [
            'avatar' => $avatar,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->avatar)->toStartWith('/storage/avatars/');

    $storedAvatarPath = ltrim(str_replace('/storage/', '', (string) $user->avatar), '/');

    Storage::disk('public')->assertExists($storedAvatarPath);
});

test('previous local profile avatar is removed when a new one is uploaded', function () {
    Storage::fake('public');

    Storage::disk('public')->put('avatars/old-profile-photo.jpg', 'old-avatar');

    $user = User::factory()->create([
        'avatar' => '/storage/avatars/old-profile-photo.jpg',
    ]);

    $avatar = UploadedFile::fake()->image('new-profile-photo.jpg');

    actingAs($user)
        ->patch(route('profile.update'), [
            'avatar' => $avatar,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    Storage::disk('public')->assertMissing('avatars/old-profile-photo.jpg');
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
