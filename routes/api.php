<?php

use App\Http\Controllers\CourierController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:kurir,admin'])
    ->post('kuriers/{id}/availability', [CourierController::class, 'toggleAvailability'])
    ->name('courier.toggleAvailability');
