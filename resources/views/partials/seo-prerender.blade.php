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
@elseif ($component === 'calculators/index')
    <section class="seo-prerender" style="max-width:760px;margin:0 auto;padding:2rem 1rem;font-family:Georgia,serif;color:#14213d;">
        <h1>Calculadoras fiscais Angola</h1>
        <p>IRT 2026, IVA, Imposto Industrial, retenção na fonte e contribuição cambial — cálculos no servidor com base na lei configurada.</p>
        <ul>
            <li>IRT Grupo A (salários)</li>
            <li>IRT Grupo C (simplificado / sector primário)</li>
            <li>IVA (14%, 7%, 5%, 1%)</li>
            <li>Imposto Industrial (25%, 10%, 35%)</li>
            <li>Retenção na fonte 6,5%</li>
            <li>Contribuição cambial 2,5% / 10%</li>
        </ul>
    </section>
@endif
