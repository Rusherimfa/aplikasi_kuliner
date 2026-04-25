<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        $id = $this->message->reservation_id ?? $this->message->order_id;
        $prefix = $this->message->reservation_id ? 'reservations' : 'orders';

        $channels = [
            new PrivateChannel($prefix.'.'.$id),
        ];

        // Notify staff if a customer sends a message
        if ($this->message->sender && ! $this->message->sender->isStaff()) {
            $channels[] = new PrivateChannel('staff.notifications');
        }

        // Notify the customer if a staff member sends a message
        if ($this->message->sender && $this->message->sender->isStaff()) {
            $recipientId = null;
            if ($prefix === 'reservations') {
                $recipientId = $this->message->reservation?->user_id;
            } else {
                $recipientId = $this->message->order?->user_id;
            }

            if ($recipientId) {
                $channels[] = new PrivateChannel('user.'.$recipientId);
            }
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
