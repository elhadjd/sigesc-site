<?php

namespace Tests\Feature;

use App\Jobs\AiContent\AnswerExpertQuestion;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\AskExpertService;
use App\Services\AiContentEngine\Research\HybridResearchEngine;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Mockery;
use Tests\TestCase;

class AskExpertDeepSeekTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_still_queues_job(): void
    {
        Queue::fake();

        $response = $this->post('/pergunte-ao-especialista', [
            'question' => 'Como registar IVA na AGT?',
            'asker_name' => 'Ana',
            'asker_email' => 'ana@example.com',
        ]);

        $question = ExpertQuestion::first();
        $this->assertNotNull($question);
        $response->assertRedirect(route('ask-expert.show', $question->uuid));
        Queue::assertPushed(AnswerExpertQuestion::class);
    }

    public function test_ask_expert_skips_tavily_and_calls_deepseek(): void
    {
        Mail::fake();
        Http::fake();

        config([
            'ai_content_engine.ask_expert.llm_provider' => 'deepseek',
            'ai_content_engine.ask_expert.use_tavily_search' => false,
            'ai_content_engine.ask_expert.use_duckduckgo' => true,
            'ai_content_engine.deepseek.api_key' => 'sk-deepseek',
            'ai_content_engine.deepseek.base_url' => 'https://api.deepseek.com',
            'ai_content_engine.deepseek.model' => 'deepseek-chat',
            'ai_content_engine.tavily.api_key' => 'tvly-should-not-be-used',
            'ai_content_engine.tavily.enabled' => true,
        ]);

        $research = Mockery::mock(HybridResearchEngine::class);
        $research->shouldReceive('research')
            ->once()
            ->withArgs(function (string $topic, $article, bool $force, array $options) {
                return str_contains($topic, 'IVA')
                    && ($options['skip_tavily'] ?? false) === true
                    && ($options['use_duckduckgo'] ?? false) === true;
            })
            ->andReturn([
                'topic' => 'IVA',
                'from_cache' => false,
                'findings' => [
                    [
                        'title' => 'AGT IVA',
                        'url' => 'https://agt.minfin.gov.ao',
                        'snippet' => 'Informação sobre IVA em Angola.',
                        'trust_score' => 100,
                        'provider' => 'official',
                    ],
                ],
                'summary' => ['topic' => 'IVA', 'main_points' => ['Consultar AGT']],
                'avg_trust_score' => 100,
                'providers' => ['official', 'duckduckgo', 'internal'],
                'execution_time_ms' => 10,
                'session' => null,
            ]);
        $this->app->instance(HybridResearchEngine::class, $research);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('isProviderReady')->with('deepseek')->andReturn(true);
        $llm->shouldReceive('chatJson')
            ->once()
            ->withArgs(function (array $messages, $model, float $temp, $outputLength, $provider) {
                $system = $messages[0]['content'] ?? '';

                return $provider === 'deepseek'
                    && $temp <= 0.25
                    && str_contains($system, 'ANTI-ALUCINAÇÃO')
                    && str_contains($system, 'Nunca inventes');
            })
            ->andReturn([
                'answer_html' => '<h2>IVA</h2><p>Consulte a AGT. (fonte: https://agt.minfin.gov.ao)</p><p>SIGESC ajuda na faturação.</p>',
                'quality_score' => 88,
                'should_become_article' => false,
                'suggested_title' => 'IVA na AGT',
                'category' => 'IVA',
                'keywords' => ['IVA', 'AGT'],
                'summary' => 'Guia IVA',
            ]);
        $this->app->instance(LlmGateway::class, $llm);

        $question = ExpertQuestion::create([
            'question' => 'Como registar IVA na AGT?',
            'asker_name' => 'Ana',
            'asker_email' => 'ana@example.com',
            'status' => 'queued',
        ]);

        $result = app(AskExpertService::class)->processQueued($question->id);

        $this->assertSame('answered', $result->status);
        $this->assertStringContainsString('AGT', (string) $result->answer_html);
        $this->assertSame(['official', 'duckduckgo', 'internal'], $result->research['providers'] ?? null);

        Http::assertNothingSent();
    }
}
