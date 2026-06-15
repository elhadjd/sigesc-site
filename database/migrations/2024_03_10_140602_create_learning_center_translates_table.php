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
        Schema::create('learning_center_translates', function (Blueprint $table) {
            $table->id();
            $table->enum('local',['en','fr','pt']);
            $table->string('title');
            $table->string('description');
            $table->unsignedBigInteger('learning_center_id');
            $table->foreign('learning_center_id')->references('id')->on('learning_centers')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_center_translates');
    }
};
