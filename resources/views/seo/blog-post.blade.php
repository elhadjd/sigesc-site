@extends('seo.layout')

@section('content')
    <article itemscope itemtype="https://schema.org/BlogPosting">
        <p class="kicker">{{ $post->category }}</p>
        <h1 itemprop="headline">{{ $post->title }}</h1>
        <p class="meta">
            <span itemprop="author">{{ $post->author_name }}</span>
            ·
            <time datetime="{{ optional($post->publish_date)->toDateString() }}" itemprop="datePublished">
                {{ optional($post->publish_date)->format('d/m/Y') }}
            </time>
            · {{ $post->read_time }} min de leitura
        </p>
        <p class="excerpt" itemprop="description">{{ $post->excerpt }}</p>

        @if ($post->image)
            <img class="hero" src="{{ $post->image }}" alt="{{ $post->title }}" itemprop="image">
        @endif

        <div itemprop="articleBody">
            {!! $post->content !!}
        </div>

        @if (!empty($post->tags))
            <p class="meta" style="margin-top:2rem;">
                Tags:
                @foreach ($post->tags as $tag)
                    <span>{{ $tag }}@if (!$loop->last), @endif</span>
                @endforeach
            </p>
        @endif
    </article>

    @if ($relatedPosts->isNotEmpty())
        <section style="margin-top:3rem;">
            <h2 style="font-family:'Segoe UI',sans-serif;">Artigos relacionados</h2>
            <ul class="card-list">
                @foreach ($relatedPosts as $related)
                    <li>
                        <a href="{{ route('blog.posts.show', $related->slug) }}">
                            <h2>{{ $related->title }}</h2>
                            <p class="meta">{{ $related->category }} · {{ optional($related->publish_date)->format('d/m/Y') }}</p>
                        </a>
                    </li>
                @endforeach
            </ul>
        </section>
    @endif
@endsection
