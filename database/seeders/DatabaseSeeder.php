<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Team;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleUserSeeder::class,
            SeatingLayoutSeeder::class,
        ]);

        $team = Team::query()->first();

        if (! $team) {
            return;
        }

        $menus = [
            ['name' => 'Wagyu A5 Ribeye', 'category' => 'Main Course', 'price' => 750000, 'description' => 'Steak premium dari sapi pilihan Jepang.', 'is_available' => true],
            ['name' => 'Truffle Mushroom Soup', 'category' => 'Appetizer', 'price' => 85000, 'description' => 'Sup krim jamur gurih dengan tetesan minyak truffle murni.', 'is_available' => true],
            ['name' => 'Artisan Lychee Tea', 'category' => 'Beverage', 'price' => 45000, 'description' => 'Teh kraf dengan buah leci segar utuh.', 'is_available' => true],
        ];

        foreach ($menus as $menu) {
            Menu::firstOrCreate(
                ['name' => $menu['name'], 'team_id' => $team->id],
                array_merge($menu, ['team_id' => $team->id]),
            );
        }
    }
}
