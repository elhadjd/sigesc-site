<?php

namespace Database\Seeders;

use App\Models\AiContent\Category;
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
            ['name' => 'AGT / Ministério das Finanças', 'domain' => 'agt.minfin.gov.ao', 'url' => 'https://agt.minfin.gov.ao', 'type' => 'official'],
            ['name' => 'Ministério das Finanças', 'domain' => 'minfin.gov.ao', 'url' => 'https://www.minfin.gov.ao', 'type' => 'official'],
            ['name' => 'Banco Nacional de Angola', 'domain' => 'bna.ao', 'url' => 'https://www.bna.ao', 'type' => 'official'],
            ['name' => 'Governo de Angola', 'domain' => 'governo.gov.ao', 'url' => 'https://governo.gov.ao', 'type' => 'official'],
            ['name' => 'INAPEM', 'domain' => 'inapem.gov.ao', 'url' => 'https://www.inapem.gov.ao', 'type' => 'official'],
            ['name' => 'Banco Mundial', 'domain' => 'worldbank.org', 'url' => 'https://www.worldbank.org', 'type' => 'institutional'],
            ['name' => 'FMI', 'domain' => 'imf.org', 'url' => 'https://www.imf.org', 'type' => 'institutional'],
            ['name' => 'Jornal de Angola', 'domain' => 'jornaldeangola.ao', 'url' => 'https://www.jornaldeangola.ao', 'type' => 'news'],
        ];

        foreach ($sources as $source) {
            ResearchSource::firstOrCreate(
                ['domain' => $source['domain']],
                array_merge($source, ['is_trusted' => true, 'is_active' => true])
            );
        }
    }
}
