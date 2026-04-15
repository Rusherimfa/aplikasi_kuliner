<?php

namespace Database\Seeders;

use App\Models\RestaurantTable;
use App\Models\TableSeat;
use App\Models\Team;
use Illuminate\Database\Seeder;

class SeatingLayoutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $team = Team::query()->first();

        if (! $team) {
            return;
        }

        $tableLayouts = [
            ['code' => 'T01', 'name' => 'Meja A1', 'seats' => 4, 'x' => 1, 'y' => 1],
            ['code' => 'T02', 'name' => 'Meja A2', 'seats' => 2, 'x' => 2, 'y' => 1],
            ['code' => 'T03', 'name' => 'Meja B1', 'seats' => 6, 'x' => 1, 'y' => 2],
            ['code' => 'T04', 'name' => 'Meja B2', 'seats' => 4, 'x' => 2, 'y' => 2],
            ['code' => 'T05', 'name' => 'Meja C1', 'seats' => 2, 'x' => 1, 'y' => 3],
            ['code' => 'T06', 'name' => 'Meja C2', 'seats' => 8, 'x' => 2, 'y' => 3],
        ];

        foreach ($tableLayouts as $layout) {
            $table = RestaurantTable::query()->updateOrCreate(
                [
                    'team_id' => $team->id,
                    'code' => $layout['code'],
                ],
                [
                    'name' => $layout['name'],
                    'seat_count' => $layout['seats'],
                    'position_x' => $layout['x'],
                    'position_y' => $layout['y'],
                ],
            );

            $activeSeatNumbers = collect(range(1, $layout['seats']));

            $activeSeatNumbers->each(function (int $seatNumber) use ($team, $table): void {
                TableSeat::query()->updateOrCreate(
                    [
                        'restaurant_table_id' => $table->id,
                        'seat_number' => $seatNumber,
                    ],
                    [
                        'team_id' => $team->id,
                        'label' => $table->code.'-S'.$seatNumber,
                        'is_active' => true,
                    ],
                );
            });

            TableSeat::query()
                ->where('restaurant_table_id', $table->id)
                ->whereNotIn('seat_number', $activeSeatNumbers->all())
                ->delete();
        }
    }
}
