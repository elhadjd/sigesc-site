<?php

namespace App\Http\Controllers\public;

use App\Events\ChatEvent;
use App\Http\Controllers\Controller;
use App\Mail\NewChatMail;
use App\Models\Chat;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($sessionUser = null)
    {
        $chat = Chat::where('session', $sessionUser)->first();
        if ($chat && Chat::where('session', $sessionUser)->first()->state) {
            cookie()->queue('chatSession', $sessionUser);
            return ['data' => $chat, 'session' => $sessionUser, 'user' => 'support'];
        }
        $session = Str::random(100);
        $userId = null;
        if (Auth::check()) $userId = Auth::user()->id;
        $chat = Chat::create([
            'user_id' => $userId,
            'session' => $session,
        ]);

        $chat->conversations()->create([
            'message' => __('Wellcome to chat live'),
            'user' => 'support'
        ]);
        cookie()->queue('chatSession', $session);

        Mail::to('comercial.sigesc@gmail.com')->send(new NewChatMail(['session' => $chat->session]));

        return ['session' => $session, 'user' => 'user', 'data' => $chat->fresh()];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $session)
    {
        $request->validate([
            'message' => 'required|string',
            'session' => "required|string",
            'user' => 'required|string'
        ]);

        try {
            $chat = Chat::where('session', $session)->first();
            if ($chat->state === false) {
                throw new Exception("Chat is closed.", 1);
            }

            $message = $chat->conversations()->create(['message' => $request->message, 'user' => $request->user]);

            event(new ChatEvent($message, $chat->session));
        } catch (\Exception $e) {
            return $this->RespondError(__('Error sending message'));
        }
    }

    public function EndChat(Request $request)
    {
        $request->validate(['session' => 'required|string']);
        $chat = Chat::where('session', $request->session)->first();
        if ($chat) {
            $message = $chat->conversations()->create(['message' => 'End of chat.', 'user' => $request->user]);
            $chat->update([
                'state' => false
            ]);
            event(new ChatEvent($message, $chat->session));
        }

        return $this->RespondSuccess(__('Chat end'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Chat $chat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chat $chat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chat $chat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chat $chat)
    {
        //
    }
}
