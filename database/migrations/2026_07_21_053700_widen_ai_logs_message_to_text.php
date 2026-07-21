<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('ai_logs')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE `ai_logs` MODIFY `message` TEXT NOT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE ai_logs ALTER COLUMN message TYPE TEXT');
        }
        // SQLite stores strings without a hard VARCHAR limit — no-op.
    }

    public function down(): void
    {
        if (! Schema::hasTable('ai_logs')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE `ai_logs` MODIFY `message` VARCHAR(255) NOT NULL');
        } elseif ($driver === 'pgsql') {
            DB::statement('ALTER TABLE ai_logs ALTER COLUMN message TYPE VARCHAR(255)');
        }
    }
};
