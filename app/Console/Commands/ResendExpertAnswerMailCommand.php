<?php

namespace App\Console\Commands;

use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\ExpertResultMailer;
use Illuminate\Console\Command;

class ResendExpertAnswerMailCommand extends Command
{
    protected $signature = 'ask-expert:resend-mail
        {uuid? : UUID da pergunta}
        {--email= : Filtrar / reenviar pelo email do asker}
        {--name= : Filtrar pelo nome do asker}
        {--question= : Texto parcial da pergunta}
        {--force : Reenviar mesmo se já tiver sido notificado}';

    protected $description = 'Reenvia o email da resposta do Especialista com o link público correto do blog';

    public function handle(ExpertResultMailer $mailer): int
    {
        $query = ExpertQuestion::query()->with('article.post');

        if ($uuid = $this->argument('uuid')) {
            $query->where('uuid', $uuid);
        }

        if ($email = trim((string) $this->option('email'))) {
            $query->where('asker_email', $email);
        }

        if ($name = trim((string) $this->option('name'))) {
            $query->where('asker_name', 'like', '%'.$name.'%');
        }

        if ($question = trim((string) $this->option('question'))) {
            $query->where('question', 'like', '%'.$question.'%');
        }

        if (! $this->argument('uuid') && ! $email && ! $name && ! $question) {
            $this->error('Indique uuid, --email, --name ou --question.');

            return self::FAILURE;
        }

        $questions = $query->latest('id')->limit(20)->get();
        if ($questions->isEmpty()) {
            $this->error('Nenhuma pergunta encontrada.');

            return self::FAILURE;
        }

        $force = (bool) $this->option('force');

        foreach ($questions as $question) {
            if (blank($question->asker_email)) {
                $this->warn("Pergunta {$question->uuid}: sem email — ignorada.");

                continue;
            }

            if ($force) {
                $question->forceFill([
                    'email_notified_at' => null,
                    'article_email_notified_at' => null,
                ])->saveQuietly();
            }

            $mailer->notifyAnswer($question->fresh(['article.post']), force: true);

            $article = $question->fresh(['article.post'])->article;
            $slug = $article?->post?->slug ?: $article?->slug;
            $this->info("Reenviado para {$question->asker_email} (uuid={$question->uuid})".($slug ? " · post=/blog/posts/{$slug}" : ''));
        }

        return self::SUCCESS;
    }
}
