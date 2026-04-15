<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TableSeat extends Model
{
    protected $fillable = [
        'team_id',
        'restaurant_table_id',
        'seat_number',
        'label',
        'is_active',
        'position_x',
        'position_y',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class, 'restaurant_table_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
