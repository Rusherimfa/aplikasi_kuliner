<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Auth\OTPController;
use App\Http\Controllers\BotController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestChatController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\TestErrorController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [PublicCatalogController::class, 'welcome'])->name('home');
Route::get('/catalog', [PublicCatalogController::class, 'catalog'])->name('catalog');
Route::get('/experience', [PublicCatalogController::class, 'experience'])->name('experience');
Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');
Route::get('/privacy', function () {
    return Inertia::render('legal/privacy');
})->name('privacy');
Route::get('/terms', function () {
    return Inertia::render('legal/terms');
})->name('terms');

// Public reservations (no login required)
Route::get('/reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

// Checkout (Public) - Removed, moved to Auth group

// Chatbot API (Public)
Route::post('/chatbot/ask', [BotController::class, 'ask'])->name('chatbot.ask');
Route::get('/guest-chat/messages', [GuestChatController::class, 'messages'])->name('guest-chat.messages');
Route::post('/guest-chat/messages', [GuestChatController::class, 'store'])->middleware('throttle:20,1')->name('guest-chat.store');

// Google Socialite Login
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('social.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/reservations/auth-intent', function () {
            return redirect()->route('reservations.create');
        })->name('reservations.auth-intent');

        Route::get('/reservations/history', [ReservationController::class, 'history'])->name('reservations.history');
        Route::get('/reservations/payment/{reservation}', [ReservationController::class, 'payment'])->name('reservations.payment');
        Route::post('/reservations/payment/{reservation}', [ReservationController::class, 'processPayment'])->name('reservations.payment.process');
        Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
        Route::put('/reservations/{reservation}/customer', [ReservationController::class, 'updateCustomer'])->name('reservations.update_customer');
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

        // Checkout (Authenticated)
        Route::get('/checkout', [PublicCatalogController::class, 'checkout'])->name('checkout');
        Route::post('/orders/checkout', [OrderController::class, 'store'])->name('orders.checkout');
        Route::get('/orders/history', [OrderController::class, 'history'])->name('orders.history');
        Route::get('/orders/{order}/track', [OrderController::class, 'track'])->name('orders.track');
        Route::get('/orders/payment/{order}', [OrderController::class, 'payment'])->name('orders.payment');
        Route::post('/orders/payment/{order}/refresh', [OrderController::class, 'refreshPayment'])->name('orders.payment.refresh');
        Route::post('/orders/payment/{order}', [OrderController::class, 'processPayment'])->name('orders.payment.process');
        Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
        Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

        // Authenticated Testimonials
        Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');

        // Review Submission Route
        Route::post('/reservations/{reservation}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

        // Chat Routes
        Route::get('/chat/threads', [ChatController::class, 'threads'])->name('chat.threads');
        Route::get('/reservations/{reservation}/messages', [ChatController::class, 'index'])->name('chat.index');
        Route::post('/reservations/{reservation}/messages', [ChatController::class, 'store'])->name('chat.store');
        Route::get('/orders/{order}/messages', [ChatController::class, 'indexOrder'])->name('chat.order.index');
        Route::post('/orders/{order}/messages', [ChatController::class, 'storeOrder'])->name('chat.order.store');
        Route::post('/chat/{id}/read', [ChatController::class, 'markAsRead'])->name('chat.mark_read');

        // Simulation Route for Mapping Tracking
        Route::post('/reservations/{reservation}/simulate-tracking', [ReservationController::class, 'simulateTracking'])->name('reservations.simulate_tracking');
        Route::post('/orders/{order}/simulate-tracking', [OrderController::class, 'simulateTracking'])->name('orders.simulate-tracking');

        Route::get('/verify-otp', [OTPController::class, 'show'])->name('otp.verify');
        Route::post('/verify-otp', [OTPController::class, 'verify']);
        Route::post('/resend-otp', [OTPController::class, 'resend'])->name('otp.resend');

        // Service Hub Routes (Customer)
        Route::post('/service-requests', [ServiceRequestController::class, 'store'])->name('service-requests.store');

        // Notification Routes
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    });

Route::middleware(['auth', 'verified', 'role:staff'])->group(function () {
    Route::get('/guest-chat/{guestConversation}/messages', [GuestChatController::class, 'staffMessages'])->name('guest-chat.staff.messages');
    Route::post('/guest-chat/{guestConversation}/messages', [GuestChatController::class, 'staffStore'])->name('guest-chat.staff.store');
});

Route::middleware(['auth', 'verified', 'role:admin,staff,kurir'])
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Admin Only Routes
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('accounts', AccountController::class)->except(['create', 'edit', 'show']);
        });

        // Menu Routes
        Route::middleware('role:admin,staff')->group(function () {
            Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
            Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
            Route::put('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
            Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');
        });

        // Reservation Dashboard Routes
        Route::middleware('role:admin,staff')->group(function () {
            Route::get('reservations', [ReservationController::class, 'index'])->name('reservations.index');
            Route::put('reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
            Route::patch('reservations/{reservation}/assign-courier', [ReservationController::class, 'assignCourier'])->name('reservations.assign_courier');
        });
        Route::patch('reservations/{reservation}/delivery-status', [ReservationController::class, 'updateDeliveryStatus'])->name('reservations.update_delivery_status');
        Route::patch('orders/{order}/delivery-status', [OrderController::class, 'updateDeliveryStatus'])->name('orders.update_delivery_status');
        Route::patch('tables/{table}/position', [ReservationController::class, 'updateTablePosition'])->name('tables.update_position')->middleware('role:admin,staff');

        // Kitchen Display System
        Route::middleware('role:admin,staff')->group(function () {
            Route::get('kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
            Route::patch('kitchen/item/{pivotId}', [KitchenController::class, 'updateItemStatus'])->name('kitchen.item.update');
            Route::patch('kitchen/order-item/{itemId}', [KitchenController::class, 'updateOrderItemStatus'])->name('kitchen.order_item.update');
            Route::post('kitchen/orders/{order}/accept', [KitchenController::class, 'acceptOrder'])->name('kitchen.orders.accept');
            Route::post('kitchen/orders/{order}/reject', [KitchenController::class, 'rejectOrder'])->name('kitchen.orders.reject');
            Route::post('kitchen/orders/{order}/ready-all', [KitchenController::class, 'readyAll'])->name('kitchen.orders.ready_all');
            Route::patch('kitchen/orders/{order}/status', [KitchenController::class, 'updateOrderStatus'])->name('kitchen.orders.update_status');

            // Analytics Dashboard
            Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

            // Service Hub Routes (Staff)
            Route::get('service-requests', [ServiceRequestController::class, 'index'])->name('service-requests.index');
            Route::patch('service-requests/{serviceRequest}', [ServiceRequestController::class, 'update'])->name('service-requests.update');
        });

        // QR Code Check-in (Staff only — scan from mobile QR reader)
        Route::get('/checkin/{token}', [ReservationController::class, 'checkin'])->name('reservations.checkin');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

Route::post('locale', function (Request $request) {
    $request->validate([
        'locale' => 'required|string|in:en,id',
    ]);

    session()->put('locale', $request->input('locale'));

    return back();
})->name('locale.update');

// Error Page Previews (Local Only)
if (app()->environment('local')) {
    Route::get('/errors/{status}', [TestErrorController::class, 'preview'])->name('errors.preview');
}

require __DIR__.'/settings.php';
