{{--
  Snapshot HTML completo para motores de busca / first paint.
  Deve espelhar o conteúdo publicado vindo da base de dados.
--}}
@php
    $component = $page['component'] ?? null;
    $props = $page['props'] ?? [];
@endphp

@if ($component === 'blog/post' && !empty($props['post']))
    @php
        $post = $props['post'];
        $title = is_array($post) ? ($post['title'] ?? '') : $post->title;
        $category = is_array($post) ? ($post['category'] ?? '') : $post->category;
        $excerpt = is_array($post) ? ($post['excerpt'] ?? '') : $post->excerpt;
        $image = is_array($post) ? ($post['image'] ?? null) : $post->image;
        $content = is_array($post) ? ($post['content'] ?? '') : $post->content;
        $author = is_array($post) ? ($post['author_name'] ?? '') : $post->author_name;
        $date = is_array($post) ? ($post['publish_date'] ?? '') : optional($post->publish_date)->toDateString();
        $tags = is_array($post) ? ($post['tags'] ?? []) : ($post->tags ?? []);
    @endphp
    <article class="seo-prerender" itemscope itemtype="https://schema.org/BlogPosting" style="max-width:760px;margin:0 auto;padding:2rem 1rem;font-family:Georgia,serif;line-height:1.7;color:#14213d;">
        <header>
            <p style="text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;color:#64748b;">{{ $category }}</p>
            <h1 itemprop="headline" style="font-size:clamp(2rem,4vw,2.8rem);line-height:1.15;">{{ $title }}</h1>
            <p style="color:#475569;">
                <span itemprop="author">{{ $author }}</span>
                @if ($date)
                    · <time datetime="{{ $date }}" itemprop="datePublished">{{ $date }}</time>
                @endif
            </p>
            <p itemprop="description" style="font-size:1.15rem;">{{ $excerpt }}</p>
        </header>
        @if ($image)
            <img src="{{ $image }}" alt="{{ $title }}" itemprop="image" style="width:100%;border-radius:16px;margin:1.5rem 0;">
        @endif
        <div itemprop="articleBody">
            {!! $content !!}
        </div>
        @if (!empty($tags))
            <p style="margin-top:2rem;color:#64748b;font-size:.9rem;">
                Tags:
                @foreach ($tags as $tag)
                    <span>{{ is_string($tag) ? $tag : '' }}@if (!$loop->last), @endif</span>
                @endforeach
            </p>
        @endif
    </article>
@elseif ($component === 'blog/index' && !empty($props['posts']))
    <section class="seo-prerender" style="max-width:760px;margin:0 auto;padding:2rem 1rem;font-family:Georgia,serif;color:#14213d;">
        <h1>Blog SIGESC — Conteúdo para empresários em Angola</h1>
        <p>Artigos sobre AGT, IVA, IRT, gestão comercial, empreendedorismo e legislação.</p>
        <ul style="list-style:none;padding:0;">
            @foreach ($props['posts'] as $postItem)
                @php
                    $slug = is_array($postItem) ? ($postItem['slug'] ?? '') : $postItem->slug;
                    $itemTitle = is_array($postItem) ? ($postItem['title'] ?? '') : $postItem->title;
                    $itemExcerpt = is_array($postItem) ? ($postItem['excerpt'] ?? '') : $postItem->excerpt;
                @endphp
                <li style="padding:1rem 0;border-bottom:1px solid #e5e0d6;">
                    <a href="{{ url('/blog/posts/'.$slug) }}" style="color:inherit;text-decoration:none;">
                        <h2 style="margin:.25rem 0;font-size:1.35rem;">{{ $itemTitle }}</h2>
                        <p>{{ $itemExcerpt }}</p>
                    </a>
                </li>
            @endforeach
        </ul>
    </section>
@elseif (!empty($props['prerender']) && is_array($props['prerender']))
    @php $pr = $props['prerender']; @endphp
    <section class="seo-prerender" style="max-width:760px;margin:0 auto;padding:2rem 1rem;font-family:Georgia,serif;color:#14213d;">
        @if (!empty($pr['kicker']))
            <p style="text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;color:#64748b;">{{ $pr['kicker'] }}</p>
        @endif
        <h1>{{ $pr['headline'] ?? ($props['seo']['title'] ?? 'SIGESC') }}</h1>
        @if (!empty($pr['lead']))
            <p style="font-size:1.15rem;">{{ $pr['lead'] }}</p>
        @endif
        @if (!empty($pr['html']))
            <div>{!! $pr['html'] !!}</div>
        @endif
        @foreach ($pr['sections'] ?? [] as $section)
            <section style="margin-top:1.5rem;">
                @if (!empty($section['heading']))
                    <h2 style="font-size:1.35rem;">{{ $section['heading'] }}</h2>
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
        @if (!empty($pr['links']))
            <ul style="list-style:none;padding:0;margin-top:2rem;">
                @foreach ($pr['links'] as $link)
                    <li style="padding:.75rem 0;border-bottom:1px solid #e5e0d6;">
                        <a href="{{ $link['href'] ?? '#' }}" style="color:#0b3d91;text-decoration:none;font-weight:600;">
                            {{ $link['label'] ?? $link['href'] }}
                        </a>
                        @if (!empty($link['description']))
                            <p style="margin:.25rem 0 0;color:#475569;">{{ $link['description'] }}</p>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </section>
@endif
