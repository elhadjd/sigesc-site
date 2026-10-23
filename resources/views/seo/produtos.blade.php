@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $products = $products ?? [];
        $headline = $page['headline'] ?? 'Produtos SIGESC';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Ecossistema SIGESC' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    @if (!empty($products))
        <section style="margin-top:2rem;">
            <h2>Produtos do ecossistema</h2>
            <ul class="card-list" style="margin-top:1rem;">
                @foreach ($products as $product)
                    <li>
                        <a href="{{ $product['href'] ?? '#' }}">
                            <h2>{{ $product['name'] ?? '' }}</h2>
                            <p><strong>{{ $product['tagline'] ?? '' }}</strong></p>
                            <p>{{ $product['description'] ?? '' }}</p>
                            @if (!empty($product['external_url']))
                                <p style="margin-top:.5rem;font-size:.9rem;">{{ $product['external_url'] }}</p>
                            @endif
                        </a>
                    </li>
                @endforeach
            </ul>
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
