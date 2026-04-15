<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id',
        'invoice_number',
        'amount',
        'method',
        'gateway',
        'payment_link',
        'qr_payload',
        'status',
        'deadline_at',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'deadline_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(PaymentLog::class);
    }
}
