<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicLoginLinksTest extends TestCase
{
    public function test_ask_expert_copy_avoids_queue_jargon_for_visitors(): void
    {
        $response = $this->get('/pergunte-ao-especialista');

        $response->assertOk();
        $response->assertDontSee('A enviar para a fila', false);
        $response->assertDontSee('processamento corre em fila', false);
        $response->assertDontSee('segundo plano (fila)', false);
        $response->assertDontSee('A processar na fila', false);
    }

    public function test_public_entrar_links_use_admin_login_url(): void
    {
        $this->assertSame('https://admin.sisgesc.net/auth/login', config('sigesc.admin_login_url'));

        $header = file_get_contents(resource_path('js/Components/home/Header.tsx'));
        $footer = file_get_contents(resource_path('js/Components/home/Footer.tsx'));

        $this->assertStringContainsString('SIGESC_ADMIN_LOGIN_URL', (string) $header);
        $this->assertStringContainsString('SIGESC_ADMIN_LOGIN_URL', (string) $footer);
        $this->assertStringNotContainsString('href="/auth"', (string) $header);
        $this->assertStringNotContainsString('href={`/auth`}', (string) $footer);
    }
}
