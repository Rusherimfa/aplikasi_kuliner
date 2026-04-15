<?php

namespace App\Events;

use App\Models\Reservation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReservationCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Reservation $reservation) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('team.'.$this->reservation->team_id.'.reservations'),
        ];
    }

    /**
     * Get the event name for the broadcast.
     */
    public function broadcastAs(): string
    {
        return 'reservation.created';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->reservation->id,
            'date' => $this->reservation->date,
            'time' => $this->reservation->time,
            'guest_count' => $this->reservation->guest_count,
            'status' => $this->reservation->status,
            'user_id' => $this->reservation->user_id,
        ];
    }
}
