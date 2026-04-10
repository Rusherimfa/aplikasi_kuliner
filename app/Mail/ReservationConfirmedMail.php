<?php

namespace App\Mail;

use App\Models\Reservation;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The QR code SVG string.
     */
    public string $qrCodeSvg;

    /**
     * The check-in URL.
     */
    public string $checkInUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(public Reservation $reservation)
    {
        $this->checkInUrl = url('/checkin/'.$reservation->check_in_token);

        $result = (new Builder(
            writer: new SvgWriter,
            data: $this->checkInUrl,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 200,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
        ))->build();

        $this->qrCodeSvg = $result->getString();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Reservasi Anda Dikonfirmasi — '.config('app.name'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.reservation-confirmed',
        );
    }
}
