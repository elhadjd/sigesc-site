<?php

namespace App\Http\Controllers\Policies;

use App\Http\Controllers\Controller;
use App\Models\LearningCenter;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class ResourcesController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request, $resource)
    {
        $seo = $this->seo->forResource($resource);
        $prerender = [
            'kicker' => 'Recursos',
            'headline' => $seo['title'],
            'lead' => $seo['description'],
            'links' => [
                ['href' => url('/resources/help'), 'label' => 'Ajuda'],
                ['href' => url('/resources/faq'), 'label' => 'FAQ'],
                ['href' => url('/resources/privacy'), 'label' => 'Privacidade'],
                ['href' => url('/resources/terms'), 'label' => 'Termos'],
                ['href' => url('/contact'), 'label' => 'Contacto'],
            ],
        ];

        return $this->renderPublicPage($request, "resources/{$resource}", [
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function learningCenter(Request $request, LearningCenter $learning)
    {
        $learnings = $learning->with(['translate' => function ($postTranslate) {
            $postTranslate->where('local', app()->getLocale())->get();
        }])->get();

        $seo = $this->seo->forPage([
            'title' => 'Centro de aprendizagem | SIGESC',
            'description' => 'Materiais e conteúdos para aprender a usar o SIGESC e melhorar a gestão da sua empresa.',
            'path' => '/resources/learningCenter/posts',
        ]);

        return $this->renderPublicPage($request, 'resources/learningCenter', [
            'data' => $learnings,
            'seo' => $seo,
            'prerender' => [
                'headline' => 'Centro de aprendizagem SIGESC',
                'lead' => 'Conteúdos formativos para tirar o máximo do software de gestão.',
                'links' => [
                    ['href' => url('/blog/posts'), 'label' => 'Blog'],
                    ['href' => url('/downloads'), 'label' => 'Downloads'],
                ],
            ],
        ]);
    }
}
