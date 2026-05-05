<?php

use App\Models\User;
use Illuminate\Config\Repository;
use Illuminate\Container\Container;

test('local storage avatar urls are normalized to relative storage paths', function () {
    $container = new Container;
    $container->instance('config', new Repository([
        'app.url' => 'http://localhost',
    ]));
    Container::setInstance($container);

    $user = new User;

    $user->forceFill([
        'avatar' => 'http://localhost/storage/avatars/profile-photo.jpg',
    ]);

    expect($user->avatar)->toBe('/storage/avatars/profile-photo.jpg');
});

test('external avatar urls remain unchanged', function () {
    $user = new User;

    $user->forceFill([
        'avatar' => 'https://lh3.googleusercontent.com/a/profile-photo=s96-c',
    ]);

    expect($user->avatar)->toBe('https://lh3.googleusercontent.com/a/profile-photo=s96-c');
});
