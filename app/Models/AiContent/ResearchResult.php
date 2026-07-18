<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchResult extends Model
{
    protected $table = 'ai_research_results';

    protected $fillable = [
        'article_id', 'query', 'provider', 'results', 'structured_summary',
        'facts', 'references',
    ];

    protected $casts = [
        'results' => 'array',
        'facts' => 'array',
        'references' => 'array',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
