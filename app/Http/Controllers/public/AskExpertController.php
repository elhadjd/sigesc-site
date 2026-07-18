<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Jobs\AiContent\AnswerExpertQuestion;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\AskExpertService;
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

    public function store(Request $request, AskExpertService $service)
    {
        $data = $request->validate([
            'question' => 'required|string|min:12|max:1000',
            'asker_name' => 'nullable|string|max:120',
            'asker_email' => 'nullable|email|max:180',
            'async' => 'nullable|boolean',
        ]);

        if ($request->boolean('async')) {
            AnswerExpertQuestion::dispatch([
                'question' => $data['question'],
                'asker_name' => $data['asker_name'] ?? null,
                'asker_email' => $data['asker_email'] ?? null,
            ]);

            return back()->with('success', 'Pergunta recebida. A resposta será processada em breve.');
        }

        $question = $service->ask([
            'question' => $data['question'],
            'asker_name' => $data['asker_name'] ?? null,
            'asker_email' => $data['asker_email'] ?? null,
        ]);

        return redirect()
            ->route('ask-expert.show', $question->uuid)
            ->with('success', 'Resposta gerada com sucesso.');
    }

    public function show(Request $request, string $uuid)
    {
        $question = ExpertQuestion::with('article:id,title,slug,status')
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
            'html' => $question->answer_html ?: '<p>Resposta em processamento.</p>',
            'links' => [
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Nova pergunta'],
                ['href' => url('/blog/posts'), 'label' => 'Blog SIGESC'],
            ],
        ];

        return $this->renderPublicPage($request, 'ask-expert/show', [
            'question' => $question,
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }
}
