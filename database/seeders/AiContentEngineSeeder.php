<?php

namespace Database\Seeders;

use App\Models\AiContent\Category;
use App\Models\AiContent\ResearchSetting;
use App\Models\AiContent\ResearchSource;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AiContentEngineSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('ai_content_engine.categories', []) as $name) {
            Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
        }

        $sources = [
            [
                'name' => 'AGT',
                'domain' => 'agt.minfin.gov.ao',
                'url' => 'https://agt.minfin.gov.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 100,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'Ministério das Finanças Angola',
                'domain' => 'minfin.gov.ao',
                'url' => 'https://www.minfin.gov.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 98,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'Diário da República Angola',
                'domain' => 'diario.gov.ao',
                'url' => 'https://www.diario.gov.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 97,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'Banco Nacional de Angola',
                'domain' => 'bna.ao',
                'url' => 'https://www.bna.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 96,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'INAPEM',
                'domain' => 'inapem.gov.ao',
                'url' => 'https://www.inapem.gov.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 95,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'Portal Oficial do Governo de Angola',
                'domain' => 'governo.gov.ao',
                'url' => 'https://governo.gov.ao',
                'type' => 'official',
                'category' => 'official',
                'priority' => 94,
                'country' => 'AO',
                'trust_score' => 100,
            ],
            [
                'name' => 'Banco Mundial',
                'domain' => 'worldbank.org',
                'url' => 'https://www.worldbank.org',
                'type' => 'institutional',
                'category' => 'institutional',
                'priority' => 80,
                'country' => 'INT',
                'trust_score' => 90,
            ],
            [
                'name' => 'FMI',
                'domain' => 'imf.org',
                'url' => 'https://www.imf.org',
                'type' => 'institutional',
                'category' => 'institutional',
                'priority' => 78,
                'country' => 'INT',
                'trust_score' => 90,
            ],
            [
                'name' => 'Jornal de Angola',
                'domain' => 'jornaldeangola.ao',
                'url' => 'https://www.jornaldeangola.ao',
                'type' => 'news',
                'category' => 'news',
                'priority' => 60,
                'country' => 'AO',
                'trust_score' => 65,
            ],
        ];

        foreach ($sources as $source) {
            ResearchSource::updateOrCreate(
                ['domain' => $source['domain']],
                array_merge($source, ['is_trusted' => $source['trust_score'] >= 70, 'is_active' => true])
            );
        }

        $defaults = [
            'tavily_enabled' => (bool) config('ai_content_engine.tavily.enabled', true),
            'max_sources' => (int) config('ai_content_engine.research.max_sources', 12),
            'min_trust_score' => (int) config('ai_content_engine.research.min_trust_score', 50),
            'cache_days' => (int) config('ai_content_engine.research.cache_days', 30),
            'news_enabled' => true,
            'internal_knowledge_enabled' => true,
        ];

        foreach ($defaults as $key => $value) {
            ResearchSetting::updateOrCreate(
                ['key' => $key],
                ['value' => ['value' => $value]]
            );
        }
    }
}
