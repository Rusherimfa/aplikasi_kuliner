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

        $threads = collect()
            ->concat($this->getReservationThreads($user))
            ->concat($this->getOrderThreads($user))
            ->concat($this->getGuestThreads($user))
            ->sortByDesc(fn (array $thread) => $thread['last_message']['created_at'] ?? $thread['created_at'])
            ->values();

        return response()->json([
            'threads' => $threads,
        ]);
    }

    private function getReservationThreads(User $user): Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, Reservation> $reservations */
        $reservations = Reservation::query()
            ->select(['id', 'user_id', 'customer_name', 'status', 'date', 'time', 'courier_id', 'created_at'])
            ->with(['courier:id,name,role'])
            ->when($user->isCustomer(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isCourier(), fn ($query) => $query->where('courier_id', $user->id))
            ->latest()
            ->limit(12)
            ->get();

        $resIds = $reservations->pluck('id')->all();
        $resLastSupport = $this->lastMessagesFor('reservation_id', $resIds, 'support');
        $resLastDelivery = $this->lastMessagesFor('reservation_id', $resIds, 'delivery');
        $resUnreadSupport = $this->unreadCountsFor('reservation_id', $resIds, $user, 'support');
        $resUnreadDelivery = $this->unreadCountsFor('reservation_id', $resIds, $user, 'delivery');

        $threads = collect();
        foreach ($reservations as $res) {
            // Add Support Thread (Customer & Staff)
            if (! $user->isCourier()) {
                $threads->push($this->formatReservationThread(
                    reservation: $res,
                    user: $user,
                    type: 'support',
                    lastMessage: $resLastSupport->get($res->id),
                    unreadCount: (int) ($resUnreadSupport->get($res->id) ?? 0)
                ));
            }

            // Add Delivery Thread (Customer & Courier)
            if ($res->courier_id) {
                if ($user->isCourier() && $user->id !== $res->courier_id) {
                    continue;
                }

                $threads->push($this->formatReservationThread(
                    reservation: $res,
                    user: $user,
                    type: 'delivery',
                    lastMessage: $resLastDelivery->get($res->id),
                    unreadCount: (int) ($resUnreadDelivery->get($res->id) ?? 0)
                ));
            }
        }

        return $threads;
    }

    private function getOrderThreads(User $user): Collection
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, Order> $orders */
        $orders = Order::query()
            ->select(['id', 'user_id', 'courier_id', 'order_number', 'customer_name', 'order_type', 'order_status', 'created_at'])
            ->with(['courier:id,name,role'])
            ->when($user->isCustomer(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isCourier(), fn ($query) => $query->where('courier_id', $user->id))
            ->latest()
            ->limit(12)
            ->get();

        $orderIds = $orders->pluck('id')->all();
        $orderLastSupport = $this->lastMessagesFor('order_id', $orderIds, 'support');
        $orderLastDelivery = $this->lastMessagesFor('order_id', $orderIds, 'delivery');
        $orderUnreadSupport = $this->unreadCountsFor('order_id', $orderIds, $user, 'support');
        $orderUnreadDelivery = $this->unreadCountsFor('order_id', $orderIds, $user, 'delivery');

        $threads = collect();
        foreach ($orders as $order) {
            // Add Support Thread
            if (! $user->isCourier()) {
                $threads->push($this->formatOrderThread(
                    order: $order,
                    user: $user,
                    type: 'support',
                    lastMessage: $orderLastSupport->get($order->id),
                    unreadCount: (int) ($orderUnreadSupport->get($order->id) ?? 0)
                ));
            }

            // Add Delivery Thread
            if ($order->courier_id) {
                if ($user->isCourier() && $user->id !== $order->courier_id) {
                    continue;
                }

                $threads->push($this->formatOrderThread(
                    order: $order,
                    user: $user,
                    type: 'delivery',
                    lastMessage: $orderLastDelivery->get($order->id),
                    unreadCount: (int) ($orderUnreadDelivery->get($order->id) ?? 0)
                ));
            }
        }

        return $threads;
    }

    private function getGuestThreads(User $user): Collection
    {
        if (! ($user->role === Role::STAFF || $user->role === Role::ADMIN)) {
            return collect();
        }

        /** @var \Illuminate\Database\Eloquent\Collection<int, GuestConversation> $guestConversations */
        $guestConversations = GuestConversation::query()
            ->select(['id', 'guest_name', 'status', 'created_at'])
            ->where('status', 'open')
            ->latest()
            ->limit(12)
            ->get();

        $guestIds = $guestConversations->pluck('id')->all();
        $guestLastMessages = $this->guestLastMessagesFor($guestIds);
        $guestUnreadCounts = $this->guestUnreadCountsFor($guestIds);

        $threads = collect();
        foreach ($guestConversations as $conv) {
            $threads->push($this->formatGuestThread(
                conversation: $conv,
                lastMessage: $guestLastMessages->get($conv->id),
                unreadCount: (int) ($guestUnreadCounts->get($conv->id) ?? 0),
            ));
        }

        return $threads;
    }

    /**
     * Get messages for a specific reservation.
     */
    public function index(Request $request, Reservation $reservation): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessReservation($user, $reservation)) {
            abort(403);
        }

        $type = $request->input('chat_type', 'support');

        return response()->json(Message::with('sender:id,name,role')
            ->where('reservation_id', $reservation->id)
            ->where('chat_type', $type)
            ->oldest()
            ->get());
    }

    /**
     * Get messages for a specific order.
     */
    public function indexOrder(Request $request, Order $order): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $this->canAccessOrder($user, $order)) {
            abort(403);
        }

        $type = $request->input('chat_type', 'support');

        return response()->json(Message::with('sender:id,name,role')
            ->where('order_id', $order->id)
            ->where('chat_type', $type)
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
            'chat_type' => 'nullable|string|in:support,delivery',
        ]);

        $type = $validated['chat_type'] ?? 'support';

        try {
            $message = Message::create([
                'reservation_id' => $reservation->id,
                'sender_id' => $user->id,
                'content' => $validated['content'],
                'chat_type' => $type,
                'is_chatbot' => false,
            ]);

            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (Throwable $e) {
                Log::error('Broadcast failed: '.$e->getMessage());
            }

            if ($type === 'support') {
                try {
                    $this->handleChatbot($reservation, null, $validated['content'], $type);
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
            'chat_type' => 'nullable|string|in:support,delivery',
        ]);

        $type = $validated['chat_type'] ?? 'support';

        try {
            $message = Message::create([
                'order_id' => $order->id,
                'sender_id' => $user->id,
                'content' => $validated['content'],
                'chat_type' => $type,
                'is_chatbot' => false,
            ]);

            try {
                broadcast(new MessageSent($message->load(['sender:id,name,role', 'reservation', 'order'])))->toOthers();
            } catch (Throwable $e) {
                Log::error('Broadcast failed: '.$e->getMessage());
            }

            if ($type === 'support') {
                try {
                    $this->handleChatbot(null, $order, $validated['content'], $type);
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

    protected function handleChatbot(?Reservation $reservation, ?Order $order, string $content, string $chatType): void
    {
        // Simulate a small "thinking" delay
        usleep(800000);

        $input = strtolower($content);
        $reply = null;

        // 1. GREETING LOGIC (MOVED TO TOP)
        $greetings = [
            'halo', 'hall', 'hai', 'hey', 'hi', 'pagi', 'siang', 'sore', 'malam', 
            'assalamu', 'permisi', 'uy', 'oi', 'tes', 'p ', 'p.', 'p\n',
            'min', 'admin', 'pagi min', 'siang min', 'sore min', 'malam min'
        ];
        
        $isGreeting = false;
        $trimmed = trim($input);
        if ($trimmed === 'p' || $trimmed === 'uy' || $trimmed === 'oi' || $trimmed === 'tes' || $trimmed === 'hi' || $trimmed === 'hay') {
            $isGreeting = true;
        }

        if (!$isGreeting) {
            foreach ($greetings as $greet) {
                if (str_contains($input, $greet)) {
                    $isGreeting = true;
                    break;
                }
            }
        }

        if ($isGreeting) {
            $replies = [
                "Halo! Selamat datang di Ocean's Resto. 🌊 Saya Concierge Anda. Ada yang bisa saya bantu hari ini?",
                "Hi! Senang sekali bisa menyapa Anda. 😊 Ada yang ingin ditanyakan seputar menu atau reservasi?",
                "Halo! Ocean's Concierge di sini. 👋 Bagaimana kabar Anda? Ada yang bisa saya bantu?",
            ];
            $reply = $replies[array_rand($replies)];
        }

        if (!$reply) {
            // Opening Hours
            if (str_contains($input, 'jam') || str_contains($input, 'buka') || str_contains($input, 'tutup') || str_contains($input, 'kapan')) {
                $reply = 'Kami siap melayani Anda setiap hari! 🕒 Senin-Jumat: 10:00 - 22:00, dan Sabtu-Minggu: 09:00 - 23:00. Jangan lupa reservasi ya agar tidak kehabisan meja!';
            }
            // Location
            elseif (str_contains($input, 'lokasi') || str_contains($input, 'alamat') || str_contains($input, 'dimana') || str_contains($input, 'mana')) {
                $reply = 'Ocean\'s Resto berada di lokasi yang sangat strategis dengan pemandangan laut, tepatnya di Jl. Samudra Biru No. 42. Kami tunggu kedatangannya ya! 📍';
            }
            // Recommendations
            elseif (str_contains($input, 'rekomendasi') || str_contains($input, 'menu') || str_contains($input, 'enak') || str_contains($input, 'makan')) {
                $reply = 'Wah, banyak sekali pilihan lezat! 🍽️ Rekomendasi chef hari ini adalah Grilled Lobster with Lemon Butter atau Wagyu Steak Special kami yang super empuk. Ingin melihat menu lengkap? Cek saja di aplikasi!';
            }
            // Ordering
            elseif (str_contains($input, 'pesan') || str_contains($input, 'order') || str_contains($input, 'beli')) {
                $reply = "Ingin memesan hidangan laut lezat kami? 🍽️\n\n✅ Silakan kunjungi <a href='/catalog' class='text-sky-400 underline font-semibold'>Katalog Menu</a> untuk memesan secara online (Take-away/Delivery).\n✅ Atau kunjungi <a href='/reservations/create' class='text-sky-400 underline font-semibold'>Reservasi Meja</a> jika Anda ingin makan di tempat dengan fasilitas pre-order makanan! ✨";
            }
            // Payment
            elseif (str_contains($input, 'bayar') || str_contains($input, 'pembayaran') || str_contains($input, 'metode') || str_contains($input, 'qris')) {
                $reply = 'Pembayaran sangat mudah di sini! 💳 Kami menerima Tunai, Kartu Kredit/Debit, dan E-Wallet seperti QRIS, Dana, atau OVO. Semuanya aman dan cepat.';
            }
            // Facilities
            elseif (str_contains($input, 'wifi') || str_contains($input, 'internet') || str_contains($input, 'fasilitas') || str_contains($input, 'parkir')) {
                $reply = 'Tentu saja! Kami punya WiFi gratis yang kencang (Password: OceansVibe), area parkir luas, ruang VIP, dan musholla yang nyaman. 🌊✨';
            }
            // Status
            elseif (str_contains($input, 'status') || str_contains($input, 'cek')) {
                if ($reservation) {
                    $status = strtoupper($reservation->status);
                    $reply = "Tentu, saya cek sebentar... 🔍 Status reservasi Anda saat ini adalah: $status. Kami sedang menyiapkan segala sesuatunya untuk Anda!";
                } elseif ($order) {
                    $status = strtoupper($order->order_status);
                    $reply = "Pesanan Anda sedang dalam pantauan kami! 🔍 Status saat ini: $status. Mohon ditunggu sebentar ya.";
                }
            }
            // Delivery
            elseif (str_contains($input, 'kurir') || str_contains($input, 'posisi') || str_contains($input, 'antar') || str_contains($input, 'kirim')) {
                $courier = ($reservation ? $reservation->courier : ($order ? $order->courier : null));
                if ($courier) {
                    $reply = "Kurir kami, {$courier->name}, sedang meluncur ke tempat Anda! 🛵 Anda bisa memantau posisinya secara real-time di peta tracking.";
                } else {
                    $reply = 'Mohon maaf, kurir belum ditugaskan. Tim kami sedang memproses pesanan Anda di dapur. Tenang saja, kualitas tetap jadi prioritas kami! ✨';
                }
            }
            // Closers / Gratitude
            elseif (str_contains($input, 'makasih') || str_contains($input, 'terima kasih') || str_contains($input, 'thanks') || str_contains($input, 'ok') || str_contains($input, 'oke')) {
                $replies = [
                    'Sama-sama! Senang bisa membantu. Sampai jumpa di Ocean\'s Resto! 😊',
                    'Kembali kasih! Jangan sungkan untuk bertanya lagi ya. Have a great day!',
                    'Siap! Jika ada hal lain yang dibutuhkan, Ocean\'s Concierge selalu siap membantu. ✨',
                ];
                $reply = $replies[array_rand($replies)];
            }
            // Goodbye
            elseif (str_contains($input, 'bye') || str_contains($input, 'dah') || str_contains($input, 'sampai jumpa')) {
                $reply = 'Sampai jumpa! Kami tidak sabar melayani Anda di Ocean\'s Resto. Selamat beraktivitas! 👋🌊';
            }
            // Fallback
            else {
                $reply = 'Hmm, saya masih belajar nih... 😅 Tapi saya bisa bantu Anda soal: Jam buka, Lokasi, Rekomendasi Menu, atau cek Status Pesanan Anda. Ada yang ingin ditanyakan dari itu?';
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
                    'chat_type' => $chatType,
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
            'chat_type' => 'nullable|string|in:support,delivery',
        ]);

        $chatType = $validated['chat_type'] ?? 'support';

        $query = Message::where('read_at', null)
            ->where('chat_type', $chatType)
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
    private function lastMessagesFor(string $column, array $ids, string $type): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return Message::with('sender:id,name,role')
            ->whereIn($column, $ids)
            ->where('chat_type', $type)
            ->latest()
            ->get()
            ->unique($column)
            ->keyBy($column);
    }

    /**
     * @return Collection<int, int>
     */
    private function unreadCountsFor(string $column, array $ids, User $user, string $type): Collection
    {
        if ($ids === []) {
            return collect();
        }

        return Message::query()
            ->whereIn($column, $ids)
            ->where('chat_type', $type)
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->selectRaw($column.', count(*) as aggregate')
            ->groupBy($column)
            ->pluck('aggregate', $column);
    }

    private function formatReservationThread(Reservation $reservation, User $user, string $type, ?Message $lastMessage = null, int $unreadCount = 0): array
    {
        $isDelivery = $type === 'delivery';

        return [
            'id' => 'reservation-'.$reservation->id.'-'.$type,
            'type' => 'reservations',
            'chat_type' => $type,
            'record_id' => $reservation->id,
            'title' => ($isDelivery ? '📦 ' : '🍷 ').'Reservasi #'.$reservation->id,
            'subtitle' => $isDelivery
                ? $this->deliverySubtitle($reservation->customer_name, $reservation->courier?->name, $user)
                : $this->supportSubtitle($reservation->customer_name, $user),
            'badge' => $isDelivery ? 'Delivery (Kurir)' : 'Resto Support',
            'status' => $reservation->status,
            'created_at' => $reservation->created_at?->toISOString(),
            'unread_count' => $unreadCount,
            'last_message' => $this->formatLastMessage($lastMessage),
        ];
    }

    private function formatOrderThread(Order $order, User $user, string $type, ?Message $lastMessage = null, int $unreadCount = 0): array
    {
        $isDelivery = $type === 'delivery';

        return [
            'id' => 'order-'.$order->id.'-'.$type,
            'type' => 'orders',
            'chat_type' => $type,
            'record_id' => $order->id,
            'title' => ($isDelivery ? '🚚 ' : '🛍️ ').$order->order_number,
            'subtitle' => $isDelivery
                ? $this->deliverySubtitle($order->customer_name, $order->courier?->name, $user)
                : $this->supportSubtitle($order->customer_name, $user),
            'badge' => $isDelivery ? 'Delivery (Kurir)' : 'Resto Support',
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

    private function supportSubtitle(string $customerName, User $user): string
    {
        return $user->isCustomer() ? 'Bantuan Tim Restoran' : 'Customer: '.$customerName;
    }

    private function deliverySubtitle(string $customerName, ?string $courierName, User $user): string
    {
        if ($user->isCustomer()) {
            return $courierName ? 'Kurir: '.$courierName : 'Menunggu Kurir...';
        }

        if ($user->isCourier()) {
            return 'Customer: '.$customerName;
        }

        return 'K: '.($courierName ?? '-').' | C: '.$customerName;
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
