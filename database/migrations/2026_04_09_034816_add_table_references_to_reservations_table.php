<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            if (! Schema::hasColumn('reservations', 'restaurant_table_id')) {
                $table->unsignedBigInteger('restaurant_table_id')->nullable()->after('team_id');
            }

            if (! Schema::hasColumn('reservations', 'table_seat_id')) {
                $table->unsignedBigInteger('table_seat_id')->nullable()->after('restaurant_table_id');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (
                Schema::hasTable('restaurant_tables') &&
                Schema::hasColumn('reservations', 'restaurant_table_id') &&
                ! $this->hasForeignKey('reservations', 'reservations_restaurant_table_id_foreign')
            ) {
                $table
                    ->foreign('restaurant_table_id')
                    ->references('id')
                    ->on('restaurant_tables')
                    ->nullOnDelete();
            }

            if (
                Schema::hasTable('table_seats') &&
                Schema::hasColumn('reservations', 'table_seat_id') &&
                ! $this->hasForeignKey('reservations', 'reservations_table_seat_id_foreign')
            ) {
                $table
                    ->foreign('table_seat_id')
                    ->references('id')
                    ->on('table_seats')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            if ($this->hasForeignKey('reservations', 'reservations_table_seat_id_foreign')) {
                $table->dropForeign('reservations_table_seat_id_foreign');
            }

            if ($this->hasForeignKey('reservations', 'reservations_restaurant_table_id_foreign')) {
                $table->dropForeign('reservations_restaurant_table_id_foreign');
            }

            if (Schema::hasColumn('reservations', 'table_seat_id')) {
                $table->dropColumn('table_seat_id');
            }

            if (Schema::hasColumn('reservations', 'restaurant_table_id')) {
                $table->dropColumn('restaurant_table_id');
            }
        });
    }

    private function hasForeignKey(string $table, string $constraintName): bool
    {
        $result = DB::selectOne(
            'SELECT COUNT(*) AS aggregate
             FROM information_schema.TABLE_CONSTRAINTS
             WHERE CONSTRAINT_SCHEMA = ?
               AND TABLE_NAME = ?
               AND CONSTRAINT_NAME = ?
               AND CONSTRAINT_TYPE = ?',
            [DB::getDatabaseName(), $table, $constraintName, 'FOREIGN KEY'],
        );

        return ((int) ($result->aggregate ?? 0)) > 0;
    }
};
