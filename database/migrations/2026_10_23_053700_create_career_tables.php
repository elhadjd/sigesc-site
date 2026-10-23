<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('career_job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('department')->nullable();
            $table->string('location')->default('Luanda, Angola');
            $table->string('employment_type', 32)->default('full_time');
            $table->string('work_mode', 32)->default('onsite');
            $table->string('status', 16)->default('open')->index();
            $table->text('summary')->nullable();
            $table->longText('description');
            $table->longText('requirements')->nullable();
            $table->longText('benefits')->nullable();
            $table->string('salary_range')->nullable();
            $table->unsignedInteger('applications_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('career_job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')
                ->constrained('career_job_listings')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->text('cover_letter');
            $table->string('cv_path')->nullable();
            $table->string('status', 24)->default('received')->index();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();

            $table->index(['job_listing_id', 'email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('career_job_applications');
        Schema::dropIfExists('career_job_listings');
    }
};
