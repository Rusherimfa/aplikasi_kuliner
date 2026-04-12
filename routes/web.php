<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicCatalogController::class, 'welcome'])->name('home');
Route::get('/catalog', [PublicCatalogController::class, 'catalog'])->name('catalog');
Route::get('/experience', [PublicCatalogController::class, 'experience'])->name('experience');
Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

// Public reservations (no login required)
Route::get('/reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

// Checkout (Public)
Route::get('/checkout', [PublicCatalogController::class, 'checkout'])->name('checkout');

// Google Socialite Login
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('social.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/reservations/history', [ReservationController::class, 'history'])->name('reservations.history');
        Route::get('/reservations/payment/{reservation}', [ReservationController::class, 'payment'])->name('reservations.payment');
        Route::post('/reservations/payment/{reservation}', [ReservationController::class, 'processPayment'])->name('reservations.payment.process');
        Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
        Route::put('/reservations/{reservation}/customer', [ReservationController::class, 'updateCustomer'])->name('reservations.update_customer');
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

        // Authenticated Testimonials
        Route::post('/testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');

        // Review Submission Route
        Route::post('/reservations/{reservation}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    });

Route::middleware(['auth', 'verified', 'role:admin,staff'])
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Menu Routes
        Route::get('menus', [MenuController::class, 'index'])->name('menus.index');
        Route::post('menus', [MenuController::class, 'store'])->name('menus.store');
        Route::put('menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
        Route::delete('menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');

        // Reservation Dashboard Routes
        Route::get('reservations', [ReservationController::class, 'index'])->name('reservations.index');
        Route::put('reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
        Route::patch('tables/{table}/position', [ReservationController::class, 'updateTablePosition'])->name('tables.update_position');

        // Kitchen Display System
        Route::get('kitchen', [KitchenController::class, 'index'])->name('kitchen.index');
        Route::patch('kitchen/item/{pivotId}', [KitchenController::class, 'updateItemStatus'])->name('kitchen.item.update');

        // QR Code Check-in (Staff only — scan from mobile QR reader)
        Route::get('/checkin/{token}', [ReservationController::class, 'checkin'])->name('reservations.checkin');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
