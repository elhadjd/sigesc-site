<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ArticleTag extends Model
{
    protected $table = 'ai_article_tags';

    protected $fillable = ['article_id', 'tag', 'slug'];

    protected static function booted(): void
    {
        static::creating(function (ArticleTag $tag) {
            if (blank($tag->slug)) {
                $tag->slug = Str::slug($tag->tag);
            }
        });
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
