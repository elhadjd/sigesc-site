@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $knowledge = $knowledge ?? [];
        $cert = $knowledge['certification'] ?? [];
        $partner = $knowledge['partnership'] ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Sobre o SIGESC' }}</p>
    <h1>{{ $page['headline'] ?? 'Sobre o SIGESC' }}</h1>
    <p class="excerpt">{{ $page['lead'] ?? '' }}</p>

    <section style="margin-top:1.5rem;padding:1rem 1.25rem;border-radius:12px;background:#0b3d91;color:#fff;">
        <p style="margin:0;"><strong>Certificação AGT:</strong> {{ $cert['number'] ?? '' }} · {{ $cert['scope'] ?? 'Faturação eletrónica' }}</p>
        <p style="margin:.5rem 0 0;"><strong>Parceria:</strong> {{ $partner['price_formatted'] ?? '40.000 Kz' }}/mês · licenças ilimitadas · Freelancer {{ data_get($partner, 'freelancer.commission_percent', 30) }}% comissão</p>
    </section>

    @foreach (($page['sections'] ?? []) as $section)
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
            @if (!empty($section['faqs']))
                @foreach ($section['faqs'] as $faq)
                    <h3>{{ $faq['question'] ?? '' }}</h3>
                    <p>{{ $faq['answer'] ?? '' }}</p>
                @endforeach
            @endif
        </section>
    @endforeach

    @if (!empty($page['links']))
        <ul class="card-list" style="margin-top:2rem;">
            @foreach ($page['links'] as $link)
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
