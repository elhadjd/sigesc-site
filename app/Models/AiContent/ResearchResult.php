<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResearchResult extends Model
{
    protected $table = 'ai_research_results';

    protected $fillable = [
        'article_id', 'query', 'topic', 'provider', 'avg_trust_score',
        'results', 'structured_summary', 'structured_payload', 'facts',
        'references', 'from_cache', 'searched_at',
    ];

    protected $casts = [
        'results' => 'array',
        'facts' => 'array',
        'references' => 'array',
        'structured_payload' => 'array',
        'avg_trust_score' => 'integer',
        'from_cache' => 'boolean',
        'searched_at' => 'datetime',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function findings(): HasMany
    {
        return $this->hasMany(ResearchFinding::class, 'ai_research_result_id');
    }
}
