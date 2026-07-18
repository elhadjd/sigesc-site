<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Jobs\AiContent\AnswerExpertQuestion;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\AskExpertService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AskExpertController extends Controller
{
    public function index()
    {
        return Inertia::render('ask-expert/index', [
            'seo' => [
                'title' => 'Pergunte ao Especialista | SIGESC',
                'description' => 'Faça uma pergunta sobre AGT, IVA, gestão comercial ou empreendedorismo em Angola. A IA do SIGESC pesquisa e responde com base em fontes.',
                'canonical' => url('/pergunte-ao-especialista'),
                'og_type' => 'website',
            ],
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

    public function show(string $uuid)
    {
        $question = ExpertQuestion::with('article:id,title,slug,status')
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('ask-expert/show', [
            'question' => $question,
            'seo' => [
                'title' => 'Resposta do Especialista | SIGESC',
                'description' => str($question->question)->limit(150)->toString(),
                'canonical' => url('/pergunte-ao-especialista/'.$question->uuid),
                'og_type' => 'article',
            ],
        ]);
    }
}
