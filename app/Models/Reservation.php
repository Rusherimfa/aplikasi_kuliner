<?php

namespace App\Models;

use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'team_id',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'date',
        'time',
        'guest_count',
        'status',
        'special_requests',
        'resto_table_id',
        'booking_fee',
        'payment_status',
        'check_in_token',
        'checked_in_at',
        'courier_id',
        'delivery_status',
        'delivery_address',
        'type',
        'points_used',
        'discount_amount',
        'total_after_discount',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
            'booking_fee' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'total_after_discount' => 'decimal:2',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class)
            ->withPivot('id', 'quantity', 'notes', 'status')
            ->withTimestamps();
    }

    public function restoTable()
    {
        return $this->belongsTo(RestoTable::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isAwaitingPayment(): bool
    {
        return $this->status === 'awaiting_payment';
    }
}
