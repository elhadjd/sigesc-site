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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt');
            $table->text('content')->nullable();
            $table->string('image');
            $table->string('category');
            $table->string('author_name');
            $table->string('author_avatar');
            $table->string('author_role');
            $table->date('publish_date');
            $table->integer('read_time');
            $table->json('tags')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Índices para otimização de consultas
            $table->index('category');
            $table->index('is_published');
            $table->index('publish_date');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
