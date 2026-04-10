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
        // Add awaiting_payment to status enum, but enum modification can be complex in some DBMS.
        // Since Laravel by default might just use string unless strict ENUM,
        // we'll just keep it string or assume the existing is string.
        // Actually, the previous migration didn't specify enum, just string.
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('booking_fee', 10, 2)->default(0)->after('special_requests');
            $table->string('payment_status')->default('unpaid')->after('booking_fee'); // unpaid, paid, failed, Refunded
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['booking_fee', 'payment_status']);
        });
    }
};
