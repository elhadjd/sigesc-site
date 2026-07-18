<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Jobs\AiContent\AnswerExpertQuestion;
use App\Models\AiContent\ExpertQuestion;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class AskExpertController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        return $this->renderPublicPage($request, 'ask-expert/index', [
            'seo' => $this->seo->forAskExpert(),
            'prerender' => $this->content->askExpert(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string|min:12|max:1000',
            'asker_name' => 'nullable|string|max:120',
            'asker_email' => 'nullable|email|max:180',
        ]);

        $question = ExpertQuestion::create([
            'question' => $data['question'],
            'asker_name' => $data['asker_name'] ?? null,
            'asker_email' => $data['asker_email'] ?? null,
            'status' => 'queued',
        ]);

        // database/redis: entra logo na tabela `jobs` para o worker processar.
        // sync: afterResponse evita bloquear o redirect da página.
        if (in_array((string) config('queue.default'), ['database', 'redis'], true)) {
            AnswerExpertQuestion::dispatch($question->id);
        } else {
            AnswerExpertQuestion::dispatch($question->id)->afterResponse();
        }

        $message = filled($question->asker_email)
            ? 'Pergunta recebida. Estamos a preparar a resposta — também a enviaremos para o seu email (com o link do artigo, se for publicado).'
            : 'Pergunta recebida. Estamos a preparar a resposta. Acompanhe esta página; com email avisamos quando estiver pronta.';

        return redirect()
            ->route('ask-expert.show', $question->uuid)
            ->with('success', $message);
    }

    public function show(Request $request, string $uuid)
    {
        $question = ExpertQuestion::with('article:id,title,slug,status,published_at,post_id')
            ->where('uuid', $uuid)
            ->firstOrFail();

        $seo = $this->seo->forPage([
            'title' => 'Resposta do Especialista | SIGESC',
            'description' => str($question->question)->limit(150)->toString(),
            'path' => '/pergunte-ao-especialista/'.$question->uuid,
            'og_type' => 'article',
        ]);

        $prerender = [
            'kicker' => 'Pergunte ao Especialista',
            'headline' => $question->question,
            'lead' => 'Resposta gerada com base em pesquisa. Confirme sempre na legislação e na AGT.',
            'html' => $question->answer_html ?: '<p>A preparar a sua resposta…</p>',
            'links' => [
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Nova pergunta'],
                ['href' => url('/blog/posts'), 'label' => 'Blog SIGESC'],
            ],
        ];

        return $this->renderPublicPage($request, 'ask-expert/show', [
            'question' => $question,
            'seo' => $seo,
            'prerender' => $prerender,
            'flash' => [
                'success' => $request->session()->get('success'),
            ],
        ]);
    }
}
