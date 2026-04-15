<?php

namespace Database\Seeders;

use App\Enums\TeamRole;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = collect([
            [
                'name' => 'User Demo',
                'email' => 'user@restoweb.test',
                'role' => UserRole::User,
            ],
            [
                'name' => 'Kasir Demo',
                'email' => 'kasir@restoweb.test',
                'role' => UserRole::Kasir,
            ],
            [
                'name' => 'Admin Demo',
                'email' => 'admin@restoweb.test',
                'role' => UserRole::Admin,
            ],
            [
                'name' => 'Superadmin Demo',
                'email' => 'superadmin@restoweb.test',
                'role' => UserRole::SuperAdmin,
            ],
        ])->map(function (array $account): User {
            $existingUser = User::query()->where('email', $account['email'])->first();

            if ($existingUser) {
                $existingUser->update([
                    'name' => $account['name'],
                    'password' => Hash::make('password'),
                    'role' => $account['role'],
                    'email_verified_at' => now(),
                ]);

                return $existingUser->fresh();
            }

            return User::factory()->create([
                'name' => $account['name'],
                'email' => $account['email'],
                'password' => Hash::make('password'),
                'role' => $account['role'],
                'email_verified_at' => now(),
            ]);
        });

        $defaultTeam = $users->first()?->currentTeam ?? $users->first()?->personalTeam();

        if (! $defaultTeam) {
            return;
        }

        $users->first()?->switchTeam($defaultTeam);

        $users->skip(1)->each(function (User $user) use ($defaultTeam): void {
            $teamRole = in_array($user->role, [UserRole::Admin, UserRole::SuperAdmin], true)
                ? TeamRole::Admin->value
                : TeamRole::Member->value;

            if (! $user->belongsToTeam($defaultTeam)) {
                $defaultTeam->members()->attach($user, [
                    'role' => $teamRole,
                ]);
            } else {
                $defaultTeam->members()->updateExistingPivot($user->id, ['role' => $teamRole]);
            }

            $user->switchTeam($defaultTeam);
        });
    }
}
