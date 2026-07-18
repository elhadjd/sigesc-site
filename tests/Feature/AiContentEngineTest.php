<?php

namespace Tests\Feature;

use App\Jobs\AiContent\RunDailyContentPipeline;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Models\User;
use Database\Seeders\AiContentEngineSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Tests\TestCase;

class AiContentEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        // Override .env allowlist so tests can open the admin UI.
        config(['ai_content_engine.admin_emails' => []]);
    }

    public function test_seeder_creates_categories_and_trusted_sources(): void
    {
        $this->seed(AiContentEngineSeeder::class);

        $this->assertDatabaseHas('ai_categories', ['name' => 'AGT']);
        $this->assertDatabaseHas('ai_categories', ['name' => 'ERP']);
        $this->assertDatabaseHas('research_sources', [
            'domain' => 'agt.minfin.gov.ao',
            'is_trusted' => 1,
        ]);
    }

    public function test_ask_expert_page_is_public(): void
    {
        $this->get('/pergunte-ao-especialista')->assertOk();
    }

    public function test_ask_expert_validates_question(): void
    {
        $this->post('/pergunte-ao-especialista', [
            'question' => 'curta',
        ])->assertSessionHasErrors('question');
    }

    public function test_admin_dashboard_requires_auth(): void
    {
        $this->get('/admin/ai-content')->assertRedirect(route('auth', ['local' => 'en']));
    }

    public function test_admin_can_view_dashboard_in_local_without_allowlist(): void
    {
        $user = User::factory()->create([
            'email' => 'editor@example.com',
        ]);

        $this->actingAs($user)
            ->get('/admin/ai-content')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/ai-content/dashboard')->has('stats'));
    }

    public function test_article_show_in_admin(): void
    {
        $this->seed(AiContentEngineSeeder::class);
        $category = Category::first();

        $article = Article::create([
            'title' => 'IVA e faturação eletrónica em Angola',
            'slug' => 'iva-faturacao-eletronica-angola',
            'status' => Article::STATUS_NEEDS_REVIEW,
            'category_id' => $category->id,
            'excerpt' => 'Guia para PME',
            'content_html' => '<p>Conteúdo</p>',
            'author_name' => 'Equipa',
            'author_role' => 'AI',
            'author_avatar' => '/img/sigesc capa.png',
            'needs_human_review' => true,
        ]);

        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->get('/admin/ai-content/articles/'.$article->id)
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/ai-content/show')
                ->where('article.slug', 'iva-faturacao-eletronica-angola')
            );
    }

    public function test_config_exposes_agent_pipeline_settings(): void
    {
        $this->assertTrue(config('ai_content_engine.pipeline.require_fact_check'));
        $this->assertContains('AGT', config('ai_content_engine.categories'));
        $this->assertContains('agt.minfin.gov.ao', config('ai_content_engine.trusted_domains'));
        $this->assertSame('auto', config('ai_content_engine.llm.provider'));
    }

    public function test_run_daily_blocks_without_tavily_or_openai(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => null,
            'ai_content_engine.openai.api_key' => null,
            'ai_content_engine.llm.provider' => 'auto',
        ]);

        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->from('/admin/ai-content')
            ->post('/admin/ai-content/run-daily')
            ->assertRedirect('/admin/ai-content')
            ->assertSessionHas('error');
    }

    public function test_run_daily_returns_json_for_axios(): void
    {
        Bus::fake();

        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.openai.api_key' => null,
            'ai_content_engine.llm.provider' => 'auto',
        ]);

        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->postJson('/admin/ai-content/run-daily')
            ->assertOk()
            ->assertJson([
                'ok' => true,
                'provider' => 'tavily',
            ])
            ->assertJsonPath('message', fn ($m) => str_contains((string) $m, 'Pipeline'));

        Bus::assertDispatched(RunDailyContentPipeline::class);
    }

    public function test_run_daily_json_error_without_keys(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => null,
            'ai_content_engine.openai.api_key' => null,
            'ai_content_engine.llm.provider' => 'auto',
        ]);

        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->postJson('/admin/ai-content/run-daily')
            ->assertStatus(422)
            ->assertJson([
                'ok' => false,
            ])
            ->assertJsonPath('message', fn ($m) => str_contains((string) $m, 'TAVILY_API_KEY'));
    }

    public function test_dashboard_shows_tavily_provider_status(): void
    {
        config([
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.openai.api_key' => null,
            'ai_content_engine.llm.provider' => 'auto',
        ]);

        $user = User::factory()->create(['email' => 'admin@sisgesc.net']);

        $this->actingAs($user)
            ->get('/admin/ai-content')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/ai-content/dashboard')
                ->where('config.llm_provider', 'tavily')
                ->where('config.llm_ready', true)
                ->where('config.tavily_ready', true)
                ->where('config.openai_ready', false)
            );
    }
}
