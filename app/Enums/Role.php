<?php

namespace App\Enums;

enum Role: string
{
    case ADMIN = 'admin';
    case STAFF = 'staff';
    case KURIR = 'kurir';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::STAFF => 'Staff',
            self::KURIR => 'Kurir Delivery',
            self::CUSTOMER => 'Customer',
        };
    }
}
