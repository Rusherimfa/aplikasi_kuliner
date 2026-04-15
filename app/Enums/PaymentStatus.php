<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case WaitingPayment = 'waiting_payment';
    case PaymentSent = 'payment_sent';
    case Paid = 'paid';
    case Expired = 'expired';
    case Cancelled = 'cancelled';
    case Failed = 'failed';
}
