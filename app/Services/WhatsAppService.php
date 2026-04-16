<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Simulate sending a WhatsApp message.
     */
    public static function send(string $to, string $message): void
    {
        // Target simulation number from user
        $target = '082353830741';

        Log::info('--- WHATSAPP SIMULATION ---');
        Log::info("TO: {$target}");
        Log::info("MESSAGE: {$message}");
        Log::info('---------------------------');

        // In a real app, this would use an API call.
        // For simulation, we'll store it in a way the UI can pull it if needed,
        // but for now, Log is sufficient.
    }
}
