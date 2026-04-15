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
        Schema::create('table_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('restaurant_table_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('seat_number');
            $table->string('label', 32);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('position_x')->default(0);
            $table->unsignedSmallInteger('position_y')->default(0);
            $table->timestamps();

            $table->unique(['restaurant_table_id', 'seat_number']);
            $table->index(['team_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_seats');
    }
};
