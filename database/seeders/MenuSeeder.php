<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teams = Team::all();

        if ($teams->isEmpty()) {
            $teams = Team::factory()->count(2)->create();
        }

        foreach ($teams as $team) {
            Menu::factory()->count(20)->create([
                'team_id' => $team->id,
            ]);
        }
    }
}
