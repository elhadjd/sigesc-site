<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\app;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class pricesController extends Controller
{
    function index()
    {
        $location = app()->getLocale();
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->get("https://bo.sisgesc.net/api/" . "$location/" . 55 . "/" . 'plans/');

        $dataJson = json_decode($response->body());
        if (!$response->successful()) return back()->withErrors(['error' => $dataJson->message]);
        return Inertia::render('prices/index', [
            'plans' => $dataJson
        ]);
    }

    function newCompanyPage($plan): Response
    {
        return Inertia::render('prices/Company', [
            'plan' => $plan
        ]);
    }
}
