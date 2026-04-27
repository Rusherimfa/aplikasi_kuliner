<?php

namespace App\Events;

use App\Models\GuestMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GuestMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public GuestMessage $message) {}

    /**
     * @return array<int, Channel|PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('guest-chat.'.$this->message->guest_conversation_id),
            ...($this->message->sender_type === 'guest'
                ? [new PrivateChannel('staff.notifications')]
                : []),
        ];
    }

    public function broadcastAs(): string
    {
        return 'guest-message.sent';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->guest_conversation_id,
                'content' => $this->message->content,
                'sender_type' => $this->message->sender_type,
                'sender' => $this->message->sender ? [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name,
                    'role' => $this->message->sender->role?->value ?? $this->message->sender->role,
                ] : [
                    'id' => null,
                    'name' => 'Guest',
                    'role' => 'guest',
                ],
                'created_at' => $this->message->created_at?->toISOString(),
            ],
            'conversation' => [
                'id' => $this->message->guest_conversation_id,
                'guest_name' => $this->message->conversation?->guest_name ?: 'Tamu website',
                'status' => $this->message->conversation?->status,
            ],
        ];
    }
}
