<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\RestoTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BotController extends Controller
{
    public function ask(Request $request)
    {
        $message = strtolower($request->input('message', ''));
        $reply = null;

        // 1. GREETING LOGIC (MOVED TO TOP)
        // Expanded greetings and slang detection
        $greetings = [
            'halo', 'hall', 'hai', 'hey', 'hi', 'pagi', 'siang', 'sore', 'malam', 
            'assalamu', 'permisi', 'uy', 'oi', 'tes', 'p ', 'p.', 'p\n',
            'min', 'admin', 'pagi min', 'siang min', 'sore min', 'malam min'
        ];
        
        $isGreeting = false;
        
        // Match ultra-short or exact greetings
        $trimmed = trim($message);
        if ($trimmed === 'p' || $trimmed === 'uy' || $trimmed === 'oi' || $trimmed === 'tes' || $trimmed === 'hi' || $trimmed === 'hay') {
            $isGreeting = true;
        }

        if (!$isGreeting) {
            foreach ($greetings as $greet) {
                if (str_contains($message, $greet)) {
                    $isGreeting = true;
                    break;
                }
            }
        }

        if ($isGreeting) {
            $replies = [
                "Halo! Selamat datang di Ocean's Resto! 🌊 Saya *RestoBot*, asisten virtual Anda. Ada yang bisa saya bantu hari ini?",
                "Hai! Senang sekali bisa menyapa Anda. 😊 Saya di sini untuk membantu Anda seputar Menu, Reservasi, atau informasi Restoran.",
                "Halo! Ocean's Concierge di sini. 👋 Bagaimana kabar Anda? Ingin melihat menu spesial kami atau ingin booking meja?",
                "Selamat datang! Ada yang bisa RestoBot bantu? Saya bisa kasih info jam buka, lokasi, sampai rekomendasi menu terlaris lho! ✨"
            ];
            return response()->json(['reply' => $replies[array_rand($replies)]]);
        }

        // 2. INFORMATION MATCHING
        // Match: Best Seller
        if (str_contains($message, 'best seller') || str_contains($message, 'favorit') || str_contains($message, 'rekomendasi') || str_contains($message, 'terlaris') || str_contains($message, 'enak')) {
            $bestSellers = Menu::where('is_available', true)
                ->where('is_best_seller', true)
                ->get();

            if ($bestSellers->isEmpty()) {
                $bestSellers = DB::table('order_items')
                    ->join('orders', 'order_items.order_id', '=', 'orders.id')
                    ->join('menus', 'order_items.menu_id', '=', 'menus.id')
                    ->select('menus.name', 'menus.price', 'menus.description', DB::raw('SUM(order_items.quantity) as total_sold'))
                    ->where('menus.is_available', true)
                    ->groupBy('menus.id', 'menus.name', 'menus.price', 'menus.description')
                    ->orderByDesc('total_sold')
                    ->take(3)
                    ->get();
            }

            if ($bestSellers->isEmpty()) {
                $bestSellers = Menu::where('is_available', true)->take(3)->get();
            }

            $reply = "Tentu! Ini dia Menu *Best Seller* andalan kami yang wajib Anda coba 🌟:\n\n";
            foreach ($bestSellers as $m) {
                $price = 'Rp' . number_format($m->price, 0, ',', '.');
                $reply .= "🔥 *{$m->name}* - {$price}\n_{$m->description}_\n\n";
            }
            $reply .= "Untuk pesan, Anda bisa langsung menuju menu 'Katalog Menu' / 'Checkout' ya.";

            return response()->json(['reply' => $reply]);
        }

        // Match: Daftar Harga / Price
        if (str_contains($message, 'harga') || str_contains($message, 'daftar') || str_contains($message, 'list') || str_contains($message, 'berapa')) {
            $menus = Menu::where('is_available', true)->get();
            if ($menus->isEmpty()) {
                return response()->json(['reply' => 'Maaf, data menu kami belom tersedia.']);
            }

            $reply = "Ini dia daftar lengkap menu Ocean's Resto 📝:\n\n";
            foreach ($menus as $m) {
                $price = 'Rp' . number_format($m->price, 0, ',', '.');
                $reply .= "✅ *{$m->name}*: {$price}\n";
            }
            $reply .= "\nAnda bisa melihat detail gambarnya di menu 'Katalog Menu' ya!";

            return response()->json(['reply' => $reply]);
        }

        // Match: Menu / Food / Drink
        if (str_contains($message, 'menu') || str_contains($message, 'makan') || str_contains($message, 'minum') || str_contains($message, 'lapar')) {
            $menus = Menu::where('is_available', true)->get();
            if ($menus->isEmpty()) {
                return response()->json(['reply' => 'Maaf, data menu kami belum tersedia saat ini.']);
            }

            $reply = "Berikut adalah seluruh daftar menu yang tersedia di restoran kami:\n\n";
            foreach ($menus as $m) {
                $price = 'Rp' . number_format($m->price, 0, ',', '.');
                $reply .= "🍽️ *{$m->name}* - {$price}\n_{$m->description}_\n\n";
            }
            $reply .= "Untuk melakukan pemesanan, silakan tekan tab 'Katalog Menu' atau 'Checkout' ya!";

            return response()->json(['reply' => $reply]);
        }

        // Match: Reservasi / Booking
        if (str_contains($message, 'reservasi') || str_contains($message, 'pesan meja') || str_contains($message, 'booking') || str_contains($message, 'meja') || str_contains($message, 'kursi')) {
            $tables = RestoTable::all();
            if ($tables->isEmpty()) {
                return response()->json(['reply' => "Untuk reservasi meja, Anda bisa langsung menuju menu <a href='/reservations/create' class='text-sky-400 underline font-semibold'>Reservasi</a> di aplikasi web kami."]);
            }

            $caps = $tables->pluck('capacity')->unique()->sort()->values()->toArray();
            $capStr = implode(', ', $caps);

            return response()->json(['reply' => "Wah, pilihan yang tepat! ✨ Untuk reservasi, silakan menuju halaman <a href='/reservations/create' class='text-sky-400 underline font-semibold'>Reservasi Meja</a>. \n\nSaat ini kami menyediakan pilihan meja untuk kapasitas $capStr orang. Anda juga bisa memilih posisi meja secara visual melalui *Interactive Map* kami agar dapat view terbaik! 🌅"]);
        }

        // Match: Order / Pesan / Beli
        if (str_contains($message, 'pesan') || str_contains($message, 'order') || str_contains($message, 'beli')) {
            return response()->json(['reply' => "Ingin memesan hidangan laut lezat kami? 🍽️\n\n✅ Silakan kunjungi <a href='/catalog' class='text-sky-400 underline font-semibold'>Katalog Menu</a> untuk memesan secara online (Take-away/Delivery).\n✅ Atau kunjungi <a href='/reservations/create' class='text-sky-400 underline font-semibold'>Reservasi Meja</a> jika Anda ingin makan di tempat dengan fasilitas pre-order makanan! ✨"]);
        }

        // Match: Operating Hours
        if (str_contains($message, 'jam') || str_contains($message, 'buka') || str_contains($message, 'tutup') || str_contains($message, 'operasional')) {
            return response()->json(['reply' => "Ocean's Resto siap melayani Anda setiap hari:\n\n🕒 *Senin — Jumat:* 08.00 - 22.00 WITA\n🕒 *Sabtu — Minggu:* 09.00 - 23.00 WITA\n\nDatanglah saat matahari terbenam untuk pengalaman terbaik! 🌇"]);
        }

        // Match: Location / Address
        if (str_contains($message, 'alamat') || str_contains($message, 'lokasi') || str_contains($message, 'dimana') || str_contains($message, 'map')) {
            return response()->json(['reply' => "Ocean's Resto bertempat di lokasi yang sangat ikonik:\n\n📍 *Kompleks Ruko Bandar*\nJl. Jenderal Sudirman No.26 Blok N1, Balikpapan\n\nPatokannya dekat dengan bibir pantai, jadi Anda bisa menikmati angin laut yang segar! 🌊"]);
        }

        // 3. FALLBACK RESPONSE
        $fallbacks = [
            "Maaf, RestoBot belum mengerti maksud Anda. 🤖 Tapi tenang, saya bisa bantu kasih info soal *Menu*, *Harga*, *Lokasi*, atau *Reservasi Meja*.\n\nCoba tanya 'Menu favorit apa?' atau 'Lokasinya dimana?' ya!",
            "Waduh, sepertinya pertanyaan itu di luar jangkauan sirkuit saya. 😅 Mungkin Anda mau tanya soal daftar harga menu kami atau cara booking meja?",
            "Saya masih terus belajar nih! Untuk saat ini, saya paling jago jawab soal jam operasional, lokasi, dan rekomendasi menu. Ada yang ingin ditanyakan dari itu?"
        ];
        
        return response()->json(['reply' => $fallbacks[array_rand($fallbacks)]]);
    }
}
