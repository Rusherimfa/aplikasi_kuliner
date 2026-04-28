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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal', 12, 2)->after('order_type')->default(0);
            $table->decimal('tax_amount', 12, 2)->after('subtotal')->default(0);
            $table->decimal('service_amount', 12, 2)->after('tax_amount')->default(0);
            $table->string('midtrans_snap_token')->nullable()->after('total_price');
            $table->string('midtrans_id')->nullable()->after('midtrans_snap_token');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('subtotal', 12, 2)->after('guest_count')->default(0);
            $table->decimal('tax_amount', 12, 2)->after('subtotal')->default(0);
            $table->decimal('service_amount', 12, 2)->after('tax_amount')->default(0);
            $table->string('midtrans_snap_token')->nullable()->after('payment_status');
            $table->string('midtrans_id')->nullable()->after('midtrans_snap_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'tax_amount', 'service_amount', 'midtrans_snap_token', 'midtrans_id']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'tax_amount', 'service_amount', 'midtrans_snap_token', 'midtrans_id']);
        });
    }
};
