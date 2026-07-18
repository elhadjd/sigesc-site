<?php

return [

    'enabled' => env('AI_CONTENT_ENGINE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Providers
    |--------------------------------------------------------------------------
    */
    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => rtrim(env('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'review_model' => env('OPENAI_REVIEW_MODEL', env('OPENAI_MODEL', 'gpt-4o-mini')),
        'image_model' => env('OPENAI_IMAGE_MODEL', 'dall-e-3'),
        'timeout' => (int) env('OPENAI_TIMEOUT', 180),
    ],

    'tavily' => [
        'api_key' => env('TAVILY_API_KEY'),
        'base_url' => rtrim(env('TAVILY_BASE_URL', 'https://api.tavily.com'), '/'),
        'max_results' => (int) env('TAVILY_MAX_RESULTS', 8),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-2.0-flash'),
        'enabled' => (bool) env('GEMINI_ENABLED', false),
    ],

    'storage' => [
        'disk' => env('AI_CONTENT_DISK', env('FILESYSTEM_DISK', 'public')),
        'image_folder' => 'ai-content/images',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pipeline behaviour
    |--------------------------------------------------------------------------
    */
    'pipeline' => [
        'topics_per_day' => (int) env('AI_CONTENT_TOPICS_PER_DAY', 2),
        'require_fact_check' => (bool) env('AI_CONTENT_REQUIRE_FACT_CHECK', true),
        'auto_publish' => (bool) env('AI_CONTENT_AUTO_PUBLISH', false),
        'schedule_delay_hours' => (int) env('AI_CONTENT_SCHEDULE_DELAY_HOURS', 6),
        'min_confidence' => (float) env('AI_CONTENT_MIN_CONFIDENCE', 0.72),
        'sync_to_blog_posts' => (bool) env('AI_CONTENT_SYNC_TO_POSTS', true),
        'locale' => 'pt_AO',
        'language' => 'Português de Angola',
        'brand_cta' => 'Conheça o SIGESC — software de gestão comercial feito para empresas em Angola.',
    ],

    'author' => [
        'name' => env('AI_CONTENT_AUTHOR_NAME', 'Equipa Editorial SIGESC'),
        'avatar' => env('AI_CONTENT_AUTHOR_AVATAR', '/img/sigesc capa.png'),
        'role' => env('AI_CONTENT_AUTHOR_ROLE', 'AI Content Engine'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Trusted research sources (Angola + institutional)
    |--------------------------------------------------------------------------
    */
    'trusted_domains' => [
        'agt.minfin.gov.ao',
        'minfin.gov.ao',
        'bna.ao',
        'governo.gov.ao',
        'jornaldeangola.ao',
        'angio.gov.ao',
        'inapem.gov.ao',
        'worldbank.org',
        'imf.org',
        'dr.incm.pt',
        'sisgesc.net',
    ],

    'seed_queries' => [
        'AGT Angola faturação eletrónica',
        'IVA Angola alterações legislação',
        'IRT Angola retenção na fonte',
        'Imposto Industrial Angola PME',
        'software gestão comercial Angola',
        'ERP PDV inventário Angola',
        'empreendedorismo Angola INAPEM',
        'Banco Nacional de Angola economia',
    ],

    'categories' => [
        'AGT', 'IVA', 'IRT', 'Imposto Industrial', 'Gestão', 'Finanças',
        'Empreendedorismo', 'Marketing', 'Software', 'ERP', 'CRM', 'POS',
        'Inventário', 'Recursos Humanos', 'Vendas', 'Pequenas Empresas',
        'Restaurantes', 'Farmácias', 'Lojas', 'Salões', 'Tecnologia',
        'Notícias', 'Legislação', 'Faturação Eletrónica', 'Gestão Comercial',
    ],

    'admin_emails' => array_filter(array_map('trim', explode(',', env('AI_CONTENT_ADMIN_EMAILS', '')))),

];
