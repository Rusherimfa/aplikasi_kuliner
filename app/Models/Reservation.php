<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_number',
        'team_id',
        'restaurant_table_id',
        'table_seat_id',
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
        'admin_note',
        'confirmed_at',
        'rejected_at',
        'payment_sent_at',
        'paid_at',
        'cancelled_at',
        'expired_at',
        'occupied_at',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'checked_in_at' => 'datetime',
            'booking_fee' => 'decimal:2',
            'confirmed_at' => 'datetime',
            'rejected_at' => 'datetime',
            'payment_sent_at' => 'datetime',
            'paid_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'expired_at' => 'datetime',
            'occupied_at' => 'datetime',
            'completed_at' => 'datetime',
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

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class)
            ->withPivot('quantity', 'notes')
            ->withTimestamps();
    }

    public function restoTable(): BelongsTo
    {
        return $this->belongsTo(RestoTable::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class, 'restaurant_table_id');
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(TableSeat::class, 'table_seat_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(BookingItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function isPending(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    public function isConfirmed(): bool
    {
        return $this->status === BookingStatus::Confirmed;
    }

    public function isAwaitingPayment(): bool
    {
        return $this->status === BookingStatus::WaitingPayment;
    }
}
