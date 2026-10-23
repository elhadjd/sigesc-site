@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $jobs = $jobs ?? [];
        $keywords = $keywords ?? (config('careers.seo_keywords') ?? []);
        $faqs = $faqs ?? (config('careers.faqs') ?? []);
        $headline = $page['headline'] ?? 'Carreiras SIGESC — Vagas de emprego em Angola';
        $lead = $page['lead'] ?? ($seo['description'] ?? '');
        $sections = $page['sections'] ?? [];
        $links = $page['links'] ?? [];
        $metaDescription = $seo['description'] ?? '';
        $metaKeywords = $seo['keywords'] ?? implode(', ', $keywords);
    @endphp

    {{-- Mirror critical meta in body for scrapers that under-weight head --}}
    <section aria-label="Metadados SEO carreiras" style="margin:1.25rem 0;padding:1rem 1.15rem;border-radius:12px;background:#fff;border:1px solid #e5e0d6;font-family:'Segoe UI',sans-serif;font-size:.9rem;color:#334155;">
        <p style="margin:0 0 .5rem;"><strong>Meta description:</strong> {{ $metaDescription }}</p>
        <p style="margin:0;"><strong>Keywords:</strong> {{ $metaKeywords }}</p>
    </section>

    <p class="kicker">{{ $page['kicker'] ?? 'Carreiras SIGESC · Emprego em Angola' }}</p>
    <h1>{{ $headline }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <section style="margin-top:1.75rem;" aria-label="Vagas abertas">
        <h2>Vagas de emprego abertas no SIGESC</h2>
        @if (empty($jobs))
            <p>Neste momento não há vagas abertas. Consulte novamente em breve ou envie uma candidatura espontânea em <a href="{{ url('/contact') }}">sisgesc.net/contact</a>.</p>
        @else
            <ul class="card-list">
                @foreach ($jobs as $job)
                    <li>
                        <a href="{{ url('/carreiras/'.($job['slug'] ?? '')) }}">
                            <p class="kicker" style="margin:0;">{{ $job['department'] ?? 'SIGESC' }} · {{ $job['location'] ?? 'Luanda, Angola' }}</p>
                            <h2>{{ $job['title'] ?? 'Vaga' }}</h2>
                            <p>
                                {{ $job['summary'] ?? \Illuminate\Support\Str::limit(strip_tags($job['description'] ?? ''), 180) }}
                            </p>
                            <p style="font-family:'Segoe UI',sans-serif;font-size:.9rem;color:#475569;">
                                {{ $job['employment_type_label'] ?? '' }}
                                @if (!empty($job['work_mode_label'])) · {{ $job['work_mode_label'] }} @endif
                                @if (!empty($job['salary_range'])) · {{ $job['salary_range'] }} @endif
                            </p>
                        </a>
                    </li>
                @endforeach
            </ul>
        @endif
    </section>

    <section style="margin-top:2rem;">
        <h2>Emprego em tecnologia e comercial B2B em Angola</h2>
        <p>
            A página oficial de carreiras do SIGESC concentra oportunidades de
            <strong>emprego em software</strong>, <strong>full stack</strong>,
            <strong>engenharia</strong>, <strong>produto</strong> e
            <strong>consultor comercial B2B</strong> para software de gestão e
            faturação eletrónica certificada AGT — com foco em
            <strong>Luanda</strong> e outras províncias de Angola.
            Candidaturas em <a href="{{ url('/carreiras') }}">sisgesc.net/carreiras</a> são gratuitas.
        </p>
    </section>

    <section style="margin-top:2rem;">
        <h2>Palavras-chave de emprego (Angola)</h2>
        <ul>
            @foreach ($keywords as $kw)
                <li>{{ $kw }}</li>
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

    @if (!empty($faqs))
        <section style="margin-top:2rem;">
            <h2>Perguntas frequentes — carreiras SIGESC</h2>
            @foreach ($faqs as $faq)
                <h3>{{ $faq['question'] ?? '' }}</h3>
                <p>{{ $faq['answer'] ?? '' }}</p>
            @endforeach
        </section>
    @endif

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
