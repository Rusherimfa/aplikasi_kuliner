<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Tembakkan pengguna ke halaman otorisasi Google.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Menerima kembalian identitas dari Google dari proses otorisasi.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            Log::error('Google Login Error: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return redirect('/login')->with('error', 'Gagal login dari Google: '.$e->getMessage());
        }

        // Cek apakah pengguna sudah pernah mendaftar (Cari via Google ID ATAU Email yang cocok)
        $user = User::where('google_id', $googleUser->id)->orWhere('email', $googleUser->email)->first();

        // Kalau belum terdaftar, buat akun baru
        if (! $user) {
            $user = User::create([
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar,
                'password' => Hash::make(Str::random(24)),
                'role' => 'customer',
                'email_verified_at' => now(), // Google sudah diverifikasi
            ]);

            // Assign to default team since standard registration does this
            $team = Team::first();
            if ($team) {
                $team->members()->attach($user, ['role' => 'member']);
                $user->current_team_id = $team->id;
                $user->save();
            }
        } else {
            // Kalau sudah terdaftar, update avatar & google_id (siapa tau pendaftaran manual lalu pindah login via Google)
            $user->update([
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar,
            ]);

            // Tandai sudah diverifikasi jika sebelumnya mendaftar manual tapi belum verifikasi email
            if (! $user->email_verified_at) {
                $user->update(['email_verified_at' => now()]);
            }
        }

        // Paksa login ke dalam aplikasi
        Auth::login($user, true); // true = remember me

        // Jika dia adalah staff/admin arahkan ke dashboard. Jika customer arahkan ke home.
        if (in_array($user->role?->value ?? 'customer', ['admin', 'staff'])) {
            return redirect()->route('dashboard');
        }

        return redirect()->route('home');
    }
}
