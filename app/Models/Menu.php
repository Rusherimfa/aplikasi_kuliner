<?php

namespace App\Models;

use Database\Factories\MenuFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['team_id', 'name', 'description', 'category', 'price', 'image_path', 'is_available', 'is_best_seller'])]
class Menu extends Model
{
    /** @use HasFactory<MenuFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the team that owns the menu.
     */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function reservations(): BelongsToMany
    {
        return $this->belongsToMany(Reservation::class)
            ->withPivot('quantity', 'notes')
            ->withTimestamps();
    }

    /**
     * Get booking items that include this menu.
     *
     * @return HasMany<BookingItem, $this>
     */
    public function bookingItems(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_available' => 'boolean',
            'is_best_seller' => 'boolean',
        ];
    }
}
