<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleFaq extends Model
{
    protected $table = 'ai_article_faqs';

    protected $fillable = ['article_id', 'question', 'answer_html', 'position'];

    protected $casts = ['position' => 'integer'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
