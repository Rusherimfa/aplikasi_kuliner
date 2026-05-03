<?php

use App\Models\Reservation;
use App\Models\Review;
use App\Models\User;

test('review is auto-approved when submitted', function () {
    $user = User::factory()->create(['is_verified' => true]);
    $reservation = Reservation::factory()->create([
        'user_id' => $user->id,
        'status' => 'completed',
    ]);

    actingAs($user)
        ->post(route('reviews.store', $reservation), [
            'rating' => 5,
            'message' => 'Excellent service!',
        ])
        ->assertSessionHasNoErrors()
        ->assertStatus(302);

    $review = Review::where('reservation_id', $reservation->id)->first();

    expect($review)->not->toBeNull();
    expect($review->rating)->toBe(5);
    expect($review->message)->toBe('Excellent service!');
    expect($review->is_approved)->toBeTrue();
});
