<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Services\Seo\SeoBuilder;
use Carbon\Carbon;
use Tests\TestCase;

class SeoBuilderTest extends TestCase
{
    public function test_for_post_builds_article_json_ld(): void
    {
        $post = new Post([
            'title' => 'AGT e faturação eletrónica em Angola',
            'meta_title' => 'AGT Faturação Eletrónica',
            'slug' => 'agt-faturacao-eletronica',
            'excerpt' => 'Guia prático para PME.',
            'meta_description' => 'Guia prático AGT para PME em Angola.',
            'content' => '<p>Conteúdo completo sobre compliance fiscal e software de gestão.</p>',
            'image' => '/img/sigesc capa.png',
            'media' => [
                [
                    'type' => 'video',
                    'url' => 'https://www.youtube.com/watch?v=abc123',
                    'embed_url' => 'https://www.youtube.com/embed/abc123',
                    'title' => 'Vídeo AGT',
                ],
            ],
            'category' => 'Faturação Eletrónica',
            'author_name' => 'Equipa SIGESC',
            'tags' => ['AGT', 'Angola'],
            'publish_date' => Carbon::parse('2026-07-18'),
        ]);
        $post->updated_at = Carbon::parse('2026-07-18 10:00:00');

        $seo = (new SeoBuilder())->forPost($post);

        $this->assertStringContainsString('AGT', $seo['title']);
        $this->assertSame('article', $seo['og_type']);
        $this->assertNotEmpty($seo['json_ld']);
        $this->assertSame('BlogPosting', $seo['json_ld'][0]['@type']);
    }
}
