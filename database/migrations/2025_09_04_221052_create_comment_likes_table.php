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
        Schema::create('comment_likes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('comment_id')
                ->constrained('post_comments')
                ->onDelete('cascade');

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            $table->string('ip_address', 45)->nullable();
            $table->string('session_id')->nullable();

            $table->timestamps();

            // Índices e constraints únicas
            $table->unique(['comment_id', 'user_id'], 'unique_comment_user_like');
            $table->unique(['comment_id', 'ip_address'], 'unique_comment_ip_like');
            $table->unique(['comment_id', 'session_id'], 'unique_comment_session_like');

            $table->index('comment_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment_likes');
    }
};
