@php
    $seo = $page['props']['seo'] ?? null;
@endphp

@if (is_array($seo))
    @php
        $seoTitle = $seo['title'] ?? 'SIGESC';
        $seoDescription = $seo['description'] ?? '';
        $seoCanonical = $seo['canonical'] ?? url()->current();
        $seoImage = $seo['og_image'] ?? 'https://admin.sisgesc.net/logo.png';
    @endphp
    <title>{{ $seoTitle }}</title>
    <meta name="description" content="{{ $seoDescription }}">
    @if (!empty($seo['keywords']))
        <meta name="keywords" content="{{ $seo['keywords'] }}">
    @endif
    <meta name="robots" content="{{ $seo['robots'] ?? 'index,follow' }}">
    <link rel="canonical" href="{{ $seoCanonical }}">

    <meta property="og:site_name" content="{{ $seo['site_name'] ?? 'SIGESC' }}">
    <meta property="og:type" content="{{ $seo['og_type'] ?? 'website' }}">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDescription }}">
    <meta property="og:url" content="{{ $seoCanonical }}">
    <meta property="og:image" content="{{ $seoImage }}">
    <meta property="og:locale" content="{{ $seo['locale'] ?? 'pt_AO' }}">

    @if (($seo['og_type'] ?? null) === 'article' && !empty($seo['article']))
        <meta property="article:published_time" content="{{ $seo['article']['published_time'] ?? '' }}">
        <meta property="article:modified_time" content="{{ $seo['article']['modified_time'] ?? '' }}">
        <meta property="article:author" content="{{ $seo['article']['author'] ?? '' }}">
        <meta property="article:section" content="{{ $seo['article']['section'] ?? '' }}">
        @foreach ($seo['article']['tags'] ?? [] as $tag)
            <meta property="article:tag" content="{{ $tag }}">
        @endforeach
    @endif

    <meta name="twitter:card" content="{{ is_string($seo['twitter_card'] ?? null) ? $seo['twitter_card'] : 'summary_large_image' }}">
    <meta name="twitter:title" content="{{ $seoTitle }}">
    <meta name="twitter:description" content="{{ $seoDescription }}">
    <meta name="twitter:image" content="{{ $seoImage }}">

    @foreach ($seo['json_ld'] ?? [] as $block)
        <script type="application/ld+json">{!! json_encode($block, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES) !!}</script>
    @endforeach
@else
    <meta name="keywords"
        content="openerp, código aberto, odoo, negócios, aplicativos, saas, nuvem, insider, erp, software empresarial, software de gestão, PDV avançado, controle financeiro, gestão de estoque, gestão de compras, pequenas e médias empresas, eficiência empresarial" />
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="SIGESC">
    <link rel="canonical" href="https://www.sisgesc.net" />
    <meta property="og:url" content="https://www.sisgesc.net">
    <meta property="og:title" content="Software de gestão comercial" />
    <meta property="og:image" content="https://admin.sisgesc.net/favicon.ico" />
    <meta name="description"
        content="O SIGESC é o software de gestão comercial completo para pequenas e médias empresas. Gerencie PDV, estoque, finanças e compras em uma única plataforma. Simplifique seus processos e impulsione seu negócio com eficiência e inovação.">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SIGESC - Software de Gestão Integrado",
        "description": "O SIGESC é um software de gestão completo para pequenas e médias empresas, oferecendo PDV, controle financeiro, estoque e compras em uma única plataforma.",
        "url": "https://www.sisgesc.net",
        "logo": "https://admin.sisgesc.net/favicon.ico",
        "image": "https://admin.sisgesc.net/logo.png",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "AOA"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SIGESC",
            "url": "https://www.sisgesc.net"
        }
    }
    </script>
    <title>SIGESC - Software de Gestão Integrado para Empresas</title>
@endif
