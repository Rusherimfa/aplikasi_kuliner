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
        // Cek apakah kolom sudah ada di tabel orders untuk menghindari error "Duplicate column"
        if (!Schema::hasColumn('orders', 'delivery_address')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('delivery_address', 500)->nullable()->after('customer_lng');
            });
        }

        // Tambahkan juga ke tabel reservations karena diperlukan oleh ReservationController
        if (!Schema::hasColumn('reservations', 'delivery_address')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->string('delivery_address', 500)->nullable()->after('type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('orders', 'delivery_address')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('delivery_address');
            });
        }

        if (Schema::hasColumn('reservations', 'delivery_address')) {
            Schema::table('reservations', function (Blueprint $table) {
                $table->dropColumn('delivery_address');
            });
        }
    }
};