<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConferencesModulePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_conferences_is_listed_in_module_catalog(): void
    {
        $slugs = collect(config('sigesc_modules'))->pluck('slug');
        $this->assertTrue($slugs->contains('chamadas-e-conferencias'));
    }

    public function test_conference_media_resolves_images(): void
    {
        $shots = \App\Support\ConferenceMedia::all();

        $this->assertNotEmpty($shots);
        $this->assertSame('/img/conferencias/hero.jpg', \App\Support\ConferenceMedia::heroSrc());
        $this->assertContains('link', collect($shots)->pluck('key')->all());
        $this->assertContains('gravacao', collect($shots)->pluck('key')->all());
    }

    public function test_seo_builder_for_conferences_has_faq_and_software_schema(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forConferences();

        $this->assertStringContainsString('Conferências', $seo['title']);
        $this->assertStringContainsString('/modules/chamadas-e-conferencias', $seo['canonical']);
        $this->assertStringContainsString('videoconferência', mb_strtolower($seo['description']));

        $types = collect($seo['json_ld'] ?? [])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('SoftwareApplication', $types);
    }

    public function test_alias_routes_resolve_to_conferences_page(): void
    {
        foreach (['/modules/conferencias', '/modules/chamadas'] as $path) {
            $this->get($path)->assertOk()->assertInertia(fn ($page) => $page
                ->component('modules/conferencias')
                ->where('module.slug', 'chamadas-e-conferencias')
            );
        }
    }
}
