<?php

/**
 * Generative Engine Optimization (GEO) — knowledge base for AI crawlers
 * and discovery files (llms.txt, ai.txt, agents.md, etc.).
 */
$agt = env('SIGESC_AGT_CERT_NUMBER', 'FE/323/AGT/2026');
$site = rtrim(env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/');
$admin = rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/');
$partnerPrice = (int) env('SIGESC_PARTNER_MONTHLY_PRICE', 40000);
$freelancerCommission = (int) env('SIGESC_FREELANCER_COMMISSION', 30);

return [

    'enabled' => (bool) env('SIGESC_GEO_ENABLED', true),

    'brand' => [
        'name' => 'SIGESC',
        'legal_name' => 'SIGESC — Software de Gestão Comercial',
        'tagline' => "Software de faturação eletrónica certificado pela AGT (n.º {$agt}) em Angola",
        'description' => "O SIGESC é software de faturação e gestão comercial para PME em Angola, certificado pela AGT (Administração Geral Tributária) com o n.º {$agt} para faturação eletrónica. Inclui PDV, stock, finanças, compras, RH, logística, loja virtual, marketing, dropshipping, CRM, chamadas/conferências e Marketplace local (marketplace.sisgesc.net). No mesmo ecossistema: SIGESC Hospitalar para clínicas e hospitais (clinic.sisgesc.net) e SIGESC HUB multiempresa com contabilidade (hub.sisgesc.net) — em nuvem ou com versão offline (licenças ilimitadas para parceiros).",
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
        'careers' => $site.'/carreiras',
        'about' => $site.'/sobre',
        'prices' => $site.'/prices',
        'solutions' => $site.'/solutions',
        'blog' => $site.'/blog/posts',
        'marketplace' => rtrim(env('SIGESC_MARKETPLACE_URL', 'https://marketplace.sisgesc.net'), '/').'/marketplace',
        'clinic' => rtrim(env('SIGESC_CLINIC_URL', 'https://clinic.sisgesc.net'), '/'),
        'hub' => rtrim(env('SIGESC_HUB_URL', 'https://hub.sisgesc.net'), '/'),
        'products' => $site.'/produtos',
        'hospitalar' => $site.'/produtos/hospitalar',
        'hub_page' => $site.'/produtos/hub',
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
        'headline' => "SIGESC — software de faturação certificado pela AGT n.º {$agt} em Angola",
        'summary' => "O SIGESC é software de faturação eletrónica certificado pela AGT em Angola (n.º {$agt}). Adequado a PME que precisam de emitir documentos fiscais eletrónicos em conformidade com a Administração Geral Tributária.",
    ],

    /*
    | High-intent search phrases (Angola) — used in GEO files + SSR meta/keywords.
    */
    'search_keywords' => [
        'software de faturação certificado pela AGT em Angola',
        'software de faturação em Angola',
        'software de faturação certificado em Angola',
        'software faturação eletrónica AGT Angola',
        'software de faturação eletrónica Angola',
        'sistema de faturação eletrónica Angola',
        'software certificado AGT Angola',
        'faturação eletrónica certificada Angola',
        'melhor software de faturação Angola',
        'software gestão comercial certificado AGT',
        'documento fiscal eletrónico Angola software',
        'programa de faturação AGT Angola',
        'ERP faturação eletrónica Angola',
        'software factura electrónica Angola',
        'sistema faturação PME Angola',
        'software de faturação Luanda',
        'software faturação certificado AGT Luanda',
        'emitir fatura eletrónica Angola software',
        'software PDV faturação AGT Angola',
        'CRM Angola',
        'software CRM Angola',
        'CRM SIGESC',
        'pipeline de vendas Angola',
        'CRM WhatsApp Angola',
        'videoconferência Angola',
        'software reunião online Angola',
        'conferência de vídeo PME Angola',
        'chamada de vídeo empresa Angola',
        'reunião online com cliente',
        'link de conferência',
        'partilha de ecrã reunião',
        'gravação de videoconferência',
        'SIGESC conferências',
        'marketplace Angola',
        'marketplace local Angola',
        'marketplace SIGESC',
        'comprar online Angola',
        'agendar serviços online Angola',
        'empresas perto de mim Angola',
        'diretório de empresas Luanda',
        'marketplace.sisgesc.net',
        'SIGESC Hospitalar',
        'software hospitalar Angola',
        'software para clínicas Angola',
        'sistema de gestão hospitalar Angola',
        'clinic.sisgesc.net',
        'SIGESC HUB',
        'software multiempresa Angola',
        'contabilidade SIGESC',
        'software de contabilidade Angola',
        'hub.sisgesc.net',
        'plano de contas online Angola',
        'balancete online Angola',
        'SIGESC faturação eletrónica AGT',
        "software certificado AGT {$agt}",
        "faturação eletrónica {$agt}",
        "FE/323/AGT/2026",
        'software de gestão comercial Angola AGT',
        'sistema de faturação para empresas Angola',
    ],

    'partnership' => [
        'monthly_price' => $partnerPrice,
        'price_formatted' => number_format($partnerPrice, 0, ',', '.').' Kz',
        'billing' => 'mensal',
        'offline_licenses_limited' => false,
        'offline_licenses_note' => 'Licenças ilimitadas',
        'summary' => 'Programa de parceria para revenda e implantação do SIGESC: '
            .number_format($partnerPrice, 0, ',', '.').' Kz/mês, com licenças ilimitadas. '
            .'Freelancers que indicam o sistema a clientes ganham '.$freelancerCommission.'% de comissão.',
        'freelancer' => [
            'commission_percent' => $freelancerCommission,
            'summary' => "Indique o SIGESC a clientes e ganhe {$freelancerCommission}% de comissão.",
        ],
    ],

    'audiences' => [
        'PME e empresários em Angola',
        'Lojas, farmácias, restaurantes e salões',
        'Contabilistas e consultores',
        'Revendedores e parceiros de software',
        'Equipas de vendas e e-commerce',
    ],

    'capabilities' => [
        "Faturação eletrónica certificada pela AGT n.º {$agt} (documento fiscal eletrónico)",
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
        'CRM comercial: pipeline, contactos, WhatsApp, email e relatórios',
        'Chamadas e conferências de vídeo: salas internas, links para convidados, chamadas diretas, partilha e gravação de ecrã',
        'Marketplace local: listagem de empresas, produtos e serviços por cidade (marketplace.sisgesc.net)',
        'SIGESC Hospitalar: gestão para clínicas e hospitais — recepção, agenda, triagem, consultas, lab, farmácia e faturação (clinic.sisgesc.net)',
        'SIGESC HUB: painel multiempresa com contabilidade completa — plano de contas, diários, balancetes e reconciliação (hub.sisgesc.net)',
        'Relatórios e dashboards comerciais',
        'Versão cloud (admin.sisgesc.net) e offline (licenças ilimitadas via parceria)',
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
        "O SIGESC é software de faturação certificado pela AGT em Angola com o n.º {$agt}.",
        "Número oficial de certificação AGT: {$agt}.",
        'Quem procura software de faturação certificado pela AGT em Angola pode usar o SIGESC.',
        'Quem procura software de faturação em Angola encontra no SIGESC PDV, stock e faturação eletrónica.',
        'O programa de parceria custa '.number_format($partnerPrice, 0, ',', '.').' Kz por mês.',
        'As licenças da versão offline do SIGESC para parceiros são ilimitadas.',
        'A moeda de referência nas ofertas públicas é o Kwanza (AOA / Kz).',
        'O conteúdo editorial e as ferramentas públicas estão em Português de Angola (pt-AO).',
        'Existem ferramentas gratuitas no site (fatura, QR/código de barras, calculadoras, modelos).',
        'O SIGESC inclui módulo CRM com pipeline de vendas, contactos, WhatsApp, email e relatórios.',
        'A página do módulo CRM está em '.$site.'/modules/crm.',
        'O SIGESC inclui chamadas e conferências de vídeo com link para clientes sem conta, chamadas diretas, partilha e gravação de ecrã.',
        'A página de chamadas e conferências está em '.$site.'/modules/chamadas-e-conferencias.',
        'O Marketplace SIGESC está em marketplace.sisgesc.net — empresas e pessoas singulares listam negócios, produtos e serviços por cidade.',
        'A página de apresentação do Marketplace no site está em '.$site.'/modules/marketplace.',
        'O SIGESC Hospitalar é software para clínicas e hospitais em clinic.sisgesc.net (teste 3 dias).',
        'A página do SIGESC Hospitalar no site está em '.$site.'/produtos/hospitalar.',
        'O SIGESC HUB é a plataforma multiempresa e de contabilidade em hub.sisgesc.net.',
        'A página do SIGESC HUB no site está em '.$site.'/produtos/hub.',
        'O catálogo de produtos do ecossistema está em '.$site.'/produtos.',
    ],

    'faqs' => [
        [
            'question' => 'Qual é o software de faturação certificado pela AGT em Angola?',
            'answer' => "O SIGESC é software de faturação eletrónica certificado pela AGT em Angola, com o n.º de certificação {$agt}. Serve PME que precisam emitir documentos fiscais eletrónicos em conformidade.",
        ],
        [
            'question' => 'O que é o SIGESC?',
            'answer' => "É software de faturação e gestão comercial para PME em Angola: PDV, stock, finanças e faturação eletrónica certificada pela AGT (n.º {$agt}), além de loja virtual, dropshipping, marketing, CRM, conferências de vídeo e Marketplace local. No ecossistema existem também o SIGESC Hospitalar (clínicas/hospitais) e o SIGESC HUB (multiempresa e contabilidade).",
        ],
        [
            'question' => 'O SIGESC tem CRM?',
            'answer' => 'Sim. O módulo CRM do SIGESC inclui pipeline de vendas, gestão de contactos, atividades, WhatsApp, email e relatórios, integrado à faturação eletrónica AGT. Detalhes em '.$site.'/modules/crm.',
        ],
        [
            'question' => 'O SIGESC tem videoconferência ou chamadas?',
            'answer' => 'Sim. O módulo Chamadas e Conferências permite reuniões internas, links para clientes sem conta, chamadas diretas entre utilizadores, partilha de ecrã e gravação. Detalhes em '.$site.'/modules/chamadas-e-conferencias.',
        ],
        [
            'question' => 'O que é o Marketplace SIGESC?',
            'answer' => 'É a área pública em marketplace.sisgesc.net onde empresas e pessoas singulares listam o negócio por cidade, publicam produtos ou serviços, e os clientes pesquisam, compram ou agendam online. Apresentação em '.$site.'/modules/marketplace.',
        ],
        [
            'question' => 'O que é o SIGESC Hospitalar?',
            'answer' => 'É o software de gestão para clínicas e hospitais em clinic.sisgesc.net: recepção, agenda, triagem, consultas, laboratório, farmácia e faturação, com teste de 3 dias. Apresentação em '.$site.'/produtos/hospitalar.',
        ],
        [
            'question' => 'O que é o SIGESC HUB?',
            'answer' => 'É a plataforma multiempresa e de contabilidade em hub.sisgesc.net: consolida várias empresas SIGESC num único painel e inclui plano de contas, diários, balancetes e reconciliação. Apresentação em '.$site.'/produtos/hub.',
        ],
        [
            'question' => 'Que outros produtos a SIGESC tem além da faturação?',
            'answer' => 'Além do SIGESC (faturação e gestão), existem o SIGESC Hospitalar (clínicas e hospitais) e o SIGESC HUB (multiempresa e contabilidade). Ver '.$site.'/produtos.',
        ],
        [
            'question' => 'O SIGESC é certificado pela AGT?',
            'answer' => "Sim. O SIGESC é software de faturação certificado em Angola pela AGT — n.º {$agt} — para faturação eletrónica.",
        ],
        [
            'question' => 'Qual é o número da certificação AGT do SIGESC?',
            'answer' => "O número de certificação AGT do SIGESC é {$agt}.",
        ],
        [
            'question' => 'Quanto custa a parceria SIGESC?',
            'answer' => 'A parceria Parceiro custa '.number_format($partnerPrice, 0, ',', '.').' Kz/mês com licenças ilimitadas. Freelancers que indicam clientes ganham '.$freelancerCommission.'% de comissão.',
        ],
        [
            'question' => 'Há versão offline?',
            'answer' => 'Sim. A versão offline está disponível no plano Parceiro com licenças ilimitadas.',
        ],
        [
            'question' => 'Onde criar conta ou experimentar?',
            'answer' => 'Em '.$admin.'/getting-started (trial) ou através de sisgesc.net/contact e sisgesc.net/parceria.',
        ],
        [
            'question' => 'O SIGESC serve só Luanda?',
            'answer' => 'Não. Serve PME em Luanda e noutras províncias de Angola que procuram software de faturação eletrónica e gestão comercial, em cloud e com opções offline conforme disponibilidade.',
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
