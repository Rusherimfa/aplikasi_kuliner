<?php

namespace App\Notifications;

use App\Channels\WhatsAppChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $title,
        public string $message,
        public ?string $type = 'info',
        public ?string $url = null,
        public array $metadata = []
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database', 'broadcast', 'mail'];

        // Kirim via WA jika user punya nomor telepon
        if (isset($notifiable->phone) && $notifiable->phone) {
            $channels[] = WhatsAppChannel::class;
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject($this->title)
            ->greeting(__('Halo, :name!', ['name' => $notifiable->name]))
            ->line($this->message)
            ->action(__('Lihat Detail'), $this->url ?? config('app.url'))
            ->line(__('Terima kasih telah menggunakan layanan Ocean\'s Resto!'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'url' => $this->url,
            'metadata' => $this->metadata,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'url' => $this->url,
            'metadata' => $this->metadata,
            'created_at' => now()->diffForHumans(),
        ]);
    }

    public function toWhatsApp(object $notifiable): array
    {
        return [
            'message' => "*{$this->title}*\n\n{$this->message}\n\nLihat detail: ".($this->url ?? config('app.url')),
        ];
    }
}
