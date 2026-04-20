<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'courier_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'order_type',
        'payment_status',
        'order_status',
        'total_price',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function courier()
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
