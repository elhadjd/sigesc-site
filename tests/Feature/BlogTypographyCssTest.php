<?php

namespace Tests\Feature;

use Tests\TestCase;

class BlogTypographyCssTest extends TestCase
{
    public function test_global_css_no_longer_crushes_all_headings(): void
    {
        $css = file_get_contents(resource_path('css/app.css'));

        $this->assertIsString($css);
        $this->assertStringNotContainsString('font-size: 17px !important', $css);
        $this->assertStringContainsString('.blog-prose', $css);
        $this->assertStringContainsString('.blog-display', $css);
        $this->assertStringContainsString('text-decoration: underline', $css);
    }
}
