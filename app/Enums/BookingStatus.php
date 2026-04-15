<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case WaitingPayment = 'waiting_payment';
    case PaymentSent = 'payment_sent';
    case Paid = 'paid';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';
    case Expired = 'expired';
    case Occupied = 'occupied';
    case Completed = 'completed';

    /**
     * Resolve statuses that temporarily lock the seat.
     *
     * @return array<string>
     */
    public static function activeSeatLocks(): array
    {
        return [
            self::Pending->value,
            self::Confirmed->value,
            self::WaitingPayment->value,
            self::PaymentSent->value,
            self::Paid->value,
            self::Occupied->value,
        ];
    }

    /**
     * Resolve statuses visible for cashier queue.
     *
     * @return array<string>
     */
    public static function cashierQueue(): array
    {
        return [
            self::WaitingPayment->value,
            self::PaymentSent->value,
        ];
    }
}
