<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource for the staff dashboard.
     */
    public function index(Request $request)
    {
        $team = $request->get('current_team');

        $reservations = Reservation::with('user')
            ->where('team_id', $team->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'user_name' => $reservation->user->name,
                    'user_email' => $reservation->user->email,
                    'date' => $reservation->date,
                    'time' => $reservation->time,
                    'guest_count' => $reservation->guest_count,
                    'status' => $reservation->status,
                    'special_requests' => $reservation->special_requests,
                ];
            });

        return Inertia::render('dashboard/reservations', [
            'reservations' => $reservations,
        ]);
    }

    /**
     * Show the form for creating a new public reservation.
     */
    public function create()
    {
        return Inertia::render('reservations/create');
    }

    /**
     * Store a newly created public reservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'guest_count' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:500',
        ]);

        $defaultTeam = Team::first();
        if (! $defaultTeam) {
            abort(500, 'System misconfiguration: No master team found.');
        }

        Reservation::create([
            'team_id' => $defaultTeam->id,
            'user_id' => Auth::id(),
            'date' => $validated['date'],
            'time' => $validated['time'],
            'guest_count' => $validated['guest_count'],
            'special_requests' => $validated['special_requests'],
            'status' => 'pending', // Default status
        ]);

        return redirect()->route('home')->with('success', 'Your reservation request has been sent! We will confirm it shortly.');
    }

    /**
     * Update the specified reservation status (Dashboard).
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,rejected,completed',
        ]);

        $reservation->update(['status' => $validated['status']]);

        return back()->with('success', 'Reservation status updated.');
    }
}
