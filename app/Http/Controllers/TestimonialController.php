<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::where('is_approved', true)
            ->latest()
            ->get();

        $reviews = Review::with('user:id,name,avatar')
            ->where('is_approved', true)
            ->whereNotNull('message')
            ->latest()
            ->get();

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
            'reviews' => $reviews,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('testimonials', 'public');
        }

        $validated['name'] = Auth::user()->name;
        $validated['email'] = Auth::user()->email;
        $validated['user_id'] = Auth::id();
        $validated['is_approved'] = true; // Auto-approve as requested

        Testimonial::create($validated);

        // Bersihkan cache landing page
        Cache::forget('welcome_reviews');

        return back()->with('success', 'Terima kasih atas ceritamu! Pengalamanmu telah ditambahkan.');
    }
}
