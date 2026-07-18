<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_expert_questions', function (Blueprint $table) {
            $table->timestamp('email_notified_at')->nullable()->after('convert_to_article');
            $table->timestamp('article_email_notified_at')->nullable()->after('email_notified_at');
        });
    }

    public function down(): void
    {
        Schema::table('ai_expert_questions', function (Blueprint $table) {
            $table->dropColumn(['email_notified_at', 'article_email_notified_at']);
        });
    }
};
