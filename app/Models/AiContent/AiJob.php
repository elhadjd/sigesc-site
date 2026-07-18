<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class AiJob extends Model
{
    protected $table = 'ai_jobs';

    protected $fillable = [
        'uuid', 'article_id', 'type', 'status', 'current_agent', 'progress',
        'input', 'output', 'error', 'started_at', 'finished_at',
    ];

    protected $casts = [
        'input' => 'array',
        'output' => 'array',
        'progress' => 'integer',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (AiJob $job) {
            if (blank($job->uuid)) {
                $job->uuid = (string) Str::uuid();
            }
        });
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(AiLog::class, 'ai_job_id');
    }
}
