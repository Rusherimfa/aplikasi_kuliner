<?php

namespace Database\Factories;

use App\Models\RestoTable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RestoTable>
 */
class RestoTableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Meja '.$this->faker->unique()->numberBetween(1, 50),
            'capacity' => $this->faker->randomElement([2, 4, 6, 8, 10]),
            'category' => $this->faker->randomElement(['indoor', 'outdoor', 'private', 'vip']),
            'pos_x' => $this->faker->numberBetween(0, 100),
            'pos_y' => $this->faker->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
