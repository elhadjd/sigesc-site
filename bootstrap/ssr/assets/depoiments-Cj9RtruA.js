import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CFHV1WkI.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { Helmet } from "react-helmet";
import { FiSearch, FiFilter, FiPlay, FiArrowRight, FiStar } from "react-icons/fi";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
const StorySkeleton = () => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg overflow-hidden h-96 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-48 bg-gray-200" }),
  /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-4" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-2 w-3/4" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-6", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-full" }),
      /* @__PURE__ */ jsxs("div", { className: "ml-4 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-2 w-2/3" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" })
      ] })
    ] })
  ] })
] });
const SuccessStoryCard = ({ story, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.6, delay: index * 0.1 },
      className: "group cursor-pointer",
      onClick: () => setIsExpanded(!isExpanded),
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500",
              src: story.image,
              alt: story.name,
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold", children: story.industry })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-start mb-4", children: /* @__PURE__ */ jsx("blockquote", { className: "text-gray-700 italic flex-1", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isExpanded ? /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "text-sm",
              children: story.fullTestimonial
            },
            "expanded"
          ) : /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "text-sm",
              children: story.testimonial
            },
            "collapsed"
          ) }) }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4 border-t border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                className: "w-12 h-12 rounded-full object-cover border-2 border-white shadow-md",
                src: story.image,
                alt: story.name,
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: story.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
                story.position,
                ", ",
                story.company
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center mt-1", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(
                FiStar,
                {
                  className: `w-4 h-4 ${i < story.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`
                },
                i
              )) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-6 pb-4", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            },
            className: "text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center",
            children: [
              isExpanded ? "Ler menos" : "Ler história completa",
              /* @__PURE__ */ jsx(FiArrowRight, { className: `ml-1 w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}` })
            ]
          }
        ) })
      ] })
    }
  );
};
const StoryFilters = ({ filters, activeFilter, setActiveFilter }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 mb-12", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveFilter("all"),
        className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === "all" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"}`,
        children: "Todos"
      }
    ),
    filters.map((filter) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setActiveFilter(filter),
        className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"}`,
        children: filter
      },
      filter
    ))
  ] });
};
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
const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Clientes Satisfeitos" },
    { number: "98%", label: "Taxa de Sucesso" },
    { number: "24/7", label: "Suporte Especializado" },
    { number: "15+", label: "Setores Atendidos" }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: index * 0.1 },
      viewport: { once: true },
      className: "text-center",
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold mb-2", children: stat.number }),
        /* @__PURE__ */ jsx("div", { className: "text-blue-100 font-medium", children: stat.label })
      ]
    },
    stat.label
  )) }) }) });
};
function SuccessStoriesPage(props) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1e3);
    return () => clearTimeout(timer);
  }, []);
  const industries = useMemo(() => {
    const allIndustries = successStoriesData.map((story) => story.industry);
    return [...new Set(allIndustries)];
  }, []);
  const filteredStories = useMemo(() => {
    return successStoriesData.filter((story) => {
      const matchesIndustry = activeFilter === "all" || story.industry === activeFilter;
      const matchesSearch = searchTerm === "" || story.name.toLowerCase().includes(searchTerm.toLowerCase()) || story.company.toLowerCase().includes(searchTerm.toLowerCase()) || story.testimonial.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [activeFilter, searchTerm]);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Casos de Sucesso - SIGESC | Histórias Reais de Clientes" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Descubra como o SIGESC transformou os negócios de nossos clientes. Leia depoimentos reais e inspire-se com nossos casos de sucesso em diversos setores."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "casos de sucesso SIGESC, depoimentos de clientes, software de gestão, PDV avançado, controle financeiro, gestão de estoque, histórias de sucesso, resultados reais"
        }
      ),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
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
      }) })
    ] }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsx("section", { className: "pt-28 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6", children: [
            "Histórias de ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "Sucesso" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto mb-10", children: "Descubra como empresas reais transformaram seus negócios com o SIGESC. Resultados comprovados e depoimentos autênticos de nossos clientes." }),
          /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto mb-8", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FiSearch, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Buscar casos de sucesso...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              }
            )
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-8 bg-white sticky top-0 z-10 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(FiFilter, { className: "w-5 h-5 text-gray-500 mr-2" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filtrar por setor:" })
      ] }),
      /* @__PURE__ */ jsx(
        StoryFilters,
        {
          filters: industries,
          activeFilter,
          setActiveFilter
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(StorySkeleton, {}, i)) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.5 },
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
          children: filteredStories.map((story, index) => /* @__PURE__ */ jsx(SuccessStoryCard, { story, index }, story.name))
        },
        activeFilter + searchTerm
      ),
      filteredStories.length === 0 && !isLoading && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "text-center py-20",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(FiSearch, { className: "w-12 h-12 text-gray-400" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Nenhum caso encontrado" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Tente ajustar seus filtros ou termos de busca" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setActiveFilter("all");
                  setSearchTerm("");
                },
                className: "px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors",
                children: "Ver Todos os Casos"
              }
            )
          ]
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ jsx(StatsSection, {}),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-6", children: "Pronto para escrever sua história de sucesso?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-10 max-w-2xl mx-auto", children: "Junte-se aos centenas de empresas que já transformaram seus negócios com o SIGESC" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                href: "/downloads",
                className: "px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(FiPlay, { className: "w-5 h-5" }),
                  "Solicitar Demonstração"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                href: "/contact",
                className: "px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(FiArrowRight, { className: "w-5 h-5" }),
                  "Falar com Especialista"
                ]
              }
            )
          ] })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  SuccessStoriesPage as default
};
