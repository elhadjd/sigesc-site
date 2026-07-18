<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Research\TavilyClient;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TavilyClientTest extends TestCase
{
    public function test_configured_requires_api_key(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => null,
        ]);

        $this->assertFalse(app(TavilyClient::class)->configured());
    }

    public function test_search_for_content_single_call_when_credit_saver(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test-key',
            'ai_content_engine.tavily.base_url' => 'https://api.tavily.com',
            'ai_content_engine.trusted_domains' => ['agt.minfin.gov.ao'],
            'ai_content_engine.credit_saver.single_search' => true,
        ]);

        Http::fake([
            'api.tavily.com/*' => Http::response([
                'answer' => 'IVA em Angola',
                'results' => [
                    [
                        'title' => 'Artigo complementar',
                        'url' => 'https://example.com/iva-angola',
                        'content' => 'Contexto adicional',
                        'score' => 0.7,
                    ],
                    [
                        'title' => 'AGT IVA',
                        'url' => 'https://agt.minfin.gov.ao/iva',
                        'content' => 'Informação oficial AGT',
                        'score' => 0.9,
                    ],
                ],
            ], 200),
        ]);

        $data = app(TavilyClient::class)->searchForContent('IVA Angola', 8, 'general');

        Http::assertSentCount(1);
        $this->assertSame('IVA em Angola', $data['answer']);
        $this->assertCount(2, $data['results']);
        $this->assertSame('https://agt.minfin.gov.ao/iva', $data['results'][0]['url']);
        $this->assertTrue($data['results'][0]['_preferred_domain'] ?? false);
    }

    public function test_search_for_content_merges_trusted_and_open_results_when_dual_mode(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test-key',
            'ai_content_engine.tavily.base_url' => 'https://api.tavily.com',
            'ai_content_engine.trusted_domains' => ['agt.minfin.gov.ao'],
            'ai_content_engine.credit_saver.single_search' => false,
        ]);

        Http::fake([
            'api.tavily.com/*' => Http::sequence()
                ->push([
                    'answer' => 'IVA em Angola',
                    'results' => [
                        [
                            'title' => 'AGT IVA',
                            'url' => 'https://agt.minfin.gov.ao/iva',
                            'content' => 'Informação oficial AGT',
                            'score' => 0.9,
                        ],
                    ],
                ], 200)
                ->push([
                    'answer' => null,
                    'results' => [
                        [
                            'title' => 'Artigo complementar',
                            'url' => 'https://example.com/iva-angola',
                            'content' => 'Contexto adicional',
                            'score' => 0.7,
                        ],
                    ],
                ], 200),
        ]);

        $data = app(TavilyClient::class)->searchForContent('IVA Angola', 8, 'general');

        $this->assertSame('IVA em Angola', $data['answer']);
        $this->assertCount(2, $data['results']);
        $this->assertSame('https://agt.minfin.gov.ao/iva', $data['results'][0]['url']);
        $this->assertTrue($data['results'][0]['_preferred_domain'] ?? false);
    }

    public function test_normalize_research_model_rejects_openai_names(): void
    {
        config(['ai_content_engine.tavily.research_model' => 'mini']);

        $client = app(TavilyClient::class);

        $this->assertSame('mini', $client->normalizeResearchModel('gpt-4o-mini'));
        $this->assertSame('mini', $client->normalizeResearchModel('OPENAI_REVIEW_MODEL'));
        $this->assertSame('pro', $client->normalizeResearchModel('pro'));
        $this->assertSame('auto', $client->normalizeResearchModel('auto'));
        $this->assertSame('mini', $client->normalizeResearchModel(null));
    }
}
