<?php

namespace App\Support;

/**
 * Imagens do produto SIGESC Hospitalar em public/img/produtos/hospitalar.
 */
class HospitalarMedia
{
    /**
     * @var list<array{key: string, file: string, title: string, alt: string, summary: string}>
     */
    protected static array $catalog = [
        [
            'key' => 'hero',
            'file' => 'hero.jpg',
            'title' => 'SIGESC Hospitalar',
            'alt' => 'SIGESC Hospitalar — software de gestão para clínicas e hospitais',
            'summary' => 'Sistema HIS no navegador: recepção, agenda, triagem, consultas, lab, farmácia e faturação.',
        ],
        [
            'key' => 'recepcao',
            'file' => 'recepcao.jpg',
            'title' => 'Recepção e pacientes',
            'alt' => 'Recepção e gestão de pacientes no SIGESC Hospitalar',
            'summary' => 'Registe visitas, organize a fila e mantenha o histórico de cada paciente.',
        ],
        [
            'key' => 'agenda',
            'file' => 'agenda.jpg',
            'title' => 'Agenda médica',
            'alt' => 'Agenda e marcação de consultas no SIGESC Hospitalar',
            'summary' => 'Marque consultas por médico, especialidade, dia e hora.',
        ],
        [
            'key' => 'triagem',
            'file' => 'triagem.jpg',
            'title' => 'Triagem e consulta',
            'alt' => 'Triagem e consulta clínica no SIGESC Hospitalar',
            'summary' => 'Sinais vitais, urgência, diagnóstico e plano de tratamento num só fluxo.',
        ],
        [
            'key' => 'laboratorio',
            'file' => 'laboratorio.jpg',
            'title' => 'Laboratório e farmácia',
            'alt' => 'Laboratório e farmácia hospitalar no SIGESC Hospitalar',
            'summary' => 'Pedidos de exames, resultados e dispensa de medicamentos.',
        ],
        [
            'key' => 'faturacao',
            'file' => 'faturacao.jpg',
            'title' => 'Faturação hospitalar',
            'alt' => 'Faturação e relatórios no SIGESC Hospitalar',
            'summary' => 'Cobranças, relatórios e visão do fluxo clínico completo.',
        ],
    ];

    /**
     * @return list<array{key: string, src: string, title: string, alt: string, summary: string}>
     */
    public static function all(): array
    {
        $dir = public_path('img/produtos/hospitalar');
        $items = [];

        foreach (self::$catalog as $item) {
            $path = $dir.DIRECTORY_SEPARATOR.$item['file'];
            if (! is_file($path)) {
                continue;
            }

            $items[] = [
                'key' => $item['key'],
                'src' => '/img/produtos/hospitalar/'.$item['file'],
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
