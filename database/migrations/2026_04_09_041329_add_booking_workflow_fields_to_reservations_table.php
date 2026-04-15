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
            if (! Schema::hasColumn('reservations', 'booking_number')) {
                $table->string('booking_number', 32)->nullable()->after('id');
            }

            if (! Schema::hasColumn('reservations', 'admin_note')) {
                $table->text('admin_note')->nullable()->after('special_requests');
            }

            if (! Schema::hasColumn('reservations', 'confirmed_at')) {
                $table->timestamp('confirmed_at')->nullable()->after('admin_note');
            }

            if (! Schema::hasColumn('reservations', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable()->after('confirmed_at');
            }

            if (! Schema::hasColumn('reservations', 'payment_sent_at')) {
                $table->timestamp('payment_sent_at')->nullable()->after('rejected_at');
            }

            if (! Schema::hasColumn('reservations', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('payment_sent_at');
            }

            if (! Schema::hasColumn('reservations', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('paid_at');
            }

            if (! Schema::hasColumn('reservations', 'expired_at')) {
                $table->timestamp('expired_at')->nullable()->after('cancelled_at');
            }

            if (! Schema::hasColumn('reservations', 'occupied_at')) {
                $table->timestamp('occupied_at')->nullable()->after('expired_at');
            }

            if (! Schema::hasColumn('reservations', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('occupied_at');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (! $this->hasUniqueIndex('reservations', 'reservations_booking_number_unique') && Schema::hasColumn('reservations', 'booking_number')) {
                $table->unique('booking_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            if ($this->hasUniqueIndex('reservations', 'reservations_booking_number_unique')) {
                $table->dropUnique('reservations_booking_number_unique');
            }

            foreach ([
                'completed_at',
                'occupied_at',
                'expired_at',
                'cancelled_at',
                'paid_at',
                'payment_sent_at',
                'rejected_at',
                'confirmed_at',
                'admin_note',
                'booking_number',
            ] as $column) {
                if (Schema::hasColumn('reservations', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    private function hasUniqueIndex(string $table, string $indexName): bool
    {
        $result = Schema::getConnection()
            ->selectOne(
                'SELECT COUNT(*) AS aggregate
                 FROM information_schema.STATISTICS
                 WHERE TABLE_SCHEMA = ?
                   AND TABLE_NAME = ?
                   AND INDEX_NAME = ?
                   AND NON_UNIQUE = 0',
                [Schema::getConnection()->getDatabaseName(), $table, $indexName],
            );

        return ((int) ($result->aggregate ?? 0)) > 0;
    }
};
