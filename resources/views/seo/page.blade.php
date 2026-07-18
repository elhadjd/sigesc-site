@extends('seo.layout')

@section('content')
    @php
        $headline = $page['headline'] ?? ($seo['title'] ?? 'SIGESC');
        $lead = $page['lead'] ?? ($seo['description'] ?? '');
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $html = $page['html'] ?? null;
    @endphp

    @if (!empty($page['kicker']))
        <p class="kicker">{{ $page['kicker'] }}</p>
    @endif

    <h1>{{ $headline }}</h1>

    @if ($lead)
        <p class="excerpt">{{ $lead }}</p>
    @endif

    @if ($html)
        <article>{!! $html !!}</article>
    @endif

    @foreach ($sections as $section)
        <section style="margin-top:2rem;">
            @if (!empty($section['heading']))
                <h2>{{ $section['heading'] }}</h2>
            @endif
            @if (!empty($section['body']))
                <p>{{ $section['body'] }}</p>
            @endif
            @if (!empty($section['html']))
                <div>{!! $section['html'] !!}</div>
            @endif
            @if (!empty($section['items']) && is_array($section['items']))
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
