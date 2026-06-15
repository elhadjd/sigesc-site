<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class clientDepoimentsController extends Controller
{
    function index($page): Response
    {
        return Inertia::render("clients/$page");
    }
}
