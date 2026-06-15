<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use Carbon\Carbon;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Maximizando Sua Eficiência Comercial com SIGESC',
                'excerpt' => 'Descubra como o SIGESC pode transformar a gestão da sua empresa, aumentando a eficiência e produtividade em até 65% com cases reais.',
                'content' => $this->generateContent('Maximizando Sua Eficiência Comercial com SIGESC'),
                'image' => '/img/sigesc capa.png',
                'category' => 'Produtividade',
                'author_name' => 'Carlos Silva',
                'author_avatar' => '/img/authors/carlos.jpg',
                'author_role' => 'Especialista em Gestão',
                'publish_date' => Carbon::create(2023, 11, 15),
                'read_time' => 8,
                'tags' => ['Produtividade', 'Gestão', 'SIGESC', 'Eficiência'],
                'is_featured' => true,
                'is_published' => true,
                'views' => 1250,
            ],
            [
                'title' => '5 Estratégias para Melhorar o Fluxo de Caixa com SIGESC',
                'excerpt' => 'Aprenda estratégias chave para otimizar o fluxo de caixa da sua empresa utilizando as funcionalidades avançadas do SIGESC.',
                'content' => $this->generateContent('5 Estratégias para Melhorar o Fluxo de Caixa com SIGESC'),
                'image' => '/img/sigesc capa.png',
                'category' => 'Finanças',
                'author_name' => 'Ana Rodrigues',
                'author_avatar' => '/img/authors/ana.jpg',
                'author_role' => 'Consultora Financeira',
                'publish_date' => Carbon::create(2023, 11, 12),
                'read_time' => 6,
                'tags' => ['Finanças', 'Fluxo de Caixa', 'Estratégias', 'SIGESC'],
                'is_featured' => true,
                'is_published' => true,
                'views' => 890,
            ],
            [
                'title' => 'Integração do SIGESC com Outras Ferramentas de Negócios',
                'excerpt' => 'Veja como o SIGESC se integra perfeitamente com outras ferramentas essenciais de negócios para proporcionar uma experiência unificada.',
                'content' => $this->generateContent('Integração do SIGESC com Outras Ferramentas de Negócios'),
                'image' => '/img/sigesc capa.png',
                'category' => 'Integração',
                'author_name' => 'Miguel Santos',
                'author_avatar' => '/img/authors/miguel.jpg',
                'author_role' => 'Especialista em TI',
                'publish_date' => Carbon::create(2023, 11, 10),
                'read_time' => 10,
                'tags' => ['Integração', 'Tecnologia', 'Ferramentas', 'SIGESC'],
                'is_featured' => false,
                'is_published' => true,
                'views' => 670,
            ],
            [
                'title' => 'Como o SIGESC Facilita a Gestão de Inventário em Tempo Real',
                'excerpt' => 'Descubra os benefícios da gestão de inventário em tempo real com SIGESC e como implementá-la eficazmente no seu negócio.',
                'content' => $this->generateContent('Como o SIGESC Facilita a Gestão de Inventário em Tempo Real'),
                'image' => '/img/sigesc capa.png',
                'category' => 'Gestão de Inventário',
                'author_name' => 'Sofia Costa',
                'author_avatar' => '/img/authors/sofia.jpg',
                'author_role' => 'Especialista em Logística',
                'publish_date' => Carbon::create(2023, 11, 8),
                'read_time' => 7,
                'tags' => ['Inventário', 'Tempo Real', 'Logística', 'SIGESC'],
                'is_featured' => false,
                'is_published' => true,
                'views' => 540,
            ],
            [
                'title' => 'Construindo Relacionamentos com Clientes através do SIGESC',
                'excerpt' => 'Explore estratégias para construir e manter relacionamentos sólidos com clientes usando as funcionalidades do SIGESC.',
                'content' => $this->generateContent('Construindo Relacionamentos com Clientes através do SIGESC'),
                'image' => '/img/sigesc capa.png',
                'category' => 'CRM',
                'author_name' => 'Ricardo Almeida',
                'author_avatar' => '/img/authors/ricardo.jpg',
                'author_role' => 'Especialista em CRM',
                'publish_date' => Carbon::create(2023, 11, 5),
                'read_time' => 9,
                'tags' => ['CRM', 'Clientes', 'Relacionamento', 'SIGESC'],
                'is_featured' => false,
                'is_published' => true,
                'views' => 780,
            ],
            [
                'title' => 'Automação de Processos: Como o SIGESC Transforma Operações',
                'excerpt' => 'Descubra como a automação de processos com SIGESC pode reduzir custos operacionais e aumentar a eficiência.',
                'content' => $this->generateContent('Automação de Processos: Como o SIGESC Transforma Operações'),
                'image' => '/img/sigesc capa.png',
                'category' => 'Automação',
                'author_name' => 'Patrícia Lima',
                'author_avatar' => '/img/authors/patricia.jpg',
                'author_role' => 'Especialista em Automação',
                'publish_date' => Carbon::create(2023, 11, 3),
                'read_time' => 11,
                'tags' => ['Automação', 'Processos', 'Eficiência', 'SIGESC'],
                'is_featured' => true,
                'is_published' => true,
                'views' => 920,
            ]
        ];

        foreach ($posts as $postData) {
            // Verificar se o post já existe para evitar duplicações
            $existingPost = Post::where(
                'slug',
                \Illuminate\Support\Str::slug($postData['title'])
            )->first();

            if (!$existingPost) {
                Post::create($postData);
            }
        }
    }

    /**
     * Generate sample content for the posts
     */
    private function generateContent($title): string
    {
        return "
        <h2>Introdução</h2>
        <p>No cenário empresarial atual, a eficiência operacional é crucial para o sucesso. Neste artigo, exploraremos como $title pode revolucionar a forma como sua empresa opera.</p>

        <h2>Vantagens Principais</h2>
        <p>As empresas que implementaram essa solução relataram:</p>
        <ul>
            <li>Aumento de 40% na produtividade</li>
            <li>Redução de 30% nos custos operacionais</li>
            <li>Melhoria de 65% na satisfação do cliente</li>
        </ul>

        <h2>Como Implementar</h2>
        <p>A implementação é simples e pode ser feita em três etapas:</p>
        <ol>
            <li>Análise dos processos atuais</li>
            <li>Configuração personalizada do sistema</li>
            <li>Treinamento da equipe</li>
        </ol>

        <h2>Conclusão</h2>
        <p>$title não é apenas uma ferramenta, mas uma transformação completa na forma como sua empresa opera. Os resultados falam por si mesmos e o retorno sobre o investimento é rapidamente alcançado.</p>

        <h2>Próximos Passos</h2>
        <p>Entre em contato conosco para agendar uma demonstração personalizada e descobrir como podemos ajudar sua empresa a alcançar resultados semelhantes.</p>
        ";
    }
}
