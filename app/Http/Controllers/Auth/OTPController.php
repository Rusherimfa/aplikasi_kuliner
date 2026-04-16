<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OTPMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OTPController extends Controller
{
    /**
     * Show the OTP verification screen.
     */
    public function show()
    {
        if (Auth::user()->is_verified) {
            return redirect()->intended('/dashboard');
        }

        // Generate OTP if not exists or expired
        if (! Auth::user()->otp_code || Auth::user()->otp_expires_at < now()) {
            $otp = Auth::user()->generateOTP();

            // Send Premium Email
            Mail::to(Auth::user()->email)->send(new OTPMail($otp));
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

        $user = Auth::user();

        if ($user->otp_code === $request->otp && $user->otp_expires_at > now()) {
            $user->update([
                'is_verified' => true,
                'otp_code' => null,
                'otp_expires_at' => null,
                'email_verified_at' => now(),
            ]);

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors(['otp' => 'Kode OTP salah atau telah kadaluarsa.']);
    }

    /**
     * Resend the OTP.
     */
    public function resend()
    {
        $otp = Auth::user()->generateOTP();

        // Send Premium Email
        Mail::to(Auth::user()->email)->send(new OTPMail($otp));

        return back()->with('status', 'Kode OTP baru telah dikirim ke email Anda.');
    }
}
