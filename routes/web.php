<?php

use App\Http\Controllers\Bookings\AdminBookingController;
use App\Http\Controllers\Bookings\BookingController;
use App\Http\Controllers\Bookings\CashierPaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\Payments\PaymentCallbackController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\TestimonialController;
use App\Http\Middleware\EnsureTeamMembership;
use App\Http\Middleware\EnsureUserRole;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicCatalogController::class, 'welcome'])->name('home');
Route::get('/catalog', [PublicCatalogController::class, 'catalog'])->name('catalog');
Route::get('/experience', [PublicCatalogController::class, 'experience'])->name('experience');
Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

// Checkout (Public)
Route::get('/checkout', [PublicCatalogController::class, 'checkout'])->name('checkout');

// Google Socialite Login
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('social.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);

// Public reservations (requires login)
Route::middleware(['auth', config('jetstream.auth_session'), 'verified'])->group(function () {
    Route::get('/reservations/create', [BookingController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [BookingController::class, 'store'])->name('reservations.store');
    Route::get('/bookings/history', [BookingController::class, 'history'])->name('bookings.history');

    // Authenticated testimonials
    Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');

    // Review submission route
    Route::post('/reservations/{reservation}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

Route::post('/payments/callback', PaymentCallbackController::class)->name('payments.callback');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class, EnsureUserRole::class.':admin,superadmin,kasir,user'])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Menu routes
        Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
        Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
        Route::put('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
        Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

        // Kitchen routes
        Route::middleware(EnsureUserRole::class.':admin,superadmin,kasir')->group(function () {
            Route::get('kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
            Route::patch('kitchen/item/{pivotId}', [KitchenController::class, 'updateItemStatus'])->name('kitchen.item.update');
        });

        // Admin reservations routes
        Route::middleware(EnsureUserRole::class.':admin,superadmin')->group(function () {
            Route::get('reservations', [AdminBookingController::class, 'index'])->name('reservations.index');
            Route::put('reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
            Route::patch('reservations/{reservation}/confirm', [AdminBookingController::class, 'confirm'])->name('reservations.confirm');
            Route::patch('reservations/{reservation}/reject', [AdminBookingController::class, 'reject'])->name('reservations.reject');
            Route::patch('reservations/{reservation}/seat', [AdminBookingController::class, 'updateSeat'])->name('reservations.update-seat');
            Route::patch('reservations/{reservation}/note', [AdminBookingController::class, 'note'])->name('reservations.note');
            Route::patch('seats/{seat}/availability', [AdminBookingController::class, 'availability'])->name('seats.availability');
        });

        // Cashier routes
        Route::middleware(EnsureUserRole::class.':kasir,admin,superadmin')->group(function () {
            Route::get('cashier/payments', [CashierPaymentController::class, 'index'])->name('cashier.payments.index');
            Route::post('cashier/payments/{reservation}/invoice', [CashierPaymentController::class, 'createInvoice'])->name('cashier.payments.invoice');
        });
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
