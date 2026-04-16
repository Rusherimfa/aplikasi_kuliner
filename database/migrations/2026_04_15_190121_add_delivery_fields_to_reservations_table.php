<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $blueprint) {
            $blueprint->foreignId('courier_id')->nullable()->constrained('users')->onDelete('set null');
            $blueprint->enum('delivery_status', ['pending', 'preparing', 'on_delivery', 'arrived', 'delivered'])->default('pending');
            $blueprint->text('delivery_address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $blueprint) {
            $blueprint->dropForeign(['courier_id']);
            $blueprint->dropColumn(['courier_id', 'delivery_status', 'delivery_address']);
        });
    }
};
