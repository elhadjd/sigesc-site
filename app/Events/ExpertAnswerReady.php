<?php

namespace App\Events;

use App\Models\AiContent\ExpertQuestion;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Notifies the ask-expert page (via Pusher) that the answer is ready — no polling.
 */
class ExpertAnswerReady implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ExpertQuestion $question) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('AskExpert.'.$this->question->uuid),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ask-expert.ready';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $this->question->loadMissing('article:id,title,slug,status');

        return [
            'uuid' => $this->question->uuid,
            'status' => $this->question->status,
            'quality_score' => $this->question->quality_score,
            'answer_html' => $this->question->answer_html,
            'article' => $this->question->article
                ? [
                    'id' => $this->question->article->id,
                    'title' => $this->question->article->title,
                    'slug' => $this->question->article->slug,
                    'status' => $this->question->article->status,
                ]
                : null,
        ];
    }
}
