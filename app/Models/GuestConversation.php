<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuestConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'guest_name',
        'status',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(GuestMessage::class);
    }
}
