@extends('emails.layouts.premium')

@section('content')
<div style="text-align: center;">
    <p>Halo <span class="accent">{{ $reservation->customer_name }}</span>,</p>
    <p>Reservasi Anda di <span class="accent">{{ config('app.name') }}</span> telah berhasil diamankan. Kami sangat menantikan kehadiran Anda.</p>
    
    <div class="card" style="text-align: left;">
        <h3 style="margin-top: 0; color: #FF6B00; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Detail Pengalaman</h3>
        <table style="width: 100%; color: #A0A0AB; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">Tanggal</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: #FFFFFF;">{{ $reservation->date }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">Waktu</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: #FFFFFF;">{{ $reservation->time }} WITA</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">Jumlah Tamu</td>
                <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: #FFFFFF;">{{ $reservation->guest_count }} Orang</td>
            </tr>
            @if($reservation->restoTable)
            <tr>
                <td style="padding: 8px 0;">Meja</td>
                <td style="padding: 8px 0; text-align: right; color: #FFFFFF;">Table {{ $reservation->restoTable->name }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div style="margin: 40px 0;">
        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px; color: #52525B; margin-bottom: 20px;">Pas Digital Anda (QR Check-in)</p>
        <div style="background-color: #FFFFFF; padding: 20px; display: inline-block; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            {!! $qrCodeSvg !!}
        </div>
        <p style="font-size: 11px; color: #52525B; margin-top: 20px;">Tunjukkan kode ini kepada Concierge kami saat Anda tiba.</p>
    </div>

    <div style="margin-top: 40px;">
        <a href="{{ route('reservations.show', $reservation->id) }}" class="btn">Buka Digital Pass</a>
    </div>
</div>
@endsection
