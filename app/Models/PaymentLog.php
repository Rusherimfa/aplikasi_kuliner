<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentLog extends Model
{
    protected $fillable = [
        'payment_id',
        'event_type',
        'status_before',
        'status_after',
        'raw_payload',
    ];

    protected function casts(): array
    {
        return [
            'raw_payload' => 'array',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }
}
