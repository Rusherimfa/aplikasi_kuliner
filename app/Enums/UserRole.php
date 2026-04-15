<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Kasir = 'kasir';
    case Admin = 'admin';
    case SuperAdmin = 'superadmin';

    /**
     * Get the role display label.
     */
    public function label(): string
    {
        return match ($this) {
            self::User => 'User',
            self::Kasir => 'Kasir',
            self::Admin => 'Admin',
            self::SuperAdmin => 'Super Admin',
        };
    }

    /**
     * Resolve Inertia dashboard component by role.
     */
    public function dashboardComponent(): string
    {
        return match ($this) {
            self::Admin, self::SuperAdmin => 'dashboard',
            self::Kasir => 'dashboard/kasir',
            self::User => 'dashboard/user',
        };
    }
}
