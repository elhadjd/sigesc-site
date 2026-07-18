<?php

namespace Tests\Feature;

use App\Models\AiContent\Article;
use App\Models\AiContent\AiJob;
use App\Models\AiContent\Category;
use App\Models\AiContent\ResearchFinding;
use App\Models\AiContent\ResearchLog;
use App\Models\AiContent\ResearchResult;
use App\Models\AiContent\ResearchSetting;
use App\Models\User;
use App\Services\AiContentEngine\Agents\FactCheckerAgent;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use App\Services\AiContentEngine\Agents\ResearchAgent;
use App\Services\AiContentEngine\Research\HybridResearchEngine;
use App\Services\AiContentEngine\Research\Providers\DuckDuckGoResearchProvider;
use App\Services\AiContentEngine\Research\Providers\InternalKnowledgeProvider;
use App\Services\AiContentEngine\Research\Providers\NewsSearchProvider;
use App\Services\AiContentEngine\Research\Providers\OfficialSourcesProvider;
use App\Services\AiContentEngine\Research\Providers\TavilyResearchProvider;
use App\Services\AiContentEngine\Research\TrustScorer;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Database\Seeders\AiContentEngineSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Mockery;
use Tests\TestCase;

class HybridResearchEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Http::fake([
            '*' => Http::response('<html><body>IVA Angola regulamentação AGT</body></html>', 200),
        ]);
    }

    public function test_seeder_creates_priority_official_sources_and_settings(): void
    {
        $this->seed(AiContentEngineSeeder::class);

        foreach ([
            'agt.minfin.gov.ao',
            'minfin.gov.ao',
            'diario.gov.ao',
            'bna.ao',
            'inapem.gov.ao',
            'governo.gov.ao',
        ] as $domain) {
            $this->assertDatabaseHas('research_sources', [
                'domain' => $domain,
                'category' => 'official',
                'trust_score' => 100,
                'is_active' => 1,
            ]);
        }

        $this->assertSame(30, (int) ResearchSetting::getValue('cache_days'));
        $this->assertTrue((bool) ResearchSetting::getValue('tavily_enabled'));
    }

    public function test_hybrid_engine_persists_findings_logs_and_summary(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        ResearchSetting::setValue('tavily_enabled', false);
        ResearchSetting::setValue('news_enabled', false);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')->andReturn([
            'topic' => 'Como funciona o IVA em Angola',
            'main_points' => ['IVA é imposto sobre o valor acrescentado.'],
            'important_dates' => [],
            'numbers' => ['14%'],
            'laws' => ['Código do IVA'],
            'changes' => [],
            'sources' => [['title' => 'AGT', 'url' => 'https://agt.minfin.gov.ao', 'trust_score' => 100]],
            'confidence_level' => 88,
            'warnings' => [],
        ]);

        $engine = new HybridResearchEngine(
            app(OfficialSourcesProvider::class),
            app(TavilyResearchProvider::class),
            app(NewsSearchProvider::class),
            app(InternalKnowledgeProvider::class),
            app(DuckDuckGoResearchProvider::class),
            app(TrustScorer::class),
            $llm
        );

        $result = $engine->research('Como funciona o IVA em Angola');

        $this->assertFalse($result['from_cache']);
        $this->assertNotEmpty($result['findings']);
        $this->assertGreaterThanOrEqual(90, $result['avg_trust_score']);
        $this->assertSame('Como funciona o IVA em Angola', $result['summary']['topic']);
        $this->assertDatabaseCount('research_results', count($result['findings']));
        $this->assertDatabaseHas('research_logs', [
            'agent' => 'AIResearchAgent',
            'action' => 'hybrid_research',
            'status' => 'ok',
        ]);

        $cached = $engine->research('Como funciona o IVA em Angola');
        $this->assertTrue($cached['from_cache']);
    }

    public function test_research_agent_keeps_pipeline_contract(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        ResearchSetting::setValue('tavily_enabled', false);
        ResearchSetting::setValue('news_enabled', false);

        $category = Category::first();
        $article = Article::create([
            'title' => 'Como funciona o IVA em Angola',
            'slug' => 'como-funciona-iva-angola',
            'status' => Article::STATUS_DISCOVERED,
            'category_id' => $category->id,
            'focus_keyword' => 'IVA Angola',
            'author_name' => 'Equipa',
            'author_role' => 'AI',
            'author_avatar' => '/img/sigesc capa.png',
        ]);

        $job = AiJob::create([
            'type' => 'pipeline',
            'status' => 'running',
            'article_id' => $article->id,
            'started_at' => now(),
        ]);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')->andReturn([
            'topic' => 'IVA Angola',
            'main_points' => ['Taxa geral aplicável às operações tributáveis.'],
            'important_dates' => [],
            'numbers' => [],
            'laws' => [],
            'changes' => [],
            'sources' => [],
            'confidence_level' => 80,
            'warnings' => [],
        ]);

        $this->app->instance(LlmGateway::class, $llm);

        $output = app(ResearchAgent::class)->handle($article->fresh(), $job);

        $this->assertArrayHasKey('research', $output);
        $this->assertArrayHasKey('facts', $output['research']);
        $this->assertArrayHasKey('research_summary', $output['research']);
        $this->assertNotNull($article->fresh()->pipeline_meta['research'] ?? null);
    }

    public function test_publisher_blocks_unverified_articles(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        $category = Category::first();

        $article = Article::create([
            'title' => 'Artigo sem fontes',
            'slug' => 'artigo-sem-fontes',
            'status' => Article::STATUS_DRAFT,
            'category_id' => $category->id,
            'content_html' => '<p>Afirmação sem fonte</p>',
            'fact_check_status' => FactCheckerAgent::STATUS_NEEDS_REVIEW,
            'needs_human_review' => true,
            'author_name' => 'Equipa',
            'author_role' => 'AI',
            'author_avatar' => '/img/sigesc capa.png',
        ]);

        $job = AiJob::create([
            'type' => 'pipeline',
            'status' => 'running',
            'article_id' => $article->id,
            'started_at' => now(),
        ]);

        config(['ai_content_engine.pipeline.require_fact_check' => true]);
        config(['ai_content_engine.pipeline.auto_publish' => true]);

        $result = app(PublisherAgent::class)->handle($article, $job);

        $this->assertFalse($result['published']);
        $this->assertSame(FactCheckerAgent::STATUS_NEEDS_REVIEW, $result['fact_check_status']);
        $this->assertSame(Article::STATUS_NEEDS_REVIEW, $article->fresh()->status);
    }

    public function test_admin_research_settings_page_and_update(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        config(['ai_content_engine.admin_emails' => []]);
        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->get('/admin/ai-content/research-settings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/ai-content/research-settings')
                ->has('settings')
                ->has('sources')
            );

        $this->actingAs($user)
            ->put('/admin/ai-content/research-settings', [
                'tavily_enabled' => false,
                'news_enabled' => true,
                'internal_knowledge_enabled' => true,
                'max_sources' => 8,
                'min_trust_score' => 60,
                'cache_days' => 15,
            ])
            ->assertRedirect();

        $this->assertFalse((bool) ResearchSetting::getValue('tavily_enabled'));
        $this->assertSame(15, (int) ResearchSetting::getValue('cache_days'));
        $this->assertSame(60, (int) ResearchSetting::getValue('min_trust_score'));
    }

    public function test_research_test_command_is_registered(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        ResearchSetting::setValue('tavily_enabled', false);
        ResearchSetting::setValue('news_enabled', false);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')->andReturn([
            'topic' => 'IVA',
            'main_points' => ['Ponto'],
            'important_dates' => [],
            'numbers' => [],
            'laws' => [],
            'changes' => [],
            'sources' => [],
            'confidence_level' => 70,
            'warnings' => [],
        ]);
        $this->app->instance(LlmGateway::class, $llm);

        $this->artisan('research:test', ['topic' => 'Como funciona o IVA em Angola'])
            ->assertSuccessful();

        $this->assertTrue(ResearchResult::query()->where('topic', 'Como funciona o IVA em Angola')->exists());
        $this->assertTrue(ResearchFinding::query()->where('topic', 'Como funciona o IVA em Angola')->exists());
        $this->assertTrue(ResearchLog::query()->where('action', 'hybrid_research')->exists());
    }
}
