<?php

namespace Tests\Feature;

use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\Chat\ChatAssistantService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ChatAssistantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Mail::fake();
        Event::fake([\App\Events\ChatEvent::class]);
        config([
            'chat_assistant.enabled' => true,
            'chat_assistant.llm_provider' => 'deepseek',
            'chat_assistant.whatsapp.digits' => '244929147445',
            'chat_assistant.whatsapp.display' => '+244 929 147 445',
            'chat_assistant.whatsapp.url' => 'https://wa.me/244929147445',
            'ai_content_engine.deepseek.api_key' => 'sk-test',
            'ai_content_engine.deepseek.base_url' => 'https://api.deepseek.com',
            'ai_content_engine.deepseek.model' => 'deepseek-v4-flash',
        ]);
    }

    public function test_new_chat_welcome_includes_whatsapp_link(): void
    {
        $response = $this->getJson('/new-chat');

        $response->assertOk();
        $session = $response->json('session');
        $this->assertNotEmpty($session);

        $welcome = (string) data_get($response->json('data.conversations.0'), 'message');
        $this->assertStringContainsString('wa.me/244929147445', $welcome);
        $this->assertStringContainsString('929', $welcome);
        $this->assertStringContainsString('assistente', mb_strtolower($welcome));

        $this->assertStringContainsString(
            'wa.me/244929147445',
            (string) data_get($response->json('assistant.whatsapp'), 'url')
        );
    }

    public function test_user_message_gets_assistant_reply_from_deepseek(): void
    {
        Http::fake([
            'api.deepseek.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'O SIGESC é software de faturação certificado AGT FE/323/AGT/2026. Pode experimentar em https://admin.sisgesc.net/getting-started',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $start = $this->getJson('/new-chat')->assertOk();
        $session = $start->json('session');

        $response = $this->postJson('/chat-conversation/'.$session, [
            'message' => 'O que é o SIGESC?',
            'session' => $session,
            'user' => 'user',
        ]);

        $response->assertOk()
            ->assertJsonPath('type', 'success');

        $this->assertNotEmpty($response->json('user_message.message'));
        $assistant = (string) $response->json('assistant_message.message');
        $this->assertStringContainsString('SIGESC', $assistant);
        $this->assertStringContainsString('AGT', $assistant);

        $this->assertDatabaseCount('chat_conversations', 3); // welcome + user + assistant
    }

    public function test_fallback_when_llm_unavailable(): void
    {
        config(['ai_content_engine.deepseek.api_key' => null]);

        $start = $this->getJson('/new-chat')->assertOk();
        $session = $start->json('session');

        $response = $this->postJson('/chat-conversation/'.$session, [
            'message' => 'Preciso de suporte',
            'session' => $session,
            'user' => 'user',
        ]);

        $response->assertOk();
        $assistant = (string) $response->json('assistant_message.message');
        $this->assertStringContainsString('wa.me/244929147445', $assistant);
    }

    public function test_chat_assistant_system_prompt_mentions_products(): void
    {
        $service = app(ChatAssistantService::class);
        $ref = new \ReflectionClass($service);
        $method = $ref->getMethod('systemPrompt');
        $method->setAccessible(true);
        $prompt = (string) $method->invoke($service);

        $this->assertStringContainsString('clinic.sisgesc.net', $prompt);
        $this->assertStringContainsString('hub.sisgesc.net', $prompt);
        $this->assertStringContainsString('FE/323/AGT/2026', $prompt);
        $this->assertStringContainsString('244929147445', $prompt);
    }

    public function test_llm_gateway_chat_text_uses_deepseek(): void
    {
        Http::fake([
            'api.deepseek.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Resposta de teste']],
                ],
            ], 200),
        ]);

        $text = app(LlmGateway::class)->chatText([
            ['role' => 'user', 'content' => 'Olá'],
        ], null, 0.2, 'deepseek');

        $this->assertSame('Resposta de teste', $text);
        Http::assertSent(function ($request) {
            $data = $request->data();

            return str_contains($request->url(), 'chat/completions')
                && ! array_key_exists('response_format', $data);
        });
    }
}
