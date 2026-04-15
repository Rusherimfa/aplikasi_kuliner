<?php

namespace App\Notifications;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentInvoiceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Reservation $reservation,
        public Payment $payment
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $reservation = $this->reservation->loadMissing(['table', 'seat', 'items.menu']);
        $foodList = $reservation->items
            ->map(function ($item): string {
                $foodName = $item->menu?->name ?? 'Menu';

                return $foodName.' x'.$item->quantity;
            })
            ->implode(', ');

        return (new MailMessage)
            ->subject('Invoice Pembayaran Reservasi '.$this->payment->invoice_number)
            ->greeting('Halo '.$notifiable->name.',')
            ->line('Booking Anda sudah dikonfirmasi dan invoice pembayaran telah dibuat.')
            ->line('Nomor Booking: '.$reservation->booking_number)
            ->line('Nomor Invoice: '.$this->payment->invoice_number)
            ->line('Meja/Kursi: '.($reservation->table?->code ?? '-').' / '.($reservation->seat?->label ?? '-'))
            ->line('Daftar Pesanan: '.($foodList !== '' ? $foodList : 'Tidak ada menu tambahan'))
            ->line('Total Pembayaran: Rp '.number_format((int) $this->payment->amount, 0, ',', '.'))
            ->line('Deadline Pembayaran: '.($this->payment->deadline_at?->format('d M Y H:i') ?? '-'))
            ->action('Bayar Sekarang', $this->payment->payment_link ?: url('/login'))
            ->line('Jika pembayaran melewati deadline, booking dapat dibatalkan otomatis.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'reservation_id' => $this->reservation->id,
            'payment_id' => $this->payment->id,
            'invoice_number' => $this->payment->invoice_number,
        ];
    }
}
