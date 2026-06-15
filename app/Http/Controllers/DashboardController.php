<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render("dashboard", [
            "local" => $request->getLocale()
        ]);
    }
}
