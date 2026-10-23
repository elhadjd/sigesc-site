@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
        $job = $job ?? [];
        $keywords = $keywords ?? [];
        $faqs = $faqs ?? (config('careers.faqs') ?? []);
        $title = $job['title'] ?? ($page['headline'] ?? 'Vaga SIGESC');
        $lead = $page['lead'] ?? ($job['summary'] ?? ($seo['description'] ?? ''));
        $metaDescription = $seo['description'] ?? $lead;
        $metaKeywords = $seo['keywords'] ?? implode(', ', $keywords);
    @endphp

    <section aria-label="Metadados SEO vaga" style="margin:1.25rem 0;padding:1rem 1.15rem;border-radius:12px;background:#fff;border:1px solid #e5e0d6;font-family:'Segoe UI',sans-serif;font-size:.9rem;color:#334155;">
        <p style="margin:0 0 .5rem;"><strong>Meta description:</strong> {{ $metaDescription }}</p>
        <p style="margin:0;"><strong>Keywords:</strong> {{ $metaKeywords }}</p>
    </section>

    <p class="kicker">
        <a href="{{ url('/carreiras') }}">Carreiras SIGESC</a>
        @if (!empty($job['department'])) · {{ $job['department'] }} @endif
    </p>
    <h1>{{ $title }}</h1>
    <p class="excerpt">{{ $lead }}</p>

    <p class="meta">
        {{ $job['location'] ?? 'Luanda, Angola' }}
        @if (!empty($job['employment_type_label'])) · {{ $job['employment_type_label'] }} @endif
        @if (!empty($job['work_mode_label'])) · {{ $job['work_mode_label'] }} @endif
        @if (!empty($job['salary_range'])) · {{ $job['salary_range'] }} @endif
    </p>

    <section style="margin-top:1.5rem;">
        <h2>Descrição da vaga</h2>
        <div style="white-space:pre-wrap;">{{ $job['description'] ?? '' }}</div>
    </section>

    @if (!empty($job['requirements']))
        <section style="margin-top:1.5rem;">
            <h2>Requisitos</h2>
            <div style="white-space:pre-wrap;">{{ $job['requirements'] }}</div>
        </section>
    @endif

    @if (!empty($job['benefits']))
        <section style="margin-top:1.5rem;">
            <h2>Benefícios</h2>
            <div style="white-space:pre-wrap;">{{ $job['benefits'] }}</div>
        </section>
    @endif

    <section style="margin-top:1.75rem;padding:1.25rem 1.4rem;border-radius:14px;background:#0b3d91;color:#fff;">
        <h2 style="margin:0 0 .5rem;color:#fde68a;font-size:1.15rem;">Como se candidatar</h2>
        <p style="margin:0;">
            Candidate-se gratuitamente em
            <a href="{{ url('/carreiras/'.($job['slug'] ?? '')) }}" style="color:#fde68a;font-weight:700;">
                sisgesc.net/carreiras/{{ $job['slug'] ?? '' }}
            </a>
            — preencha nome, e-mail e carta de apresentação. Recebe confirmação por e-mail e a equipa SIGESC é notificada.
        </p>
    </section>

    @if (!empty($keywords))
        <section style="margin-top:2rem;">
            <h2>Palavras-chave desta vaga</h2>
            <ul>
                @foreach ($keywords as $kw)
                    <li>{{ $kw }}</li>
                @endforeach
            </ul>
        </section>
    @endif

    @if (!empty($faqs))
        <section style="margin-top:2rem;">
            <h2>Perguntas frequentes</h2>
            @foreach ($faqs as $faq)
                <h3>{{ $faq['question'] ?? '' }}</h3>
                <p>{{ $faq['answer'] ?? '' }}</p>
            @endforeach
        </section>
    @endif

    <ul class="card-list" style="margin-top:2rem;">
        <li>
            <a href="{{ url('/carreiras') }}">
                <h2>Todas as vagas SIGESC</h2>
                <p>Emprego em tecnologia, produto e comercial B2B em Angola</p>
            </a>
        </li>
        <li>
            <a href="{{ url('/contact') }}">
                <h2>Candidatura espontânea</h2>
                <p>Contacto comercial e recrutamento</p>
            </a>
        </li>
        <li>
            <a href="{{ url('/sobre') }}">
                <h2>Sobre o SIGESC</h2>
                <p>Software de faturação certificado AGT em Angola</p>
            </a>
        </li>
    </ul>
@endsection
