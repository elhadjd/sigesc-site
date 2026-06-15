<?php

namespace App\Http\Controllers\Policies;

use App\Http\Controllers\Controller;
use App\Models\LearningCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourcesController extends Controller
{
    function index($resource): Response
    {
        return Inertia::render("resources/$resource");
    }

    function learningCenter(LearningCenter $learning): Response
    {
        $learnings =  $learning->with(['translate' => function ($postTranslate) {
            $postTranslate->where('local', app()->getLocale())->get();
        }])->get();

        return Inertia::render(
            'resources/learningCenter',
            [
                'data' => $learnings
            ]
        );
    }
}
