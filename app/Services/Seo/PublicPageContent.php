<?php

namespace App\Services\Seo;

use App\Models\Post;
use Illuminate\Support\Collection;

/**
 * Rich prerender / crawler content shared by public pages.
 */
class PublicPageContent
{
    /**
     * @return list<array{name: string, slug: string, description: string, href: string}>
     */
    public function modules(): array
    {
        return collect(config('sigesc_modules', []))
            ->map(fn (array $module) => [
                'name' => $module['name'],
                'slug' => $module['slug'],
                'description' => $module['description'],
                'href' => url('/modules/'.$module['slug']),
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{href: string, label: string, description: string}>
     */
    public function moduleLinks(): array
    {
        return collect($this->modules())
            ->map(fn (array $m) => [
                'href' => $m['href'],
                'label' => $m['name'],
                'description' => $m['description'],
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function home(): array
    {
        $modules = $this->modules();

        return [
            'kicker' => 'Software de gestão Angola',
            'headline' => 'SIGESC — gestão comercial completa para PME',
            'lead' => 'Gerencie PDV, estoque, finanças, compras e faturação eletrónica AGT numa única plataforma feita para empresas em Angola. Ideal para lojas, farmácias, restaurantes, salões e comércio em geral.',
            'sections' => [
                [
                    'heading' => 'O que pode fazer com o SIGESC',
                    'items' => [
                        'Ponto de venda (PDV) e faturação eletrónica alinhada à AGT',
                        'Controlo de stock, inventário e alertas de reposição',
                        'Finanças, fluxo de caixa, contas a pagar e a receber',
                        'Gestão de funcionários, operações e relatórios',
                        'Compras a fornecedores e logística entre armazéns',
                        'Conformidade com IVA, IRT e Imposto Industrial em Angola',
                    ],
                ],
                [
                    'heading' => 'Soluções e módulos (submenu)',
                    'body' => 'Cada módulo abaixo tem página própria indexável. Explore as soluções SIGESC para o seu sector.',
                    'items' => collect($modules)->map(fn ($m) => $m['name'].' — '.$m['description'])->all(),
                ],
                [
                    'heading' => 'Para quem é o SIGESC',
                    'items' => [
                        'Pequenas e médias empresas em Luanda e todo o país',
                        'Comércio a retalho, grossistas e serviços',
                        'Empresas que precisam de faturação e compliance AGT',
                        'Negócios que querem PDV + stock + finanças no mesmo sistema',
                    ],
                ],
            ],
            'links' => array_merge(
                [
                    ['href' => url('/solutions'), 'label' => 'Ver todas as soluções', 'description' => 'Catálogo completo de módulos SIGESC'],
                ],
                $this->moduleLinks(),
                [
                    ['href' => url('/prices'), 'label' => 'Ver preços', 'description' => 'Planos para o seu negócio'],
                    ['href' => url('/blog/posts'), 'label' => 'Blog', 'description' => 'AGT, IVA, IRT, gestão e empreendedorismo'],
                    ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'IRT 2026, IVA, Imposto Industrial, retenção e câmbio'],
                    ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Perguntas sobre fiscalidade e gestão com fontes'],
                    ['href' => url('/downloads'), 'label' => 'Downloads', 'description' => 'Instalar o SIGESC Admin'],
                    ['href' => url('/contact'), 'label' => 'Contacto', 'description' => 'Fale com a equipa comercial'],
                ]
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function solutions(): array
    {
        return [
            'kicker' => 'Soluções SIGESC',
            'headline' => 'Soluções e módulos de gestão comercial para Angola',
            'lead' => 'O SIGESC reúne PDV, stock, faturação, finanças, RH, compras e logística num só software. Escolha o módulo abaixo — cada página explica funcionalidades para PME angolanas.',
            'sections' => [
                [
                    'heading' => 'Submenu de módulos',
                    'body' => 'Links diretos para cada solução (úteis para motores de busca e navegação sem JavaScript):',
                    'items' => collect($this->modules())->map(fn ($m) => $m['name'])->all(),
                ],
                [
                    'heading' => 'Benefícios para a sua empresa',
                    'items' => [
                        'Dados centralizados: vendas, stock e caixa no mesmo sistema',
                        'Apoio à faturação eletrónica e obrigações junto da AGT',
                        'Relatórios para decidir preços, margens e reposição',
                        'Adequado a lojas, farmácias, restaurantes, salões e serviços',
                    ],
                ],
            ],
            'links' => array_merge(
                $this->moduleLinks(),
                [
                    ['href' => url('/prices'), 'label' => 'Planos e preços', 'description' => 'Compare planos SIGESC'],
                    ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'Simule IRT, IVA e Imposto Industrial'],
                    ['href' => url('/contact'), 'label' => 'Pedir demonstração', 'description' => 'Fale com a equipa SIGESC'],
                ]
            ),
        ];
    }

    /**
     * @param  array<string, mixed>  $meta  from AngolaTaxCalculator::meta()
     * @return array<string, mixed>
     */
    public function calculators(array $meta = []): array
    {
        $ivaRates = collect($meta['iva_rates'] ?? config('angola_tax.iva.rates', []))
            ->map(function ($rate, $key) {
                if (is_array($rate)) {
                    return $rate['label'] ?? ((string) $key.' — '.(((float) ($rate['rate'] ?? 0)) * 100).'%');
                }

                return "{$key}: {$rate}";
            })
            ->values()
            ->all();

        $iiRates = collect($meta['imposto_industrial_rates'] ?? config('angola_tax.imposto_industrial.rates', []))
            ->map(function ($rate, $key) {
                if (is_array($rate)) {
                    return $rate['label'] ?? ((string) $key.' — '.(((float) ($rate['rate'] ?? 0)) * 100).'%');
                }

                return "{$key}: {$rate}";
            })
            ->values()
            ->all();

        $irtItems = collect($meta['irt_brackets'] ?? config('angola_tax.irt.group_a.brackets', []))
            ->take(6)
            ->map(function (array $b) {
                $max = $b['max'] === null ? 'acima' : number_format((float) $b['max'], 0, ',', '.');
                $min = number_format((float) $b['min'], 0, ',', '.');
                $rate = ((float) $b['rate']) * 100;

                return ($b['label'] ?? 'Escalão').": {$min}–{$max} Kz · taxa {$rate}%";
            })
            ->all();

        return [
            'kicker' => 'Ferramentas fiscais Angola',
            'headline' => 'Calculadoras fiscais Angola — IRT 2026, IVA, Imposto Industrial',
            'lead' => 'Simuladores no servidor (sem erro de float) com base na legislação configurada: Lei n.º 14/25 (OGE 2026) para IRT, Código do IVA e Código do Imposto Industrial. Úteis para PME, contabilistas e gestores que usam o SIGESC.',
            'sections' => [
                [
                    'heading' => 'IRT Grupo A (salários) — Lei n.º 14/25 / OGE 2026',
                    'body' => 'Tabela progressiva de retenção na fonte para trabalho por conta de outrem. Isenção até 150.000 Kz de rendimento bruto mensal. Fórmula: parcela fixa + taxa × (rendimento − excesso).',
                    'items' => $irtItems !== [] ? $irtItems : [
                        '1.º Escalão isento até 150.000 Kz',
                        'Escalões progressivos até 25% no último escalão',
                    ],
                ],
                [
                    'heading' => 'IRT Grupo C (empresários / regime simplificado)',
                    'body' => 'Regime simplificado 6,5% sobre volume de negócios (dentro do limite legal) e 10% para sector primário acima do limite de referência.',
                    'items' => [
                        'Taxa simplificada 6,5%',
                        'Limite de volume de negócios de referência: 10.000.000 Kz',
                        'Sector primário: 10% acima do limite',
                    ],
                ],
                [
                    'heading' => 'IVA — Código do IVA (Lei n.º 14/23)',
                    'body' => 'Calcule IVA a acrescentar ou a extrair do preço. Taxas configuradas para Angola:',
                    'items' => $ivaRates,
                ],
                [
                    'heading' => 'Imposto Industrial — art. 64.º',
                    'body' => 'Estimativa sobre lucro tributável com taxas por sector:',
                    'items' => $iiRates !== [] ? $iiRates : [
                        'Taxa geral 25%',
                        'Agricultura / sector privilegiado 10%',
                        'Banca, seguros, telecom e petróleo 35%',
                    ],
                ],
                [
                    'heading' => 'Retenção na fonte sobre serviços (6,5%)',
                    'body' => 'Cálculo da retenção aplicável a facturas de prestação de serviços, comum em subcontratação e consultoria.',
                    'items' => [
                        'Taxa de referência 6,5% sobre o valor da factura',
                        'Útil para empresas que pagam fornecedores de serviços',
                    ],
                ],
                [
                    'heading' => 'Contribuição especial sobre operações cambiais — OGE 2026',
                    'body' => 'Simulação da contribuição sobre transferências/operações cambiais:',
                    'items' => [
                        'Pessoa singular: 2,5%',
                        'Pessoa colectiva: 10%',
                    ],
                ],
                [
                    'heading' => 'Aviso importante',
                    'body' => $meta['disclaimer']
                        ?? 'Estas calculadoras são ferramentas de apoio e não substituem a AGT, o Quiosque do Contribuinte nem consultoria fiscal oficial. Confirme sempre a legislação vigente.',
                    'items' => [
                        'Fontes: AGT / MinFin / BNA (conforme configuração em vigor)',
                        'Use o Blog SIGESC e o Pergunte ao Especialista para contexto adicional',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/blog/posts'), 'label' => 'Artigos sobre IVA, IRT e AGT', 'description' => 'Conteúdo editorial SIGESC'],
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Dúvidas fiscais com pesquisa de fontes'],
                ['href' => url('/solutions'), 'label' => 'Software de gestão SIGESC', 'description' => 'PDV, stock e faturação'],
                ['href' => 'https://agt.minfin.gov.ao', 'label' => 'Portal AGT', 'description' => 'Fonte oficial'],
                ['href' => 'https://quiosqueagt.minfin.gov.ao/simulador/irt', 'label' => 'Simulador IRT AGT', 'description' => 'Referência oficial'],
            ],
        ];
    }

    /**
     * @param  Collection<int, Post>|iterable<int, Post|array<string, mixed>>  $posts
     * @return array<string, mixed>
     */
    public function blogIndex(iterable $posts = [], array $categories = []): array
    {
        $postLinks = collect($posts)->take(12)->map(function ($post) {
            $slug = is_array($post) ? ($post['slug'] ?? '') : $post->slug;
            $title = is_array($post) ? ($post['title'] ?? '') : $post->title;
            $excerpt = is_array($post) ? ($post['excerpt'] ?? '') : $post->excerpt;
            $category = is_array($post) ? ($post['category'] ?? '') : $post->category;

            return [
                'href' => url('/blog/posts/'.$slug),
                'label' => $title,
                'description' => trim(($category ? $category.' — ' : '').(string) $excerpt),
            ];
        })->all();

        return [
            'kicker' => 'Blog SIGESC Angola',
            'headline' => 'Blog: faturação eletrónica AGT, IVA, IRT e gestão comercial',
            'lead' => 'Artigos práticos para empresários e gestores em Angola: obrigações AGT, impostos (IVA, IRT, Imposto Industrial), software de gestão, PDV, stock, empreendedorismo e compliance. Conteúdo atualizado para PME que usam ou avaliam o SIGESC.',
            'sections' => [
                [
                    'heading' => 'Temas que cobrimos',
                    'items' => [
                        'Faturação eletrónica e obrigações junto da AGT',
                        'IVA, IRT 2026 (Lei n.º 14/25) e Imposto Industrial',
                        'Gestão comercial: PDV, stock, preços e fluxo de caixa',
                        'Abertura de empresa, INAPEM e licenciamento',
                        'Ferramentas: calculadoras fiscais e Pergunte ao Especialista',
                    ],
                ],
                [
                    'heading' => 'Categorias em destaque',
                    'items' => $categories !== []
                        ? $categories
                        : ['AGT', 'IVA', 'IRT', 'Gestão', 'Faturação Eletrónica', 'Empreendedorismo'],
                ],
            ],
            'links' => array_merge(
                $postLinks,
                [
                    ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'Simular IRT, IVA e Imposto Industrial'],
                    ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Tire dúvidas com pesquisa de fontes'],
                    ['href' => url('/solutions'), 'label' => 'Soluções SIGESC', 'description' => 'Módulos de gestão comercial'],
                ]
            ),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function askExpert(): array
    {
        return [
            'kicker' => 'Assistência inteligente SIGESC',
            'headline' => 'Pergunte ao Especialista — fiscalidade e gestão em Angola',
            'lead' => 'Faça perguntas sobre AGT, IVA, IRT, Imposto Industrial, faturação eletrónica, stock, PDV ou abertura de empresa. O motor de pesquisa híbrido do SIGESC consulta fontes oficiais e conteúdo recente, e a IA responde com avisos quando a informação for incerta.',
            'sections' => [
                [
                    'heading' => 'Exemplos de perguntas',
                    'items' => [
                        'Como funciona o IVA em Angola e quais as taxas?',
                        'Qual a tabela de IRT 2026 para salários?',
                        'O que é faturação eletrónica AGT para PME?',
                        'Como controlar stock e PDV numa loja em Luanda?',
                        'Que documentos preciso para abrir empresa (INAPEM)?',
                    ],
                ],
                [
                    'heading' => 'Como funciona',
                    'items' => [
                        'Pesquisa híbrida: fontes oficiais (AGT, MinFin, BNA) + Tavily + base interna',
                        'Resumo estruturado com pontos, leis, números e avisos',
                        'Não substitui consultoria fiscal oficial — confirme sempre na AGT',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'IRT, IVA, Imposto Industrial'],
                ['href' => url('/blog/posts'), 'label' => 'Blog SIGESC', 'description' => 'Artigos sobre AGT e gestão'],
                ['href' => url('/solutions'), 'label' => 'Software SIGESC', 'description' => 'Módulos PDV, stock e faturação'],
                ['href' => url('/contact'), 'label' => 'Contacto humano', 'description' => 'Equipa comercial e suporte'],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function modulePage(string $moduleName, string $slug): array
    {
        $catalog = collect($this->modules())->firstWhere('slug', $slug)
            ?? collect($this->modules())->first(fn ($m) => strcasecmp($m['name'], $moduleName) === 0);

        $description = $catalog['description']
            ?? "O módulo {$moduleName} do SIGESC ajuda empresas em Angola a organizar operações e aumentar produtividade.";

        return [
            'kicker' => 'Módulo SIGESC',
            'headline' => "{$moduleName} — software de gestão SIGESC Angola",
            'lead' => $description.' Integrado com PDV, stock, faturação e finanças no mesmo sistema.',
            'sections' => [
                [
                    'heading' => "O que inclui o módulo {$moduleName}",
                    'body' => 'Funcionalidades pensadas para PME angolanas, com dados partilhados entre módulos e relatórios para decisão.',
                    'items' => [
                        "Gestão operacional de {$moduleName}",
                        'Integração com faturação e documentos comerciais',
                        'Relatórios e indicadores de desempenho',
                        'Apoio a processos alinhados com boas práticas AGT / gestão',
                    ],
                ],
                [
                    'heading' => 'Outros módulos (submenu)',
                    'items' => collect($this->modules())->pluck('name')->all(),
                ],
            ],
            'links' => array_merge(
                [
                    ['href' => url('/solutions'), 'label' => 'Todas as soluções', 'description' => 'Catálogo de módulos'],
                ],
                $this->moduleLinks(),
                [
                    ['href' => url('/prices'), 'label' => 'Preços', 'description' => 'Planos SIGESC'],
                    ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Dúvidas de gestão e fiscalidade'],
                ]
            ),
        ];
    }
}
