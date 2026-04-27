<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Events\GuestMessageSent;
use App\Models\GuestConversation;
use App\Models\GuestMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuestChatController extends Controller
{
    public function messages(Request $request): JsonResponse
    {
        $conversation = $this->currentConversation($request);

        if (! $conversation) {
            return response()->json([
                'conversation' => null,
                'messages' => [],
            ]);
        }

        $conversation->messages()
            ->where('sender_type', 'staff')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'conversation' => $this->formatConversation($conversation),
            'messages' => $this->formatMessages($conversation),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'guest_name' => ['nullable', 'string', 'max:80'],
            'conversation_id' => ['nullable', 'integer'],
        ]);

        $conversation = $this->resolveConversation(
            $request,
            $validated['conversation_id'] ?? null,
        );

        if (! $conversation) {
            $conversation = GuestConversation::create([
                'session_id' => $request->session()->getId(),
                'guest_name' => $validated['guest_name'] ?? null,
                'status' => 'open',
            ]);
        }

        if (($validated['guest_name'] ?? null) && $conversation->guest_name !== $validated['guest_name']) {
            $conversation->update(['guest_name' => $validated['guest_name']]);
        }

        $message = GuestMessage::create([
            'guest_conversation_id' => $conversation->id,
            'sender_type' => 'guest',
            'content' => $validated['content'],
        ]);

        broadcast(new GuestMessageSent($message->load('conversation')));

        return response()->json($this->formatMessage($message->load('sender')));
    }

    public function staffMessages(GuestConversation $guestConversation): JsonResponse
    {
        $this->authorizeStaffReply();

        $guestConversation->messages()
            ->where('sender_type', 'guest')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'conversation' => $this->formatConversation($guestConversation),
            'messages' => $this->formatMessages($guestConversation),
        ]);
    }

    public function staffStore(Request $request, GuestConversation $guestConversation): JsonResponse
    {
        $this->authorizeStaffReply();

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $message = GuestMessage::create([
            'guest_conversation_id' => $guestConversation->id,
            'sender_id' => Auth::id(),
            'sender_type' => 'staff',
            'content' => $validated['content'],
        ]);

        broadcast(new GuestMessageSent($message->load(['conversation', 'sender:id,name,role'])));

        return response()->json($this->formatMessage($message->load('sender:id,name,role')));
    }

    private function currentConversation(Request $request): ?GuestConversation
    {
        return $this->resolveConversation(
            $request,
            $request->integer('conversation_id'),
        );
    }

    private function resolveConversation(
        Request $request,
        ?int $conversationId,
    ): ?GuestConversation {
        if ($conversationId) {
            return GuestConversation::find($conversationId);
        }

        return GuestConversation::where(
            'session_id',
            $request->session()->getId(),
        )->first();
    }

    private function authorizeStaffReply(): void
    {
        abort_unless(Auth::user()?->role === Role::STAFF, 403);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatConversation(GuestConversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'guest_name' => $conversation->guest_name,
            'status' => $conversation->status,
            'created_at' => $conversation->created_at?->toISOString(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function formatMessages(GuestConversation $conversation): array
    {
        return $conversation->messages()
            ->with('sender:id,name,role')
            ->oldest()
            ->get()
            ->map(fn (GuestMessage $message) => $this->formatMessage($message))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatMessage(GuestMessage $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->guest_conversation_id,
            'content' => $message->content,
            'sender_type' => $message->sender_type,
            'sender' => $message->sender ? [
                'id' => $message->sender->id,
                'name' => $message->sender->name,
                'role' => $message->sender->role?->value ?? $message->sender->role,
            ] : [
                'id' => null,
                'name' => 'Guest',
                'role' => 'guest',
            ],
            'read_at' => $message->read_at?->toISOString(),
            'created_at' => $message->created_at?->toISOString(),
        ];
    }
}
