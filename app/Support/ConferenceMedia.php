<?php

namespace App\Support;

/**
 * Imagens do módulo Chamadas e Conferências em public/img/conferencias.
 */
class ConferenceMedia
{
    /**
     * @var list<array{key: string, file: string, title: string, alt: string, summary: string}>
     */
    protected static array $catalog = [
        [
            'key' => 'hero',
            'file' => 'hero.jpg',
            'title' => 'Conferências no SIGESC',
            'alt' => 'Conferência de vídeo SIGESC — reunião online para equipas e clientes em Angola',
            'summary' => 'Reuniões online dentro do software de gestão, com a equipa ou convidados externos.',
        ],
        [
            'key' => 'link',
            'file' => 'link-convidado.jpg',
            'title' => 'Link para convidados',
            'alt' => 'Link de conferência SIGESC enviado ao cliente sem conta no sistema',
            'summary' => 'Crie o link, envie ao cliente e ele entra na conferência sem precisar de conta SIGESC.',
        ],
        [
            'key' => 'chamada',
            'file' => 'chamada-direta.jpg',
            'title' => 'Chamadas diretas',
            'alt' => 'Chamada direta entre utilizadores no módulo de conferências SIGESC',
            'summary' => 'Ligue de um utilizador para outro dentro da empresa, sem marcar sala completa.',
        ],
        [
            'key' => 'partilha',
            'file' => 'compartilhar-tela.jpg',
            'title' => 'Partilha de ecrã',
            'alt' => 'Partilha de ecrã durante conferência SIGESC com membros da reunião',
            'summary' => 'Partilhe o ecrã com todos os participantes da conferência em tempo real.',
        ],
        [
            'key' => 'gravacao',
            'file' => 'gravacao-ecra.jpg',
            'title' => 'Gravação de ecrã',
            'alt' => 'Gravação de ecrã durante conferência de vídeo no SIGESC',
            'summary' => 'Grave a conferência para arquivo interno, formação ou acompanhamento de clientes.',
        ],
    ];

    /**
     * @return list<array{key: string, src: string, title: string, alt: string, summary: string}>
     */
    public static function all(): array
    {
        $dir = public_path('img/conferencias');
        $items = [];

        foreach (self::$catalog as $item) {
            $path = $dir.DIRECTORY_SEPARATOR.$item['file'];
            if (! is_file($path)) {
                continue;
            }

            $items[] = [
                'key' => $item['key'],
                'src' => '/img/conferencias/'.$item['file'],
                'title' => $item['title'],
                'alt' => $item['alt'],
                'summary' => $item['summary'],
            ];
        }

        return $items;
    }

    public static function heroSrc(): ?string
    {
        $all = self::all();
        foreach ($all as $item) {
            if ($item['key'] === 'hero') {
                return $item['src'];
            }
        }

        return $all[0]['src'] ?? null;
    }
}
