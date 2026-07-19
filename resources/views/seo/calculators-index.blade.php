@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $headline = $page['headline'] ?? 'Calculadoras fiscais Angola — IRT 2026, IVA, Imposto Industrial';
        $lead = $page['lead'] ?? 'Simuladores com base na legislação angolana configurada.';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Ferramentas fiscais Angola' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

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
            @if (!empty($section['faqs']) && is_array($section['faqs']))
                <div style="margin-top:1rem;">
                    @foreach ($section['faqs'] as $faq)
                        <h3>{{ $faq['question'] ?? '' }}</h3>
                        <p>{{ $faq['answer'] ?? '' }}</p>
                    @endforeach
                </div>
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

    <p class="meta" style="margin-top:2rem;">{{ $meta['disclaimer'] ?? '' }}</p>
@endsection
