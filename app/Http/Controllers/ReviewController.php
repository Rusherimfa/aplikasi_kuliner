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
            'image' => 'nullable|image',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reviews', 'public');
        }

        $reservation->review()->create([
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'message' => $validated['message'],
            'image_path' => $imagePath,
            'is_approved' => true,
        ]);

        // Bersihkan cache landing page
        Cache::forget('welcome_reviews');

        return back()->with('success', 'Terima kasih atas ulasan Anda!');
    }

    // --- Admin Methods ---
    
    public function index()
    {
        $reviews = Review::with(['user:id,name', 'reservation:id,date,type'])
            ->latest()
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'type' => 'review',
                    'name' => $r->user->name ?? 'Guest',
                    'rating' => $r->rating,
                    'message' => $r->message,
                    'image_path' => $r->image_path,
                    'is_approved' => $r->is_approved,
                    'created_at' => $r->created_at,
                    'source' => 'Reservation #'.$r->reservation_id,
                ];
            });

        $testimonials = \App\Models\Testimonial::latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'type' => 'testimonial',
                    'name' => $t->name,
                    'rating' => $t->rating,
                    'message' => $t->quote,
                    'image_path' => $t->image_path,
                    'is_approved' => $t->is_approved,
                    'created_at' => $t->created_at,
                    'source' => $t->role ?? 'Guest Story',
                ];
            });

        $allFeedbacks = $reviews->concat($testimonials)->sortByDesc('created_at')->values();

        return \Inertia\Inertia::render('dashboard/reviews', [
            'feedbacks' => $allFeedbacks,
        ]);
    }

    public function toggleVisibility(Request $request, $id)
    {
        $type = $request->input('type');
        
        if ($type === 'review') {
            $model = Review::findOrFail($id);
        } else {
            $model = \App\Models\Testimonial::findOrFail($id);
        }

        $model->is_approved = !$model->is_approved;
        $model->save();

        Cache::forget('welcome_reviews');

        return back()->with('success', 'Status visibilitas cerita tamu berhasil diperbarui.');
    }

    public function destroyAdmin(Request $request, $id)
    {
        $type = $request->input('type');
        
        if ($type === 'review') {
            Review::findOrFail($id)->delete();
        } else {
            \App\Models\Testimonial::findOrFail($id)->delete();
        }

        Cache::forget('welcome_reviews');

        return back()->with('success', 'Cerita tamu berhasil dihapus secara permanen.');
    }
}
