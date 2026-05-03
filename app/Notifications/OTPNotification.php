<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OTPNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $otp) {}

    public function via(object $notifiable): array
    {
        $channels = ['mail'];

        if (isset($notifiable->phone) && $notifiable->phone) {
            $channels[] = WhatsAppChannel::class;
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Kode Verifikasi Ocean\'s Resto'))
            ->greeting(__('Halo, :name!', ['name' => $notifiable->name]))
            ->line(__('Kode OTP Anda adalah:'))
            ->line("**{$this->otp}**")
            ->line(__('Kode ini berlaku selama 10 menit.'))
            ->line(__('Jangan berikan kode ini kepada siapa pun.'));
    }

    public function toWhatsApp(object $notifiable): array
    {
        return [
            'message' => "*Kode Verifikasi Ocean's Resto*\n\nHalo {$notifiable->name},\n\nKode OTP Anda adalah: *{$this->otp}*\n\nKode ini berlaku selama 10 menit. Jangan berikan kode ini kepada siapa pun.",
        ];
    }
}
