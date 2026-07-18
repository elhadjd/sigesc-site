@extends('seo.layout')

@section('content')
    @php
        $page = $page ?? [];
    @endphp

    <p class="kicker">{{ $page['kicker'] ?? 'Blog SIGESC' }}</p>
    <h1>{{ $page['headline'] ?? 'Faturação eletrónica AGT e gestão comercial em Angola' }}</h1>
    <p class="excerpt">{{ $page['lead'] ?? 'Artigos atualizados para empresas que precisam de compliance fiscal e operações comerciais modernas.' }}</p>

    @foreach ($page['sections'] ?? [] as $section)
        <section style="margin-top:1.75rem;">
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

    <h2 style="margin-top:2.5rem;">Artigos publicados</h2>
    <ul class="card-list">
        @forelse ($posts as $post)
            <li>
                <a href="{{ route('blog.posts.show', $post->slug) }}">
                    <p class="kicker">{{ $post->category }} · {{ optional($post->publish_date)->format('d/m/Y') }}</p>
                    <h2>{{ $post->title }}</h2>
                    <p>{{ $post->excerpt }}</p>
                </a>
            </li>
        @empty
            <li><p>Nenhum artigo publicado ainda — em breve novos conteúdos sobre AGT, IVA e gestão.</p></li>
        @endforelse
    </ul>

    @if (!empty($categories))
        <p class="meta" style="margin-top:1.5rem;">
            Categorias:
            @foreach ($categories as $category)
                <a href="{{ route('blog.posts', ['category' => $category]) }}">{{ $category }}</a>@if (!$loop->last), @endif
            @endforeach
        </p>
    @endif

    @if (($pagination['last_page'] ?? 1) > 1)
        <nav aria-label="Paginação" style="margin-top:2rem;font-family:'Segoe UI',sans-serif;">
            @for ($pageNum = 1; $pageNum <= $pagination['last_page']; $pageNum++)
                <a href="{{ route('blog.posts', ['page' => $pageNum]) }}" style="margin-right:.75rem;">{{ $pageNum }}</a>
            @endfor
        </nav>
    @endif

    <ul class="card-list" style="margin-top:2rem;">
        <li><a href="{{ url('/calculadoras') }}"><h2>Calculadoras fiscais</h2><p>IRT 2026, IVA, Imposto Industrial</p></a></li>
        <li><a href="{{ url('/pergunte-ao-especialista') }}"><h2>Pergunte ao Especialista</h2><p>Dúvidas com pesquisa de fontes</p></a></li>
        <li><a href="{{ url('/solutions') }}"><h2>Soluções SIGESC</h2><p>Módulos PDV, stock e faturação</p></a></li>
    </ul>
@endsection
