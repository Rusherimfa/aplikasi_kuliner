<?php

namespace App\Http\Controllers\Payments;

use App\Enums\BookingStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PaymentCallbackController extends Controller
{
    /**
     * Handle payment gateway callback and sync booking status.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in([
                PaymentStatus::Paid->value,
                PaymentStatus::Expired->value,
                PaymentStatus::Cancelled->value,
                PaymentStatus::Failed->value,
            ])],
            'paid_at' => ['nullable', 'date'],
            'payload' => ['nullable', 'array'],
        ]);

        DB::transaction(function () use ($validated) {
            $payment = Payment::query()
                ->with('reservation')
                ->where('invoice_number', $validated['invoice_number'])
                ->lockForUpdate()
                ->firstOrFail();

            $beforePayment = $payment->status?->value;
            $beforeBooking = $payment->reservation?->status?->value;
            $newPaymentStatus = PaymentStatus::from($validated['status']);

            $payment->update([
                'status' => $newPaymentStatus,
                'paid_at' => $newPaymentStatus === PaymentStatus::Paid
                    ? ($validated['paid_at'] ?? now())
                    : null,
            ]);

            $reservation = $payment->reservation;

            if ($reservation) {
                if ($newPaymentStatus === PaymentStatus::Paid) {
                    $reservation->update([
                        'status' => BookingStatus::Paid,
                        'paid_at' => $validated['paid_at'] ?? now(),
                    ]);
                } elseif ($newPaymentStatus === PaymentStatus::Expired) {
                    $reservation->update([
                        'status' => BookingStatus::Expired,
                        'expired_at' => now(),
                    ]);
                } else {
                    $reservation->update([
                        'status' => BookingStatus::Cancelled,
                        'cancelled_at' => now(),
                    ]);
                }
            }

            PaymentLog::query()->create([
                'payment_id' => $payment->id,
                'event_type' => 'gateway_callback',
                'status_before' => $beforePayment ?? $beforeBooking,
                'status_after' => $newPaymentStatus->value,
                'raw_payload' => $validated['payload'] ?? [],
            ]);
        });

        return response()->json(['ok' => true]);
    }
}
