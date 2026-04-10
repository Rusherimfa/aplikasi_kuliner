<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case STAFF = 'staff';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::STAFF => 'Staff',
            self::CUSTOMER => 'Customer',
        };
    }
}
