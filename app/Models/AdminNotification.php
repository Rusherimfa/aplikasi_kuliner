<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminNotification extends Model
{
    protected $fillable = [
        'team_id',
        'recipient_user_id',
        'actor_user_id',
        'reservation_id',
        'type',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
