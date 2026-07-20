import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { usePage, router } from "@inertiajs/react";
import { FiStar, FiSearch, FiPlay, FiArrowRight, FiCheck } from "react-icons/fi";
import { f as features, a as SIGESC_SITE_URL, H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
const useInView = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    if (ref.current)
      observer.observe(ref.current);
    return () => {
      if (ref.current)
        observer.unobserve(ref.current);
    };
  }, [options]);
  return [ref, isVisible];
};
const FeatureCard = ({ feature, index }) => {
  const [ref, isVisible] = useInView({ threshold: 0.1, triggerOnce: true });
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    red: "from-red-500 to-red-600",
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    teal: "from-teal-500 to-teal-600"
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ref,
      initial: { opacity: 0, y: 50 },
      animate: isVisible ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.6, delay: index * 0.1 },
      whileHover: { y: -5, transition: { duration: 0.2 } },
      className: "group",
      children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-xl bg-gradient-to-r ${colorMap[feature.color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`, children: /* @__PURE__ */ jsx(feature.icon, { className: "w-7 h-7 text-white" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors", children: feature.name }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6 flex-grow leading-relaxed", children: feature.desc }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 mb-6", children: feature.desc.split(" ").slice(0, 3).map((word, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(FiCheck, { className: "w-4 h-4 text-green-500 mr-2 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: word })
        ] }, i)) }),
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            whileHover: { x: 5 },
            whileTap: { scale: 0.95 },
            onClick: () => router.get(feature.href),
            className: "w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group/btn",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Saber Mais" }),
              /* @__PURE__ */ jsx(FiArrowRight, { className: "w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" })
            ]
          }
        )
      ] })
    }
  );
};
const FeatureSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-64 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-200 rounded-xl mb-4" }),
  /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded mb-3" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-2" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" })
] });
const SolutionsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { props } = usePage();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1e3);
    return () => clearTimeout(timer);
  }, []);
  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      const matchesFilter = activeFilter === "all" || feature.name.toLowerCase().includes(activeFilter.toLowerCase());
      const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) || feature.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);
  const categories = useMemo(() => [
    { id: "all", name: "Todas as Soluções", count: features.length },
    { id: "venda", name: "Vendas", count: features.filter((f) => f.name.includes("Venda") || f.name.includes("Faturamento") || f.name.includes("Dropshipping")).length },
    { id: "gestão", name: "Gestão", count: features.filter((f) => f.name.includes("Gestão") || f.name.includes("Funcionários")).length },
    { id: "estoque", name: "Estoque", count: features.filter((f) => f.name.includes("Estoque") || f.name.includes("Compras")).length },
    { id: "marketing", name: "Marketing", count: features.filter((f) => f.name.includes("Marketing") || f.name.includes("Loja") || f.name.includes("Dropshipping")).length }
  ], []);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(UserLoggedProvider, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Soluções Completas de Gestão Empresarial | SIGESC" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Descubra todas as soluções SIGESC: PDV, gestão de estoque, faturamento, dropshipping, marketing e muito mais. Sistema completo para transformar sua empresa." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "software gestão, sistema PDV, controle estoque, faturamento, dropshipping Angola, gestão funcionários, marketing, loja virtual, logística, SIGESC Angola" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Soluções de Gestão Empresarial | SIGESC" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Conheça todas as soluções integradas SIGESC, incluindo o novo módulo de dropshipping, para transformar a gestão da sua empresa." }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `${SIGESC_SITE_URL}/solucoes` }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
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
      }) })
    ] }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-28 pb-20 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black opacity-50" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" }),
      /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 },
          className: "text-center",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6", children: [
              /* @__PURE__ */ jsx(FiStar, { className: "w-4 h-4 text-blue-300 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "text-blue-200 text-sm font-medium", children: "mais de 10 Soluções Integradas" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight", children: [
              /* @__PURE__ */ jsx("span", { className: "text-white", children: "Soluções Completas para" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "text-blue-400", children: "Sua Empresa" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed", children: "Descubra todas as ferramentas integradas do SIGESC que vão transformar a gestão do seu negócio e impulsionar seus resultados." }),
            /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto mb-12", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(FiSearch, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Buscar soluções...",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: "w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              )
            ] }) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 bg-gray-50  z-10 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 justify-center", children: categories.map((category) => /* @__PURE__ */ jsxs(
      motion.button,
      {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: () => setActiveFilter(category.id),
        className: `px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeFilter === category.id ? "bg-blue-500 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"}`,
        children: [
          category.name,
          /* @__PURE__ */ jsx("span", { className: "ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full", children: category.count })
        ]
      },
      category.id
    )) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(FeatureSkeleton, {}, i)) }) : /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.5 },
          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
          children: filteredFeatures.map((feature, index) => /* @__PURE__ */ jsx(FeatureCard, { feature, index }, feature.name))
        },
        activeFilter + searchTerm
      ) }),
      filteredFeatures.length === 0 && !isLoading && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "text-center py-20",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(FiSearch, { className: "w-12 h-12 text-gray-400" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Nenhuma solução encontrada" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Tente ajustar seus filtros ou termos de busca" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setActiveFilter("all");
                  setSearchTerm("");
                },
                className: "px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors",
                children: "Ver Todas as Soluções"
              }
            )
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: [
      { number: "10+", label: "Soluções Integradas" },
      { number: "500+", label: "Empresas Atendidas" },
      { number: "99.9%", label: "Uptime Garantido" },
      { number: "24/7", label: "Suporte Especializado" }
    ].map((stat, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl md:text-5xl font-bold mb-2", children: stat.number }),
          /* @__PURE__ */ jsx("div", { className: "text-blue-100 font-medium", children: stat.label })
        ]
      },
      stat.label
    )) }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-6", children: "Pronto para Transformar Sua Empresa?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-10 max-w-2xl mx-auto", children: "Experimente todas as soluções SIGESC e descubra como podemos impulsionar seu negócio" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2",
                onClick: () => router.get("/downloads"),
                children: [
                  /* @__PURE__ */ jsx(FiPlay, { className: "w-5 h-5" }),
                  "Solicitar Demonstração"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-2",
                onClick: () => router.get("/contact"),
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
};
export {
  SolutionsPage as default
};
