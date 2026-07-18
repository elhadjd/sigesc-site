<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Widen users.social_token for long OAuth tokens without requiring doctrine/dbal.
     */
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        if (! Schema::hasColumn('users', 'social_token')) {
            Schema::table('users', function (Blueprint $table) {
                $table->text('social_token')->nullable();
            });

            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY social_token TEXT NULL');

            return;
        }

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ALTER COLUMN social_token TYPE TEXT');

            return;
        }

        // sqlite / others: string columns already accept long values in practice.
    }

    public function down(): void
    {
        // Intentionally left blank — narrowing a token column is unsafe.
    }
};
