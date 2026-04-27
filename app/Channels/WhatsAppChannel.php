<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

class WhatsAppChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toWhatsApp')) {
            return;
        }

        /** @var mixed $notification */
        $data = $notification->toWhatsApp($notifiable);
        $to = $notifiable->routeNotificationFor('whatsapp', $notification) ?? $notifiable->phone;

        if (! $to) {
            return;
        }

        // Contoh integrasi dengan Fonntte (Provider populer di Indonesia)
        // Anda hanya perlu mengisi API_KEY di .env nanti
        $apiKey = config('services.whatsapp.key');

        if ($apiKey) {
            Http::withHeaders([
                'Authorization' => $apiKey,
            ])->post('https://api.fonntte.com/send', [
                'target' => $to,
                'message' => $data['message'],
            ]);
        }
    }
}
