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
        Schema::table('messages', function (Blueprint $table) {
            $table->string('chat_type')->default('support')->after('is_chatbot');
            $table->index(['reservation_id', 'chat_type']);
            $table->index(['order_id', 'chat_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['reservation_id', 'chat_type']);
            $table->dropIndex(['order_id', 'chat_type']);
            $table->dropColumn('chat_type');
        });
    }
};
