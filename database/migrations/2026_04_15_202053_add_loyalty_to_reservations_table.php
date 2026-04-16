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
        Schema::table('reservations', function (Blueprint $table) {
            $table->integer('points_used')->nullable()->after('booking_fee');
            $table->decimal('discount_amount', 12, 2)->nullable()->after('points_used');
            $table->decimal('total_after_discount', 12, 2)->nullable()->after('discount_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['points_used', 'discount_amount', 'total_after_discount']);
        });
    }
};
