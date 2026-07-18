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
        Schema::table('posts', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('title');
            $table->text('meta_description')->nullable()->after('excerpt');
            $table->json('media')->nullable()->after('image');
            $table->json('source_urls')->nullable()->after('tags');
            $table->string('generation_topic')->nullable()->after('source_urls');
            $table->boolean('is_ai_generated')->default(false)->after('generation_topic');

            $table->index('generation_topic');
            $table->index('is_ai_generated');
        });

        // Widen content for long-form AI articles without requiring doctrine/dbal.
        $driver = \Illuminate\Support\Facades\Schema::getConnection()->getDriverName();
        if ($driver === 'mysql' || $driver === 'mariadb') {
            \Illuminate\Support\Facades\DB::statement('ALTER TABLE posts MODIFY content LONGTEXT NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex(['generation_topic']);
            $table->dropIndex(['is_ai_generated']);
            $table->dropColumn([
                'meta_title',
                'meta_description',
                'media',
                'source_urls',
                'generation_topic',
                'is_ai_generated',
            ]);
        });
    }
};
