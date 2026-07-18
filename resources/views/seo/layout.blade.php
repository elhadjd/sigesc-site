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
    @php $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/'); @endphp
    <div class="wrap">
        <header class="site">
            <div class="brand">
                <a href="{{ $base }}/">SIGESC</a>
                <a href="{{ $base }}/auth">Entrar</a>
            </div>
            <nav aria-label="Principal">
                <a href="{{ $base }}/">Início</a>
                <a href="{{ $base }}/solutions">Soluções</a>
                <a href="{{ $base }}/prices">Preços</a>
                <a href="{{ $base }}/blog/posts">Blog</a>
                <a href="{{ $base }}/calculadoras">Calculadoras</a>
                <a href="{{ $base }}/pergunte-ao-especialista">Especialista</a>
                <a href="{{ $base }}/shop">Loja</a>
                <a href="{{ $base }}/downloads">Downloads</a>
                <a href="{{ $base }}/contact">Contacto</a>
            </nav>
        </header>
        @yield('content')
        <footer>
            Conteúdo indexável gerado no servidor para motores de busca · SIGESC Angola
        </footer>
    </div>
</body>
</html>
