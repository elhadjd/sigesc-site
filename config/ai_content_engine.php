<?php

$topicBuckets = [
    'fiscal' => [
        'label' => 'Fiscalidade & AGT',
        'categories' => [
            'AGT', 'IVA', 'IRT', 'Imposto Industrial', 'Imposto Predial', 'Imposto de Selo',
            'Faturação Eletrónica', 'Compliance Fiscal', 'Legislação',
        ],
        'queries' => [
            'AGT Angola faturação eletrónica obrigações PME',
            'IVA Angola taxa geral regime simplificado 14% 7%',
            'IRT Angola tabela retenção salários 2026',
            'Imposto Industrial Angola PME obrigações',
            'NIF empresa Angola como obter AGT',
            'certidão de não dívida AGT Angola como pedir',
            'AGT documento fiscal eletrónico requisitos Angola',
            'declaração periódica IVA Angola prazos AGT',
            'retenção na fonte Angola obrigações empregador',
            'imposto predial urbano Angola como funciona',
        ],
    ],
    'gestao' => [
        'label' => 'Gestão & operações',
        'categories' => [
            'Gestão', 'Gestão Comercial', 'Finanças', 'Fluxo de Caixa', 'Inventário',
            'Recursos Humanos', 'Software', 'ERP', 'CRM', 'POS', 'PDV', 'Preçário', 'Vendas',
        ],
        'queries' => [
            'software gestão comercial Angola PDV stock faturação',
            'como controlar fluxo de caixa PME Angola',
            'gestão de inventário farmácia loja Angola',
            'formação preço de venda margem lucro Angola',
            'recursos humanos processamento salarial Angola',
            'contratos de trabalho Angola obrigações empregador',
            'CRM vendas equipa comercial Angola',
            'relatório de vendas diário PME boas práticas',
            'melhor sistema gestão comercial Angola PDV ERP',
            'implementar ERP CRM nuvem PME Angola',
        ],
    ],
    'marketing' => [
        'label' => 'Marketing & vendas digitais',
        'categories' => [
            'Marketing', 'Marketing Digital', 'Anúncios', 'Vendas Online', 'E-commerce',
            'WhatsApp Business', 'Dropshipping',
        ],
        'queries' => [
            'como vender na internet Angola PME WhatsApp Instagram',
            'como fazer anúncios de sucesso Facebook Instagram Angola',
            'e-commerce Angola como começar loja online',
            'marketing digital PME Angola Google Ads Meta Ads',
            'WhatsApp Business catálogo vendas Angola',
            'delivery restaurante Angola gestão encomendas',
            'como aumentar vendas loja física Luanda',
            'como precificar produtos loja Angola margem lucro',
            'campanhas lead ads Facebook Instagram Angola PME',
            'dropshipping Angola como funciona',
        ],
    ],
    'empreendedorismo' => [
        'label' => 'Empreendedorismo & setores',
        'categories' => [
            'Empreendedorismo', 'Licenciamento', 'Pequenas Empresas', 'Restaurantes',
            'Farmácias', 'Lojas', 'Salões', 'Importação/Exportação', 'Banca', 'Câmbio',
        ],
        'queries' => [
            'abrir empresa Angola INAPEM GUE passos',
            'licenciamento comercial restaurante Luanda',
            'gestão de salão de beleza Angola',
            'gestão de farmácia Angola requisitos AGT',
            'crédito PME banca Angola BNA',
            'exportação Angola documentação aduaneira',
            'fornecedores e importação China Angola PME',
            'Guiché Único Empresa Angola constituição',
            'licença comercial municipal Luanda requisitos',
            'como formalizar negócio informal Angola NIF',
        ],
    ],
];

return [

    'enabled' => env('AI_CONTENT_ENGINE_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Providers
    |--------------------------------------------------------------------------
    | Article pipeline LLM: auto | deepseek | tavily | openai
    | Ask Expert defaults to DeepSeek (see ask_expert) to avoid Tavily credits.
    */
    'llm' => [
        // auto | deepseek | tavily | openai
        'provider' => env('AI_CONTENT_LLM_PROVIDER', 'auto'),
    ],

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'base_url' => rtrim(env('OPENAI_BASE_URL', 'https://api.openai.com/v1'), '/'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'review_model' => env('OPENAI_REVIEW_MODEL', env('OPENAI_MODEL', 'gpt-4o-mini')),
        'image_model' => env('OPENAI_IMAGE_MODEL', 'dall-e-3'),
        'timeout' => (int) env('OPENAI_TIMEOUT', 180),
    ],

    /*
    | DeepSeek — OpenAI-compatible chat API (https://api.deepseek.com).
    | Official model IDs (2026): deepseek-v4-flash | deepseek-v4-pro
    | Legacy deepseek-chat / deepseek-reasoner are remapped in LlmGateway.
    */
    'deepseek' => [
        'api_key' => env('DEEPSEEK_API_KEY'),
        'base_url' => rtrim(env('DEEPSEEK_BASE_URL', 'https://api.deepseek.com'), '/'),
        'model' => env('DEEPSEEK_MODEL', 'deepseek-v4-flash'),
        'review_model' => env('DEEPSEEK_REVIEW_MODEL', 'deepseek-v4-pro'),
        'timeout' => (int) env('DEEPSEEK_TIMEOUT', 180),
    ],

    'tavily' => [
        'api_key' => env('TAVILY_API_KEY'),
        'base_url' => rtrim(env('TAVILY_BASE_URL', 'https://api.tavily.com'), '/'),
        'max_results' => (int) env('TAVILY_MAX_RESULTS', 5),
        'enabled' => (bool) env('TAVILY_ENABLED', true),
        'research_model' => env('TAVILY_RESEARCH_MODEL', 'mini'),
        'research_timeout' => (int) env('TAVILY_RESEARCH_TIMEOUT', 240),
        'research_poll_seconds' => (int) env('TAVILY_RESEARCH_POLL_SECONDS', 4),
        // Tavily accepts only: short | standard | long
        'research_output_length' => env('TAVILY_RESEARCH_OUTPUT_LENGTH', 'short'),
        // Writer needs more room for full HTML articles
        'writer_output_length' => env('TAVILY_WRITER_OUTPUT_LENGTH', 'long'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Ask Expert (pergunte ao especialista)
    |--------------------------------------------------------------------------
    | DeepSeek synthesizes answers from free/local research (official sources,
    | DuckDuckGo, internal blog). Tavily Search/Research are off by default here.
    */
    'ask_expert' => [
        // deepseek | openai | tavily | auto
        'llm_provider' => env('ASK_EXPERT_LLM_PROVIDER', 'deepseek'),
        'use_tavily_search' => (bool) env('ASK_EXPERT_USE_TAVILY', false),
        'use_duckduckgo' => (bool) env('ASK_EXPERT_USE_DUCKDUCKGO', true),
        'min_trust_score' => (int) env('ASK_EXPERT_MIN_TRUST_SCORE', 40),
        'max_sources' => (int) env('ASK_EXPERT_MAX_SOURCES', 10),
    ],

    /*
    |--------------------------------------------------------------------------
    | Tavily credit saver — fewer API calls without dropping article quality
    |--------------------------------------------------------------------------
    | Keeps Writer + FactChecker as Research LLM steps; SEO/social/review/summary
    | use heuristics; Search uses a single call per query.
    */
    'credit_saver' => [
        'enabled' => (bool) env('AI_CONTENT_CREDIT_SAVER', true),
        'single_search' => (bool) env('AI_CONTENT_SINGLE_SEARCH', true),
        'heuristic_seo' => (bool) env('AI_CONTENT_HEURISTIC_SEO', true),
        'heuristic_social' => (bool) env('AI_CONTENT_HEURISTIC_SOCIAL', true),
        'skip_reviewer_llm' => (bool) env('AI_CONTENT_SKIP_REVIEWER_LLM', true),
        'skip_research_summary_llm' => (bool) env('AI_CONTENT_SKIP_RESEARCH_SUMMARY_LLM', true),
        'trend_seed_queries' => (int) env('AI_CONTENT_TREND_SEED_QUERIES', 2),
    ],

    /*
    |--------------------------------------------------------------------------
    | Hybrid Research Engine (evolves AIResearchAgent)
    |--------------------------------------------------------------------------
    */
    'research' => [
        'cache_days' => (int) env('RESEARCH_CACHE_DAYS', 30),
        'max_sources' => (int) env('RESEARCH_MAX_SOURCES', 8),
        'min_trust_score' => (int) env('RESEARCH_MIN_TRUST_SCORE', 50),
        'prefer_official' => true,
        // News doubles Tavily Search cost; keep off unless you need freshness bursts.
        'news_enabled' => (bool) env('RESEARCH_NEWS_ENABLED', false),
        'internal_knowledge_enabled' => (bool) env('RESEARCH_INTERNAL_ENABLED', true),
        // Free web fallback used by Ask Expert when Tavily Search is disabled.
        'duckduckgo_enabled' => (bool) env('RESEARCH_DUCKDUCKGO_ENABLED', true),
        'trust_scores' => [
            'official' => 100,
            'institutional' => 90,
            'university' => 85,
            'specialized' => 70,
            'news' => 65,
            'blog' => 50,
            'web' => 45,
        ],
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
    | Cover images for AI articles / blog posts.
    | auto: OpenAI (if key) → Openverse (free) → Wikimedia → Unsplash/Pexels keys → curated pool
    */
    'images' => [
        'provider' => env('AI_CONTENT_IMAGE_PROVIDER', 'auto'),
        // Prefer free web search by default; set true to try DALL-E first when OPENAI_API_KEY exists.
        'prefer_openai' => (bool) env('AI_CONTENT_IMAGE_PREFER_OPENAI', false),
        'openverse_enabled' => (bool) env('AI_CONTENT_OPENVERSE_ENABLED', true),
        'wikimedia_enabled' => (bool) env('AI_CONTENT_WIKIMEDIA_ENABLED', true),
        'unsplash_access_key' => env('UNSPLASH_ACCESS_KEY'),
        'pexels_api_key' => env('PEXELS_API_KEY'),
        'store_locally' => (bool) env('AI_CONTENT_STORE_IMAGES', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pipeline behaviour
    |--------------------------------------------------------------------------
    */
    'pipeline' => [
        // 1 article/day keeps quality high and Tavily spend predictable; raise via env if needed.
        'topics_per_day' => (int) env('AI_CONTENT_TOPICS_PER_DAY', 1),
        'require_fact_check' => (bool) env('AI_CONTENT_REQUIRE_FACT_CHECK', true),
        'auto_publish' => (bool) env('AI_CONTENT_AUTO_PUBLISH', false),
        'schedule_delay_hours' => (int) env('AI_CONTENT_SCHEDULE_DELAY_HOURS', 6),
        'min_confidence' => (float) env('AI_CONTENT_MIN_CONFIDENCE', 0.72),
        'sync_to_blog_posts' => (bool) env('AI_CONTENT_SYNC_TO_POSTS', true),
        'locale' => 'pt_AO',
        'language' => 'Português de Angola',
        'brand_cta' => 'Conheça o SIGESC — software de gestão comercial (faturação, stock, PDV e vendas) feito para empresas em Angola. Para experimentar ou aceder ao painel: https://admin.sisgesc.net/getting-started. Site: https://www.sisgesc.net',
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

    /*
    |--------------------------------------------------------------------------
    | Topic buckets — TrendAgent rotates these so the blog diversifies
    |--------------------------------------------------------------------------
    */
    'topic_rotation' => [
        'enabled' => (bool) env('AI_CONTENT_TOPIC_ROTATION', true),
        // round_robin = mistura garantida (fiscal → gestão → marketing → empreendedorismo)
        // underused = escolhe o bucket com menos artigos recentes
        'mode' => env('AI_CONTENT_TOPIC_ROTATION_MODE', 'round_robin'),
        'cooldown_days' => (int) env('AI_CONTENT_BUCKET_COOLDOWN_DAYS', 5),
        'prefer_underused' => (bool) env('AI_CONTENT_PREFER_UNDERUSED_BUCKETS', true),
    ],

    /*
    | Live Angola search interest (fail-soft). Uses Google Suggest (gl=ao) +
    | Trends RSS. Sports-only trends are filtered out for business buckets.
    */
    'search_interest' => [
        'enabled' => (bool) env('AI_CONTENT_SEARCH_INTEREST', true),
        'cache_minutes' => (int) env('AI_CONTENT_SEARCH_INTEREST_CACHE', 180),
        'trends_rss_url' => env('AI_CONTENT_TRENDS_RSS_URL', 'https://trends.google.com/trending/rss?geo=AO'),
        'business_keywords' => [
            'angola', 'negócio', 'negocio', 'empresa', 'pme', 'imposto', 'iva', 'agt',
            'venda', 'loja', 'marketing', 'anúncio', 'anuncio', 'software', 'gestão', 'gestao',
        ],
        'bucket_keywords' => [
            'fiscal' => ['agt', 'iva', 'irt', 'imposto', 'fatura', 'nif', 'tribut'],
            'gestao' => ['erp', 'crm', 'pdv', 'stock', 'gestão', 'gestao', 'software', 'caixa'],
            'marketing' => ['facebook', 'instagram', 'whatsapp', 'anúncio', 'ads', 'loja', 'e-commerce', 'marketing'],
            'empreendedorismo' => ['empresa', 'licen', 'inapem', 'crédito', 'credito', 'import', 'export'],
        ],
        'bucket_stems' => [
            'fiscal' => [
                'IVA Angola',
                'AGT Angola',
                'faturação eletrónica Angola',
                'IRT Angola',
                'NIF empresa Angola',
            ],
            'gestao' => [
                'software gestão comercial Angola',
                'ERP Angola PME',
                'PDV stock Angola',
                'fluxo de caixa PME Angola',
            ],
            'marketing' => [
                'loja online Angola',
                'Facebook Ads Angola',
                'WhatsApp Business Angola',
                'marketing digital Angola',
            ],
            'empreendedorismo' => [
                'abrir empresa Angola',
                'INAPEM Angola',
                'licenciamento comercial Luanda',
                'crédito PME Angola',
            ],
        ],
    ],

    'topic_buckets' => $topicBuckets,

    'seed_queries' => array_values(array_unique(array_merge(
        ...array_map(
            static fn (array $bucket): array => $bucket['queries'] ?? [],
            array_values($topicBuckets)
        )
    ))),

    'categories' => [
        'AGT', 'IVA', 'IRT', 'Imposto Industrial', 'Imposto Predial', 'Imposto de Selo',
        'Faturação Eletrónica', 'Compliance Fiscal', 'Gestão', 'Finanças', 'Fluxo de Caixa',
        'Empreendedorismo', 'Licenciamento', 'Marketing', 'Marketing Digital', 'Anúncios',
        'Vendas Online', 'E-commerce', 'Software', 'ERP', 'CRM', 'POS', 'PDV',
        'Inventário', 'Recursos Humanos', 'Vendas', 'Preçário', 'Pequenas Empresas',
        'Restaurantes', 'Farmácias', 'Lojas', 'Salões', 'Importação/Exportação',
        'Câmbio', 'Banca', 'Tecnologia', 'Notícias', 'Legislação', 'Gestão Comercial',
        'WhatsApp Business', 'Dropshipping',
    ],

    'admin_emails' => array_filter(array_map('trim', explode(',', env('AI_CONTENT_ADMIN_EMAILS', '')))),

];
