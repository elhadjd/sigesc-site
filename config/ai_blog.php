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
        'user_agent' => 'SIGESC-BlogBot/1.0 (+https://www.sisgesc.net)',
    ],

    /*
    | Topics researched and published every Monday.
    | Each topic can define extra search queries and default taxonomy.
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
    ],

];
