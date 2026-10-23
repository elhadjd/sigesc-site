<?php

namespace App\Services\Chat;

use App\Models\Chat;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Facades\Log;
use Throwable;

class ChatAssistantService
{
    public function __construct(
        protected LlmGateway $llm
    ) {}

    public function welcomeMessage(): string
    {
        return (string) config('chat_assistant.welcome');
    }

    public function whatsappUrl(): string
    {
        $cfg = config('chat_assistant.whatsapp', []);
        $url = (string) ($cfg['url'] ?? 'https://wa.me/244929147445');
        $prefill = trim((string) ($cfg['prefill'] ?? ''));

        if ($prefill === '') {
            return $url;
        }

        return $url.'?text='.rawurlencode($prefill);
    }

    public function whatsappDisplay(): string
    {
        return (string) config('chat_assistant.whatsapp.display', '+244 929 147 445');
    }

    /**
     * @return array{display: string, url: string, digits: string}
     */
    public function whatsappPayload(): array
    {
        return [
            'display' => $this->whatsappDisplay(),
            'url' => $this->whatsappUrl(),
            'digits' => (string) config('chat_assistant.whatsapp.digits', '244929147445'),
        ];
    }

    public function reply(Chat $chat, string $userMessage): string
    {
        if (! (bool) config('chat_assistant.enabled', true)) {
            return (string) config('chat_assistant.fallback_reply');
        }

        $provider = strtolower((string) config('chat_assistant.llm_provider', 'deepseek'));
        if (! $this->llm->isProviderReady($provider)) {
            $provider = null;
        }

        if ($provider === null && ! $this->llm->configured()) {
            return (string) config('chat_assistant.fallback_reply');
        }

        try {
            $historyLimit = max(4, (int) config('chat_assistant.max_history', 16));
            $history = $chat->conversations()
                ->orderByDesc('id')
                ->limit($historyLimit)
                ->get()
                ->reverse()
                ->values();

            $messages = [
                ['role' => 'system', 'content' => $this->systemPrompt()],
            ];

            foreach ($history as $row) {
                $text = trim((string) $row->message);
                if ($text === '' || $text === 'End of chat.') {
                    continue;
                }
                $role = ($row->user === 'support') ? 'assistant' : 'user';
                $messages[] = ['role' => $role, 'content' => $text];
            }

            // Ensure the latest user turn is present even if history race.
            $last = end($messages);
            if (! is_array($last) || ($last['role'] ?? '') !== 'user' || ($last['content'] ?? '') !== trim($userMessage)) {
                $messages[] = ['role' => 'user', 'content' => trim($userMessage)];
            }

            return $this->llm->chatText(
                $messages,
                (string) config('chat_assistant.model'),
                (float) config('chat_assistant.temperature', 0.35),
                $provider
            );
        } catch (Throwable $e) {
            Log::warning('Chat assistant LLM failed: '.$e->getMessage());

            return (string) config('chat_assistant.fallback_reply');
        }
    }

    protected function systemPrompt(): string
    {
        $agt = (string) config('geo.certification.number', config('sigesc.agt_certification.number', 'FE/323/AGT/2026'));
        $site = rtrim((string) config('sigesc.site_url', 'https://sisgesc.net'), '/');
        $admin = rtrim((string) config('sigesc.admin_url', 'https://admin.sisgesc.net'), '/');
        $clinic = rtrim((string) config('sigesc.clinic_url', 'https://clinic.sisgesc.net'), '/');
        $hub = rtrim((string) config('sigesc.hub_url', 'https://hub.sisgesc.net'), '/');
        $marketplace = rtrim((string) config('sigesc.marketplace_home_url', 'https://marketplace.sisgesc.net/marketplace'), '/');
        $waDisplay = $this->whatsappDisplay();
        $waUrl = $this->whatsappUrl();
        $partnerPrice = (string) config('geo.partnership.price_formatted', '40.000 Kz');
        $commission = (int) data_get(config('geo.partnership'), 'freelancer.commission_percent', 30);

        $capabilities = collect(config('geo.capabilities', []))
            ->map(fn ($c) => '- '.$c)
            ->implode("\n");

        $modules = collect(config('sigesc_modules', []))
            ->map(fn ($m) => '- '.($m['name'] ?? '').': '.($m['description'] ?? '').' ('.$site.'/modules/'.($m['slug'] ?? '').')')
            ->implode("\n");

        $facts = collect(config('geo.facts', []))
            ->take(18)
            ->map(fn ($f) => '- '.$f)
            ->implode("\n");

        return <<<PROMPT
És o assistente oficial do SIGESC no site {$site}. Respondes em português de Angola, de forma clara, útil e profissional.

IDENTIDADE
- Produto principal: SIGESC — software de faturação e gestão comercial para PME em Angola.
- Certificação AGT (faturação eletrónica): n.º {$agt}.
- Domínio do site: sisgesc.net (nunca digas "sigesc.net").
- Painel / trial: {$admin}/getting-started
- Login clientes: {$admin}/auth/login

OUTROS PRODUTOS DO ECOSSISTEMA
- SIGESC Hospitalar (clínicas e hospitais): {$clinic} — página {$site}/produtos/hospitalar — teste 3 dias.
- SIGESC HUB (multiempresa + contabilidade): {$hub} — página {$site}/produtos/hub.
- Marketplace local: {$marketplace} — página {$site}/modules/marketplace.
- Catálogo de produtos: {$site}/produtos

PARCERIA
- Parceiro: {$partnerPrice}/mês com licenças ilimitadas — {$site}/parceria
- Freelancer: {$commission}% de comissão por indicação

CAPACIDADES / MÓDULOS
{$capabilities}

DETALHE DOS MÓDULOS NO SITE
{$modules}

FACTOS ÚTEIS
{$facts}

WHATSAPP (atendimento humano)
- Número: {$waDisplay}
- Link directo: {$waUrl}
- Quando o visitante pedir preço personalizado, demonstração, suporte urgente, implementação, ou disser que quer falar com uma pessoa, oferece o WhatsApp com o link completo.
- Em respostas longas sobre compra/adesão, podes mencionar o WhatsApp uma vez de forma natural.

REGRAS
1) Responde só sobre SIGESC, produtos do ecossistema, faturação/gestão em Angola e tópicos comerciais relacionados.
2) Não inventes preços de planos que não conheças; orienta para {$site}/prices, {$site}/parceria ou WhatsApp.
3) Não inventes leis, taxas ou números oficiais; se não souberes, diz e sugere AGT / contacto.
4) Mensagens curtas a médias (ideal 2–6 frases ou lista breve). Usa quebras de linha.
5) Inclui URLs completas https:// quando fores útil (trial, produtos, parceria, WhatsApp).
6) Não digas que és ChatGPT; és o assistente SIGESC.
7) Se a pergunta for fora do âmbito, redireciona educadamente e oferece WhatsApp.
PROMPT;
    }
}
