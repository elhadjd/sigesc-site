<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_likes', function (Blueprint $table) {
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

            // Informações para usuários não logados
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('session_id')->nullable();

            // Timestamps
            $table->timestamps();

            // Índices para otimização
            $table->index('post_id');
            $table->index('user_id');
            $table->index('ip_address');
            $table->index('session_id');

            // Garantir que um usuário/IP/sessão só possa curtir uma vez por post
            $table->unique(['post_id', 'user_id'], 'unique_user_like');
            $table->unique(['post_id', 'ip_address'], 'unique_ip_like');
            $table->unique(['post_id', 'session_id'], 'unique_session_like');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_likes');
    }
};
