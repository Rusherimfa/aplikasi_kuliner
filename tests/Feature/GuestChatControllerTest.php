<?php

use App\Events\GuestMessageSent;
use App\Models\GuestConversation;
use App\Models\GuestMessage;
use App\Models\User;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

test('guest can start a staff chat without logging in', function () {
    Event::fake([GuestMessageSent::class]);

    postJson(route('guest-chat.store'), [
        'guest_name' => 'Tamu Website',
        'content' => 'Halo staff, saya mau bertanya.',
    ])
        ->assertSuccessful()
        ->assertJsonPath('content', 'Halo staff, saya mau bertanya.')
        ->assertJsonPath('sender.role', 'guest');

    $conversation = GuestConversation::first();

    expect($conversation)
        ->not->toBeNull()
        ->and($conversation->guest_name)->toBe('Tamu Website')
        ->and(GuestMessage::where('guest_conversation_id', $conversation->id)
            ->where('sender_type', 'guest')
            ->where('content', 'Halo staff, saya mau bertanya.')
            ->exists())->toBeTrue();

    Event::assertDispatched(GuestMessageSent::class, function (GuestMessageSent $event) use ($conversation) {
        return $event->message->guest_conversation_id === $conversation->id
            && $event->message->sender_type === 'guest'
            && $event->message->content === 'Halo staff, saya mau bertanya.';
    });

    getJson(route('guest-chat.messages', ['conversation_id' => $conversation->id]))
        ->assertSuccessful()
        ->assertJsonPath('conversation.id', $conversation->id)
        ->assertJsonPath('messages.0.content', 'Halo staff, saya mau bertanya.');
});

test('guest conversation persists when session changes but conversation id is reused', function () {
    $response = postJson(route('guest-chat.store'), [
        'guest_name' => 'Evan',
        'content' => 'Halo staff, ini Evan.',
    ])
        ->assertSuccessful();

    $conversationId = $response->json('conversation_id');

    flushSession();

    getJson(route('guest-chat.messages', [
        'conversation_id' => $conversationId,
    ]))
        ->assertSuccessful()
        ->assertJsonPath('conversation.id', $conversationId)
        ->assertJsonPath('conversation.guest_name', 'Evan')
        ->assertJsonPath('messages.0.content', 'Halo staff, ini Evan.');

    postJson(route('guest-chat.store'), [
        'conversation_id' => $conversationId,
        'guest_name' => 'Evan',
        'content' => 'Saya lanjut chat yang sama.',
    ])
        ->assertSuccessful()
        ->assertJsonPath('conversation_id', $conversationId);

    expect(GuestMessage::where('guest_conversation_id', $conversationId)->count())
        ->toBe(2);
});

test('staff can see and reply to guest chat threads', function () {
    Event::fake([GuestMessageSent::class]);

    $staff = User::factory()->staff()->create();
    $conversation = GuestConversation::create([
        'session_id' => 'guest-session',
        'guest_name' => 'Tamu Landing',
        'status' => 'open',
    ]);

    GuestMessage::create([
        'guest_conversation_id' => $conversation->id,
        'sender_type' => 'guest',
        'content' => 'Apakah restoran buka malam ini?',
    ]);

    actingAs($staff)
        ->getJson(route('chat.threads'))
        ->assertSuccessful()
        ->assertJsonPath('threads.0.type', 'guest')
        ->assertJsonPath('threads.0.record_id', $conversation->id)
        ->assertJsonPath('threads.0.badge', 'Guest & Staff')
        ->assertJsonPath('threads.0.unread_count', 1);

    actingAs($staff)
        ->postJson(route('guest-chat.staff.store', $conversation), [
            'content' => 'Buka, staff siap membantu.',
        ])
        ->assertSuccessful()
        ->assertJsonPath('content', 'Buka, staff siap membantu.')
        ->assertJsonPath('sender.id', $staff->id);

    Event::assertDispatched(GuestMessageSent::class, function (GuestMessageSent $event) use ($conversation, $staff) {
        return $event->message->guest_conversation_id === $conversation->id
            && $event->message->sender_type === 'staff'
            && $event->message->sender_id === $staff->id
            && $event->message->content === 'Buka, staff siap membantu.';
    });
});

test('admin cannot reply to guest staff chat', function () {
    $admin = User::factory()->admin()->create();
    $conversation = GuestConversation::create([
        'session_id' => 'guest-session',
        'status' => 'open',
    ]);

    actingAs($admin)
        ->postJson(route('guest-chat.staff.store', $conversation), [
            'content' => 'Admin tidak mengambil chat tamu.',
        ])
        ->assertForbidden();
});
