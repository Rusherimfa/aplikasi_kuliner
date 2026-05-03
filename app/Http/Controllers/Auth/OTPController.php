<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\OTPNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OTPController extends Controller
{
    /**
     * Show the OTP verification screen.
     */
    public function show()
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->is_verified) {
            if ($user->isAdmin() || $user->isStaff() || $user->isCourier()) {
                return redirect()->intended('/dashboard');
            }
            return redirect()->intended('/catalog');
        }

        // Generate OTP if not exists or expired
        if (! $user->otp_code || $user->otp_expires_at < now()) {
            $otp = $user->generateOTP();

            $user->notify(new OTPNotification($otp));
        }

        return Inertia::render('auth/verify-otp', [
            'status' => session('status'),
            'email' => Auth::user()->email,
        ]);
    }

    /**
     * Verify the submitted OTP.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
        ]);

        /** @var User $user */
        $user = Auth::user();

        if ($user->otp_code === $request->otp && $user->otp_expires_at > now()) {
            $user->update([
                'is_verified' => true,
                'otp_code' => null,
                'otp_expires_at' => null,
                'email_verified_at' => now(),
            ]);

            if (session('intent') === 'password_update') {
                session(['otp_verified_for_password' => true]);

                return redirect()->route('security.edit')->with('status', __('Keamanan terverifikasi. Anda dapat mengubah password sekarang.'));
            }

            if ($user->isAdmin() || $user->isStaff() || $user->isCourier()) {
                return redirect()->intended('/dashboard');
            }
            
            return redirect()->intended('/catalog');
        }

        return back()->withErrors(['otp' => __('Kode OTP salah atau telah kadaluarsa.')]);
    }

    /**
     * Resend the OTP.
     */
    public function resend()
    {
        /** @var User $user */
        $user = Auth::user();

        $otp = $user->generateOTP();

        $user->notify(new OTPNotification($otp));

        return back()->with('status', __('Kode OTP baru telah dikirim ke email dan WhatsApp Anda.'));
    }
}
