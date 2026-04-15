<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Concerns\HasTeams;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'current_team_id', 'role', 'google_id', 'avatar', 'email_verified_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin || $this->role === UserRole::SuperAdmin;
    }

    public function isStaff(): bool
    {
        return in_array($this->role, [UserRole::Admin, UserRole::SuperAdmin, UserRole::Kasir], true);
    }

    public function isCustomer(): bool
    {
        return $this->role === UserRole::User;
    }

    /**
     * Get reservations created by this user.
     *
     * @return HasMany<Reservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Determine if user has one of the given roles.
     */
    public function hasAnyRole(UserRole ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }
}
