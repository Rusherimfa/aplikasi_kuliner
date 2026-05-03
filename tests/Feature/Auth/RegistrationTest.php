<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    withoutExceptionHandling();
    $response = post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '081234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    assertAuthenticated();

    $user = User::where('email', 'test@example.com')->first();
    $response->assertRedirect(route('otp.verify'));
});
