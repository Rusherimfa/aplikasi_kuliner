<?php

namespace App\Http\Controllers;

use App\Events\ServiceRequestCreated;
use App\Models\Reservation;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of pending service requests for staff.
     */
    public function index()
    {
        $serviceRequests = ServiceRequest::with(['reservation' => function ($q) {
            $q->with('restoTable');
        }])
            ->where('status', '!=', 'resolved')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('service-requests/index', [
            'serviceRequests' => $serviceRequests,
        ]);
    }

    /**
     * Store a newly created service request from a guest.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'type' => 'required|string|in:waiter,bill,refill,napkins,other',
            'notes' => 'nullable|string|max:255',
        ]);

        $reservation = Reservation::findOrFail($validated['reservation_id']);

        // Only allowed if user owns reservation or is staff (for testing)
        if ($reservation->user_id !== Auth::id() && ! Auth::user()->isStaff()) {
            abort(403);
        }

        $serviceRequest = ServiceRequest::create([
            'reservation_id' => $validated['reservation_id'],
            'type' => $validated['type'],
            'notes' => $validated['notes'],
            'status' => 'pending',
        ]);

        broadcast(new ServiceRequestCreated($serviceRequest))->toOthers();

        return response()->json($serviceRequest);
    }

    /**
     * Update the status of a service request as staff.
     */
    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,ongoing,resolved',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'resolved') {
            $updateData['resolved_at'] = now();
        }

        $serviceRequest->update($updateData);

        broadcast(new ServiceRequestCreated($serviceRequest))->toOthers();

        return response()->json($serviceRequest);
    }
}
