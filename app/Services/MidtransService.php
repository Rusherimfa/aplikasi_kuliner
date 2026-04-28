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
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = config('services.midtrans.is_sanitized');
        Config::$is3ds = config('services.midtrans.is_3ds');
    }

    public function getSnapToken($order)
    {
        $itemDetails = [];
        $subtotal = 0;

        // Jika ini adalah Order (Pesanan Online)
        if ($order instanceof Order) {
            $order->load('items.menu');
            foreach ($order->items as $item) {
                $itemDetails[] = [
                    'id' => 'MENU-'.$item->menu_id,
                    'price' => (int) $item->price,
                    'quantity' => (int) $item->quantity,
                    'name' => $item->menu->name,
                ];
                $subtotal += ($item->price * $item->quantity);
            }

            if ($order->delivery_fee > 0) {
                $itemDetails[] = [
                    'id' => 'DELIVERY',
                    'price' => (int) $order->delivery_fee,
                    'quantity' => 1,
                    'name' => 'Biaya Pengiriman',
                ];
            }
        }
        // Jika ini adalah Reservation (DP)
        elseif ($order instanceof Reservation) {
            $itemDetails[] = [
                'id' => 'DP-RES-'.$order->id,
                'price' => (int) $order->booking_fee,
                'quantity' => 1,
                'name' => 'DP Reservasi Meja',
            ];
            $subtotal = $order->booking_fee;
        }

        // Tambahkan Pajak sebagai Item
        if ($order->tax_amount > 0) {
            $itemDetails[] = [
                'id' => 'TAX',
                'price' => (int) $order->tax_amount,
                'quantity' => 1,
                'name' => 'Pajak (PB1) 10%',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => ($order->order_number ?? 'RES-'.$order->id).'-'.time(),
                'gross_amount' => (int) $order->total_price ?? $order->total_after_discount,
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => $order->customer_name,
                'email' => $order->customer_email,
                'phone' => $order->customer_phone,
            ],
        ];

        return Snap::getSnapToken($params);
    }
}
