<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Reservation;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        // Konfigurasi Midtrans dari file config/services.php
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production', false);
        Config::$isSanitized = config('services.midtrans.is_sanitized', true);
        Config::$is3ds = config('services.midtrans.is_3ds', true);
    }

    /**
     * Mendapatkan Snap Token dari Midtrans.
     *
     * @param Order|Reservation $model
     * @return string
     */
    public function getSnapToken($model)
    {
        $isOrder = $model instanceof Order;
        
        // Format Order ID: [Nomor/ID]-[Timestamp] untuk memastikan keunikan saat retry
        $orderId = ($isOrder ? $model->order_number : 'RES-' . $model->id) . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => (int) ($isOrder ? $model->total_price : $model->total_after_discount),
            ],
            'customer_details' => [
                'first_name' => $model->customer_name,
                'email' => $model->customer_email,
                'phone' => $model->customer_phone,
            ],
        ];

        return Snap::getSnapToken($params);
    }
}