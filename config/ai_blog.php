<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Weekly AI Blog Generation
    |--------------------------------------------------------------------------
    |
    | Every Monday the scheduler researches these topics on the web and
    | creates polished blog posts via an OpenAI-compatible API.
    |
    */

    'enabled' => env('AI_BLOG_ENABLED', true),

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => rtrim(env('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'timeout' => (int) env('OPENAI_TIMEOUT', 120),
        'image_model' => env('OPENAI_IMAGE_MODEL', 'dall-e-3'),
        'generate_images' => (bool) env('AI_BLOG_GENERATE_IMAGES', false),
    ],

    'author' => [
        'name' => env('AI_BLOG_AUTHOR_NAME', 'Equipa SIGESC'),
        'avatar' => env('AI_BLOG_AUTHOR_AVATAR', '/img/sigesc capa.png'),
        'role' => env('AI_BLOG_AUTHOR_ROLE', 'Análise & Conteúdo'),
    ],

    'posts_per_topic' => (int) env('AI_BLOG_POSTS_PER_TOPIC', 1),

    'research' => [
        'results_per_query' => 6,
        'max_pages_to_fetch' => 4,
        'user_agent' => 'SIGESC-BlogBot/1.0 (+' . rtrim((string) env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/') . ')',
    ],

    /*
    | Topics researched and published every Monday.
    | Each topic can define extra search queries and default taxonomy.
    | Cover images resolve via CoverImageService (contextual stock / editorial SVG).
    | Never uses SIGESC module product screenshots or brand logos.
    */
    'topics' => [
        [
            'key' => 'agt_faturamento_eletronico',
            'label' => 'AGT Faturamento Eletrónico',
            'category' => 'Faturação Eletrónica',
            'queries' => [
                'AGT Angola faturação eletrónica',
                'AGT facturação electrónica requisitos 2026',
                'software faturação eletrónica Angola AGT',
                'normas AGT documento fiscal eletrónico Angola',
            ],
            'tags' => ['AGT', 'Faturação Eletrónica', 'Angola', 'Compliance Fiscal', 'SIGESC'],
            'youtube_query' => 'AGT faturação eletrónica Angola',
            'image_keywords' => 'electronic invoice africa business office',
        ],
        [
            'key' => 'software_gestao_comercial_angola',
            'label' => 'Software de Gestão Comercial em Angola',
            'category' => 'Gestão Comercial',
            'queries' => [
                'software de gestão comercial Angola',
                'ERP PDV PME Angola 2026',
                'sistema de gestão de stock e vendas Angola',
                'melhor software gestão comercial empresas angolanas',
            ],
            'tags' => ['Gestão Comercial', 'ERP', 'Angola', 'PME', 'SIGESC'],
            'youtube_query' => 'software gestão comercial Angola ERP',
            'image_keywords' => 'point of sale retail africa business software',
        ],
        [
            'key' => 'iva_angola_pme',
            'label' => 'IVA em Angola para PME',
            'category' => 'IVA',
            'queries' => [
                'IVA Angola taxa 14% regime simplificado',
                'declaração periódica IVA Angola AGT',
                'IVA PME Angola obrigações 2026',
            ],
            'tags' => ['IVA', 'AGT', 'Angola', 'PME', 'Fiscalidade'],
            'youtube_query' => 'IVA Angola PME AGT',
            'image_keywords' => 'tax invoice accounting angola',
        ],
        [
            'key' => 'fluxo_caixa_pme',
            'label' => 'Fluxo de Caixa para PME',
            'category' => 'Fluxo de Caixa',
            'queries' => [
                'como controlar fluxo de caixa PME Angola',
                'gestão financeira pequena empresa Angola',
                'previsão de caixa loja Angola',
            ],
            'tags' => ['Finanças', 'Fluxo de Caixa', 'PME', 'Angola', 'SIGESC'],
            'youtube_query' => 'fluxo de caixa PME Angola',
            'image_keywords' => 'cash flow finance dashboard business',
        ],
        [
            'key' => 'pdv_stock_loja',
            'label' => 'PDV e Stock para Lojas',
            'category' => 'PDV',
            'queries' => [
                'PDV ponto de venda Angola Multicaixa',
                'controlo de stock loja Angola',
                'sistema PDV stock faturação Angola',
            ],
            'tags' => ['PDV', 'Inventário', 'Lojas', 'Angola', 'SIGESC'],
            'youtube_query' => 'PDV stock loja Angola',
            'image_keywords' => 'point of sale inventory retail',
        ],
        [
            'key' => 'whatsapp_business_vendas',
            'label' => 'WhatsApp Business para Vendas',
            'category' => 'WhatsApp Business',
            'queries' => [
                'WhatsApp Business catálogo vendas Angola',
                'vender pelo WhatsApp loja Angola',
                'catálogo digital WhatsApp PME Angola',
            ],
            'tags' => ['WhatsApp Business', 'Marketing Digital', 'Vendas Online', 'Angola'],
            'youtube_query' => 'WhatsApp Business vendas Angola',
            'image_keywords' => 'whatsapp business catalog sales',
        ],
        [
            'key' => 'marketing_digital_pme',
            'label' => 'Marketing Digital para PME',
            'category' => 'Marketing Digital',
            'queries' => [
                'marketing digital PME Angola Facebook Instagram',
                'anúncios Meta Ads Angola pequena empresa',
                'como aumentar vendas online Angola',
            ],
            'tags' => ['Marketing Digital', 'Anúncios', 'Angola', 'PME'],
            'youtube_query' => 'marketing digital PME Angola',
            'image_keywords' => 'digital marketing social media business',
        ],
        [
            'key' => 'abrir_empresa_angola',
            'label' => 'Abrir Empresa em Angola',
            'category' => 'Empreendedorismo',
            'queries' => [
                'abrir empresa Angola INAPEM GUE',
                'formalizar negócio Angola NIF',
                'licenciamento comercial Luanda PME',
            ],
            'tags' => ['Empreendedorismo', 'Licenciamento', 'INAPEM', 'Angola'],
            'youtube_query' => 'abrir empresa Angola INAPEM',
            'image_keywords' => 'small business startup angola',
        ],
        [
            'key' => 'folha_pagamento_rh',
            'label' => 'Folha de Pagamento e RH',
            'category' => 'Folha de Pagamento',
            'queries' => [
                'folha de pagamento PME Angola',
                'IRT retenção salários Angola',
                'controlo de ponto funcionários Angola',
            ],
            'tags' => ['Recursos Humanos', 'Folha de Pagamento', 'IRT', 'Angola'],
            'youtube_query' => 'folha de pagamento Angola PME',
            'image_keywords' => 'payroll human resources office',
        ],
        [
            'key' => 'ecommerce_angola',
            'label' => 'E-commerce em Angola',
            'category' => 'E-commerce',
            'queries' => [
                'e-commerce Angola como começar loja online',
                'loja virtual entregas pagamentos Angola',
                'vender online Luanda PME',
            ],
            'tags' => ['E-commerce', 'Vendas Online', 'Angola', 'PME'],
            'youtube_query' => 'e-commerce Angola loja online',
            'image_keywords' => 'ecommerce online store logistics',
        ],
        [
            'key' => 'gestao_compras_fornecedores',
            'label' => 'Gestão de Compras e Fornecedores',
            'category' => 'Compras',
            'queries' => [
                'gestão de compras fornecedores PME Angola',
                'controlo de encomendas stock Angola',
                'importação fornecedores China Angola PME',
            ],
            'tags' => ['Compras', 'Inventário', 'Importação/Exportação', 'Angola'],
            'youtube_query' => 'gestão compras fornecedores Angola',
            'image_keywords' => 'purchase orders suppliers inventory',
        ],
        [
            'key' => 'logistica_entregas',
            'label' => 'Logística e Entregas',
            'category' => 'Logística',
            'queries' => [
                'logística entregas PME Luanda',
                'gestão de frota entregas Angola',
                'rastreamento encomendas loja online Angola',
            ],
            'tags' => ['Logística', 'E-commerce', 'Angola', 'PME'],
            'youtube_query' => 'logística entregas Luanda PME',
            'image_keywords' => 'logistics delivery fleet tracking',
        ],
    ],

];
