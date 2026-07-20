@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $headline = $page['headline'] ?? 'Criar fatura online grátis Angola';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $documentTypes = $documentTypes ?? [];
        $taxOptions = $taxOptions ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Ferramenta gratuita · Sem conta' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <section style="margin-top:1.5rem;padding:1rem 1.25rem;border-radius:12px;background:#fff7ed;border:1px solid #fdba74;">
        <h2 style="margin:0 0 .5rem;font-size:1.05rem;">Aviso importante de privacidade</h2>
        <p style="margin:0;">As facturas criadas neste gerador <strong>não são guardadas</strong> em nenhum servidor. Os dados ficam só no seu navegador. Imprima ou guarde em PDF antes de sair.</p>
    </section>

    <section style="margin-top:2rem;">
        <h2>Tipos de documento disponíveis</h2>
        <ul>
            @foreach ($documentTypes as $type)
                <li>{{ $type['label'] ?? $type['key'] }}</li>
            @endforeach
        </ul>
    </section>

    <section style="margin-top:2rem;">
        <h2>Taxas de imposto disponíveis</h2>
        <ul>
            @foreach ($taxOptions as $tax)
                <li>{{ $tax['label'] ?? $tax['key'] }}@if(isset($tax['rate']) && $tax['rate'] >= 0) — {{ number_format(((float) $tax['rate']) * 100, 1, ',', '.') }}%@endif</li>
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
