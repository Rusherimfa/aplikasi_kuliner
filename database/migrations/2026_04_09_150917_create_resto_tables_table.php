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
        Schema::create('resto_tables', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('capacity')->default(2);
            $table->string('category')->default('regular');
            $table->integer('pos_x')->default(0);
            $table->integer('pos_y')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resto_tables');
    }
};
