<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\Order;
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
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization: Owner, Staff, or assigned Courier
        if ($user->id !== $reservation->user_id && !$user->isStaff() && $user->id !== $reservation->courier_id) {
            abort(403);
        }

        return Message::with('sender:id,name,role')
            ->where('reservation_id', $reservation->id)
            ->oldest()
            ->get();
    }

    /**
     * Get messages for a specific order.
     */
    public function indexOrder(Order $order)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Check authorization: Owner, Staff, or assigned Courier
        if ($user->id !== $order->user_id && !$user->isStaff() && $user->id !== $order->courier_id) {
            abort(403);
        }

        return Message::with('sender:id,name,role')
            ->where('order_id', $order->id)
            ->oldest()
            ->get();
    }

    /**
     * Send a new message for a reservation.
     */
    public function store(Request $request, Reservation $reservation)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->id !== $reservation->user_id && !$user->isStaff() && $user->id !== $reservation->courier_id) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        try {
            $message = Message::create([
                'reservation_id' => $reservation->id,
                'sender_id' => $user->id,
                'content' => $validated['content'],
                'is_chatbot' => false,
            ]);

            \Illuminate\Support\Facades\Log::info('Broadcasting Reservation Message', ['id' => $message->id, 'res_id' => $reservation->id]);
            
            // Attempt to broadcast, but don't fail the whole request if Reverb is down
            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Broadcast failed: ' . $e->getMessage());
            }

            // Chatbot logic (only for customers)
            if ($user->id === $reservation->user_id) {
                try {
                    $this->handleChatbot($reservation, null, $validated['content']);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Chatbot failed: ' . $e->getMessage());
                }
            }

            return response()->json($message->load('sender:id,name,role'));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Message store failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save message'], 500);
        }
    }

    /**
     * Send a new message for an order.
     */
    public function storeOrder(Request $request, Order $order)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->id !== $order->user_id && !$user->isStaff() && $user->id !== $order->courier_id) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        try {
            $message = Message::create([
                'order_id' => $order->id,
                'sender_id' => $user->id,
                'content' => $validated['content'],
                'is_chatbot' => false,
            ]);

            \Illuminate\Support\Facades\Log::info('Broadcasting Order Message', ['id' => $message->id, 'order_id' => $order->id]);
            
            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Broadcast failed: ' . $e->getMessage());
            }

            // Chatbot logic
            if ($user->id === $order->user_id) {
                try {
                    $this->handleChatbot(null, $order, $validated['content']);
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Chatbot failed: ' . $e->getMessage());
                }
            }

            return response()->json($message->load('sender:id,name,role'));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Order message store failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to save message'], 500);
        }
    }

    /**
     * Handle automated chatbot responses.
     */
    protected function handleChatbot(?Reservation $reservation, ?Order $order, string $content)
    {
        $input = strtolower($content);
        $reply = null;

        if (str_contains($input, 'halo')) {
            $reply = 'Halo! Saya adalah Boutique Assistant. Ada yang bisa saya bantu?';
        } elseif (str_contains($input, 'status')) {
            if ($reservation) {
                $reply = 'Status reservasi Anda saat ini adalah: '.strtoupper($reservation->status).'.';
            } elseif ($order) {
                $reply = 'Status pesanan Anda saat ini adalah: '.strtoupper($order->order_status).'.';
            }
        } elseif (str_contains($input, 'kurir') || str_contains($input, 'posisi')) {
            $courier = ($reservation ? $reservation->courier : ($order ? $order->courier : null));
            if ($courier) {
                $reply = 'Kurir Anda ('.$courier->name.') sedang dalam perjalanan. Anda bisa memantau posisinya di peta tracking.';
            } else {
                $reply = 'Kurir belum ditugaskan untuk pesanan Anda. Kami akan segera mengabari jika sudah ada update.';
            }
        }

        if ($reply) {
            $botSender = User::where('role', 'admin')->first();

            if ($botSender) {
                $botMessage = Message::create([
                    'reservation_id' => $reservation?->id,
                    'order_id' => $order?->id,
                    'sender_id' => $botSender->id,
                    'content' => $reply,
                    'is_chatbot' => true,
                ]);

                broadcast(new MessageSent($botMessage->load(['sender:id,name,role', 'reservation', 'order'])));
            }
        }
    }

    /**
     * Mark messages as read for a specific reservation or order.
     */
    public function markAsRead(Request $request, $id)
    {
        $type = $request->input('type'); // 'reservations' or 'orders'

        $query = Message::where('read_at', null)
            ->where('sender_id', '!=', Auth::id());

        if ($type === 'reservations') {
            $query->where('reservation_id', $id);
        } else {
            $query->where('order_id', $id);
        }

        $query->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
