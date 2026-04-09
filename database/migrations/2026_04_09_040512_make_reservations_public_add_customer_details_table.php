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
            $table->foreignId('team_id')->nullable()->change();
            $table->foreignId('user_id')->nullable()->change();
            $table->string('customer_name')->after('user_id')->nullable();
            $table->string('customer_email')->after('customer_name')->nullable();
            $table->string('customer_phone')->after('customer_email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable(false)->change();
            $table->foreignId('user_id')->nullable(false)->change();
            $table->dropColumn(['customer_name', 'customer_email', 'customer_phone']);
        });
    }
};
