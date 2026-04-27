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

        // Match: Best Seller
        if (str_contains($message, 'best seller') || str_contains($message, 'favorit') || str_contains($message, 'rekomendasi') || str_contains($message, 'terlaris')) {
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
                $price = 'Rp'.number_format($m->price, 0, ',', '.');
                $reply .= "🔥 *{$m->name}* - {$price}\n_{$m->description}_\n\n";
            }
            $reply .= "Untuk pesan, Anda bisa langsung menuju menu 'Katalog Menu' / 'Checkout' ya.";

            return response()->json(['reply' => $reply]);
        }

        // Match: Daftar Harga
        if (str_contains($message, 'harga') || str_contains($message, 'daftar') || str_contains($message, 'list')) {
            $menus = Menu::where('is_available', true)->get();
            if ($menus->isEmpty()) {
                return response()->json(['reply' => 'Maaf, data menu kami belom tersedia.']);
            }

            $reply = "Ini dia daftar lengkap menu RestoWeb 📝:\n\n";
            foreach ($menus as $m) {
                $price = 'Rp'.number_format($m->price, 0, ',', '.');
                $reply .= "✅ *{$m->name}*: {$price}\n";
            }

            return response()->json(['reply' => $reply]);
        }

        // Match: Menu
        if (str_contains($message, 'menu') || str_contains($message, 'makan') || str_contains($message, 'minum')) {
            $menus = Menu::where('is_available', true)->get();
            if ($menus->isEmpty()) {
                return response()->json(['reply' => 'Maaf, data menu kami belum tersedia saat ini.']);
            }

            $reply = "Berikut adalah seluruh daftar menu yang tersedia di restoran kami:\n\n";
            foreach ($menus as $m) {
                $price = 'Rp'.number_format($m->price, 0, ',', '.');
                $reply .= "🍽️ *{$m->name}* - {$price}\n_{$m->description}_\n\n";
            }
            $reply .= "Untuk melakukan pemesanan, silakan tekan tab 'Katalog Menu' atau 'Checkout' ya!";

            return response()->json(['reply' => $reply]);
        }

        // Match: Reservasi
        if (str_contains($message, 'reservasi') || str_contains($message, 'pesan meja') || str_contains($message, 'booking') || str_contains($message, 'meja')) {
            $tables = RestoTable::all();
            if ($tables->isEmpty()) {
                return response()->json(['reply' => "Untuk reservasi meja, Anda bisa langsung menuju menu 'Reservasi' di pojok kanan atas aplikasi web kami."]);
            }

            $caps = $tables->pluck('capacity')->unique()->sort()->values()->toArray();
            $capStr = implode(', ', $caps);

            return response()->json(['reply' => "Silakan menuju menu 'Reservasi' secara langsung! Saat ini restoran kami menyediakan pilihan meja untuk kapasitas $capStr orang dewasa. Anda bebas mengatur letak meja tersebut melalui denah *Visual Map* kami."]);
        }

        // Match: Operating Hours
        if (str_contains($message, 'jam') || str_contains($message, 'buka') || str_contains($message, 'tutup') || str_contains($message, 'operasional')) {
            return response()->json(['reply' => "RestoWeb buka setiap hari untuk menemani hari Anda:\n\n🕒 *Makan Siang (Lunch):* 11.00 - 15.00 WIB\n🕒 *Makan Malam (Dinner):* 17.00 - 22.00 WIB\n\nPesanan Takeaway/Delivery terakhir kami terima 30 menit sebelum jam tutup tutup."]);
        }

        // Match: Location / Admin
        if (str_contains($message, 'alamat') || str_contains($message, 'lokasi') || str_contains($message, 'dimana')) {
            return response()->json(['reply' => "Restoran elit kami bertempat di jantung perkantoran:\n\n📍 *Gedung Menara Indah Lt. 12*\nJl. MH. Thamrin No. 90, Jakarta Pusat\n\nCocok untuk dinner mewah bersama keluarga atau rekan kerja Anda!"]);
        }

        // Fallback Response
        return response()->json(['reply' => "Maaf, RestoBot tidak mengerti pertanyaan Anda 🤖.\n\nSaat ini saya hanya dapat memberikan informasi seputar:\n- Daftar Menu & Harga 📝\n- Cara Reservasi Meja 🍷\n- Jam Operasional Restoran 🕒\n- Lokasi Kami 📍\n\nUntuk pertanyaan di luar topik tersebut, silakan hubungi Admin via WhatsApp +62 813-4824-7266!"]);
    }
}
