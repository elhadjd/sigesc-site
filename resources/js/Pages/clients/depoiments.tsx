import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { User } from '@/types';
import FooterComponent from '@/Components/home/Footer';
import { Helmet } from 'react-helmet';
import { FiStar, FiArrowRight, FiSearch, FiFilter, FiPlay, FiDownload } from 'react-icons/fi';

// Componente Skeleton para loading
const StorySkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="flex items-center mt-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    </div>
);

// Componente de Card de História
const SuccessStoryCard = ({ story, index }: { story: any; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative overflow-hidden">
                    <img
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        src={story.image}
                        alt={story.name}
                        loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {story.industry}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start mb-4">
                        {/* <FiQuote className="w-8 h-8 text-blue-400 opacity-20 flex-shrink-0 mr-3" /> */}
                        <blockquote className="text-gray-700 italic flex-1">
                            <AnimatePresence mode="wait">
                                {isExpanded ? (
                                    <motion.p
                                        key="expanded"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm"
                                    >
                                        {story.fullTestimonial}
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="collapsed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm"
                                    >
                                        {story.testimonial}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </blockquote>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                            <img
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                src={story.image}
                                alt={story.name}
                                loading="lazy"
                            />
                            <div className="ml-4">
                                <p className="font-semibold text-gray-900">{story.name}</p>
                                <p className="text-sm text-gray-600">{story.position}, {story.company}</p>
                                <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar
                                            key={i}
                                            className={`w-4 h-4 ${i < story.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                        {isExpanded ? 'Ler menos' : 'Ler história completa'}
                        <FiArrowRight className={`ml-1 w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Componente de Filtros
const StoryFilters = ({ filters, activeFilter, setActiveFilter }) => {
    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === 'all'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                    }`}
            >
                Todos
            </button>
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                        }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

// Dados de casos de sucesso
const successStoriesData = [
    {
        name: "Alcides João Alfredo",
        position: "Diretor de Operações",
        company: "Tech Innovations",
        industry: "Tecnologia",
        image: "/clients/alcides.jpg",
        testimonial: "O SIGESC revolucionou a maneira como gerenciamos nossas operações diárias...",
        fullTestimonial: "O SIGESC revolucionou a maneira como gerenciamos nossas operações diárias, trazendo eficiência e clareza para nosso trabalho. Antes gastávamos horas com relatórios manuais, agora temos tudo automatizado e em tempo real. A redução de custos foi de 35% no primeiro trimestre.",
        rating: 5,
        results: ["+35% eficiência", "-40% custos operacionais", "+50% velocidade nos processos"]
    },
    {
        name: "Ali Sanoh",
        position: "CEO",
        company: "StartUp XYZ",
        industry: "Startup",
        image: "/clients/ali.jpg",
        testimonial: "Graças ao SIGESC, conseguimos escalar nosso negócio mais rapidamente...",
        fullTestimonial: "Graças ao SIGESC, conseguimos escalar nosso negócio mais rapidamente e com mais confiança. O módulo de gestão financeira nos deu o controle que precisávamos para tomar decisões estratégicas com base em dados reais. Crescemos 200% em um ano.",
        rating: 5,
        results: ["+200% crescimento", "Controle financeiro total", "Decisões baseadas em dados"]
    },
    {
        name: "Kalil Koulibaly",
        position: "Gerente de TI",
        company: "Soluções Digitais",
        industry: "TI",
        image: "/clients/kalil.jpg",
        testimonial: "O SIGESC facilitou nossa transição para operações digitais...",
        fullTestimonial: "O SIGESC facilitou nossa transição para operações digitais, melhorando significativamente nossa produtividade. A integração com nossos sistemas existentes foi perfeita e a equipe de suporte foi excepcional. Tempo de implementação: apenas 2 semanas.",
        rating: 4,
        results: ["Implementação em 2 semanas", "Integração perfeita", "+60% produtividade"]
    },
    {
        name: "Mamoudou Koulibaly",
        position: "Proprietário",
        company: "Martins Comércio",
        industry: "Varejo",
        image: "/clients/mamoudou.jpg",
        testimonial: "Com o SIGESC, obtivemos uma visão clara do nosso estoque e vendas...",
        fullTestimonial: "Com o SIGESC, obtivemos uma visão clara do nosso estoque e vendas, otimizando nossos processos comerciais. Antes tínhamos problemas com excesso de stock e falta de produtos simultaneamente. Agora temos o equilíbrio perfeito.",
        rating: 5,
        results: ["-70% excesso de stock", "-90% falta de produtos", "+45% giro de estoque"]
    },
    {
        name: "Pathé Diallo",
        position: "Diretor Financeiro",
        company: "Fernandes Finanças",
        industry: "Finanças",
        image: "/clients/pathe.jpg",
        testimonial: "O módulo de faturamento do SIGESC transformou nossa gestão financeira...",
        fullTestimonial: "O módulo de faturamento do SIGESC transformou nossa gestão financeira, tornando tudo mais rápido e simples. Reduzimos o tempo de faturamento em 80% e eliminamos erros manuais. O retorno sobre investimento foi alcançado em apenas 3 meses.",
        rating: 5,
        results: ["-80% tempo de faturamento", "Erros eliminados", "ROI em 3 meses"]
    },
    {
        name: "Pedro Álvares",
        position: "Consultor de Vendas",
        company: "Álvares e Associados",
        industry: "Consultoria",
        image: "/path/to/pedro-alvares-image.jpg",
        testimonial: "O SIGESC nos ajudou a entender melhor nossos clientes...",
        fullTestimonial: "O SIGESC nos ajudou a entender melhor nossos clientes e aprimorar nosso processo de vendas. Com as análises de comportamento de compra, personalizamos nossas ofertas e aumentamos significativamente a taxa de conversão.",
        rating: 4,
        results: ["+65% taxa de conversão", "Clientes mais satisfeitos", "Vendas personalizadas"]
    },
    {
        name: "Soulaymane Diallo",
        position: "Especialista em Logística",
        company: "LogisTech",
        industry: "Logística",
        image: "/clients/soulaymane.jpg",
        testimonial: "A funcionalidade de gerenciamento de compras do SIGESC simplificou...",
        fullTestimonial: "A funcionalidade de gerenciamento de compras do SIGESC simplificou nossa cadeia de suprimentos. Automatizamos processos de compra, reduzimos custos com fornecedores e melhoramos os prazos de entrega. Eficiência máxima alcançada.",
        rating: 5,
        results: ["-30% custos com fornecedores", "Prazos otimizados", "Cadeia de suprimentos eficiente"]
    },
    {
        name: "Henrique Dias",
        position: "CEO",
        company: "Dias Innovations",
        industry: "Inovação",
        image: "/path/to/henrique-dias-image.jpg",
        testimonial: "O SIGESC nos proporcionou a inovação necessária para manter...",
        fullTestimonial: "O SIGESC nos proporcionou a inovação necessária para manter nossa empresa à frente no mercado. A flexibilidade do sistema nos permite adaptar rapidamente às mudanças do mercado e às necessidades específicas do nosso negócio.",
        rating: 4,
        results: ["Flexibilidade total", "Adaptação rápida", "Vantagem competitiva"]
    }
];

// Componente de Estatísticas
const StatsSection = () => {
    const stats = [
        { number: '500+', label: 'Clientes Satisfeitos' },
        { number: '98%', label: 'Taxa de Sucesso' },
        { number: '24/7', label: 'Suporte Especializado' },
        { number: '15+', label: 'Setores Atendidos' }
    ];

    return (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {stat.number}
                            </div>
                            <div className="text-blue-100 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Componente Principal
export default function SuccessStoriesPage(props: { auth: { user: User }, local: string }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Simular loading
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Filtros disponíveis
    const industries = useMemo(() => {
        const allIndustries = successStoriesData.map(story => story.industry);
        return [...new Set(allIndustries)];
    }, []);

    // Filtrar histórias
    const filteredStories = useMemo(() => {
        return successStoriesData.filter(story => {
            const matchesIndustry = activeFilter === 'all' || story.industry === activeFilter;
            const matchesSearch = searchTerm === '' ||
                story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                story.testimonial.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesIndustry && matchesSearch;
        });
    }, [activeFilter, searchTerm]);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <Helmet>
                    <title>Casos de Sucesso - SIGESC | Histórias Reais de Clientes</title>
                    <meta
                        name="description"
                        content="Descubra como o SIGESC transformou os negócios de nossos clientes. Leia depoimentos reais e inspire-se com nossos casos de sucesso em diversos setores."
                    />
                    <meta
                        name="keywords"
                        content="casos de sucesso SIGESC, depoimentos de clientes, software de gestão, PDV avançado, controle financeiro, gestão de estoque, histórias de sucesso, resultados reais"
                    />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Casos de Sucesso SIGESC",
                            "description": "Histórias reais de clientes que transformaram seus negócios com o SIGESC",
                            "numberOfItems": successStoriesData.length,
                            "itemListElement": successStoriesData.map((story, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "Review",
                                    "author": story.name,
                                    "reviewBody": story.fullTestimonial,
                                    "reviewRating": {
                                        "@type": "Rating",
                                        "ratingValue": story.rating.toString(),
                                        "bestRating": "5"
                                    },
                                    "itemReviewed": {
                                        "@type": "SoftwareApplication",
                                        "name": "SIGESC"
                                    }
                                }
                            }))
                        })}
                    </script>
                </Helmet>

                <HeaderComponent auth={props.auth} />

                {/* Hero Section */}
                <section className="pt-28 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Histórias de <span className="text-blue-600">Sucesso</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                                Descubra como empresas reais transformaram seus negócios com o SIGESC.
                                Resultados comprovados e depoimentos autênticos de nossos clientes.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar casos de sucesso..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Filtros Section */}
                <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center">
                                <FiFilter className="w-5 h-5 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Filtrar por setor:</span>
                            </div>
                            <StoryFilters
                                filters={industries}
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />
                        </div>
                    </div>
                </section>

                {/* Stories Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, i) => (
                                        <StorySkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <motion.div
                                        key={activeFilter + searchTerm}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {filteredStories.map((story, index) => (
                                            <SuccessStoryCard key={story.name} story={story} index={index} />
                                        ))}
                                    </motion.div>

                                    {/* Empty State */}
                                    {filteredStories.length === 0 && !isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-20"
                                        >
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <FiSearch className="w-12 h-12 text-gray-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                Nenhum caso encontrado
                                            </h3>
                                            <p className="text-gray-600 mb-8">
                                                Tente ajustar seus filtros ou termos de busca
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setActiveFilter('all');
                                                    setSearchTerm('');
                                                }}
                                                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                            >
                                                Ver Todos os Casos
                                            </button>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Stats Section */}
                <StatsSection />

                {/* CTA Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Pronto para escrever sua história de sucesso?
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                                Junte-se aos centenas de empresas que já transformaram seus negócios com o SIGESC
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="/downloads"
                                    className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FiPlay className="w-5 h-5" />
                                    Solicitar Demonstração
                                </motion.a>

                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    href="/contact"
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FiArrowRight className="w-5 h-5" />
                                    Falar com Especialista
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
