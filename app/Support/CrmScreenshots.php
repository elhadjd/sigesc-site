<?php

namespace App\Support;

/**
 * Screenshots do módulo CRM em public/img/crm (aliases curtos + originais).
 */
class CrmScreenshots
{
    /**
     * Ordem e metadados preferidos (ficheiros curtos em /img/crm).
     *
     * @var list<array{key: string, file: string, title: string, alt: string, summary: string}>
     */
    protected static array $catalog = [
        [
            'key' => 'painel',
            'file' => 'painel.png',
            'title' => 'Painel CRM',
            'alt' => 'Painel CRM SIGESC — visão geral de oportunidades e desempenho comercial',
            'summary' => 'Dashboard com pipeline, contactos e indicadores comerciais numa só vista.',
        ],
        [
            'key' => 'pipeline',
            'file' => 'pipeline.png',
            'title' => 'Pipeline de vendas',
            'alt' => 'Pipeline de vendas CRM SIGESC — etapas do funil comercial',
            'summary' => 'Funil visual para acompanhar negócios desde o lead até ao fecho.',
        ],
        [
            'key' => 'contactos',
            'file' => 'contactos.png',
            'title' => 'Gestão de contactos',
            'alt' => 'Gestão de contactos CRM SIGESC — fichas de clientes e leads',
            'summary' => 'Fichas completas de clientes, leads e histórico comercial.',
        ],
        [
            'key' => 'atividades',
            'file' => 'atividades.png',
            'title' => 'Atividades e tarefas',
            'alt' => 'Atividades CRM SIGESC — tarefas, follow-ups e agenda comercial',
            'summary' => 'Tarefas, follow-ups e agenda para a equipa não perder nenhuma oportunidade.',
        ],
        [
            'key' => 'whatsapp',
            'file' => 'whatsapp.png',
            'title' => 'Conversas WhatsApp',
            'alt' => 'CRM SIGESC — conversa com o cliente no WhatsApp integrada',
            'summary' => 'Fale com o cliente no WhatsApp sem sair do SIGESC.',
        ],
        [
            'key' => 'email',
            'file' => 'email.png',
            'title' => 'Conversas por email',
            'alt' => 'CRM SIGESC — conversa com o cliente via email integrada',
            'summary' => 'Email comercial ligado ao contacto e ao negócio em curso.',
        ],
        [
            'key' => 'relatorios',
            'file' => 'relatorios.png',
            'title' => 'Relatórios CRM',
            'alt' => 'Relatórios CRM SIGESC — desempenho de vendas e equipa',
            'summary' => 'Relatórios de conversão, equipa e desempenho do funil.',
        ],
    ];

    /**
     * @return list<array{key: string, src: string, title: string, alt: string, summary: string}>
     */
    public static function all(): array
    {
        $dir = public_path('img/crm');
        $items = [];

        foreach (self::$catalog as $item) {
            $path = $dir.DIRECTORY_SEPARATOR.$item['file'];
            if (! is_file($path)) {
                continue;
            }

            $items[] = [
                'key' => $item['key'],
                'src' => '/img/crm/'.$item['file'],
                'title' => $item['title'],
                'alt' => $item['alt'],
                'summary' => $item['summary'],
            ];
        }

        if ($items !== []) {
            return $items;
        }

        // Fallback: qualquer imagem na pasta (incluindo nomes longos originais).
        if (! is_dir($dir)) {
            return [];
        }

        foreach (scandir($dir) ?: [] as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            if (! preg_match('/\.(png|jpe?g|webp|gif)$/i', $file)) {
                continue;
            }

            $items[] = [
                'key' => pathinfo($file, PATHINFO_FILENAME),
                'src' => '/img/crm/'.rawurlencode($file),
                'title' => 'CRM SIGESC',
                'alt' => 'Módulo CRM do software SIGESC — '.$file,
                'summary' => 'Interface do módulo CRM SIGESC.',
            ];
        }

        return $items;
    }

    public static function heroSrc(): ?string
    {
        $all = self::all();
        foreach ($all as $item) {
            if ($item['key'] === 'painel') {
                return $item['src'];
            }
        }

        return $all[0]['src'] ?? null;
    }
}
