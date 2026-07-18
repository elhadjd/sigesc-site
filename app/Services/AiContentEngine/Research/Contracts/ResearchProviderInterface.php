<?php

namespace App\Services\AiContentEngine\Research\Contracts;

interface ResearchProviderInterface
{
    public function name(): string;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(string $topic, int $limit = 8): array;
}
