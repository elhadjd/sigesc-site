<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C4R6W7PSK6"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-C4R6W7PSK6');
    </script>

    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="generator" content="SIGESC">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="https://admin.sisgesc.net/favicon.ico" type="image/x-icon">
    <link rel="alternate" type="application/rss+xml" title="Blog SIGESC" href="{{ url('/feed.xml') }}">

    {{-- Meta/OG/JSON-LD no HTML inicial (antes de qualquer JS) --}}
    @include('partials.seo-meta')

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,500;600;700&display=swap"
        rel="stylesheet">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @php
        if (! isset($__inertiaSsrDispatched)) {
            $__inertiaSsrDispatched = true;
            $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page);
        }
    @endphp

    @if ($__inertiaSsrResponse)
        {{-- React SSR real (quando o processo Node está ativo) --}}
        {!! $__inertiaSsrResponse->body !!}
    @else
        {{-- Fallback SSR-like: conteúdo da BD já no HTML para crawlers --}}
        <div id="app" data-page="{{ json_encode($page) }}">
            @include('partials.seo-prerender')
        </div>
    @endif

    <noscript>
        @include('partials.seo-prerender')
    </noscript>
</body>

</html>
