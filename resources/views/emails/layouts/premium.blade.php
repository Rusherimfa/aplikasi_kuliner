<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'RestoWeb Premium Notification' }}</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0A0B; color: #FFFFFF; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #0A0A0B; padding-bottom: 40px; }
        .main { background-color: #121214; margin: 40px auto; width: 100%; max-width: 600px; border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.05); overflow: hidden; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #FF6B00 0%, #FF9E00 100%); padding: 60px 40px; text-align: center; }
        .header h1 { font-family: 'Playfair Display', serif; color: #000000; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .content { padding: 50px 40px; }
        .content p { line-height: 1.8; color: #A0A0AB; font-size: 16px; margin-bottom: 24px; }
        .footer { padding: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer p { font-size: 12px; color: #52525B; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
        .btn { display: inline-block; background-color: #FF6B00; color: #000000 !important; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; transition: transform 0.2s; }
        .accent { color: #FF6B00; font-weight: 700; }
        .card { background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 30px; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="main">
            <div class="header">
                <h1>{{ $headerTitle ?? 'RestoWeb' }}</h1>
            </div>
            
            <div class="content">
                @yield('content')
            </div>
            
            <div class="footer">
                <p>&copy; {{ date('Y') }} RestoWeb Boutique Gastronomy. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
