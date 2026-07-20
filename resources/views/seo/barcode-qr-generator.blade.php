@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $headline = $page['headline'] ?? 'Gerador de código de barras e QR Code grátis';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $codeKinds = $codeKinds ?? [];
        $contentTypes = $contentTypes ?? [];
        $barcodeFormats = $barcodeFormats ?? [];
        $errorLevels = $errorLevels ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Ferramenta gratuita · Sem conta' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <section style="margin-top:1.5rem;padding:1rem 1.25rem;border-radius:12px;background:#fff7ed;border:1px solid #fdba74;">
        <h2 style="margin:0 0 .5rem;font-size:1.05rem;">Aviso importante de privacidade</h2>
        <p style="margin:0;">Os códigos criados neste gerador <strong>não são guardados</strong> em nenhum servidor. O texto, URL, Wi‑Fi e logotipo ficam só no seu navegador. Descarregue PNG ou SVG antes de sair.</p>
    </section>

    <section style="margin-top:2rem;">
        <h2>Tipos de código disponíveis</h2>
        <ul>
            @foreach ($codeKinds as $kind)
                <li><strong>{{ $kind['label'] ?? $kind['key'] }}</strong> — {{ $kind['description'] ?? '' }}</li>
            @endforeach
        </ul>
    </section>

    <section style="margin-top:2rem;">
        <h2>Conteúdos para QR Code</h2>
        <ul>
            @foreach ($contentTypes as $type)
                <li><strong>{{ $type['label'] ?? $type['key'] }}</strong> — {{ $type['hint'] ?? '' }}</li>
            @endforeach
        </ul>
    </section>

    <section style="margin-top:2rem;">
        <h2>Formatos de código de barras</h2>
        <ul>
            @foreach ($barcodeFormats as $format)
                <li><strong>{{ $format['label'] ?? $format['key'] }}</strong> — {{ $format['hint'] ?? '' }}</li>
            @endforeach
        </ul>
    </section>

    <section style="margin-top:2rem;">
        <h2>Níveis de correção de erro (QR)</h2>
        <ul>
            @foreach ($errorLevels as $level)
                <li>{{ $level['label'] ?? $level['key'] }}</li>
            @endforeach
        </ul>
    </section>

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
            @if (!empty($section['faqs']))
                @foreach ($section['faqs'] as $faq)
                    <h3>{{ $faq['question'] ?? '' }}</h3>
                    <p>{{ $faq['answer'] ?? '' }}</p>
                @endforeach
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
