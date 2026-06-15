// import React, { useState, useEffect } from 'react';
// import FooterComponent from '@/Components/home/Footer';
// import { HeaderComponent } from '@/Components/home/Header';
// import { UserLoggedProvider } from '@/contexts/loggedUser';
// import { FormStateProvider } from '@/contexts/stateForm';
// import { User } from '@/types';
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     FiCheck,
//     FiStar,
//     FiArrowRight,
//     FiPlay,
//     FiUsers,
//     FiShoppingCart,
//     FiPackage,
//     FiBarChart2,
//     FiDollarSign,
//     FiShield,
//     FiClock,
//     FiMessageSquare
// } from 'react-icons/fi';

// // Componente de Preços
// const Prices = () => {
//     const [selectedPlan, setSelectedPlan] = useState('pro');
//     const [isAnnual, setIsAnnual] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setIsLoading(false);
//         }, 500);
//         return () => clearTimeout(timer);
//     }, []);

//     const plans = [
//         {
//             id: 'basic',
//             name: 'Básico',
//             price: { monthly: 299, annual: 249 },
//             description: 'Ideal para pequenos negócios que estão começando',
//             features: [
//                 'PDV Básico',
//                 'Gestão de Estoque',
//                 'Relatórios Simples',
//                 'Suporte por Email',
//                 '1 Usuário',
//                 'Atualizações Mensais'
//             ],
//             mostPopular: false,
//             color: 'gray'
//         },
//         {
//             id: 'pro',
//             name: 'Profissional',
//             price: { monthly: 599, annual: 499 },
//             description: 'Perfeito para empresas em crescimento',
//             features: [
//                 'PDV Avançado',
//                 'Gestão Financeira',
//                 'Relatórios Detalhados',
//                 'Suporte Prioritário',
//                 '5 Usuários',
//                 'Loja Virtual',
//                 'App Mobile',
//                 'Atualizações Semanais'
//             ],
//             mostPopular: true,
//             color: 'blue'
//         },
//         {
//             id: 'enterprise',
//             name: 'Empresarial',
//             price: { monthly: 1199, annual: 999 },
//             description: 'Solução completa para grandes empresas',
//             features: [
//                 'Todos os recursos do Pro',
//                 'Usuários Ilimitados',
//                 'Personalizações',
//                 'Suporte 24/7',
//                 'Treinamento Presencial',
//                 'Integrações Avançadas',
//                 'Backup Diário',
//                 'Consultoria Especializada'
//             ],
//             mostPopular: false,
//             color: 'indigo'
//         }
//     ];

//     const features = [
//         {
//             icon: FiShoppingCart,
//             title: 'PDV Avançado',
//             description: 'Sistema completo de ponto de venda com múltiplas formas de pagamento'
//         },
//         {
//             icon: FiPackage,
//             title: 'Gestão de Estoque',
//             description: 'Controle total do seu inventário com alertas de reposição'
//         },
//         {
//             icon: FiDollarSign,
//             title: 'Controle Financeiro',
//             description: 'Gestão completa de contas a pagar e receber, fluxo de caixa'
//         },
//         {
//             icon: FiBarChart2,
//             title: 'Relatórios Detalhados',
//             description: 'Mais de 50 relatórios para análise completa do seu negócio'
//         },
//         {
//             icon: FiUsers,
//             title: 'Multi-usuários',
//             description: 'Acesso simultâneo com diferentes níveis de permissão'
//         },
//         {
//             icon: FiShield,
//             title: 'Segurança',
//             description: 'Proteção de dados com backup automático e criptografia'
//         }
//     ];

//     const faqs = [
//         {
//             question: 'Posso mudar de plano a qualquer momento?',
//             answer: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença de valor será prorrateada.'
//         },
//         {
//             question: 'Há taxa de instalação ou configuração?',
//             answer: 'Não, a instalação e configuração inicial estão incluídas em todos os nossos planos.'
//         },
//         {
//             question: 'Quais formas de pagamento são aceitas?',
//             answer: 'Aceitamos cartão de crédito, débito, transferência bancária e PIX.'
//         },
//         {
//             question: 'Oferecem teste gratuito?',
//             answer: 'Sim, oferecemos 14 dias de teste gratuito para você conhecer todas as funcionalidades.'
//         }
//     ];

//     return (
//         <div className="py-16 bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Toggle Anual/Mensal */}
//                 <div className="flex justify-center mb-16">
//                     <div className="bg-white rounded-xl p-1 shadow-md inline-flex">
//                         <button
//                             onClick={() => setIsAnnual(false)}
//                             className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${!isAnnual ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
//                         >
//                             Pagamento Mensal
//                         </button>
//                         <button
//                             onClick={() => setIsAnnual(true)}
//                             className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${isAnnual ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
//                         >
//                             Pagamento Anual
//                             <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                                 -20%
//                             </span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Cards de Planos */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
//                     {plans.map((plan, index) => (
//                         <motion.div
//                             key={plan.id}
//                             initial={{ opacity: 0, y: 30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: index * 0.1 }}
//                             className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${plan.mostPopular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}
//                         >
//                             {plan.mostPopular && (
//                                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
//                                     Mais Popular
//                                 </div>
//                             )}

//                             <div className="p-8">
//                                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
//                                 <p className="text-gray-600 mb-6">{plan.description}</p>

//                                 <div className="mb-6">
//                                     <span className="text-4xl font-bold text-gray-900">
//                                         R$ {isAnnual ? plan.price.annual : plan.price.monthly}
//                                     </span>
//                                     <span className="text-gray-600">/{isAnnual ? 'ano' : 'mês'}</span>
//                                 </div>

//                                 <button
//                                     onClick={() => setSelectedPlan(plan.id)}
//                                     className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${selectedPlan === plan.id
//                                             ? 'bg-blue-500 text-white hover:bg-blue-600'
//                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                         }`}
//                                 >
//                                     {selectedPlan === plan.id ? 'Selecionado' : 'Selecionar Plano'}
//                                 </button>

//                                 <ul className="mt-8 space-y-4">
//                                     {plan.features.map((feature, i) => (
//                                         <li key={i} className="flex items-start">
//                                             <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
//                                             <span className="text-gray-700">{feature}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* Recursos do Sistema */}
//                 <div className="text-center mb-20">
//                     <h2 className="text-3xl font-bold text-gray-900 mb-4">Recursos Incluídos em Todos os Planos</h2>
//                     <p className="text-gray-600 max-w-3xl mx-auto mb-12">
//                         Todos os planos incluem acesso a recursos essenciais para transformar a gestão do seu negócio
//                     </p>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {features.map((feature, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                                 className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
//                             >
//                                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
//                                     <feature.icon className="w-6 h-6 text-blue-500" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                                 <p className="text-gray-600">{feature.description}</p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* FAQ Section */}
//                 <div className="bg-white rounded-2xl shadow-md p-8 mb-20">
//                     <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perguntas Frequentes</h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {faqs.map((faq, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                                 className="bg-gray-50 p-6 rounded-xl"
//                             >
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
//                                 <p className="text-gray-600">{faq.answer}</p>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* CTA Final */}
//                 <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-12 text-white">
//                     <h2 className="text-3xl font-bold mb-4">Pronto para Transformar Sua Empresa?</h2>
//                     <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
//                         Experimente o SIGESC gratuitamente por 14 dias e descubra como podemos impulsionar seu negócio
//                     </p>

//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
//                         >
//                             <FiPlay className="w-5 h-5" />
//                             Iniciar Teste Gratuito
//                         </motion.button>

//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
//                         >
//                             <FiMessageSquare className="w-5 h-5" />
//                             Falar com Vendas
//                         </motion.button>
//                     </div>

//                     <p className="text-blue-200 text-sm mt-6">
//                         Não é necessário cartão de crédito • Cancele a qualquer momento
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Componente Principal
// export default function PricesComponent(props: { auth: { user: User }, local: string }) {
//     return (
//         <UserLoggedProvider>
//             <div className='relative'>
//                 <FormStateProvider>
//                     <Helmet>
//                         <title>Planos e Preços do SIGESC - Software de Gestão Comercial</title>
//                         <meta
//                             name="description"
//                             content="Descubra os planos do SIGESC, o software de gestão comercial com PDV avançado, controle financeiro e gestão de estoque. Escolha o plano ideal para o seu negócio e impulsione sua eficiência."
//                         />
//                         <meta
//                             name="keywords"
//                             content="software de gestão, preços SIGESC, PDV avançado, controle financeiro, gestão de estoque, planos de gestão, software comercial, eficiência empresarial, gestão integrada"
//                         />
//                         <meta property="og:title" content="Planos e Preços do SIGESC - Software de Gestão Comercial" />
//                         <meta property="og:description" content="Descubra os planos do SIGESC e escolha o ideal para o seu negócio. PDV avançado, controle financeiro e gestão de estoque." />
//                         <meta property="og:type" content="website" />
//                         <link rel="canonical" href="https://seusite.com/precos" />
//                         <script type="application/ld+json">
//                             {JSON.stringify({
//                                 "@context": "https://schema.org",
//                                 "@type": "Product",
//                                 "name": "SIGESC Software de Gestão",
//                                 "description": "Sistema completo de gestão comercial com PDV avançado",
//                                 "offers": {
//                                     "@type": "AggregateOffer",
//                                     "offerCount": "3",
//                                     "lowPrice": "299",
//                                     "highPrice": "1199",
//                                     "priceCurrency": "BRL"
//                                 }
//                             })}
//                         </script>
//                     </Helmet>

//                     <HeaderComponent auth={props.auth} local={props.local} />

//                     <main className="mt-20">
//                         {/* Hero Section */}
//                         <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-28 pb-20 overflow-hidden">
//                             <div className="absolute inset-0 bg-black opacity-50"></div>
//                             <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

//                             <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 30 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.8 }}
//                                 >
//                                     <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
//                                         <FiStar className="w-4 h-4 text-blue-300 mr-2" />
//                                         <span className="text-blue-200 text-sm font-medium">Planos Acessíveis</span>
//                                     </div>

//                                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
//                                         Planos que Crescem com <span className="text-blue-400">Seu Negócio</span>
//                                     </h1>

//                                     <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
//                                         Escolha o plano ideal para sua empresa e tenha acesso a todas as ferramentas necessárias para
//                                         impulsionar seus resultados com o sistema de gestão mais completo do mercado.
//                                     </p>
//                                 </motion.div>
//                             </div>
//                         </section>

//                         <Prices />
//                     </main>

//                     <FooterComponent />
//                 </FormStateProvider>
//             </div>
//         </UserLoggedProvider>
//     );
// }
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link, usePage, router } from '@inertiajs/react';
import {
    FiCheck,
    FiStar,
    FiArrowRight,
    FiHelpCircle,
    FiPlay,
    FiAward,
    FiShield,
    FiTrendingUp,
    FiZap
} from 'react-icons/fi';
import FooterComponent from '@/Components/home/Footer';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { HeaderComponent } from '@/Components/home/Header';
import { User } from '@/types';
import { features } from '@/services/public/veriables';

// Componente de Preço Skeleton para loading
const PriceSkeleton = () => (
    <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-8 flex flex-col items-center gap-4 w-80 h-96 animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3 w-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
        </div>
        <div className="h-12 w-full bg-gray-200 rounded-lg mt-6"></div>
    </div>
);

// Componente de Cartão de Plano
const PlanCard = ({
    title,
    description,
    price,
    onSelectPlan,
    popular = false,
    recommended = false
}: {
    title: string;
    description: string;
    price: string;
    onSelectPlan: () => void;
    popular?: boolean;
    recommended?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-white border rounded-xl p-8 flex flex-col h-full transition-all duration-300
      ${popular
                ? 'border-blue-500 shadow-xl transform scale-105 z-10'
                : 'border-gray-200 shadow-lg hover:shadow-xl'}`}
    >
        {/* Badges */}
        {popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                </span>
            </div>
        )}

        {recommended && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    RECOMENDADO
                </span>
            </div>
        )}

        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{description}</p>
        </div>

        <div className="text-center mb-6">
            <span className="text-4xl font-bold text-blue-600">{price}</span>
        </div>

        <ul className="space-y-3 mb-8 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature.name}</span>
                </li>
            ))}
        </ul>

        <a
            href='https://admin.sisgesc.net/getting-started' target='_blank' rel='noopener noreferrer'
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300
        ${popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
            {popular ? 'Começar Agora' : 'Selecionar Plano'}
        </a>
    </motion.div>
);

// Componente de Comparação de Planos
const PlanComparison = () => {
    const comparisonData = [
        { feature: 'Módulos de Gestão', basic: '5', standard: 'Todos', premium: 'Todos + Avançados' },
        { feature: 'Usuários Incluídos', basic: '1', standard: '3', premium: 'Ilimitados' },
        { feature: 'Armazenamento', basic: '5GB', standard: '20GB', premium: 'Ilimitado' },
        { feature: 'Suporte', basic: 'Email', standard: 'Email + Chat', premium: '24/7 Prioritário' },
        { feature: 'Treinamento', basic: 'Não', standard: 'Básico', premium: 'Completo' },
    ];

    return (
        <div className="mt-10 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Comparação de Planos</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Funcionalidades</th>
                            <th className="text-center p-4">Básico</th>
                            <th className="text-center p-4">Standard</th>
                            <th className="text-center p-4">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonData.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="p-4 font-medium">{row.feature}</td>
                                <td className="p-4 text-center">{row.basic}</td>
                                <td className="p-4 text-center">{row.standard}</td>
                                <td className="p-4 text-center text-blue-600 font-semibold">{row.premium}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente de Benefícios
const BenefitsSection = () => {
    const benefits = [
        {
            icon: FiShield,
            title: 'Segurança de Dados',
            description: 'Seus dados protegidos com criptografia avançada e backups automáticos'
        },
        {
            icon: FiTrendingUp,
            title: 'Atualizações Constantes',
            description: 'Receba novas funcionalidades e melhorias regularmente'
        },
        {
            icon: FiZap,
            title: 'Implementação Rápida',
            description: 'Comece a usar em poucos dias com nossa equipe especializada'
        },
        {
            icon: FiAward,
            title: 'Suporte Especializado',
            description: 'Time técnico preparado para resolver suas dúvidas rapidamente'
        }
    ];

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Por que escolher o SIGESC?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <benefit.icon className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Componente Principal de Preços
export const Prices = () => {
    const { props } = usePage<{ plans: any[] }>();
    const [isLoading, setIsLoading] = useState(true);

    // Simular loading
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleSelectPlan = (route: string) => {
        router.get(route);
    };

    // Dados de planos padrão caso não haja planos da API
    const defaultPlans = useMemo(() => [
        {
            id: 1,
            name: 'Básico',
            description: 'Ideal para pequenos negócios',
            price: '199,00',
            features: [
                'Todos os módulos essenciais',
                'Até 500 vendas/mês',
                'Clientes ilimitados',
                'Suporte por email',
                '5GB de armazenamento'
            ],
            popular: false
        },
        {
            id: 2,
            name: 'Standard',
            description: 'Perfeito para empresas em crescimento',
            price: '399,00',
            features: [
                'Todos os módulos incluídos',
                'Vendas ilimitadas',
                'Clientes e fornecedores ilimitados',
                'Suporte prioritário',
                '20GB de armazenamento',
                'Relatórios avançados'
            ],
            popular: true
        },
        {
            id: 3,
            name: 'Premium',
            description: 'Para empresas que querem o máximo',
            price: '699,00',
            features: [
                'Todos os módulos + recursos avançados',
                'Vendas ilimitadas',
                'Usuários ilimitados',
                'Suporte 24/7',
                'Armazenamento ilimitado',
                'Treinamento personalizado',
                'Integrações premium'
            ],
            popular: false,
            recommended: true
        }
    ], []);

    const plansToShow = props?.plans?.length ? props.plans : defaultPlans;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Helmet>
                <title>Planos e Preços do SIGESC - Software de Gestão Comercial</title>
                <meta
                    name="description"
                    content="Descubra os planos do SIGESC, o software de gestão comercial com PDV avançado, controle financeiro e gestão de estoque. Escolha o plano ideal para o seu negócio e impulsione sua eficiência."
                />
                <meta
                    name="keywords"
                    content="software de gestão, preços SIGESC, PDV avançado, controle financeiro, gestão de estoque, planos de gestão, software comercial, eficiência empresarial, gestão integrada"
                />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://sisgesc.net/prices" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": "SIGESC Software de Gestão",
                        "description": "Sistema completo de gestão empresarial",
                        "offers": {
                            "@type": "AggregateOffer",
                            "offerCount": plansToShow.length,
                            "lowPrice": "199",
                            "highPrice": "699",
                            "priceCurrency": "BRL",
                            "offers": plansToShow.map(plan => ({
                                "@type": "Offer",
                                "name": plan.name,
                                "description": plan.description,
                                "price": plan.price.replace(',00', '').replace('.', ''),
                                "priceCurrency": "BRL"
                            }))
                        }
                    })}
                </script>
            </Helmet>

            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                >
                    Planos que se adaptam ao seu negócio
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-600 max-w-3xl mx-auto"
                >
                    Escolha o plano ideal para sua empresa e tenha acesso a todas as ferramentas
                    necessárias para crescer com eficiência e controle total.
                </motion.p>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <div className="flex flex-wrap justify-center gap-8">
                        {[...Array(3)].map((_, i) => (
                            <PriceSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center gap-8"
                    >
                        {plansToShow.map((plan, index) => (
                            <div key={plan.id || index} className="w-full sm:w-auto">
                                <PlanCard
                                    title={plan.name}
                                    description={plan.description}
                                    price={plan.price}
                                    popular={plan.popular}
                                    recommended={plan.recommended}
                                    onSelectPlan={() => handleSelectPlan('/CreateCompany/0')}
                                />
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Seção de Garantia */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 bg-blue-50 rounded-2xl p-8 text-center"
            >
                <div className="inline-flex items-center bg-white rounded-full px-4 py-2 mb-4">
                    <FiStar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-600 font-semibold">Garantia de 30 dias</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Experimente sem riscos</h3>
                <p className="text-gray-700 max-w-2xl mx-auto">
                    Se não ficar satisfeito nos primeiros 30 dias, devolvemos seu dinheiro.
                    Sem perguntas, sem complicações.
                </p>
            </motion.div>

            {/* Seção de FAQ */}
            <div className="mt-20">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perguntas Frequentes</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {[
                        {
                            question: "Posso mudar de plano depois?",
                            answer: "Sim, você pode upgrade ou downgrade a qualquer momento. A diferença de valor será ajustada na próxima fatura."
                        },
                        {
                            question: "Quais formas de pagamento aceitam?",
                            answer: "Aceitamos cartão de crédito, débito automático, PIX e boleto bancário."
                        },
                        {
                            question: "O sistema funciona offline?",
                            answer: "O PDV funciona em modo offline, sincronizando os dados quando a conexão for restabelecida."
                        },
                        {
                            question: "Oferecem treinamento?",
                            answer: "Sim, todos os planos incluem treinamento inicial. Planos premium têm treinamento personalizado."
                        }
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-xl shadow-md"
                        >
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Seção de CTA Final */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 text-center"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ainda com dúvidas?</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Nossa equipe está pronta para ajudar você a escolher a melhor solução para seu negócio.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FiHelpCircle className="w-5 h-5 mr-2" />
                        Falar com Especialista
                    </motion.a>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://admin.sisgesc.net/getting-started"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        <FiPlay className="w-5 h-5 mr-2" />
                        Demonstração Gratuita
                    </motion.a>
                </div>
            </motion.div>
        </div>
    );
};

// Componente de página principal
export default function PricesComponent(props: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <div className='relative'>
                <FormStateProvider>
                    <HeaderComponent auth={props.auth} />

                    <Helmet>
                        <title>Planos e Preços do SIGESC - Software de Gestão Comercial</title>
                        <meta
                            name="description"
                            content="Descubra os planos do SIGESC, o software de gestão comercial com PDV avançado, controle financeiro e gestão de estoque. Escolha o plano ideal para o seu negócio e impulsione sua eficiência."
                        />
                        <meta
                            name="keywords"
                            content="software de gestão, preços SIGESC, PDV avançado, controle financeiro, gestão de estoque, planos de gestão, software comercial, eficiência empresarial, gestão integrada"
                        />
                    </Helmet>

                    <main className="mt-10 bg-gradient-to-b from-blue-50 to-white py-16">
                        <Prices />
                    </main>

                    <FooterComponent />
                </FormStateProvider>
            </div>
        </UserLoggedProvider>
    );
}
