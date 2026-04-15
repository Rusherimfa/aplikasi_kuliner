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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->unsignedBigInteger('amount');
            $table->string('method', 32)->nullable();
            $table->string('gateway', 32)->nullable();
            $table->string('payment_link')->nullable();
            $table->longText('qr_payload')->nullable();
            $table->string('status', 32)->default('waiting_payment');
            $table->timestamp('deadline_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique('reservation_id');
            $table->index(['status', 'deadline_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
