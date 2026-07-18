<?php

namespace Tests\Unit;

use App\Events\ExpertAnswerReady;
use App\Models\AiContent\ExpertQuestion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ExpertAnswerReadyEventTest extends TestCase
{
    use RefreshDatabase;

    public function test_broadcasts_on_ask_expert_channel_with_payload(): void
    {
        $question = ExpertQuestion::create([
            'question' => 'Como vender na internet em Angola com WhatsApp Business?',
            'asker_name' => 'Ana',
            'status' => 'answered',
            'answer_html' => '<p>Use catálogo e follow-up.</p>',
            'quality_score' => 88,
        ]);

        $event = new ExpertAnswerReady($question->fresh());

        $this->assertSame('ask-expert.ready', $event->broadcastAs());
        $this->assertSame('AskExpert.'.$question->uuid, $event->broadcastOn()[0]->name);
        $this->assertSame('<p>Use catálogo e follow-up.</p>', $event->broadcastWith()['answer_html']);
        $this->assertSame('answered', $event->broadcastWith()['status']);
    }

    public function test_event_is_dispatched_when_faked(): void
    {
        Event::fake([ExpertAnswerReady::class]);

        $question = ExpertQuestion::create([
            'question' => 'Qual sistema de gestão usar em Luanda?',
            'status' => 'answered',
            'answer_html' => '<p>Depende do setor.</p>',
        ]);

        event(new ExpertAnswerReady($question));

        Event::assertDispatched(ExpertAnswerReady::class, function (ExpertAnswerReady $event) use ($question) {
            return $event->question->is($question);
        });
    }
}
