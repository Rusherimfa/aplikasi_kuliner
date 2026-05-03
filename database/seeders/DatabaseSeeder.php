<?php

namespace Database\Seeders;

use App\Models\Menu;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\RestoTable;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Inisialisasi Team Utama
        $team = Team::firstOrCreate(['slug' => 'restoweb-master'], [
            'name' => 'RestoWeb Master',
            'is_personal' => true,
        ]);

        // 2. Akun ADMIN / OWNER
        $admin = User::firstOrCreate([
            'email' => 'admin@restoweb.test',
        ], [
            'name' => 'Admin Boss (Owner)',
            'role' => 'admin',
            'password' => bcrypt('password'),
            'current_team_id' => $team->id,
            'is_verified' => true,
        ]);

        DB::table('team_members')->updateOrInsert(
            ['team_id' => $team->id, 'user_id' => $admin->id],
            ['role' => 'owner', 'created_at' => now(), 'updated_at' => now()]
        );

        // 3. Akun STAFF (Pelayan/Kasir)
        $staffs = [
            ['email' => 'staff@restoweb.test', 'name' => 'Staff Utama (Waiter)'],
            ['email' => 'kasir@restoweb.test', 'name' => 'Staff Kasir'],
        ];

        foreach ($staffs as $s) {
            User::firstOrCreate(['email' => $s['email']], [
                'name' => $s['name'],
                'role' => 'staff',
                'password' => bcrypt('password'),
                'current_team_id' => $team->id,
                'is_verified' => true,
            ]);
        }

        // Akun KURIR
        User::firstOrCreate(['email' => 'kurir@restoweb.test'], [
            'name' => 'Agus (Kurir Express)',
            'role' => 'kurir',
            'password' => bcrypt('password'),
            'current_team_id' => $team->id,
            'is_verified' => true,
        ]);

        // 4. Akun CUSTOMER (Pelanggan)
        $customers = [
            ['email' => 'test@example.com', 'name' => 'Customer Biasa'],
            ['email' => 'pelanggan@restoweb.test', 'name' => 'Budi Setiawan (VIP User)'],
        ];

        foreach ($customers as $c) {
            User::firstOrCreate(['email' => $c['email']], [
                'name' => $c['name'],
                'role' => 'customer',
                'password' => bcrypt('password'),
                'current_team_id' => $team->id,
                'is_verified' => true,
            ]);
        }

        // Default Menus from OceansRestoMenuSeeder
        $this->call(OceansRestoMenuSeeder::class);

        // Floor Plan Tables
        $tables = [
            ['name' => 'VIP-1', 'capacity' => 6, 'category' => 'vip', 'pos_x' => 2, 'pos_y' => 2],
            ['name' => 'VIP-2', 'capacity' => 6, 'category' => 'vip', 'pos_x' => 2, 'pos_y' => 8],
            ['name' => 'W-1', 'capacity' => 2, 'category' => 'window', 'pos_x' => 11, 'pos_y' => 2],
            ['name' => 'W-2', 'capacity' => 2, 'category' => 'window', 'pos_x' => 11, 'pos_y' => 5],
            ['name' => 'W-3', 'capacity' => 2, 'category' => 'window', 'pos_x' => 11, 'pos_y' => 8],
            ['name' => 'W-4', 'capacity' => 2, 'category' => 'window', 'pos_x' => 11, 'pos_y' => 11],
            ['name' => 'R-1', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 5, 'pos_y' => 4],
            ['name' => 'R-2', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 8, 'pos_y' => 4],
            ['name' => 'R-3', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 5, 'pos_y' => 7],
            ['name' => 'R-4', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 8, 'pos_y' => 7],
            ['name' => 'R-5', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 5, 'pos_y' => 10],
            ['name' => 'R-6', 'capacity' => 4, 'category' => 'regular', 'pos_x' => 8, 'pos_y' => 10],
        ];

        foreach ($tables as $t) {
            RestoTable::firstOrCreate(['name' => $t['name']], $t);
        }
    }
}
