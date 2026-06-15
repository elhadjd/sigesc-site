<?php

use App\Models\Chat;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('welcomeUser.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.email.verified.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('resetPassword.{email}', function ($email) {
    $user = User::where('email', $email)->first();
    return (string) $user->email === (string) $email;
});


Broadcast::channel('Chat.{sessionId}', function ($user, $sessionId) {
    return true;
});
