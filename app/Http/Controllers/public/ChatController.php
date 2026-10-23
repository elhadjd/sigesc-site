<?php

namespace App\Http\Controllers\public;

use App\Events\ChatEvent;
use App\Http\Controllers\Controller;
use App\Mail\NewChatMail;
use App\Models\Chat;
use App\Services\Chat\ChatAssistantService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class ChatController extends Controller
{
    public function __construct(
        protected ChatAssistantService $assistant
    ) {}

    /**
     * Start or resume a chat session.
     */
    public function index($sessionUser = null)
    {
        $existing = $sessionUser
            ? Chat::where('session', $sessionUser)->where('state', true)->first()
            : null;

        if ($existing) {
            cookie()->queue('chatSession', $sessionUser);

            return [
                'data' => $existing->fresh(),
                'session' => $sessionUser,
                'user' => 'user',
                'assistant' => [
                    'whatsapp' => $this->assistant->whatsappPayload(),
                ],
            ];
        }

        $session = Str::random(100);
        $userId = Auth::check() ? Auth::id() : null;

        $chat = Chat::create([
            'user_id' => $userId,
            'session' => $session,
        ]);

        $chat->conversations()->create([
            'message' => $this->assistant->welcomeMessage(),
            'user' => 'support',
        ]);

        cookie()->queue('chatSession', $session);

        try {
            $notify = (string) config('chat_assistant.notify_email', 'comercial.sigesc@gmail.com');
            if ($notify !== '') {
                Mail::to($notify)->send(new NewChatMail(['session' => $chat->session]));
            }
        } catch (Throwable $e) {
            Log::warning('Chat notify mail failed: '.$e->getMessage());
        }

        return [
            'session' => $session,
            'user' => 'user',
            'data' => $chat->fresh(),
            'assistant' => [
                'whatsapp' => $this->assistant->whatsappPayload(),
            ],
        ];
    }

    /**
     * Store a visitor message and return the assistant reply.
     */
    public function create(Request $request, $session)
    {
        $request->validate([
            'message' => 'required|string|max:4000',
            'session' => 'required|string',
            'user' => 'required|string',
        ]);

        try {
            $chat = Chat::where('session', $session)->first();
            if (! $chat || $chat->state === false) {
                throw new Exception('Chat is closed.');
            }

            $userRole = $request->user === 'support' ? 'support' : 'user';
            $text = trim((string) $request->message);

            $userMessage = $chat->conversations()->create([
                'message' => $text,
                'user' => $userRole,
            ]);

            $this->broadcastConversation($userMessage, $chat->session);

            $assistantMessage = null;

            // Only auto-reply when the visitor writes (not support/human override).
            if ($userRole === 'user' && $text !== 'End of chat.') {
                $reply = $this->assistant->reply($chat->fresh(), $text);
                $assistantMessage = $chat->conversations()->create([
                    'message' => $reply,
                    'user' => 'support',
                ]);
                $this->broadcastConversation($assistantMessage, $chat->session);
            }

            return response()->json([
                'type' => 'success',
                'user_message' => $userMessage->fresh(),
                'assistant_message' => $assistantMessage?->fresh(),
                'assistant' => [
                    'whatsapp' => $this->assistant->whatsappPayload(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning('Chat create failed: '.$e->getMessage());

            return $this->RespondError(__('Error sending message'));
        }
    }

    public function EndChat(Request $request)
    {
        $request->validate(['session' => 'required|string']);
        $chat = Chat::where('session', $request->session)->first();
        if ($chat) {
            $message = $chat->conversations()->create([
                'message' => 'End of chat.',
                'user' => $request->user ?: 'user',
            ]);
            $chat->update([
                'state' => false,
            ]);
            $this->broadcastConversation($message, $chat->session);
        }

        return $this->RespondSuccess(__('Chat end'));
    }

    protected function broadcastConversation($message, string $session): void
    {
        try {
            event(new ChatEvent($message, $session));
        } catch (Throwable $e) {
            Log::warning('Chat broadcast skipped: '.$e->getMessage());
        }
    }

    public function show(Chat $chat)
    {
        //
    }

    public function edit(Chat $chat)
    {
        //
    }

    public function update(Request $request, Chat $chat)
    {
        //
    }

    public function destroy(Chat $chat)
    {
        //
    }
}
