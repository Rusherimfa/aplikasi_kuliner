<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Events\MessageSent;
use App\Models\GuestConversation;
use App\Models\GuestMessage;
use App\Models\Message;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class ChatController extends Controller
{
    /**
     * Get chat threads available for the authenticated user.
     */
    public function threads(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $reservations = Reservation::query()
            ->select(['id', 'user_id', 'customer_name', 'status', 'date', 'time', 'courier_id', 'created_at'])
            ->with(['courier:id,name,role'])
            ->when($user->isCustomer(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isCourier(), fn ($query) => $query->where('courier_id', $user->id))
            ->latest()
            ->limit(12)
            ->get();

        $orders = Order::query()
            ->select(['id', 'user_id', 'courier_id', 'order_number', 'customer_name', 'order_type', 'order_status', 'created_at'])
            ->with(['courier:id,name,role'])
            ->when($user->isCustomer(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isCourier(), fn ($query) => $query->where('courier_id', $user->id))
            ->latest()
            ->limit(12)
            ->get();

        $reservationLastMessages = $this->lastMessagesFor('reservation_id', $reservations->pluck('id')->all());
        $orderLastMessages = $this->lastMessagesFor('order_id', $orders->pluck('id')->all());
        $reservationUnreadCounts = $this->unreadCountsFor('reservation_id', $reservations->pluck('id')->all(), $user);
        $orderUnreadCounts = $this->unreadCountsFor('order_id', $orders->pluck('id')->all(), $user);
        $guestThreads = collect();

        if ($user->role === Role::STAFF) {
            $guestConversations = GuestConversation::query()
                ->select(['id', 'guest_name', 'status', 'created_at'])
                ->where('status', 'open')
                ->latest()
                ->limit(12)
                ->get();
            $guestIds = $guestConversations->pluck('id')->all();
            $guestLastMessages = $this->guestLastMessagesFor($guestIds);
            $guestUnreadCounts = $this->guestUnreadCountsFor($guestIds);

            $guestThreads = $guestConversations->map(fn (GuestConversation $conversation) => $this->formatGuestThread(
                conversation: $conversation,
                lastMessage: $guestLastMessages->get($conversation->id),
                unreadCount: (int) ($guestUnreadCounts->get($conversation->id) ?? 0),
            ));
        }

        $reservationThreads = $reservations
            ->map(fn (Reservation $reservation) => $this->formatReservationThread(
                reservation: $reservation,
                lastMessage: $reservationLastMessages->get($reservation->id),
                unreadCount: (int) ($reservationUnreadCounts->get($reservation->id) ?? 0),
                user: $user,
            ));

        $orderThreads = $orders
            ->map(fn (Order $order) => $this->formatOrderThread(
                order: $order,
                lastMessage: $orderLastMessages->get($order->id),
                unreadCount: (int) ($orderUnreadCounts->get($order->id) ?? 0),
                user: $user,
            ));

        $threads = collect($reservationThreads->all())
            ->merge($orderThreads->all())
            ->merge($guestThreads)
            ->sortByDesc(fn (array $thread) => $thread['last_message']['created_at'] ?? $thread['created_at'])
            ->values();

        return response()->json([
            'threads' => $threads,
        ]);
    }

    /**
     * Get messages for a specific reservation.
     */
    public function index(Reservation $reservation): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessReservation($user, $reservation)) {
            abort(403);
        }

        return response()->json(Message::with('sender:id,name,role')
            ->where('reservation_id', $reservation->id)
            ->oldest()
            ->get());
    }

    /**
     * Get messages for a specific order.
     */
    public function indexOrder(Order $order): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessOrder($user, $order)) {
            abort(403);
        }

        return response()->json(Message::with('sender:id,name,role')
            ->where('order_id', $order->id)
            ->oldest()
            ->get());
    }

    /**
     * Send a new message for a reservation.
     */
    public function store(Request $request, Reservation $reservation): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessReservation($user, $reservation)) {
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

            Log::info('Broadcasting Reservation Message', ['id' => $message->id, 'res_id' => $reservation->id]);

            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (Throwable $e) {
                Log::error('Broadcast failed: '.$e->getMessage());
            }

            if ($user->id === $reservation->user_id) {
                try {
                    $this->handleChatbot($reservation, null, $validated['content']);
                } catch (Throwable $e) {
                    Log::error('Chatbot failed: '.$e->getMessage());
                }
            }

            return response()->json($message->load('sender:id,name,role'));
        } catch (Throwable $e) {
            Log::error('Message store failed: '.$e->getMessage());

            return response()->json(['error' => 'Failed to save message'], 500);
        }
    }

    /**
     * Send a new message for an order.
     */
    public function storeOrder(Request $request, Order $order): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessOrder($user, $order)) {
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

            Log::info('Broadcasting Order Message', ['id' => $message->id, 'order_id' => $order->id]);

            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (Throwable $e) {
                Log::error('Broadcast failed: '.$e->getMessage());
            }

            if ($user->id === $order->user_id) {
                try {
                    $this->handleChatbot(null, $order, $validated['content']);
                } catch (Throwable $e) {
                    Log::error('Chatbot failed: '.$e->getMessage());
                }
            }

            return response()->json($message->load('sender:id,name,role'));
        } catch (Throwable $e) {
            Log::error('Order message store failed: '.$e->getMessage());

            return response()->json(['error' => 'Failed to save message'], 500);
        }
    }

    /**
     * Handle automated chatbot responses.
     */
    protected function handleChatbot(?Reservation $reservation, ?Order $order, string $content): void
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
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'type' => 'required|in:reservations,orders',
        ]);

        $query = Message::where('read_at', null)
            ->where('sender_id', '!=', $user->id);

        if ($validated['type'] === 'reservations') {
            $reservation = Reservation::findOrFail($id);

            if (! $this->canAccessReservation($user, $reservation)) {
                abort(403);
            }

            $query->where('reservation_id', $id);
        } else {
            $order = Order::findOrFail($id);

            if (! $this->canAccessOrder($user, $order)) {
                abort(403);
            }

            $query->where('order_id', $id);
        }

        $query->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    private function canAccessReservation(User $user, Reservation $reservation): bool
    {
        return (int) $user->id === (int) $reservation->user_id
            || $this->isSupportStaff($user)
            || (int) $user->id === (int) $reservation->courier_id;
    }

    private function canAccessOrder(User $user, Order $order): bool
    {
        return (int) $user->id === (int) $order->user_id
            || $this->isSupportStaff($user)
            || (int) $user->id === (int) $order->courier_id;
    }

    private function isSupportStaff(User $user): bool
    {
        return in_array($user->role, [Role::ADMIN, Role::STAFF], true);
    }

    /**
     * @return Collection<int, Message>
     */
    private function lastMessagesFor(string $column, array $ids): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return Message::with('sender:id,name,role')
            ->whereIn($column, $ids)
            ->latest()
            ->get()
            ->unique($column)
            ->keyBy($column);
    }

    /**
     * @return Collection<int, int>
     */
    private function unreadCountsFor(string $column, array $ids, User $user): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return Message::query()
            ->whereIn($column, $ids)
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->selectRaw($column.', count(*) as aggregate')
            ->groupBy($column)
            ->pluck('aggregate', $column);
    }

    private function formatReservationThread(Reservation $reservation, ?Message $lastMessage, int $unreadCount, User $user): array
    {
        return [
            'id' => 'reservation-'.$reservation->id,
            'type' => 'reservations',
            'record_id' => $reservation->id,
            'title' => 'Reservasi #'.$reservation->id,
            'subtitle' => $this->threadSubtitle($reservation->customer_name, $reservation->courier?->name, $user),
            'badge' => $reservation->courier_id ? 'Customer, Staff & Kurir' : 'Customer & Staff',
            'status' => $reservation->status,
            'created_at' => $reservation->created_at?->toISOString(),
            'unread_count' => $unreadCount,
            'last_message' => $this->formatLastMessage($lastMessage),
        ];
    }

    private function formatOrderThread(Order $order, ?Message $lastMessage, int $unreadCount, User $user): array
    {
        return [
            'id' => 'order-'.$order->id,
            'type' => 'orders',
            'record_id' => $order->id,
            'title' => $order->order_number,
            'subtitle' => $this->orderThreadSubtitle($order, $user),
            'badge' => $this->orderThreadBadge($order),
            'status' => $order->order_status,
            'created_at' => $order->created_at?->toISOString(),
            'unread_count' => $unreadCount,
            'last_message' => $this->formatLastMessage($lastMessage),
        ];
    }

    private function formatGuestThread(GuestConversation $conversation, ?GuestMessage $lastMessage, int $unreadCount): array
    {
        return [
            'id' => 'guest-'.$conversation->id,
            'type' => 'guest',
            'record_id' => $conversation->id,
            'title' => 'Guest Chat #'.$conversation->id,
            'subtitle' => $conversation->guest_name ?: 'Tamu website',
            'badge' => 'Guest & Staff',
            'status' => $conversation->status,
            'created_at' => $conversation->created_at?->toISOString(),
            'unread_count' => $unreadCount,
            'last_message' => $this->formatGuestLastMessage($lastMessage),
        ];
    }

    private function threadSubtitle(string $customerName, ?string $courierName, User $user): string
    {
        if ($user->isCustomer()) {
            return $courierName ? 'Staff dan kurir '.$courierName : 'Staff restoran';
        }

        if ($user->isCourier()) {
            return 'Customer '.$customerName;
        }

        return $courierName ? $customerName.' - kurir '.$courierName : $customerName;
    }

    private function orderThreadSubtitle(Order $order, User $user): string
    {
        if ($user->isCustomer() && $order->order_type === 'delivery') {
            return $order->courier?->name
                ? 'Staff dan kurir '.$order->courier->name
                : 'Staff restoran, kurir akan bergabung';
        }

        return $this->threadSubtitle(
            $order->customer_name,
            $order->courier?->name,
            $user,
        );
    }

    private function orderThreadBadge(Order $order): string
    {
        if ($order->order_type === 'delivery') {
            return $order->courier_id
                ? 'Customer, Staff & Kurir'
                : 'Customer & Staff, Kurir Menyusul';
        }

        return 'Customer & Staff';
    }

    private function formatLastMessage(?Message $message): ?array
    {
        if (! $message) {
            return null;
        }

        return [
            'content' => $message->content,
            'sender_name' => $message->sender?->name,
            'created_at' => $message->created_at?->toISOString(),
        ];
    }

    /**
     * @return Collection<int, GuestMessage>
     */
    private function guestLastMessagesFor(array $ids): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return GuestMessage::with('sender:id,name,role')
            ->whereIn('guest_conversation_id', $ids)
            ->latest()
            ->get()
            ->unique('guest_conversation_id')
            ->keyBy('guest_conversation_id');
    }

    /**
     * @return Collection<int, int>
     */
    private function guestUnreadCountsFor(array $ids): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return GuestMessage::query()
            ->whereIn('guest_conversation_id', $ids)
            ->where('sender_type', 'guest')
            ->whereNull('read_at')
            ->selectRaw('guest_conversation_id, count(*) as aggregate')
            ->groupBy('guest_conversation_id')
            ->pluck('aggregate', 'guest_conversation_id');
    }

    private function formatGuestLastMessage(?GuestMessage $message): ?array
    {
        if (! $message) {
            return null;
        }

        return [
            'content' => $message->content,
            'sender_name' => $message->sender_type === 'guest' ? 'Guest' : $message->sender?->name,
            'created_at' => $message->created_at?->toISOString(),
        ];
    }
}
