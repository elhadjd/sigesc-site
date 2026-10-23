@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $product = $product ?? [];
        $screenshots = $screenshots ?? ($product['screenshots'] ?? []);
        $headline = $page['headline'] ?? 'SIGESC HUB';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $hero = $product['hero_image'] ?? ($screenshots[0]['src'] ?? null);
        $productUrl = $product['product_url'] ?? 'https://hub.sisgesc.net';
        $agt = $product['agt_cert'] ?? ($seo['agt_certification_number'] ?? 'FE/323/AGT/2026');
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'SIGESC HUB · Multiempresa e contabilidade' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <p style="margin:1rem 0 0;font-family:'Segoe UI',sans-serif;font-size:.95rem;color:#334155;">
        Ecossistema SIGESC · faturação eletrónica AGT
        <strong style="font-family:ui-monospace,monospace;color:#0b3d91;">{{ $agt }}</strong>
    </p>

    <p style="margin:1rem 0 0;font-family:'Segoe UI',sans-serif;">
        Aceda ao HUB:
        <a href="{{ $productUrl }}" rel="noopener">{{ $productUrl }}</a>
    </p>

    @if ($hero)
        <figure style="margin:1.75rem 0 0;">
            <img
                src="{{ $hero }}"
                alt="{{ $screenshots[0]['alt'] ?? 'SIGESC HUB' }}"
                width="1200"
                height="675"
                style="width:100%;height:auto;border-radius:12px;border:1px solid #d9d2c5;background:#0b1f20;"
            >
            <figcaption style="margin-top:.65rem;font-family:'Segoe UI',sans-serif;color:#64748b;font-size:.9rem;">
                {{ $screenshots[0]['title'] ?? 'SIGESC HUB' }} — multiempresa e contabilidade
            </figcaption>
        </figure>
    @endif

    @if (!empty($product['highlights']))
        <section style="margin-top:2rem;">
            <h2>O que o HUB oferece</h2>
            <ul>
                @foreach ($product['highlights'] as $item)
                    <li>{{ $item }}</li>
                @endforeach
            </ul>
        </section>
    @endif

    @if (!empty($screenshots))
        <section style="margin-top:2rem;">
            <h2>Imagens do SIGESC HUB</h2>
            <div style="display:grid;gap:1.25rem;margin-top:1rem;">
                @foreach ($screenshots as $shot)
                    <figure style="margin:0;">
                        <img
                            src="{{ $shot['src'] }}"
                            alt="{{ $shot['alt'] }}"
                            width="1100"
                            height="620"
                            loading="lazy"
                            style="width:100%;height:auto;border-radius:10px;border:1px solid #e2e8f0;"
                        >
                        <figcaption style="margin-top:.5rem;">
                            <strong>{{ $shot['title'] }}</strong>
                            — {{ $shot['summary'] }}
                        </figcaption>
                    </figure>
                @endforeach
            </div>
        </section>
    @endif

    @foreach ($sections as $section)
        <section style="margin-top:2rem;">
            @if (!empty($section['heading']))
                <h2>{{ $section['heading'] }}</h2>
            @endif
            @if (!empty($section['body']))
                <p>{{ $section['body'] }}</p>
            @endif
            @if (!empty($section['items']))
                <ul>
                    @foreach ($section['items'] as $item)
                        <li>{{ $item }}</li>
                    @endforeach
                </ul>
            @endif
        </section>
    @endforeach

    @if (!empty($links))
        <ul class="card-list" style="margin-top:2rem;">
            @foreach ($links as $link)
                <li>
                    <a href="{{ $link['href'] ?? '#' }}">
                        <h2>{{ $link['label'] ?? $link['href'] }}</h2>
                        @if (!empty($link['description']))
                            <p>{{ $link['description'] }}</p>
                        @endif
                    </a>
                </li>
            @endforeach
        </ul>
    @endif
@endsection
