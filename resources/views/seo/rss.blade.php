<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>{{ $title }}</title>
    <link>{{ $link }}</link>
    <description>{{ $description }}</description>
    <language>pt-ao</language>
    <atom:link href="{{ url('/feed.xml') }}" rel="self" type="application/rss+xml" />
    @foreach ($posts as $post)
    <item>
      <title>{{ $post->title }}</title>
      <link>{{ route('blog.posts.show', $post->slug, absolute: true) }}</link>
      <guid isPermaLink="true">{{ route('blog.posts.show', $post->slug, absolute: true) }}</guid>
      <pubDate>{{ optional($post->publish_date)->toRfc2822String() }}</pubDate>
      <description><![CDATA[{{ $post->excerpt }}]]></description>
      <content:encoded><![CDATA[{!! $post->content !!}]]></content:encoded>
      @if ($post->category)
      <category>{{ $post->category }}</category>
      @endif
    </item>
    @endforeach
  </channel>
</rss>
