<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Policies\ResourcesController;
use App\Http\Controllers\public\contactController;
use App\Http\Controllers\public\paymentsController;
use App\Http\Controllers\public\pricesController;
use App\Http\Controllers\profile\UserProfileController;
use App\Http\Controllers\Admin\AiContentEngineController;
use App\Http\Controllers\public\AskExpertController;
use App\Http\Controllers\public\Blog\EngagementController;
use App\Http\Controllers\public\BlogController;
use App\Http\Controllers\public\CalculatorsController;
use App\Http\Controllers\public\ChatController;
use App\Http\Controllers\public\InvoiceTemplatesController;
use App\Http\Controllers\public\RssFeedController;
use App\Http\Controllers\public\SitemapController;
use App\Http\Controllers\public\clientDepoimentsController;
use App\Http\Controllers\public\CompanyController;
use App\Http\Controllers\public\DownloadController;
use App\Http\Controllers\public\modules;
use App\Http\Controllers\shop\shopController;
use App\Models\app;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('auth/callback', [AuthenticatedSessionController::class, 'authenticateWithSocialCallback'])
    ->name('auth.social.callback');

require __DIR__ . '/auth.php';

Route::get('/', [DashboardController::class, 'index']);

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/feed.xml', [RssFeedController::class, 'blog'])->name('feed.blog');

Route::prefix('calculadoras')->name('calculators.')->group(function () {
    Route::get('', [CalculatorsController::class, 'index'])->name('index');
    Route::post('calcular', [CalculatorsController::class, 'calculate'])
        ->middleware('throttle:60,1')
        ->name('calculate');
});

Route::prefix('modelos-de-fatura')->name('invoice-templates.')->group(function () {
    Route::get('', [InvoiceTemplatesController::class, 'index'])->name('index');
    Route::get('{slug}/download', [InvoiceTemplatesController::class, 'download'])
        ->where('slug', '[a-z0-9\-]+')
        ->name('download');
    Route::get('{slug}', [InvoiceTemplatesController::class, 'show'])
        ->where('slug', '[a-z0-9\-]+')
        ->name('show');
});

Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::get('/auth', 'create')->name('auth');
    // Accept POST on /auth too — native form submit without JS would otherwise 405.
    Route::post('/auth', 'store')->middleware('guest');
    Route::get('/loginWithSocial/{drive}', 'authenticateWithSocial')
        ->middleware('guest')
        ->name('auth.social');
    Route::post('authenticate', 'store')->middleware('guest')->name('authenticate');
    // Frontend axios posts to auth/login — keep this alias.
    Route::post('auth/login', 'store')->middleware('guest')->name('auth.login');
    Route::match(['get', 'post'], 'authenticate/logout', 'destroy')->name('authenticate.logout');
});

Route::controller(modules::class)->group(function () {
    Route::get('solutions', 'page')->name('solutions');
    Route::get('modules/{module}', 'index')->name('modules');
});

Route::prefix('downloads')->group(function () {
    Route::controller(DownloadController::class)->group(function () {
        Route::get('', 'Page')->name('download-page');
        Route::get('{appType}/{appVersion}', 'Download')->name('download');
        Route::get('thanks', 'Thanks')->name('download.thanks');
    });
});

Route::get('/verificar-email/{id}', [VerifyEmailController::class, '__invoke']);

Route::get('notify-user-to-verify-email/{id}', [VerifyEmailController::class, 'notifyUserToVerifyEmail']);

Route::middleware('auth')->group(function () {
    Route::controller(UserProfileController::class)->group(function () {
        Route::post('editUserInfo/{user}', 'edit');
        Route::get('profile', 'index');
    });
    Route::get('/verificar-email', [VerifyEmailController::class, 'emailVerifyPage']);
});

Route::controller(RegisteredUserController::class)->group(function () {
    Route::get('auth/register', 'create');
    Route::post('auth/registerUser', 'store');
});

Route::controller(contactController::class)->group(function () {
    Route::post('contact/sendMessage', 'senMessage');
    Route::get('/contact', 'index');
});

Route::controller(pricesController::class)->group(function () {
    Route::get('/prices', 'index');
    Route::get('/CreateCompany/{plan}', 'newCompanyPage');
});


Route::controller(CompanyController::class)->group(function () {
    Route::post('/register/company', 'register');
});

Route::controller(paymentsController::class)->group(function () {
    Route::get('/payments/{fiscalIdentification?}/{email?}', 'index');
});

Route::controller(ResourcesController::class)->group(function () {
    Route::get('resources/{resource}', 'index')->name('resources');
    Route::get('resources/learningCenter/posts', 'learningCenter')->name('learningCenter');
});

Route::controller(ChatController::class)->group(function () {
    Route::get('new-chat/{sessionUser?}', 'index');
    Route::post('/chat-conversation/{session}', 'create');
    Route::post('chat-end', 'EndChat');
});

Route::controller(clientDepoimentsController::class)->group(function () {
    Route::get('clients/{page}', 'index')->name('clients');
});

Route::controller(shopController::class)->group(function () {
    Route::get('shop/{page?}', 'index')->name('shop');
    Route::get('/shop/books/audio-books', 'audioBooksPage')->name('audio-books');
    Route::get('shop/books/download-audio-book/{book}', 'downloadAudioBooks');
});

Route::controller(NewsletterController::class)->group(function () {
    Route::post('/newsletter/new-email', 'register')->name('new-newsletter');
    Route::get('/newsletter/unsigned/{newsletter}', 'destroy')->name('destroy-newsletter');
});

Route::prefix('blog/posts')->group(function () {
    Route::get('', [BlogController::class, 'index'])->name('blog.posts');
    // Dedicated JSON endpoint (must stay above {slug}) — keeps page URL free of AJAX/SW cache collisions.
    Route::get('data', [BlogController::class, 'data'])->name('blog.posts.data');
    Route::get('{slug}', [BlogController::class, 'show'])->name('blog.posts.show');
    Route::post('{post}/like', [EngagementController::class, 'likePost'])->name('blog.posts.like');
    Route::get('{post}/comments', [EngagementController::class, 'getComments'])->name('blog.posts.comments');
    Route::post('{post}/comment', [EngagementController::class, 'storeComment'])->name('blog.posts.comment');
    Route::post('{post}/comment/{comment}/like', [EngagementController::class, 'likeComment'])->name('blog.posts.comment.like');
});

Route::prefix('pergunte-ao-especialista')->name('ask-expert.')->group(function () {
    Route::get('', [AskExpertController::class, 'index'])->name('index');
    Route::post('', [AskExpertController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('store');
    Route::get('{uuid}', [AskExpertController::class, 'show'])->name('show');
});

Route::middleware(['auth', 'ai-content-admin'])
    ->prefix('admin/ai-content')
    ->name('admin.ai-content.')
    ->group(function () {
        Route::get('', [AiContentEngineController::class, 'dashboard'])->name('dashboard');
        Route::get('articles', [AiContentEngineController::class, 'articles'])->name('articles');
        Route::get('articles/{article}', [AiContentEngineController::class, 'show'])->name('articles.show');
        Route::post('articles/{article}/process', [AiContentEngineController::class, 'processArticle'])->name('articles.process');
        Route::post('articles/{article}/approve', [AiContentEngineController::class, 'approve'])->name('articles.approve');
        Route::post('articles/{article}/schedule', [AiContentEngineController::class, 'schedule'])->name('articles.schedule');
        Route::post('run-daily', [AiContentEngineController::class, 'runDaily'])->name('run-daily');
        Route::get('jobs', [AiContentEngineController::class, 'jobs'])->name('jobs');
        Route::get('logs', [AiContentEngineController::class, 'logs'])->name('logs');
        Route::get('expert', [AiContentEngineController::class, 'expertQuestions'])->name('expert');
        Route::get('research-settings', [AiContentEngineController::class, 'researchSettings'])->name('research-settings');
        Route::put('research-settings', [AiContentEngineController::class, 'updateResearchSettings'])->name('research-settings.update');
        Route::put('research-sources/{source}', [AiContentEngineController::class, 'toggleResearchSource'])->name('research-sources.toggle');
    });

Route::fallback(function () {
    return Inertia::render('dashboard', [
        'local' => app()->getLocale()
    ])->toResponse(request())->setStatusCode(404);
});
