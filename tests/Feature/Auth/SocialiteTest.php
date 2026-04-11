<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

test('users can redirect to google', function () {
    $response = $this->get('/auth/google');

    // Fortify or Socialite will send a 302 redirect to google
    $response->assertStatus(302);
    $this->assertStringContainsString('accounts.google.com', $response->headers->get('Location'));
});

test('new users can register via google', function () {
    $abstractUser = Mockery::mock('Laravel\Socialite\Two\User');
    $abstractUser->shouldReceive('getId')
        ->andReturn('1234567890')
        ->shouldReceive('getName')
        ->andReturn('Google User')
        ->shouldReceive('getEmail')
        ->andReturn('googleuser@test.com')
        ->shouldReceive('getAvatar')
        ->andReturn('https://google.com/avatar.jpg');

    // Expose properties dynamically used by SocialiteController
    $abstractUser->id = '1234567890';
    $abstractUser->name = 'Google User';
    $abstractUser->email = 'googleuser@test.com';
    $abstractUser->avatar = 'https://google.com/avatar.jpg';

    $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(route('home'));

    $this->assertAuthenticated();

    $user = User::where('email', 'googleuser@test.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role->value)->toBe('customer');
    expect($user->email_verified_at)->not->toBeNull();
});

test('existing admin users can login via google and redirect to dashboard', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@test.com',
    ]);

    $abstractUser = Mockery::mock('Laravel\Socialite\Two\User');
    $abstractUser->shouldReceive('getId')
        ->andReturn('0987654321')
        ->shouldReceive('getName')
        ->andReturn('Admin Google')
        ->shouldReceive('getEmail')
        ->andReturn('admin@test.com')
        ->shouldReceive('getAvatar')
        ->andReturn('https://google.com/avatar_admin.jpg');

    $abstractUser->id = '0987654321';
    $abstractUser->name = 'Admin Google';
    $abstractUser->email = 'admin@test.com';
    $abstractUser->avatar = 'https://google.com/avatar_admin.jpg';

    $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
    $provider->shouldReceive('user')->andReturn($abstractUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $response = $this->get('/auth/google/callback');

    $response->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($admin);

    $admin->refresh();
    expect($admin->google_id)->toBe('0987654321');
});
