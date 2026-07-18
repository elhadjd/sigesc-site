{{--
  Server-rendered snapshot for first paint / non-JS crawlers.
  React/Inertia replaces #app on hydration for human visitors.
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
    @endphp
    <article class="seo-prerender" itemscope itemtype="https://schema.org/BlogPosting">
        <header>
            <p>{{ $category }}</p>
            <h1 itemprop="headline">{{ $title }}</h1>
            <p itemprop="description">{{ $excerpt }}</p>
        </header>
        @if ($image)
            <img src="{{ $image }}" alt="{{ $title }}" itemprop="image">
        @endif
        <div itemprop="articleBody">
            {!! $content !!}
        </div>
    </article>
@elseif ($component === 'blog/index' && !empty($props['posts']))
    <section class="seo-prerender">
        <h1>Blog SIGESC</h1>
        <ul>
            @foreach ($props['posts'] as $postItem)
                @php
                    $slug = is_array($postItem) ? ($postItem['slug'] ?? '') : $postItem->slug;
                    $itemTitle = is_array($postItem) ? ($postItem['title'] ?? '') : $postItem->title;
                    $itemExcerpt = is_array($postItem) ? ($postItem['excerpt'] ?? '') : $postItem->excerpt;
                @endphp
                <li>
                    <a href="{{ url('/blog/posts/'.$slug) }}">
                        <h2>{{ $itemTitle }}</h2>
                        <p>{{ $itemExcerpt }}</p>
                    </a>
                </li>
            @endforeach
        </ul>
    </section>
@endif
