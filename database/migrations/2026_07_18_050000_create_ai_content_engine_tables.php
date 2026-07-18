<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('articles_count')->default(0);
            $table->timestamps();
        });

        Schema::create('research_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('domain')->nullable()->index();
            $table->string('url')->nullable();
            $table->string('type')->default('web'); // official, news, institutional, web
            $table->boolean('is_trusted')->default(false)->index();
            $table->boolean('is_active')->default(true);
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::create('ai_articles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('category_id')->nullable()->constrained('ai_categories')->nullOnDelete();
            $table->unsignedBigInteger('post_id')->nullable()->index(); // synced public blog post
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('status', 40)->default('discovered')->index();
            // discovered, researching, drafting, reviewing, fact_checking, seo,
            // imaging, social, draft, needs_review, scheduled, published, failed, archived
            $table->unsignedTinyInteger('priority')->default(3)->index();
            $table->string('focus_keyword')->nullable()->index();
            $table->text('excerpt')->nullable();
            $table->longText('content_html')->nullable();
            $table->longText('content_markdown')->nullable();
            $table->string('featured_image')->nullable();
            $table->unsignedInteger('read_time')->default(5);
            $table->decimal('seo_score', 5, 2)->nullable();
            $table->decimal('fact_confidence', 5, 2)->nullable();
            $table->boolean('needs_human_review')->default(false)->index();
            $table->boolean('is_ai_generated')->default(true);
            $table->string('author_name')->nullable();
            $table->string('author_role')->nullable();
            $table->string('author_avatar')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->json('open_graph')->nullable();
            $table->json('twitter_card')->nullable();
            $table->json('schema_json_ld')->nullable();
            $table->json('social_posts')->nullable();
            $table->json('pipeline_meta')->nullable();
            $table->json('toc')->nullable();
            $table->timestamp('scheduled_at')->nullable()->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'scheduled_at']);
            $table->index(['status', 'published_at']);
        });

        Schema::create('ai_article_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('type', 40)->default('section'); // intro, h2, h3, faq, glossary, cta, toc
            $table->string('heading')->nullable();
            $table->longText('body_html')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['article_id', 'position']);
        });

        Schema::create('ai_article_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->foreignId('research_source_id')->nullable()->constrained('research_sources')->nullOnDelete();
            $table->string('title')->nullable();
            $table->text('url');
            $table->text('snippet')->nullable();
            $table->boolean('is_trusted')->default(false);
            $table->timestamps();
        });

        Schema::create('ai_article_keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('keyword');
            $table->string('type', 20)->default('secondary'); // focus, secondary, related
            $table->unsignedInteger('score')->default(0);
            $table->timestamps();

            $table->index(['article_id', 'type']);
        });

        Schema::create('ai_article_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('tag');
            $table->string('slug');
            $table->timestamps();

            $table->unique(['article_id', 'slug']);
        });

        Schema::create('ai_article_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('role', 40)->default('cover'); // cover, og, facebook, linkedin, whatsapp, inline, infographic
            $table->string('url');
            $table->string('alt')->nullable();
            $table->string('storage_path')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['article_id', 'role']);
        });

        Schema::create('ai_article_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('stage', 40);
            $table->longText('content_html')->nullable();
            $table->json('payload')->nullable();
            $table->string('created_by')->default('ai');
            $table->timestamps();

            $table->index(['article_id', 'stage']);
        });

        Schema::create('ai_article_faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('question');
            $table->longText('answer_html');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('ai_article_glossary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('ai_articles')->cascadeOnDelete();
            $table->string('term');
            $table->text('definition');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('ai_research_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
            $table->string('query');
            $table->string('provider', 40)->default('tavily');
            $table->json('results')->nullable();
            $table->longText('structured_summary')->nullable();
            $table->json('facts')->nullable();
            $table->json('references')->nullable();
            $table->timestamps();

            $table->index(['article_id', 'provider']);
        });

        Schema::create('ai_jobs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
            $table->string('type', 60)->index(); // daily_pipeline, single_topic, ask_expert, publish
            $table->string('status', 30)->default('pending')->index();
            $table->string('current_agent')->nullable();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->json('input')->nullable();
            $table->json('output')->nullable();
            $table->text('error')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });

        Schema::create('ai_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_job_id')->nullable()->constrained('ai_jobs')->nullOnDelete();
            $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
            $table->string('agent', 60)->nullable()->index();
            $table->string('level', 20)->default('info')->index();
            $table->string('message');
            $table->json('context')->nullable();
            $table->timestamps();

            $table->index('created_at');
        });

        Schema::create('ai_expert_questions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('asker_name')->nullable();
            $table->string('asker_email')->nullable();
            $table->text('question');
            $table->longText('answer_html')->nullable();
            $table->string('status', 30)->default('pending')->index();
            // pending, researching, answered, converted, rejected
            $table->decimal('quality_score', 5, 2)->nullable();
            $table->foreignId('article_id')->nullable()->constrained('ai_articles')->nullOnDelete();
            $table->json('research')->nullable();
            $table->boolean('convert_to_article')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_expert_questions');
        Schema::dropIfExists('ai_logs');
        Schema::dropIfExists('ai_jobs');
        Schema::dropIfExists('ai_research_results');
        Schema::dropIfExists('ai_article_glossary');
        Schema::dropIfExists('ai_article_faqs');
        Schema::dropIfExists('ai_article_revisions');
        Schema::dropIfExists('ai_article_images');
        Schema::dropIfExists('ai_article_tags');
        Schema::dropIfExists('ai_article_keywords');
        Schema::dropIfExists('ai_article_sources');
        Schema::dropIfExists('ai_article_sections');
        Schema::dropIfExists('ai_articles');
        Schema::dropIfExists('research_sources');
        Schema::dropIfExists('ai_categories');
    }
};
