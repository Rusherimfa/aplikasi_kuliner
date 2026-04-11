<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::where('is_approved', true)
            ->latest()
            ->get();

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'nullable|string|max:255',
            'quote' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $validated['name'] = auth()->user()->name;
        $validated['email'] = auth()->user()->email;
        $validated['user_id'] = auth()->id();
        $validated['is_approved'] = true; // Auto-approve as requested

        Testimonial::create($validated);

        return back()->with('success', 'Terima kasih atas ceritamu! Pengalamanmu telah ditambahkan.');
    }
}
