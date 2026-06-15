<?php

namespace App\Http\Controllers\shop;

use App\Http\Controllers\Controller;
use App\Models\book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\Ssr\Response as SsrResponse;

class shopController extends Controller
{
    function index($page = null): Response
    {
        if (!$page) return Inertia::render('shop/index', ['local' => app()->getLocale()]);
        return Inertia::render("shop/$page", ['local' => app()->getLocale()]);
    }

    function audioBooksPage(): Response
    {
        return Inertia::render('shop/books/audio-books', [
            'local' => app()->getLocale(),
            'books' => book::all(),
        ]);
    }


    function downloadAudioBooks($local, book $book)
    {
        $filePath = storage_path("app/public/videos/{$book->url_download}");

        if (!file_exists($filePath)) {
            abort(404);
        }

        $book->downloads()->create([
            'ip_client' => request()->ip()
        ]);

        return response()->download($filePath);
    }
}
