import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { router, usePage } from '@inertiajs/react';
import {
    FiShoppingCart, FiPackage, FiUsers, FiTruck, FiCalendar,
    FiBarChart2, FiShoppingBag, FiDollarSign, FiSearch,
    FiArrowRight, FiCheck, FiPlay, FiDownload, FiGlobe,
    FiShield, FiTrendingUp, FiAward, FiStar, FiChevronRight
} from 'react-icons/fi';
import FooterComponent from '@/Components/home/Footer';
import { StateChatToggleProvider } from '@/contexts/stateChatToggleContext';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { HeaderComponent } from '@/Components/home/Header';

// Hook de Intersection Observer para lazy loading
const useInView = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [options]);

    return [ref, isVisible];
};

// Componente de Feature individual
const FeatureCard = ({ feature, index }) => {
    const [ref, isVisible] = useInView({ threshold: 0.1, triggerOnce: true });
    const colorMap = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        pink: 'from-pink-500 to-pink-600',
        red: 'from-red-500 to-red-600',
        indigo: 'from-indigo-500 to-indigo-600',
        emerald: 'from-emerald-500 to-emerald-600',
        teal: 'from-teal-500 to-teal-600'
    };

    return (
        <motion.div
            ref={ref as React.Ref<HTMLDivElement>}
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${colorMap[feature.color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.name}
                </h3>

                <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    {feature.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                    {feature.desc.split(' ').slice(0, 3).map((word, i) => (
                        <div key={i} className="flex items-center">
                            <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{word}</span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.get(feature.href)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group/btn"
                >
                    <span>Saber Mais</span>
                    <FiArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );
};

// Componente de loading otimizado
const FeatureSkeleton = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-64 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
);

const SolutionsPage = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { props } = usePage();
    // Simular loading inicial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const filteredFeatures = useMemo(() => {
        return features.filter(feature => {
            const matchesFilter = activeFilter === 'all' ||
                feature.name.toLowerCase().includes(activeFilter.toLowerCase());
            const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                feature.desc.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchTerm]);

    const categories = useMemo(() => [
        { id: 'all', name: 'Todas as Soluções', count: features.length },
        { id: 'venda', name: 'Vendas', count: features.filter(f => f.name.includes('Venda') || f.name.includes('Faturamento')).length },
        { id: 'gestão', name: 'Gestão', count: features.filter(f => f.name.includes('Gestão') || f.name.includes('Funcionários')).length },
        { id: 'estoque', name: 'Estoque', count: features.filter(f => f.name.includes('Estoque') || f.name.includes('Compras')).length },
        { id: 'marketing', name: 'Marketing', count: features.filter(f => f.name.includes('Marketing') || f.name.includes('Loja')).length }
    ], []);

    return (
        <>
            <UserLoggedProvider>
                <Helmet>
                    <title>Soluções Completas de Gestão Empresarial | SIGESC</title>
                    <meta name="description" content="Descubra todas as soluções SIGESC: PDV, gestão de estoque, faturamento, marketing e muito mais. Sistema completo para transformar sua empresa." />
                    <meta name="keywords" content="software gestão, sistema PDV, controle estoque, faturamento, gestão funcionários, marketing, loja virtual, logística, SIGESC Angola" />
                    <meta property="og:title" content="Soluções de Gestão Empresarial | SIGESC" />
                    <meta property="og:description" content="Conheça todas as soluções integradas SIGESC para transformar a gestão da sua empresa." />
                    <meta property="og:type" content="website" />
                    <link rel="canonical" href="https://sisgesc.net/solucoes" />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": "Soluções SIGESC",
                            "description": "Soluções completas de gestão empresarial",
                            "numberOfItems": features.length,
                            "itemListElement": features.map((feature, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "Service",
                                    "name": feature.name,
                                    "description": feature.desc
                                }
                            }))
                        })}
                    </script>
                </Helmet>
                <HeaderComponent auth={props.auth} />
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-28 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                                <FiStar className="w-4 h-4 text-blue-300 mr-2" />
                                <span className="text-blue-200 text-sm font-medium">mais de 10 Soluções Integradas</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="text-white">Soluções Completas para</span>{' '}
                                <span className="text-blue-400">Sua Empresa</span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Descubra todas as ferramentas integradas do SIGESC que vão transformar a gestão do seu negócio e impulsionar seus resultados.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto mb-12">
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar soluções..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-12 bg-gray-50  z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeFilter === category.id
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                                        }`}
                                >
                                    {category.name}
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {category.count}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[...Array(6)].map((_, i) => (
                                        <FeatureSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    key={activeFilter + searchTerm}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {filteredFeatures.map((feature, index) => (
                                        <FeatureCard key={feature.name} feature={feature} index={index} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Empty State */}
                        {filteredFeatures.length === 0 && !isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiSearch className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Nenhuma solução encontrada
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
                                    Ver Todas as Soluções
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { number: '10+', label: 'Soluções Integradas' },
                                { number: '500+', label: 'Empresas Atendidas' },
                                { number: '99.9%', label: 'Uptime Garantido' },
                                { number: '24/7', label: 'Suporte Especializado' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="text-4xl md:text-5xl font-bold mb-2">
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
                                Pronto para Transformar Sua Empresa?
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                                Experimente todas as soluções SIGESC e descubra como podemos impulsionar seu negócio
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                    onClick={() => router.get('/downloads')}
                                >
                                    <FiPlay className="w-5 h-5" />
                                    Solicitar Demonstração
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                                    onClick={() => router.get('/contact')}
                                >
                                    <FiArrowRight className="w-5 h-5" />
                                    Falar com Especialista
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <FooterComponent />
            </UserLoggedProvider>
        </>
    );
};

export default SolutionsPage;

// Seus dados de features (mantidos iguais)
export const features = [
    {
        icon: FiShoppingCart,
        className: "text-lg",
        desc: "Gerencie vendas, clientes e produtos com eficiência em um sistema completo.",
        name: "Ponto de Venda",
        color: "blue",
        href: route('modules', { module: 'ponto de venda' })
    },
    {
        icon: FiPackage,
        className: "text-lg",
        desc: "Tenha controle total do inventário e dos níveis de estoque.",
        name: "Gestão de Estoque",
        color: "green",
        href: route('modules', { module: 'gestao de stock' })
    },
    {
        icon: FiUsers,
        className: "text-lg",
        desc: "Administre funcionários e equipes de forma prática.",
        name: "Gestão de Funcionários",
        color: "purple",
        href: route('modules', { module: 'gestao de funcionarios' })
    },
    {
        icon: FiTruck,
        className: "text-lg",
        desc: "Otimize processos logísticos e melhore a eficiência.",
        name: "Logística",
        color: "orange",
        href: route('modules', { module: 'logisticas' })
    },
    {
        icon: FiCalendar,
        className: "text-lg",
        desc: "Agende tarefas e compromissos com facilidade.",
        name: "Agendamentos",
        color: "pink",
        href: route('modules', { module: 'agendamentos' })
    },
    {
        icon: FiBarChart2,
        className: "text-lg",
        desc: "Analise dados e gere relatórios de desempenho detalhados.",
        name: "Marketing",
        color: "red",
        href: route('modules', { module: 'marketing' })
    },
    {
        icon: FiShoppingBag,
        className: "text-lg",
        desc: "Crie e gerencie sua loja virtual de maneira simples.",
        name: "Loja Virtual",
        color: "indigo",
        href: route('modules', { module: 'loja virtual' })
    },
    {
        icon: FiDollarSign,
        className: "text-lg",
        desc: "Gerencie finanças e contabilidade com ferramentas completas.",
        name: "Gestao Financeira",
        color: "emerald",
        href: route('modules', { module: 'Gestao Financeira' })
    },
    {
        icon: FiDollarSign,
        className: "text-lg",
        desc: "Emita faturas, gerencie clientes e controle financeiro de forma integrada.",
        name: "Faturamento",
        color: "teal",
        href: route('modules', { module: 'faturamento' })
    },
    {
        icon: FiShoppingCart,
        className: "text-lg",
        desc: "Gerencie compras e suprimentos de maneira eficiente.",
        name: "Compras",
        color: "blue",
        href: route('modules', { module: 'gestao de compras' })
    }
];
