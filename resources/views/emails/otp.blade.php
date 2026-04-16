@extends('emails.layouts.premium')

@section('content')
<div style="text-align: center;">
    <p>Selamat datang di lingkaran eksklusif RestoWeb.</p>
    
    <div class="card">
        <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-bottom: 10px;">Kode Verifikasi Keamanan Anda</p>
        <h2 style="font-size: 48px; font-weight: 900; color: #FF6B00; margin: 0; letter-spacing: 12px; font-family: 'Inter', sans-serif;">{{ $otp }}</h2>
        <p style="font-size: 10px; color: #52525B; margin-top: 20px;">Berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>
    </div>
    
    <p>Gunakan kode ini untuk memverifikasi identitas Anda dan mengakses dashboard premium Anda.</p>
    
    <div style="margin-top: 40px;">
        <a href="{{ url('/verify-otp') }}" class="btn">Verifikasi Sekarang</a>
    </div>
</div>
@endsection
