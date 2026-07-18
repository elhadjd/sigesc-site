<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('research_sources', function (Blueprint $table) {
            if (! Schema::hasColumn('research_sources', 'category')) {
                $table->string('category', 60)->default('web')->after('type')->index();
            }
            if (! Schema::hasColumn('research_sources', 'priority')) {
                $table->unsignedTinyInteger('priority')->default(50)->after('category')->index();
            }
            if (! Schema::hasColumn('research_sources', 'country')) {
                $table->string('country', 8)->default('AO')->after('priority')->index();
            }
            if (! Schema::hasColumn('research_sources', 'trust_score')) {
                $table->unsignedTinyInteger('trust_score')->default(50)->after('country')->index();
            }
        });

        Schema::table('ai_articles', function (Blueprint $table) {
            if (! Schema::hasColumn('ai_articles', 'fact_check_status')) {
                $table->string('fact_check_status', 30)->nullable()->after('fact_confidence')->index();
            }
        });

        Schema::table('ai_research_results', function (Blueprint $table) {
            if (! Schema::hasColumn('ai_research_results', 'topic')) {
                $table->string('topic')->nullable()->after('query');
            }
            if (! Schema::hasColumn('ai_research_results', 'avg_trust_score')) {
                $table->unsignedTinyInteger('avg_trust_score')->nullable()->after('provider');
            }
            if (! Schema::hasColumn('ai_research_results', 'structured_payload')) {
                $table->json('structured_payload')->nullable()->after('structured_summary');
            }
            if (! Schema::hasColumn('ai_research_results', 'from_cache')) {
                $table->boolean('from_cache')->default(false)->after('references');
            }
            if (! Schema::hasColumn('ai_research_results', 'searched_at')) {
                $table->timestamp('searched_at')->nullable()->after('from_cache');
            }
        });

        if (! Schema::hasTable('research_results')) {
            Schema::create('research_results', function (Blueprint $table) {
                $table->id();
                $table->string('topic')->index();
                $table->foreignId('source_id')->nullable()->constrained('research_sources')->nullOnDelete();
                $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
                $table->foreignId('ai_research_result_id')->nullable()->constrained('ai_research_results')->nullOnDelete();
                $table->string('title')->nullable();
                $table->text('url')->nullable();
                $table->longText('content')->nullable();
                $table->text('summary')->nullable();
                $table->date('published_date')->nullable();
                $table->unsignedTinyInteger('trust_score')->default(50)->index();
                $table->string('provider', 40)->default('hybrid')->index();
                $table->timestamp('searched_at')->nullable()->index();
                $table->json('metadata')->nullable();
                $table->timestamps();

                $table->index(['topic', 'searched_at']);
                $table->index(['trust_score', 'searched_at']);
            });
        }

        if (! Schema::hasTable('research_logs')) {
            Schema::create('research_logs', function (Blueprint $table) {
                $table->id();
                $table->string('agent', 60)->default('AIResearchAgent')->index();
                $table->string('action', 80)->index();
                $table->string('provider', 40)->nullable()->index();
                $table->string('status', 30)->default('ok')->index();
                $table->unsignedInteger('execution_time_ms')->default(0);
                $table->text('error')->nullable();
                $table->json('context')->nullable();
                $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
                $table->timestamps();

                $table->index('created_at');
            });
        }

        if (! Schema::hasTable('ai_research_settings')) {
            Schema::create('ai_research_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->json('value')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_research_settings');
        Schema::dropIfExists('research_logs');
        Schema::dropIfExists('research_results');

        Schema::table('ai_research_results', function (Blueprint $table) {
            foreach (['topic', 'avg_trust_score', 'structured_payload', 'from_cache', 'searched_at'] as $column) {
                if (Schema::hasColumn('ai_research_results', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        if (Schema::hasColumn('ai_articles', 'fact_check_status')) {
            Schema::table('ai_articles', function (Blueprint $table) {
                $table->dropColumn('fact_check_status');
            });
        }

        Schema::table('research_sources', function (Blueprint $table) {
            foreach (['category', 'priority', 'country', 'trust_score'] as $column) {
                if (Schema::hasColumn('research_sources', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
