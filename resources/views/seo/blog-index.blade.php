@extends('seo.layout')

@section('content')
    <p class="kicker">Blog SIGESC</p>
    <h1>Faturação eletrónica AGT e gestão comercial em Angola</h1>
    <p class="excerpt">Artigos atualizados semanalmente para empresas que precisam de compliance fiscal e operações comerciais modernas.</p>

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
            <li><p>Nenhum artigo publicado ainda.</p></li>
        @endforelse
    </ul>

    @if (($pagination['last_page'] ?? 1) > 1)
        <nav aria-label="Paginação" style="margin-top:2rem;font-family:'Segoe UI',sans-serif;">
            @for ($page = 1; $page <= $pagination['last_page']; $page++)
                <a href="{{ route('blog.posts', ['page' => $page]) }}" style="margin-right:.75rem;">{{ $page }}</a>
            @endfor
        </nav>
    @endif
@endsection
