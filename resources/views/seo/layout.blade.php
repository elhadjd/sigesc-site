<!DOCTYPE html>
<html lang="pt-AO">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $seo['title'] }}</title>
    <meta name="description" content="{{ $seo['description'] }}">
    @if (!empty($seo['keywords']))
    <meta name="keywords" content="{{ $seo['keywords'] }}">
    @endif
    <meta name="robots" content="{{ $seo['robots'] ?? 'index,follow' }}">
    <link rel="canonical" href="{{ $seo['canonical'] }}">
    <meta property="og:site_name" content="{{ $seo['site_name'] ?? 'SIGESC' }}">
    <meta property="og:type" content="{{ $seo['og_type'] ?? 'website' }}">
    <meta property="og:title" content="{{ $seo['title'] }}">
    <meta property="og:description" content="{{ $seo['description'] }}">
    <meta property="og:url" content="{{ $seo['canonical'] }}">
    <meta property="og:image" content="{{ $seo['og_image'] }}">
    <meta property="og:locale" content="{{ $seo['locale'] ?? 'pt_AO' }}">
    <meta name="twitter:card" content="{{ $seo['twitter_card'] ?? 'summary_large_image' }}">
    <meta name="twitter:title" content="{{ $seo['title'] }}">
    <meta name="twitter:description" content="{{ $seo['description'] }}">
    <meta name="twitter:image" content="{{ $seo['og_image'] }}">
    <meta name="geo.region" content="AO">
    <meta name="language" content="pt-AO">
    @php
        $baseGeo = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $agtMeta = $seo['agt_certification_number'] ?? config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
    @endphp
    <meta name="agt:certification" content="{{ $agtMeta }}">
    <meta name="citation_technical_report_number" content="{{ $agtMeta }}">
    <link rel="alternate" type="text/plain" title="LLMs" href="{{ $baseGeo }}/llms.txt">
    <link rel="alternate" type="text/plain" title="LLMs full" href="{{ $baseGeo }}/llms-full.txt">
    <link rel="alternate" type="text/plain" title="AI policy" href="{{ $baseGeo }}/ai.txt">
    <link rel="alternate" type="text/markdown" title="Agents" href="{{ $baseGeo }}/agents.md">
    <link rel="describedby" href="{{ $baseGeo }}/llms.txt">
    @foreach ($seo['json_ld'] ?? [] as $block)
    <script type="application/ld+json">{!! json_encode($block, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT) !!}</script>
    @endforeach
    <style>
        :root { color-scheme: light; }
        body { margin: 0; font-family: Georgia, "Times New Roman", serif; color: #14213d; background: #f7f4ef; line-height: 1.7; }
        .wrap { max-width: 760px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
        header.site { margin-bottom: 2rem; border-bottom: 1px solid #d9d2c5; padding-bottom: 1rem; }
        header.site .brand { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .75rem; }
        header.site a { color: #0b3d91; text-decoration: none; font-family: "Segoe UI", sans-serif; font-weight: 700; letter-spacing: .04em; }
        header.site nav { display: flex; flex-wrap: wrap; gap: .65rem 1rem; font-family: "Segoe UI", sans-serif; font-size: .9rem; }
        header.site nav a { font-weight: 600; }
        .agt-cert { margin: 0 0 1rem; padding: .65rem .9rem; border-radius: 10px; background: #0b3d91; color: #fff; font-family: "Segoe UI", sans-serif; display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; justify-content: space-between; }
        .agt-cert .label { font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; opacity: .9; }
        .agt-cert .number { font-family: ui-monospace, monospace; font-weight: 800; letter-spacing: .06em; color: #fde68a; font-size: 1.05rem; }
        .kicker { font-family: "Segoe UI", sans-serif; text-transform: uppercase; letter-spacing: .12em; font-size: .75rem; color: #6b7280; }
        h1 { font-size: clamp(2rem, 4vw, 2.8rem); line-height: 1.15; margin: .6rem 0 1rem; }
        .meta { font-family: "Segoe UI", sans-serif; color: #4b5563; font-size: .95rem; margin-bottom: 1.5rem; }
        .hero { width: 100%; border-radius: 18px; margin: 1.5rem 0 2rem; display: block; }
        article :is(h2,h3), section :is(h2,h3) { font-family: "Segoe UI", sans-serif; color: #0f172a; margin-top: 2rem; }
        article img { max-width: 100%; height: auto; border-radius: 12px; }
        article a, section a { color: #0b3d91; }
        .excerpt { font-size: 1.15rem; color: #334155; }
        .card-list { list-style: none; padding: 0; margin: 0; }
        .card-list li { padding: 1.25rem 0; border-bottom: 1px solid #e5e0d6; }
        .card-list a { color: inherit; text-decoration: none; }
        .card-list h2 { margin: .35rem 0; font-size: 1.35rem; }
        footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #d9d2c5; font-family: "Segoe UI", sans-serif; color: #64748b; font-size: .9rem; }
    </style>
</head>
<body>
    @php
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $agtCert = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $agtLabel = config('sigesc.agt_certification.label', 'Software certificado AGT');
    @endphp
    <div class="wrap">
        <header class="site">
            <div class="agt-cert" role="note" aria-label="{{ $agtLabel }}">
                <span class="label">{{ $agtLabel }} · Faturação eletrónica</span>
                <span class="number">{{ $agtCert }}</span>
            </div>
            <div class="brand">
                <a href="{{ $base }}/">SIGESC</a>
                <a href="{{ $base }}/auth">Entrar</a>
            </div>
            <nav aria-label="Principal">
                <a href="{{ $base }}/">Início</a>
                <a href="{{ $base }}/solutions">Soluções</a>
                <a href="{{ $base }}/prices">Preços</a>
                <a href="{{ $base }}/parceria">Parceria</a>
                <a href="{{ $base }}/sobre">Sobre</a>
                <a href="{{ $base }}/blog/posts">Blog</a>
                <a href="{{ $base }}/calculadoras">Calculadoras</a>
                <a href="{{ $base }}/gerador-de-fatura">Gerador de fatura</a>
                <a href="{{ $base }}/gerador-de-codigo-barras">QR e código de barras</a>
                <a href="{{ $base }}/modelos-de-fatura">Modelos de fatura</a>
                <a href="{{ $base }}/pergunte-ao-especialista">Especialista</a>
                <a href="{{ $base }}/shop">Loja</a>
                <a href="{{ $base }}/downloads">Downloads</a>
                <a href="{{ $base }}/contact">Contacto</a>
            </nav>
        </header>

        <section class="agt-keywords" aria-label="Certificação AGT e palavras-chave">
            <h2 style="font-family:'Segoe UI',sans-serif;font-size:1.05rem;margin:0 0 .5rem;">Software de faturação certificado pela AGT em Angola</h2>
            <p style="margin:0 0 .75rem;">
                O <strong>SIGESC</strong> é <strong>software de faturação certificado pela AGT</strong>
                (Administração Geral Tributária) com o n.º
                <strong>{{ $agtCert }}</strong>.
                Também responde a pesquisas por
                <em>software de faturação em Angola</em> e
                <em>software de faturação certificado em Angola</em>.
            </p>
            <p style="margin:0;font-family:'Segoe UI',sans-serif;font-size:.88rem;color:#4b5563;">
                Número de certificação AGT:
                <strong style="font-family:ui-monospace,monospace;color:#0b3d91;">{{ $agtCert }}</strong>
            </p>
        </section>

        @yield('content')
        <footer>
            Conteúdo indexável gerado no servidor para motores de busca · SIGESC Angola · Software de faturação certificado AGT {{ $agtCert }} · {{ $agtLabel }}
        </footer>
    </div>
</body>
</html>
