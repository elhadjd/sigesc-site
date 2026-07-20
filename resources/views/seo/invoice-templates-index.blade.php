@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $templates = $templates ?? [];
        $levels = $levels ?? [];
        $headline = $page['headline'] ?? 'Modelos de fatura gratuitos Angola';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Recursos gratuitos · Angola' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    @if (!empty($templates))
        <section style="margin-top:2rem;">
            <h2>Todos os modelos ({{ count($templates) }})</h2>
            <ul class="card-list">
                @foreach ($templates as $template)
                    <li>
                        <a href="{{ $template['download_url'] ?? '#' }}">
                            <h2>{{ $template['title'] ?? $template['slug'] }}</h2>
                            <p>
                                {{ $template['level_label'] ?? '' }}
                                · {{ $template['category_label'] ?? '' }}
                                — {{ $template['description'] ?? '' }}
                            </p>
                        </a>
                        <p>
                            <a href="{{ $template['preview_url'] ?? '#' }}">Pré-visualizar</a>
                            ·
                            <a href="{{ $template['download_url'] ?? '#' }}">Descarregar HTML</a>
                        </p>
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
@endsection
