<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchFinding extends Model
{
    protected $table = 'research_results';

    protected $fillable = [
        'topic', 'source_id', 'article_id', 'ai_research_result_id',
        'title', 'url', 'content', 'summary', 'published_date',
        'trust_score', 'provider', 'searched_at', 'metadata',
    ];

    protected $casts = [
        'published_date' => 'date',
        'trust_score' => 'integer',
        'searched_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function source(): BelongsTo
    {
        return $this->belongsTo(ResearchSource::class, 'source_id');
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(ResearchResult::class, 'ai_research_result_id');
    }
}
