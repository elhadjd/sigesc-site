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
                'keywords' => $module['keywords'] ?? null,
                'highlights' => $module['highlights'] ?? [],
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
            'lead' => 'Gerencie PDV, estoque, finanças, compras, dropshipping e faturação eletrónica AGT numa única plataforma feita para empresas em Angola. Ideal para lojas, farmácias, restaurantes, salões, e-commerce e comércio em geral.',
            'sections' => [
                [
                    'heading' => 'O que pode fazer com o SIGESC',
                    'items' => [
                        'Ponto de venda (PDV) e faturação eletrónica alinhada à AGT',
                        'Controlo de stock, inventário e alertas de reposição',
                        'Dropshipping: venda online sem stock próprio, com fornecedores e entregas',
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
            'lead' => 'O SIGESC reúne PDV, stock, faturação, finanças, RH, compras, logística, loja virtual e dropshipping num só software. Escolha o módulo abaixo — cada página explica funcionalidades para PME angolanas.',
            'sections' => [
                [
                    'heading' => 'Submenu de módulos',
                    'body' => 'Links diretos para cada solução (úteis para motores de busca e navegação sem JavaScript):',
                    'items' => collect($this->modules())->map(fn ($m) => $m['name'].' — '.$m['description'])->all(),
                ],
                [
                    'heading' => 'Benefícios para a sua empresa',
                    'items' => [
                        'Dados centralizados: vendas, stock e caixa no mesmo sistema',
                        'Apoio à faturação eletrónica e obrigações junto da AGT',
                        'Dropshipping e e-commerce sem stock próprio, integrados à loja virtual',
                        'Relatórios para decidir preços, margens e reposição',
                        'Adequado a lojas, farmácias, restaurantes, salões, e-commerce e serviços',
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
            'kicker' => 'Ferramentas fiscais Angola · AGT',
            'headline' => 'Calculadora IVA e IRT Angola 2026 — impostos AGT gratuitos',
            'lead' => 'Simule online IVA, IRT 2026 (Lei n.º 14/25 / OGE 2026), Imposto Industrial, retenção na fonte 6,5% e contribuição cambial. Calculadoras fiscais gratuitas para PME, gestores e contabilistas em Angola — cálculos no servidor com a legislação configurada.',
            'sections' => [
                [
                    'heading' => 'Para que servem estas calculadoras fiscais?',
                    'body' => 'Quem pesquisa “calculadora IVA Angola”, “calcular IRT 2026” ou “simulador impostos AGT” encontra aqui ferramentas práticas para estimar obrigações fiscais sem instalar software. Ideal para salários, facturas com IVA, lucro tributável e retenções.',
                    'items' => [
                        'Calculadora de IVA Angola (acrescentar ou extrair do preço)',
                        'Calculadora de IRT salários e IRT Grupo C (empresários)',
                        'Simulador de Imposto Industrial por sector',
                        'Retenção na fonte sobre serviços e contribuição cambial',
                    ],
                ],
                [
                    'heading' => 'IRT Grupo A (salários) — Lei n.º 14/25 / OGE 2026',
                    'body' => 'Tabela progressiva de retenção na fonte para trabalho por conta de outrem. Isenção até 150.000 Kz de rendimento bruto mensal. Fórmula: parcela fixa + taxa × (rendimento − excesso). Use para calcular salário líquido em Angola.',
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
                    'heading' => 'Calculadora IVA Angola — Código do IVA',
                    'body' => 'Calcule o imposto sobre o valor acrescentado a acrescentar ou a extrair do preço. Taxas configuradas para o mercado angolano e conformidade AGT:',
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
                    'body' => 'Cálculo da retenção aplicável a facturas de prestação de serviços, comum em subcontratação e consultoria em Luanda e no resto do país.',
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
                    'heading' => 'Perguntas frequentes sobre calculadoras de impostos em Angola',
                    'faqs' => [
                        [
                            'question' => 'Como calcular o IVA numa factura em Angola?',
                            'answer' => 'Indique o valor sem imposto, escolha a taxa (geral ou especial) e o modo “acrescentar”. Para preços com IVA incluído, use o modo “extrair”.',
                        ],
                        [
                            'question' => 'Qual a tabela de IRT 2026 para salários?',
                            'answer' => 'A Lei n.º 14/25 (OGE 2026) define isenção até 150.000 Kz e escalões progressivos. A calculadora aplica essa tabela automaticamente.',
                        ],
                        [
                            'question' => 'Posso usar isto em vez do simulador AGT?',
                            'answer' => 'Não para declarações oficiais. Use como estimativa rápida e confirme no Quiosque do Contribuinte / AGT.',
                        ],
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
                ['href' => url('/gerador-de-fatura'), 'label' => 'Criar fatura online grátis', 'description' => 'Gerador sem conta — nada é guardado'],
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
    public function invoiceGenerator(): array
    {
        return [
            'kicker' => 'Ferramenta gratuita · Sem conta · Nada é guardado',
            'headline' => 'Criar fatura online grátis Angola — gerador de factura com IVA',
            'lead' => 'Faça facturas, factura-recibos, proformas e orçamentos no browser: adicione artigos, preços, quantidades, IVA (14%, 7%, 5%), descontos e retenção. Uso 100% gratuito. Atenção: as facturas NÃO são guardadas em nenhum servidor — imprima ou guarde PDF antes de sair.',
            'sections' => [
                [
                    'heading' => 'O que pode fazer neste gerador de fatura',
                    'items' => [
                        'Escolher tipo: Factura, Factura-Recibo, Proforma, Recibo, Orçamento, Nota de Crédito/Débito',
                        'Dados do emitente e do cliente (NIF, morada, contacto, IBAN)',
                        'Artigos ilimitados com quantidade, preço unitário e desconto por linha',
                        'Impostos: IVA 14%, 7%, 5%, Cabinda 1%, isento ou taxa personalizada',
                        'Desconto global e retenção na fonte 6,5%',
                        'Pré-visualização em tempo real e impressão / guardar PDF',
                    ],
                ],
                [
                    'heading' => 'Privacidade e limites legais',
                    'body' => 'Este gerador funciona só no seu dispositivo. Não criamos conta, não enviamos a factura por email automático e não arquivamos o documento. Para faturação eletrónica oficial AGT use software certificado.',
                    'items' => [
                        'Sem registo e sem login',
                        'Sem armazenamento no servidor SIGESC',
                        'Documento de apoio — confirme requisitos na AGT',
                    ],
                ],
                [
                    'heading' => 'Perguntas frequentes',
                    'faqs' => [
                        [
                            'question' => 'Preciso de conta para criar fatura?',
                            'answer' => 'Não. O gerador é gratuito e aberto — basta preencher e imprimir.',
                        ],
                        [
                            'question' => 'Os meus dados comerciais ficam guardados?',
                            'answer' => 'Não. Ficam apenas temporariamente no navegador até limpar ou fechar a página.',
                        ],
                        [
                            'question' => 'Posso usar Kwanzas e IVA de Angola?',
                            'answer' => 'Sim. O total é em Kz e as taxas de IVA seguem as opções do Código do IVA configuradas no SIGESC.',
                        ],
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/gerador-de-fatura'), 'label' => 'Abrir gerador de fatura', 'description' => 'Criar factura online agora'],
                ['href' => url('/modelos-de-fatura'), 'label' => 'Modelos de fatura para descarregar', 'description' => '24 templates HTML'],
                ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'IVA, IRT, Imposto Industrial'],
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Dúvidas AGT e faturação'],
                ['href' => url('/solutions'), 'label' => 'Software SIGESC', 'description' => 'Faturação eletrónica completa'],
            ],
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $templates
     * @return array<string, mixed>
     */
    public function invoiceTemplates(array $templates = []): array
    {
        $templates = $templates !== [] ? $templates : config('invoice_templates.templates', []);
        $byLevel = collect($templates)->groupBy('level');

        $sections = [
            [
                'heading' => 'Biblioteca gratuita de modelos de fatura para Angola',
                'body' => 'Empresários e contabilistas podem descarregar modelos de factura, factura-recibo, proforma, recibo, orçamento e notas de crédito — do básico ao avançado, com campos em Kwanzas e alinhados à prática AGT.',
                'items' => [
                    'Mais de 20 modelos HTML print-ready (imprimir ou guardar PDF)',
                    'Níveis: básico, intermédio e avançado',
                    'Factura com IVA 14%, retenção 6,5% e layouts AGT',
                    'Design profissional inspirado no mercado angolano',
                ],
            ],
        ];

        foreach (['basico', 'intermedio', 'avancado'] as $level) {
            $items = $byLevel->get($level, collect());
            if ($items->isEmpty()) {
                continue;
            }
            $label = config('invoice_templates.levels.'.$level.'.label', $level);
            $sections[] = [
                'heading' => "Modelos {$label}",
                'body' => (string) config('invoice_templates.levels.'.$level.'.description', ''),
                'items' => $items->map(function (array $t) {
                    $href = $t['download_url'] ?? url('/modelos-de-fatura/'.($t['slug'] ?? '').'/download');

                    return ($t['title'] ?? $t['slug']).' — '.$href;
                })->all(),
            ];
        }

        $sections[] = [
            'heading' => 'Perguntas frequentes',
            'faqs' => [
                [
                    'question' => 'Como descarregar um modelo de fatura?',
                    'answer' => 'Escolha o modelo, clique em Descarregar ou abra a pré-visualização e use Imprimir / PDF no navegador.',
                ],
                [
                    'question' => 'Os modelos substituem o software AGT?',
                    'answer' => 'Não. São templates editáveis. Para documentos fiscais oficiais use faturação eletrónica certificada (ex.: SIGESC).',
                ],
            ],
        ];

        $links = collect($templates)->map(fn (array $t) => [
            'href' => $t['download_url'] ?? url('/modelos-de-fatura/'.$t['slug'].'/download'),
            'label' => $t['title'] ?? $t['slug'],
            'description' => ($t['level_label'] ?? $t['level'] ?? '').' · '.($t['category_label'] ?? $t['category'] ?? ''),
        ])->all();

        $links[] = ['href' => url('/gerador-de-fatura'), 'label' => 'Criar fatura online grátis', 'description' => 'Gerador sem conta — nada é guardado'];
        $links[] = ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'IVA, IRT e Imposto Industrial'];
        $links[] = ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Dúvidas sobre faturação AGT'];
        $links[] = ['href' => url('/solutions'), 'label' => 'Software SIGESC', 'description' => 'Emita facturas no sistema'];

        return [
            'kicker' => 'Recursos gratuitos · Angola',
            'headline' => 'Modelos de fatura gratuitos Angola — factura, recibo e proforma',
            'lead' => 'Biblioteca organizada com +20 modelos de fatura para descarregar: do layout básico à factura avançada AGT. Ideal para PME, freelancers e contabilistas em Luanda e em todo o país.',
            'sections' => $sections,
            'links' => $links,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function askExpert(): array
    {
        return [
            'kicker' => 'Consultoria informativa · Angola',
            'headline' => 'Pergunte ao Especialista Angola — dúvidas fiscais AGT, IVA e gestão',
            'lead' => 'Tire dúvidas fiscais e de gestão comercial em Angola de forma gratuita: AGT, IVA, IRT 2026, Imposto Industrial, faturação eletrónica, PDV, stock ou abertura de empresa. Pesquisa de fontes oficiais e resposta clara — complemento ideal às calculadoras fiscais SIGESC.',
            'sections' => [
                [
                    'heading' => 'Dúvidas fiscais e empresariais que pode perguntar',
                    'body' => 'Ideal se procura “dúvidas fiscais Angola”, “perguntas AGT”, “consultoria empresarial online” ou ajuda sobre impostos sem marcar reunião. Escreva a pergunta em português e receba orientação com base em pesquisa.',
                    'items' => [
                        'Como funciona o IVA em Angola e quais as taxas AGT?',
                        'Qual a tabela de IRT 2026 para calcular salário líquido?',
                        'O que é faturação eletrónica AGT para PME?',
                        'Como controlar stock e PDV numa loja em Luanda?',
                        'Que documentos preciso para abrir empresa (INAPEM)?',
                        'Quando se aplica retenção na fonte de 6,5% sobre serviços?',
                        'Qual a taxa de Imposto Industrial para o meu sector?',
                    ],
                ],
                [
                    'heading' => 'Como funciona o Pergunte ao Especialista',
                    'items' => [
                        'Pesquisa híbrida: fontes oficiais (AGT, MinFin, BNA) e base de conhecimento SIGESC',
                        'Resumo estruturado com pontos, leis, números e avisos de incerteza',
                        'Pode receber a resposta por email e, em alguns casos, virar artigo no blog',
                        'Não substitui consultoria fiscal oficial — confirme sempre na AGT',
                    ],
                ],
                [
                    'heading' => 'Perguntas frequentes',
                    'faqs' => [
                        [
                            'question' => 'É gratuito tirar dúvidas com o especialista SIGESC?',
                            'answer' => 'Sim. O serviço Pergunte ao Especialista é gratuito para dúvidas sobre fiscalidade e gestão em Angola.',
                        ],
                        [
                            'question' => 'Serve para consultoria sobre IVA e IRT?',
                            'answer' => 'Sim, para orientação informativa sobre IVA, IRT, Imposto Industrial e AGT. Para declarações e planeamento formal, fale com um contabilista.',
                        ],
                        [
                            'question' => 'Posso perguntar sobre software de gestão e PDV?',
                            'answer' => 'Sim. Além de impostos, cobre gestão comercial, PDV, stock, preços e empreendedorismo para PME angolanas.',
                        ],
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/calculadoras'), 'label' => 'Calculadora IVA e IRT Angola', 'description' => 'Simular impostos AGT online'],
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

        $highlights = $catalog['highlights'] ?? [];
        if ($highlights === []) {
            $highlights = [
                "Gestão operacional de {$moduleName}",
                'Integração com faturação e documentos comerciais',
                'Relatórios e indicadores de desempenho',
                'Apoio a processos alinhados com boas práticas AGT / gestão',
            ];
        }

        return [
            'kicker' => 'Módulo SIGESC',
            'headline' => "{$moduleName} — software de gestão SIGESC Angola",
            'lead' => $description.' Integrado com PDV, stock, faturação, loja virtual e finanças no mesmo sistema.',
            'sections' => [
                [
                    'heading' => "O que inclui o módulo {$moduleName}",
                    'body' => 'Funcionalidades pensadas para PME angolanas, com dados partilhados entre módulos e relatórios para decisão.',
                    'items' => $highlights,
                ],
                [
                    'heading' => 'Porquê escolher o SIGESC',
                    'items' => [
                        'Plataforma única: vendas, stock, finanças e e-commerce ligados',
                        'Feito para o mercado angolano e conformidade AGT',
                        'Ideal para PME que querem crescer com processos organizados',
                    ],
                ],
                [
                    'heading' => 'Outros módulos (submenu)',
                    'items' => collect($this->modules())->map(fn ($m) => $m['name'].' — '.$m['description'])->all(),
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
