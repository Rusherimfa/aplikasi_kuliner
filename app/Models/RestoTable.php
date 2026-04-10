<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RestoTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
        'category',
        'pos_x',
        'pos_y',
        'is_active',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
