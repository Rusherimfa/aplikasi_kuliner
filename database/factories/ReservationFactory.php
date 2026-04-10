<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\RestoTable;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'team_id' => Team::factory(),
            'user_id' => User::factory(),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->numerify('08##########'),
            'date' => $this->faker->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'time' => $this->faker->randomElement(['11:00', '12:00', '13:00', '18:00', '19:00', '20:00']),
            'guest_count' => $this->faker->numberBetween(1, 8),
            'special_requests' => null,
            'resto_table_id' => RestoTable::factory(),
            'status' => 'pending',
            'booking_fee' => 50000,
            'payment_status' => 'paid',
            'check_in_token' => Str::uuid()->toString(),
            'checked_in_at' => null,
        ];
    }

    /**
     * Reservation that is awaiting payment.
     */
    public function awaitingPayment(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'awaiting_payment',
            'payment_status' => 'unpaid',
        ]);
    }

    /**
     * Reservation that has been checked in.
     */
    public function checkedIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'checked_in_at' => now(),
        ]);
    }
}

