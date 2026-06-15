<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_comments', function (Blueprint $table) {
            $table->id();

            // Chave estrangeira para o post
            $table->foreignId('post_id')
                ->constrained()
                ->onDelete('cascade');

            // Chave estrangeira para o usuário (se estiver logado)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            // Chave estrangeira para comentário pai (respostas)
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('post_comments')
                ->onDelete('cascade');

            // Informações do comentarista
            $table->string('author_name')->nullable(); // Para comentários anônimos
            $table->string('author_email')->nullable(); // Para comentários anônimos
            $table->string('author_avatar')->nullable();

            // Conteúdo do comentário
            $table->text('content');

            // Status do comentário
            $table->enum('status', ['pending', 'approved', 'rejected', 'spam'])
                ->default('pending');

            // Metadados
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();

            // Engajamento
            $table->integer('likes_count')->default(0);
            $table->integer('replies_count')->default(0);

            // Timestamps
            $table->timestamps();
            $table->timestamp('approved_at')->nullable();

            // Índices para otimização
            $table->index('post_id');
            $table->index('user_id');
            $table->index('parent_id');
            $table->index('status');
            $table->index('approved_at');
            $table->index('created_at');

            // Fulltext index para busca (se suportado)
            if (config('database.default') === 'mysql') {
                $table->fullText(['content']);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_comments');
    }
};
