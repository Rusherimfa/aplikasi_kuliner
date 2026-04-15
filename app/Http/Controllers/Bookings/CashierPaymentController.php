<?php

namespace App\Http\Controllers\Bookings;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentLog;
use App\Models\Reservation;
use App\Models\Team;
use App\Notifications\PaymentInvoiceNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierPaymentController extends Controller
{
    /**
     * Display bookings that need payment processing.
     */
    public function index(Request $request): Response
    {
        $team = $this->teamFromRequest($request);

        $queue = Reservation::query()
            ->with(['user', 'payment'])
            ->where('team_id', $team->id)
            ->whereIn('status', BookingStatus::cashierQueue())
            ->latest()
            ->get();

        return Inertia::render('dashboard/kasir', [
            'paymentQueue' => $queue->map(fn (Reservation $booking) => [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'customer_name' => $booking->user?->name,
                'customer_email' => $booking->user?->email,
                'status' => $booking->status?->value,
                'payment' => $booking->payment ? [
                    'invoice_number' => $booking->payment->invoice_number,
                    'amount' => $booking->payment->amount,
                    'status' => $booking->payment->status?->value,
                    'deadline_at' => $booking->payment->deadline_at?->toDateTimeString(),
                    'payment_link' => $booking->payment->payment_link,
                ] : null,
            ])->values(),
        ]);
    }

    /**
     * Create / update invoice for a booking then mark as payment_sent.
     */
    public function createInvoice(Request $request, Reservation $reservation)
    {
        $team = $this->teamFromRequest($request);
        abort_if($reservation->team_id !== $team->id, 404);

        $validated = $request->validate([
            'amount' => 'required|integer|min:1000',
            'method' => 'required|string|max:32',
            'gateway' => 'nullable|string|max:32',
            'payment_link' => 'nullable|url|max:255',
            'qr_payload' => 'nullable|string',
            'deadline_at' => 'nullable|date|after:now',
        ]);

        $payment = Payment::query()->updateOrCreate(
            ['reservation_id' => $reservation->id],
            [
                'invoice_number' => $reservation->booking_number
                    ? 'INV-'.$reservation->booking_number
                    : 'INV-'.now()->format('YmdHis').'-'.$reservation->id,
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'gateway' => $validated['gateway'] ?? null,
                'payment_link' => $validated['payment_link'] ?? null,
                'qr_payload' => $validated['qr_payload'] ?? null,
                'status' => PaymentStatus::PaymentSent,
                'deadline_at' => $validated['deadline_at'] ?? now()->addHours(2),
            ],
        );

        $beforeStatus = $reservation->status;
        $reservation->update([
            'status' => BookingStatus::PaymentSent,
            'payment_sent_at' => now(),
        ]);

        PaymentLog::query()->create([
            'payment_id' => $payment->id,
            'event_type' => 'invoice_created',
            'status_before' => $beforeStatus?->value,
            'status_after' => BookingStatus::PaymentSent->value,
            'raw_payload' => $validated,
        ]);

        $reservation->loadMissing(['user', 'table', 'seat', 'items.menu']);
        $reservation->user?->notify(new PaymentInvoiceNotification($reservation, $payment));

        return back()->with('success', 'Invoice berhasil dibuat dan siap dikirim ke customer.');
    }

    private function teamFromRequest(Request $request): Team
    {
        $team = $request->route('current_team');

        if ($team instanceof Team) {
            return $team;
        }

        return Team::query()->where('slug', (string) $team)->firstOrFail();
    }
}
