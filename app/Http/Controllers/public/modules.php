<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class modules extends Controller
{
    function page(): Response
    {
        return Inertia::render("modules/index");
    }

    function index($module): Response
    {
        return Inertia::render("modules/sigesc-modules", [
            'moduleName' => ucwords(str_replace('-', '', $module))
        ]);
    }
}
