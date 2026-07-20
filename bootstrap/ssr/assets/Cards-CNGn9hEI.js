import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { motion } from "framer-motion";
import { p as performanceMetrics, b as SIGESC_GETTING_STARTED_URL } from "./Header-CFHV1WkI.js";
import { FiAward, FiStar, FiCheckCircle, FiArrowRight, FiShoppingCart, FiDollarSign, FiTruck, FiUsers } from "react-icons/fi";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "./loggedUser-Dauubd9z.js";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
function Cards() {
  const features = [
    {
      icon: /* @__PURE__ */ jsx(FiShoppingCart, { className: "text-lg" }),
      title: "PDV Avançado",
      description: "Vendas rápidas com integração total"
    },
    {
      icon: /* @__PURE__ */ jsx(FiDollarSign, { className: "text-lg" }),
      title: "Gestão Financeira",
      description: "Controle completo do fluxo de caixa"
    },
    {
      icon: /* @__PURE__ */ jsx(FiTruck, { className: "text-lg" }),
      title: "Compras & Stock",
      description: "Gestão inteligente de inventário"
    },
    {
      icon: /* @__PURE__ */ jsx(FiUsers, { className: "text-lg" }),
      title: "Equipe Integrada",
      description: "Gestão de funcionários e permissões"
    }
  ];
  const competitiveAdvantages = [
    "Suporte 24/7 em Angola",
    "Implementação em 72h",
    "Treinamento inclusivo",
    "Actualizações gratuitas"
  ];
  return /* @__PURE__ */ jsx("div", { className: "py-12 lg:py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "text-center mb-10",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full mb-4", children: [
            /* @__PURE__ */ jsx(FiAward, { className: "text-white" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Solução Premium" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: [
            "Tudo o que sua empresa precisa",
            /* @__PURE__ */ jsx("span", { className: "block text-blue-600", children: "em uma única plataforma" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Sistema completo de gestão empresarial com todos os módulos integrados para maximizar sua produtividade." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay: 0.2 },
        className: "bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 p-6 lg:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiStar, { className: "text-blue-600" }),
                  "Diferenciais Exclusivos"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: competitiveAdvantages.map((advantage, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-blue-600 text-sm" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-700 text-sm", children: advantage })
                ] }, index)) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 p-4 bg-white/50 rounded-xl border border-gray-200/30", children: performanceMetrics.map((stat, index) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-blue-600", children: stat.number }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: stat.label })
              ] }, index)) }),
              /* @__PURE__ */ jsxs(
                motion.a,
                {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  href: SIGESC_GETTING_STARTED_URL,
                  className: "inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: "Começar Agora - Grátis" }),
                    /* @__PURE__ */ jsx(FiArrowRight, { className: "text-lg" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: features.map((feature, index) => /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.4, delay: index * 0.1 + 0.4 },
                className: "bg-white rounded-xl p-4 border border-gray-200/60 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 group cursor-pointer",
                children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300", children: feature.icon }),
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 text-sm mb-1", children: feature.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs leading-tight", children: feature.description })
                ] })
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white/80 border-t border-gray-200/50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiCheckCircle, { className: "text-green-600 text-sm" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Teste gratuito por 30 dias" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-400 text-sm" }),
              /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-400 text-sm" }),
              /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-400 text-sm" }),
              /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-400 text-sm" }),
              /* @__PURE__ */ jsx(FiStar, { className: "text-yellow-400 text-sm" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 ml-1", children: "4.9/5" })
            ] }) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.8 },
        className: "mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200/50",
        children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Porque escolher o SIGESC?" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium", children: "Preço acessível" }),
            " +",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium", children: "suporte local" }),
            " +",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-medium", children: "solução completa" }),
            " =",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-green-600 font-semibold", children: "melhor custo-benefício" })
          ] })
        ] })
      }
    )
  ] }) });
}
export {
  Cards as default
};
