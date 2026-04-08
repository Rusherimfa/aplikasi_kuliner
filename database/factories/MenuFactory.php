<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Specialty'];

        return [
            'team_id' => Team::factory(),
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'category' => $this->faker->randomElement($categories),
            'price' => $this->faker->randomFloat(2, 50000, 500000), // Prices between 50k - 500k IDR equivalent
            'image_path' => null, // We can leave this null or add a placeholder
            'is_available' => $this->faker->boolean(80), // 80% chance to be available
        ];
    }
}
