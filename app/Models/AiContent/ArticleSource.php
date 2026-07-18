<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleSource extends Model
{
    protected $table = 'ai_article_sources';

    protected $fillable = [
        'article_id', 'research_source_id', 'title', 'url', 'snippet', 'is_trusted',
    ];

    protected $casts = [
        'is_trusted' => 'boolean',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }

    public function researchSource(): BelongsTo
    {
        return $this->belongsTo(ResearchSource::class, 'research_source_id');
    }
}
