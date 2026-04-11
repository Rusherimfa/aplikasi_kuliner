<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['name', 'role', 'quote', 'rating', 'is_approved', 'user_id', 'email'];

    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
            'rating' => 'integer',
        ];
    }
}
