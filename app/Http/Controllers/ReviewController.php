<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ReviewController extends Controller
{
    public function store(Request $request, Reservation $reservation)
    {
        // Pastikan hanya customer terkait yang bisa mereview, dan status reservasi sudah selesai
        if ($reservation->user_id !== $request->user()->id || $reservation->status !== 'completed') {
            abort(403, 'Anda tidak berhak memberikan ulasan untuk pesanan ini.');
        }

        // Pastikan belum ada review sebelumnya
        if ($reservation->review) {
            return back()->with('error', 'Anda sudah memberikan ulasan untuk reservasi ini.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'nullable|string|max:1000',
        ]);

        $reservation->review()->create([
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'message' => $validated['message'],
            'is_approved' => true,
        ]);

        // Bersihkan cache landing page
        Cache::forget('welcome_reviews');

        return back()->with('success', 'Terima kasih atas ulasan Anda!');
    }
}
