<?php

namespace Tests\Unit;

use App\Services\Seo\SeoBuilder;
use Tests\TestCase;

class SeoBuilderExpertCalculatorsTest extends TestCase
{
    public function test_ask_expert_seo_targets_angola_search_intent(): void
    {
        $seo = app(SeoBuilder::class)->forAskExpert();

        $this->assertStringContainsString('Pergunte ao Especialista Angola', $seo['title']);
        $this->assertStringContainsString('dúvidas fiscais', strtolower($seo['description']));
        $this->assertStringContainsString('dúvidas fiscais Angola', $seo['keywords']);
        $this->assertStringContainsString('perguntas AGT', $seo['keywords']);
        $this->assertStringEndsWith('/pergunte-ao-especialista', $seo['canonical']);

        $types = collect($seo['json_ld'])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('Service', $types);
    }

    public function test_calculators_seo_targets_tax_keywords(): void
    {
        $seo = app(SeoBuilder::class)->forCalculators();

        $this->assertStringContainsString('Calculadora IVA e IRT Angola', $seo['title']);
        $this->assertStringContainsString('calculadora IVA Angola', $seo['keywords']);
        $this->assertStringContainsString('calculadora IRT Angola 2026', $seo['keywords']);
        $this->assertStringEndsWith('/calculadoras', $seo['canonical']);

        $types = collect($seo['json_ld'])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('WebApplication', $types);
    }
}
