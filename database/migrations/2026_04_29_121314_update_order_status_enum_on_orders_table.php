<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM('pending', 'confirmed', 'cancelled', 'rejected', 'waiting_for_payment', 'preparing', 'complete', 'delivering', 'delivered') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_status ENUM('pending', 'confirmed', 'cancelled', 'waiting_for_payment', 'preparing', 'complete', 'delivering', 'delivered') NOT NULL DEFAULT 'pending'");
    }
};
