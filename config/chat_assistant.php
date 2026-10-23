<?php

/**
 * Assistente de chat do site (DeepSeek + WhatsApp).
 */
$agt = env('SIGESC_AGT_CERT_NUMBER', 'FE/323/AGT/2026');
$site = rtrim(env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/');
$admin = rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/');
$whatsappDigits = preg_replace('/\D+/', '', (string) env('SIGESC_WHATSAPP', '244929147445')) ?: '244929147445';
$whatsappDisplay = env('SIGESC_WHATSAPP_DISPLAY', '+244 929 147 445');

return [

    'enabled' => (bool) env('SIGESC_CHAT_ASSISTANT_ENABLED', true),

    'llm_provider' => env('SIGESC_CHAT_LLM_PROVIDER', 'deepseek'),

    'model' => env('SIGESC_CHAT_MODEL', env('DEEPSEEK_MODEL', 'deepseek-v4-flash')),

    'temperature' => (float) env('SIGESC_CHAT_TEMPERATURE', 0.35),

    'max_history' => (int) env('SIGESC_CHAT_MAX_HISTORY', 16),

    'whatsapp' => [
        'digits' => $whatsappDigits,
        'display' => $whatsappDisplay,
        'url' => 'https://wa.me/'.$whatsappDigits,
        'prefill' => 'Olá, vim do site sisgesc.net e gostava de falar com a equipa SIGESC.',
    ],

    'welcome' => "Olá! Sou o assistente SIGESC — posso ajudar com faturação eletrónica AGT ({$agt}), PDV, stock, preços, Hospitalar, HUB e os módulos do software.\n\n"
        ."Se preferir atendimento humano no WhatsApp: {$whatsappDisplay}\n"
        .'https://wa.me/'.$whatsappDigits,

    'fallback_reply' => "Obrigado pela mensagem. Neste momento o assistente automático está temporariamente indisponível.\n\n"
        ."Fale connosco no WhatsApp {$whatsappDisplay}:\n"
        .'https://wa.me/'.$whatsappDigits."\n\n"
        ."Ou peça demonstração em {$site}/contact — trial em {$admin}/getting-started.",

    'notify_email' => env('SIGESC_CHAT_NOTIFY_EMAIL', 'comercial.sigesc@gmail.com'),

];
