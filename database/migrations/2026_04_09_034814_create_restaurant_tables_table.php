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
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('code', 20);
            $table->string('name')->nullable();
            $table->unsignedSmallInteger('seat_count')->default(0);
            $table->unsignedSmallInteger('position_x')->default(0);
            $table->unsignedSmallInteger('position_y')->default(0);
            $table->timestamps();

            $table->unique(['team_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurant_tables');
    }
};
