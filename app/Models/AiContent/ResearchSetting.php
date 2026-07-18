<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ResearchSetting extends Model
{
    protected $table = 'ai_research_settings';

    protected $fillable = ['key', 'value'];

    protected $casts = [
        'value' => 'array',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return Cache::remember("ai_research_setting_{$key}", 60, function () use ($key, $default) {
            $row = static::query()->where('key', $key)->first();

            if (! $row) {
                return $default;
            }

            return $row->value['value'] ?? $row->value ?? $default;
        });
    }

    public static function setValue(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => ['value' => $value]]
        );

        Cache::forget("ai_research_setting_{$key}");
        Cache::forget('ai_research_settings_all');
    }

    /**
     * @return array<string, mixed>
     */
    public static function allMapped(): array
    {
        return Cache::remember('ai_research_settings_all', 60, function () {
            $defaults = [
                'tavily_enabled' => (bool) config('ai_content_engine.tavily.enabled', true),
                'max_sources' => (int) config('ai_content_engine.research.max_sources', 12),
                'min_trust_score' => (int) config('ai_content_engine.research.min_trust_score', 50),
                'cache_days' => (int) config('ai_content_engine.research.cache_days', 30),
                'news_enabled' => (bool) config('ai_content_engine.research.news_enabled', true),
                'internal_knowledge_enabled' => (bool) config('ai_content_engine.research.internal_knowledge_enabled', true),
            ];

            foreach (static::query()->get() as $row) {
                $defaults[$row->key] = $row->value['value'] ?? $row->value;
            }

            return $defaults;
        });
    }
}
