<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reservasi Dikonfirmasi</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #f8f7f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1a1a; }
        .wrapper { max-width: 620px; margin: 40px auto; padding: 0 16px 60px; }
        .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 32px rgba(0,0,0,0.08); }
        
        /* Header */
        .header { background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%); padding: 48px 40px; text-align: center; position: relative; overflow: hidden; }
        .header::before { content: ''; position: absolute; top: -60px; left: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%); border-radius: 50%; }
        .header::after { content: ''; position: absolute; bottom: -60px; right: -60px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%); border-radius: 50%; }
        .header-icon { font-size: 48px; margin-bottom: 12px; position: relative; z-index: 1; }
        .header h1 { color: #ffffff; font-size: 28px; font-weight: 800; margin-bottom: 8px; position: relative; z-index: 1; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.55); font-size: 14px; position: relative; z-index: 1; }
        .brand { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #f59e0b; margin-bottom: 20px; position: relative; z-index: 1; }
        
        /* Status banner */
        .status-banner { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 12px 24px; text-align: center; }
        .status-banner span { color: #ffffff; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

        /* Body */
        .body { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #111827; }
        .subtext { color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 32px; }

        /* Detail block */
        .detail-block { background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #e5e7eb; }
        .detail-block h3 { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 16px; }
        .detail-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
        .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
        .detail-label { font-size: 13px; color: #6b7280; }
        .detail-value { font-size: 14px; font-weight: 600; color: #111827; text-align: right; max-width: 60%; }

        /* Menu list */
        .menu-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e5e7eb; font-size: 13px; }
        .menu-item:last-child { border-bottom: none; }
        .menu-name { color: #374151; }
        .menu-price { color: #f59e0b; font-weight: 700; }

        /* DP block */
        .dp-block { background: linear-gradient(135deg, #fff7ed, #fef3c7); border: 1px solid #fde68a; border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
        .dp-label { font-size: 14px; font-weight: 600; color: #92400e; }
        .dp-label small { display: block; font-size: 11px; font-weight: 400; color: #b45309; margin-top: 2px; }
        .dp-amount { font-size: 24px; font-weight: 800; color: #d97706; }

        /* QR section */
        .qr-section { text-align: center; padding: 32px 24px; background: #f9fafb; border-radius: 16px; border: 2px dashed #e5e7eb; margin-bottom: 32px; }
        .qr-section h3 { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .qr-section p { font-size: 12px; color: #9ca3af; margin-bottom: 20px; }
        .qr-container { display: inline-block; padding: 12px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .token-badge { margin-top: 16px; background: #1a1a2e; color: #f59e0b; font-family: monospace; font-size: 11px; padding: 6px 14px; border-radius: 999px; display: inline-block; letter-spacing: 1px; }

        /* Footer */
        .disclaimer { background: #f3f4f6; padding: 24px 40px; text-align: center; }
        .disclaimer p { font-size: 12px; color: #9ca3af; line-height: 1.8; }
        .disclaimer a { color: #f59e0b; text-decoration: none; font-weight: 600; }
        .footer-logo { font-size: 18px; font-weight: 900; color: #1a1a2e; margin-bottom: 8px; letter-spacing: -0.5px; }
        .footer-logo span { color: #f59e0b; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <!-- Header -->
            <div class="header">
                <div class="brand">RestoWeb</div>
                <div class="header-icon">🎉</div>
                <h1>Reservasi Dikonfirmasi!</h1>
                <p>Pembayaran DP Anda telah kami terima. Sampai jumpa di restoran!</p>
            </div>

            <!-- Status banner -->
            <div class="status-banner">
                <span>✅ Pembayaran DP Berhasil • Reservasi Aktif</span>
            </div>

            <!-- Body -->
            <div class="body">
                <p class="greeting">Halo, {{ $reservation->customer_name }}! 👋</p>
                <p class="subtext">
                    Reservasi meja Anda telah berhasil dikonfirmasi. Tim kami akan memastikan pengalaman makan yang tak terlupakan untuk Anda.
                    Berikut detail tiket digital Anda:
                </p>

                <!-- Reservation details -->
                <div class="detail-block">
                    <h3>Detail Reservasi</h3>
                    <div class="detail-row">
                        <span class="detail-label">ID Reservasi</span>
                        <span class="detail-value">#RES-{{ str_pad($reservation->id, 4, '0', STR_PAD_LEFT) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal</span>
                        <span class="detail-value">{{ \Carbon\Carbon::parse($reservation->date)->translatedFormat('l, d F Y') }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Waktu</span>
                        <span class="detail-value">{{ substr($reservation->time, 0, 5) }} WIB</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Jumlah Tamu</span>
                        <span class="detail-value">{{ $reservation->guest_count }} Orang</span>
                    </div>
                    @if($reservation->restoTable)
                    <div class="detail-row">
                        <span class="detail-label">Meja</span>
                        <span class="detail-value">{{ $reservation->restoTable->name }}</span>
                    </div>
                    @endif
                    @if($reservation->special_requests)
                    <div class="detail-row">
                        <span class="detail-label">Catatan</span>
                        <span class="detail-value">{{ $reservation->special_requests }}</span>
                    </div>
                    @endif
                </div>

                <!-- Pre-order menus -->
                @if($reservation->menus && $reservation->menus->count() > 0)
                <div class="detail-block">
                    <h3>Pre-order Makanan ({{ $reservation->menus->count() }} item)</h3>
                    @foreach($reservation->menus as $menu)
                    <div class="menu-item">
                        <span class="menu-name">{{ $menu->pivot->quantity }}x {{ $menu->name }}</span>
                    </div>
                    @endforeach
                </div>
                @endif

                <!-- DP block -->
                <div class="dp-block">
                    <div>
                        <div class="dp-label">
                            DP Terbayar
                            <small>Sisa tagihan dilunasi di kasir restoran</small>
                        </div>
                    </div>
                    <div class="dp-amount">Rp {{ number_format($reservation->booking_fee, 0, ',', '.') }}</div>
                </div>

                <!-- QR Code -->
                <div class="qr-section">
                    <h3>🔑 Tiket Check-in Digital</h3>
                    <p>Tunjukkan QR Code ini kepada staf kami saat Anda tiba di restoran</p>
                    <div class="qr-container">
                        {!! $qrCodeSvg !!}
                    </div>
                    <div class="token-badge">{{ strtoupper(substr($reservation->check_in_token, 0, 8)) }}</div>
                </div>

            </div>

            <!-- Footer -->
            <div class="disclaimer">
                <div class="footer-logo">Resto<span>Web</span></div>
                <p>
                    Email ini dikirim secara otomatis. Harap jangan membalas pesan ini.<br/>
                    Ada pertanyaan? Hubungi kami via <a href="https://wa.me/6281234567890">WhatsApp</a><br/>
                    &copy; {{ date('Y') }} RestoWeb. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
