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
use App\Http\Controllers\public\Blog\EngagementController;
use App\Http\Controllers\public\BlogController;
use App\Http\Controllers\public\ChatController;
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

Route::get('auth/callback', [AuthenticatedSessionController::class, 'authenticateWithSocialCallback']);

require __DIR__ . '/auth.php';

Route::get('/', [DashboardController::class, 'index']);

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::get('/auth', 'create')->name('auth');
    Route::get('/loginWithSocial/{drive}', 'authenticateWithSocial')->middleware('guest');
    Route::post('authenticate', 'store')->middleware('guest');
    Route::get('authenticate/logout', 'destroy');
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
    Route::get('{slug}', [BlogController::class, 'show'])->name('blog.posts.show');
    Route::post('{post}/like', [EngagementController::class, 'likePost'])->name('blog.posts.like');
    Route::get('{post}/comments', [EngagementController::class, 'getComments'])->name('blog.posts.comments');
    Route::post('{post}/comment', [EngagementController::class, 'storeComment'])->name('blog.posts.comment');
    Route::post('{post}/comment/{comment}/like', [EngagementController::class, 'likeComment'])->name('blog.posts.comment.like');
});


Route::fallback(function () {
    return Inertia::render('dashboard', [
        'local' => app()->getLocale()
    ])->toResponse(request())->setStatusCode(404);
});
