<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
@foreach ($staticUrls as $url)
    <url>
        <loc>{{ $url['loc'] }}</loc>
        <changefreq>{{ $url['changefreq'] }}</changefreq>
        <priority>{{ $url['priority'] }}</priority>
    </url>
@endforeach
@php
    $seen = [];
@endphp
@foreach ($posts as $post)
    @php $seen[$post->slug] = true; @endphp
    <url>
        <loc>{{ route('blog.posts.show', $post->slug, absolute: true) }}</loc>
        <lastmod>{{ optional($post->updated_at ?? $post->publish_date)->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        @if ($post->image)
        <image:image>
            <image:loc>{{ \Illuminate\Support\Str::startsWith($post->image, ['http://', 'https://']) ? $post->image : rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/') . '/' . ltrim($post->image, '/') }}</image:loc>
            <image:title>{{ $post->title ?? $post->slug }}</image:title>
        </image:image>
        @endif
    </url>
@endforeach
@foreach (($aiArticles ?? []) as $article)
    @continue(isset($seen[$article->slug]))
    <url>
        <loc>{{ route('blog.posts.show', $article->slug, absolute: true) }}</loc>
        <lastmod>{{ optional($article->updated_at ?? $article->published_at)->toAtomString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.75</priority>
        @if ($article->featured_image)
        <image:image>
            <image:loc>{{ \Illuminate\Support\Str::startsWith($article->featured_image, ['http://', 'https://']) ? $article->featured_image : rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/') . '/' . ltrim($article->featured_image, '/') }}</image:loc>
            <image:title>{{ $article->title }}</image:title>
        </image:image>
        @endif
    </url>
@endforeach
</urlset>
