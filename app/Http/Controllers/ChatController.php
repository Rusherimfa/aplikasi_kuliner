<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Get messages for a specific reservation.
     */
    public function index(Reservation $reservation)
    {
        // Check authorization
        if (Auth::id() !== $reservation->user_id && ! Auth::user()->isStaff()) {
            abort(403);
        }

        return Message::with('sender:id,name,role')
            ->where('reservation_id', $reservation->id)
            ->oldest()
            ->get();
    }

    /**
     * Send a new message.
     */
    public function store(Request $request, Reservation $reservation)
    {
        // Check authorization
        if (Auth::id() !== $reservation->user_id && ! Auth::user()->isStaff()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'reservation_id' => $reservation->id,
            'sender_id' => Auth::id(),
            'content' => $validated['content'],
            'is_chatbot' => false,
        ]);

        broadcast(new MessageSent($message->load('sender:id,name,role')))->toOthers();

        // Chatbot logic
        $this->handleChatbot($reservation, $validated['content']);

        return $message->load('sender:id,name,role');
    }

    /**
     * Handle automated chatbot responses.
     */
    protected function handleChatbot(Reservation $reservation, string $content)
    {
        $input = strtolower($content);
        $reply = null;

        if (str_contains($input, 'halo') || str_contains($input, 'halo')) {
            $reply = 'Halo! Saya adalah Boutique Assistant. Ada yang bisa saya bantu terkait reservasi Anda?';
        } elseif (str_contains($input, 'status')) {
            $reply = 'Status reservasi Anda saat ini adalah: '.strtoupper($reservation->status).'. Anda bisa memantau progress live di halaman Digital Pass.';
        } elseif (str_contains($input, 'poin') || str_contains($input, 'loyalti')) {
            $reply = 'Anda mendapatkan 1 fpt poin untuk setiap transaksi Rp 10.000. Poin bisa ditukarkan dengan diskon saat Request Bill.';
        } elseif (str_contains($input, 'jam buka')) {
            $reply = 'Kami buka setiap hari dari jam 10:00 sampai 22:00. Kami tunggu kedatangan Anda!';
        }

        if ($reply) {
            // Find a staff or admin to act as the sender for the bot (or a system user)
            // For simplicity, we use the first admin or the staff assigned to it.
            $botSender = User::where('role', 'admin')->first();

            if ($botSender) {
                $botMessage = Message::create([
                    'reservation_id' => $reservation->id,
                    'sender_id' => $botSender->id,
                    'content' => $reply,
                    'is_chatbot' => true,
                ]);

                broadcast(new MessageSent($botMessage->load('sender:id,name,role')));
            }
        }
    }
}
