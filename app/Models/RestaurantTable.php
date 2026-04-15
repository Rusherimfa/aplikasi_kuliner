<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RestaurantTable extends Model
{
    protected $fillable = [
        'team_id',
        'code',
        'name',
        'seat_count',
        'position_x',
        'position_y',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function seats(): HasMany
    {
        return $this->hasMany(TableSeat::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
