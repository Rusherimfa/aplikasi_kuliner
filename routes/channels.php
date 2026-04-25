<?php

use App\Models\Order;
use App\Models\Reservation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('reservations.{id}', function ($user, $id) {
    $reservation = Reservation::find($id);
    if (! $reservation) {
        return false;
    }

    return (int) $user->id === (int) $reservation->user_id ||
           $user->isStaff() ||
           (int) $user->id === (int) $reservation->courier_id;
});

Broadcast::channel('orders.{id}', function ($user, $id) {
    $order = Order::find($id);
    if (! $order) {
        return false;
    }

    return (int) $user->id === (int) $order->user_id ||
           $user->isStaff() ||
           (int) $user->id === (int) $order->courier_id;
});

Broadcast::channel('staff.notifications', function ($user) {
    return $user->isStaff();
});
