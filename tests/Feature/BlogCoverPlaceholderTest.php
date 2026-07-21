<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogCoverPlaceholderTest extends TestCase
{
    use RefreshDatabase;

    public function test_placeholder_blog_asset_exists_and_is_valid_svg(): void
    {
        $path = public_path('img/placeholder-blog.svg');
        $this->assertFileExists($path);
        $this->assertFileDoesNotExist(public_path('img/placeholder-blog.jpg'));

        $svg = file_get_contents($path);
        $this->assertNotFalse($svg);
        $this->assertStringContainsString('<svg', $svg);
        $this->assertStringContainsString('SIGESC Blog', $svg);
    }

    public function test_avatar_placeholder_exists(): void
    {
        $this->assertFileExists(public_path('img/avatar-placeholder.svg'));
    }
}
