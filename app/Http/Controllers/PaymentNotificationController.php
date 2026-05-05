<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Notifications\AppNotification;
use Illuminate\Support\Facades\Log;
use Midtrans\Notification;

class PaymentNotificationController extends Controller
{
    public function handle(Request $request)
    {
        try {
            $serverKey = config('services.midtrans.server_key');
            $hashed = hash('sha512', $request->order_id.$request->status_code.$request->gross_amount.$serverKey);

            if ($hashed !== $request->signature_key) {
                Log::warning("Midtrans Security Warning: Invalid Signature Key for Order $request->order_id");

                return response()->json(['message' => 'Invalid signature'], 403);
            }

            $notification = new Notification;
            $transaction = $notification->transaction_status;
            $type = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraud = $notification->fraud_status;

            Log::info("Midtrans Notification Received: $orderId - $transaction");

            if (str_starts_with($orderId, 'ORD-')) {
                // Order ID format: ORD-YYYYMMDDHHMMSS-RAND-TIMESTAMP
                // We need to extract the original ORD-YYYYMMDDHHMMSS-RAND
                $parts = explode('-', $orderId);
                array_pop($parts); // Remove the timestamp suffix
                $originalOrderNumber = implode('-', $parts);

                $this->handleOrder($originalOrderNumber, $transaction, $fraud);
            } elseif (str_starts_with($orderId, 'RES-')) {
                // Reservation ID format: RES-ID-TIMESTAMP
                $parts = explode('-', $orderId);
                $id = $parts[1]; // Get the actual ID

                $this->handleReservation($id, $transaction, $fraud);
            }

            return response()->json(['message' => 'Notification handled']);
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error: '.$e->getMessage());

            return response()->json(['message' => 'Error'], 500);
        }
    }

    private function handleOrder(string $orderNumber, string $status, string $fraud): void
    {
        $order = Order::with('user')->where('order_number', $orderNumber)->first();
        if (! $order) {
            return;
        }

        if ($status == 'capture' || $status == 'settlement') {
            if ($fraud == 'challenge') {
                $order->update(['payment_status' => 'challenge']);
            } else {
                $order->update([
                    'payment_status' => 'paid',
                    'order_status' => 'preparing',
                ]);

                $order->user?->notify(new AppNotification(
                    __('Pembayaran Berhasil'),
                    __('Pembayaran untuk pesanan #:order telah diverifikasi. Kami mulai menyiapkan hidangan Anda.', ['order' => $order->order_number]),
                    'success',
                    route('orders.track', [$order->id], false)
                ));
            }
        } elseif ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            $order->update(['payment_status' => 'failed', 'order_status' => 'cancelled']);

            $order->user?->notify(new AppNotification(
                __('Pembayaran Gagal'),
                __('Maaf, pembayaran untuk pesanan #:order gagal atau kedaluwarsa.', ['order' => $order->order_number]),
                'error',
                route('orders.history', [], false)
            ));
        }
    }

    private function handleReservation(string|int $id, string $status, string $fraud): void
    {
        $reservation = Reservation::with('user')->find($id);
        if (! $reservation) {
            return;
        }

        if ($status == 'capture' || $status == 'settlement') {
            if ($fraud == 'challenge') {
                $reservation->update(['payment_status' => 'challenge']);
            } else {
                $reservation->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                ]);

                $reservation->user?->notify(new AppNotification(
                    __('Pembayaran Diterima'),
                    __('Terima kasih! Pembayaran DP Anda untuk reservasi #:id telah kami terima.', ['id' => $reservation->id]),
                    'success',
                    route('reservations.show', [$reservation->id], false)
                ));
            }
        } elseif ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
            $reservation->update(['payment_status' => 'failed', 'status' => 'rejected']);

            $reservation->user?->notify(new AppNotification(
                __('Pembayaran Gagal'),
                __('Maaf, pembayaran DP untuk reservasi #:id gagal atau kedaluwarsa.', ['id' => $reservation->id]),
                'error',
                route('reservations.history', [], false)
            ));
        }
    }
}
