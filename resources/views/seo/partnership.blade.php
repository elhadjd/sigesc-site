@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $plan = $plan ?? [];
        $headline = $page['headline'] ?? 'Parceria SIGESC';
        $lead = $page['lead'] ?? '';
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $price = $plan['price_formatted'] ?? '40.000 Kz';
        $freelancer = $plan['freelancer'] ?? [];
        $commission = $freelancer['commission_formatted'] ?? (($freelancer['commission_percent'] ?? 30).'%');
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Programa de parceria SIGESC' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <section style="margin-top:1.75rem;padding:1.25rem 1.4rem;border-radius:14px;background:#0b3d91;color:#fff;">
        <h2 style="margin:0 0 .4rem;font-size:1.1rem;color:#fde68a;">Parceiro</h2>
        <p style="margin:0;font-size:1.85rem;font-weight:800;letter-spacing:.02em;">{{ $price }} <span style="font-size:1rem;font-weight:600;opacity:.9;">/ mês</span></p>
        @if (!empty($plan['offline_licenses_note']))
            <p style="margin:.75rem 0 0;opacity:.92;">{{ $plan['offline_licenses_note'] }}</p>
        @endif
        @if (!empty($plan['agt_cert']))
            <p style="margin:.5rem 0 0;font-size:.9rem;opacity:.85;">Software certificado AGT · {{ $plan['agt_cert'] }}</p>
        @endif
    </section>

    <section style="margin-top:1rem;padding:1.25rem 1.4rem;border-radius:14px;background:#0b2833;color:#fff;border:1px solid rgba(0,165,207,.35);">
        <h2 style="margin:0 0 .4rem;font-size:1.1rem;color:#7fd4e8;">Freelancer</h2>
        <p style="margin:0;font-size:1.85rem;font-weight:800;letter-spacing:.02em;">{{ $commission }} <span style="font-size:1rem;font-weight:600;opacity:.9;">comissão</span></p>
        <p style="margin:.75rem 0 0;opacity:.92;">{{ $freelancer['summary'] ?? 'Indique o SIGESC a clientes e ganhe comissão sobre as vendas fechadas.' }}</p>
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
