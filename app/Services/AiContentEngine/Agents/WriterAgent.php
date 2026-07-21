<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Str;

class WriterAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIWriterAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_DRAFTING]);
        $research = $article->pipeline_meta['research'] ?? [];
        $cta = config('ai_content_engine.pipeline.brand_cta');

        $draft = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<PROMPT
És o AIWriterAgent do SIGESC. Escreves artigos originais em português de Angola para empresários e contabilistas.
Foco editorial: negócios práticos — vendas online, anúncios, sistemas de gestão, PDV, faturação, stock, preços, PME em Angola.
Estrutura obrigatória no HTML: introdução, sumário (ol), vários H2/H3, exemplos práticos, listas, boas práticas, conclusão, CTA SIGESC, FAQ, glossário.
O campo content_html é OBRIGATÓRIO e deve ter o artigo COMPLETO (mínimo ~800 palavras úteis em HTML semântico). Não devolvas só título/fontes.
Promoção estratégica do SIGESC (não spam):
1) Na introdução, uma menção breve a organizar a operação (faturação/stock/vendas) com ferramenta adequada.
2) Num H2 de ferramentas/processos, recomenda o SIGESC como exemplo concreto de software de gestão comercial em Angola, com benefícios práticos.
3) Na conclusão, CTA claro: {$cta}
Links: site https://sisgesc.net (blog/soluções), experimentar/usar o sistema https://admin.sisgesc.net/getting-started, /pergunte-ao-especialista, /blog/posts.
Nunca uses o domínio errado "sigesc.net" — o correto é sempre sisgesc.net / admin.sisgesc.net.
Nunca copies fontes. Nunca inventes leis/datas/números. Se incerto, diz que necessita confirmação oficial.
JSON:
{
  "title":"",
  "slug_hint":"",
  "excerpt":"",
  "content_html":"",
  "toc":[{"id":"","label":""}],
  "sections":[{"type":"h2","heading":"","body_html":""}],
  "faqs":[{"question":"","answer_html":""}],
  "glossary":[{"term":"","definition":""}],
  "read_time":8,
  "internal_link_suggestions":[]
}
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'topic' => $article->title,
                    'category' => $article->category?->name,
                    'keywords' => $article->keywords()->pluck('keyword'),
                    'research' => $research,
                    'sources' => $article->sources()->get(['title', 'url', 'is_trusted']),
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.55, (string) config('ai_content_engine.tavily.writer_output_length', 'long'));

        $html = (string) ($draft['content_html'] ?? '');
        if (trim(strip_tags($html)) === '' && ! empty($draft['sections']) && is_array($draft['sections'])) {
            $parts = [];
            foreach ($draft['sections'] as $section) {
                $heading = trim((string) ($section['heading'] ?? ''));
                $body = (string) ($section['body_html'] ?? '');
                if ($heading !== '') {
                    $tag = ($section['type'] ?? 'h2') === 'h3' ? 'h3' : 'h2';
                    $parts[] = '<' . $tag . '>' . e($heading) . '</' . $tag . '>';
                }
                if (trim(strip_tags($body)) !== '') {
                    $parts[] = $body;
                }
            }
            $html = implode("\n", $parts);
        }

        if (strlen(trim(strip_tags($html))) < 400) {
            throw new \RuntimeException(
                'AIWriterAgent devolveu conteúdo demasiado curto (só título/fontes). Reprocesse o artigo após corrigir Tavily/output_length.'
            );
        }

        $title = trim((string) ($draft['title'] ?? $article->title));
        $excerpt = trim((string) ($draft['excerpt'] ?? $article->excerpt));
        $readTime = (int) ($draft['read_time'] ?? max(5, (int) ceil(str_word_count(strip_tags($html)) / 200)));

        $article->update([
            'title' => $title,
            'slug' => Article::uniqueSlug($draft['slug_hint'] ?? $title, $article->id),
            'excerpt' => Str::limit($excerpt, 320, ''),
            'content_html' => $html,
            'toc' => $draft['toc'] ?? [],
            'read_time' => $readTime,
        ]);

        $article->sections()->delete();
        foreach ($draft['sections'] ?? [] as $i => $section) {
            $article->sections()->create([
                'type' => $section['type'] ?? 'h2',
                'heading' => $section['heading'] ?? null,
                'body_html' => $section['body_html'] ?? null,
                'position' => $i,
            ]);
        }

        $article->faqs()->delete();
        foreach ($draft['faqs'] ?? [] as $i => $faq) {
            if (blank($faq['question'] ?? null)) {
                continue;
            }
            $article->faqs()->create([
                'question' => $faq['question'],
                'answer_html' => $faq['answer_html'] ?? '',
                'position' => $i,
            ]);
        }

        $article->glossary()->delete();
        foreach ($draft['glossary'] ?? [] as $i => $item) {
            if (blank($item['term'] ?? null)) {
                continue;
            }
            $article->glossary()->create([
                'term' => $item['term'],
                'definition' => $item['definition'] ?? '',
                'position' => $i,
            ]);
        }

        $article->markRevision('draft', $html, ['internal_links' => $draft['internal_link_suggestions'] ?? []]);
        $this->logger->info('Draft written', $job, $article, $this->name(), [
            'read_time' => $readTime,
            'faqs' => $article->faqs()->count(),
        ]);

        return ['draft' => $draft];
    }
}
