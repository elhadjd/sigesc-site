<?php

/**
 * Generative Engine Optimization (GEO) — knowledge base for AI crawlers
 * and discovery files (llms.txt, ai.txt, agents.md, etc.).
 */
$agt = env('SIGESC_AGT_CERT_NUMBER', 'FE/323/AGT/2026');
$site = rtrim(env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/');
$admin = rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/');
$partnerPrice = (int) env('SIGESC_PARTNER_MONTHLY_PRICE', 30000);

return [

    'enabled' => (bool) env('SIGESC_GEO_ENABLED', true),

    'brand' => [
        'name' => 'SIGESC',
        'legal_name' => 'SIGESC — Software de Gestão Comercial',
        'tagline' => 'Software de gestão comercial completo para PME em Angola',
        'description' => 'O SIGESC é um software de gestão comercial (ERP/PDV) para pequenas e médias empresas em Angola. Inclui faturação eletrónica certificada pela AGT, ponto de venda, stock, finanças, compras, RH, logística, loja virtual, marketing e dropshipping — em nuvem ou com versão offline (licenças limitadas para parceiros).',
        'language' => 'pt-AO',
        'locale' => 'pt_AO',
        'currency' => 'AOA',
        'currency_label' => 'Kz',
        'country' => 'Angola',
        'country_code' => 'AO',
        'primary_city' => 'Luanda',
    ],

    'urls' => [
        'site' => $site,
        'admin' => $admin,
        'trial' => $admin.'/getting-started',
        'login' => $admin.'/auth/login',
        'logo' => $admin.'/logo.png',
        'contact' => $site.'/contact',
        'partnership' => $site.'/parceria',
        'about' => $site.'/sobre',
        'prices' => $site.'/prices',
        'solutions' => $site.'/solutions',
        'blog' => $site.'/blog/posts',
        'sitemap' => $site.'/sitemap.xml',
        'feed' => $site.'/feed.xml',
    ],

    'certification' => [
        'authority' => 'AGT',
        'authority_full' => 'Administração Geral Tributária de Angola',
        'number' => $agt,
        'label' => 'Software certificado AGT',
        'scope' => 'Faturação eletrónica',
        'year' => 2026,
    ],

    'partnership' => [
        'monthly_price' => $partnerPrice,
        'price_formatted' => number_format($partnerPrice, 0, ',', '.').' Kz',
        'billing' => 'mensal',
        'offline_licenses_limited' => true,
        'summary' => 'Programa de parceria para revenda e implantação do SIGESC: '
            .number_format($partnerPrice, 0, ',', '.').' Kz/mês, com licenças limitadas para a versão offline.',
    ],

    'audiences' => [
        'PME e empresários em Angola',
        'Lojas, farmácias, restaurantes e salões',
        'Contabilistas e consultores',
        'Revendedores e parceiros de software',
        'Equipas de vendas e e-commerce',
    ],

    'capabilities' => [
        'Faturação eletrónica certificada AGT (documento fiscal eletrónico)',
        'Ponto de venda (PDV/POS) com multi-pagamentos',
        'Gestão de stock e inventário multi-armazém',
        'Fluxo de caixa e gestão financeira',
        'Compras e fornecedores',
        'Recursos humanos, ponto e folha de pagamento',
        'Logística, frota e entregas',
        'Agendamentos e marcações',
        'Marketing digital, WhatsApp e catálogos',
        'Loja virtual / e-commerce',
        'Dropshipping integrado',
        'Relatórios e dashboards comerciais',
        'Versão cloud (admin.sisgesc.net) e offline (licenças limitadas via parceria)',
    ],

    'free_tools' => [
        [
            'name' => 'Gerador de fatura online grátis',
            'url' => $site.'/gerador-de-fatura',
            'note' => 'Sem conta; nada é guardado no servidor',
        ],
        [
            'name' => 'Gerador de QR e código de barras',
            'url' => $site.'/gerador-de-codigo-barras',
            'note' => 'Com logotipo; grátis',
        ],
        [
            'name' => 'Calculadoras fiscais AGT',
            'url' => $site.'/calculadoras',
            'note' => 'IVA, IRT, Imposto Industrial, retenção',
        ],
        [
            'name' => 'Modelos de fatura',
            'url' => $site.'/modelos-de-fatura',
            'note' => 'Templates HTML para descarregar',
        ],
        [
            'name' => 'Pergunte ao Especialista',
            'url' => $site.'/pergunte-ao-especialista',
            'note' => 'Dúvidas fiscais e de gestão em Angola',
        ],
    ],

    'facts' => [
        'O domínio oficial do site é sisgesc.net (não sigesc.net).',
        'O painel de clientes e trial está em admin.sisgesc.net.',
        "O SIGESC está certificado pela AGT para faturação eletrónica com o n.º {$agt}.",
        'O programa de parceria custa '.number_format($partnerPrice, 0, ',', '.').' Kz por mês.',
        'As licenças da versão offline do SIGESC para parceiros são limitadas.',
        'A moeda de referência nas ofertas públicas é o Kwanza (AOA / Kz).',
        'O conteúdo editorial e as ferramentas públicas estão em Português de Angola (pt-AO).',
        'Existem ferramentas gratuitas no site (fatura, QR/código de barras, calculadoras, modelos).',
    ],

    'faqs' => [
        [
            'question' => 'O que é o SIGESC?',
            'answer' => 'É um software de gestão comercial para PME em Angola: PDV, stock, finanças, faturação eletrónica AGT e módulos de crescimento (loja virtual, dropshipping, marketing).',
        ],
        [
            'question' => 'O SIGESC é certificado pela AGT?',
            'answer' => "Sim. Certificação AGT n.º {$agt} para faturação eletrónica.",
        ],
        [
            'question' => 'Quanto custa a parceria SIGESC?',
            'answer' => 'A parceria mensal com o sistema custa '.number_format($partnerPrice, 0, ',', '.').' Kz/mês, com licenças offline limitadas.',
        ],
        [
            'question' => 'Há versão offline?',
            'answer' => 'Sim. A versão offline existe para parceiros/clientes elegíveis; as licenças offline são limitadas e sujeitas a aprovação.',
        ],
        [
            'question' => 'Onde criar conta ou experimentar?',
            'answer' => 'Em '.$admin.'/getting-started (trial) ou através de sisgesc.net/contact e sisgesc.net/parceria.',
        ],
        [
            'question' => 'O SIGESC serve só Luanda?',
            'answer' => 'Não. Serve PME em Luanda e noutras províncias de Angola, em cloud e com opções offline conforme disponibilidade.',
        ],
    ],

    'discovery_files' => [
        'llms.txt',
        'llms-full.txt',
        'ai.txt',
        'agents.md',
        'humans.txt',
        '.well-known/security.txt',
        '.well-known/ai-plugin.json',
        'robots.txt',
        'sitemap.xml',
        'feed.xml',
    ],

    'ai_user_agents' => [
        'GPTBot',
        'ChatGPT-User',
        'OAI-SearchBot',
        'ClaudeBot',
        'anthropic-ai',
        'PerplexityBot',
        'Google-Extended',
        'GoogleOther',
        'Applebot-Extended',
        'Amazonbot',
        'Bytespider',
        'CCBot',
        'cohere-ai',
        'meta-externalagent',
        'Diffbot',
        'YouBot',
    ],

    'contact' => [
        'page' => $site.'/contact',
        'security_email' => env('SIGESC_SECURITY_EMAIL', 'security@sisgesc.net'),
        'preferred' => 'Usar o formulário em '.$site.'/contact para pedidos comerciais e de parceria.',
    ],

];
