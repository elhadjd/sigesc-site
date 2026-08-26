<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrmModulePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_crm_is_listed_in_module_catalog(): void
    {
        $slugs = collect(config('sigesc_modules'))->pluck('slug');
        $this->assertTrue($slugs->contains('crm'));
    }

    public function test_crm_screenshots_resolve_short_aliases(): void
    {
        $shots = \App\Support\CrmScreenshots::all();

        $this->assertNotEmpty($shots);
        $this->assertSame('/img/crm/painel.png', \App\Support\CrmScreenshots::heroSrc());
        $this->assertContains('pipeline', collect($shots)->pluck('key')->all());
        $this->assertContains('whatsapp', collect($shots)->pluck('key')->all());
    }

    public function test_seo_builder_for_crm_has_faq_and_software_schema(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forCrm();

        $this->assertStringContainsString('CRM', $seo['title']);
        $this->assertStringContainsString('/modules/crm', $seo['canonical']);
        $this->assertStringContainsString('WhatsApp', $seo['description']);

        $types = collect($seo['json_ld'] ?? [])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('SoftwareApplication', $types);
    }
}
