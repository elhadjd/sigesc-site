import { jsx, jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import { usePage, router } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent, a as SIGESC_SITE_URL, b as SIGESC_GETTING_STARTED_URL, f as features } from "./Header-DS1KgxT3.js";
import { FiStar, FiHelpCircle, FiPlay, FiCheck } from "react-icons/fi";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
const PriceSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 shadow-lg rounded-xl p-8 flex flex-col items-center gap-4 w-80 h-96 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-8 w-32 bg-gray-200 rounded mb-4" }),
  /* @__PURE__ */ jsx("div", { className: "h-4 w-48 bg-gray-200 rounded mb-2" }),
  /* @__PURE__ */ jsx("div", { className: "h-6 w-24 bg-gray-200 rounded mb-4" }),
  /* @__PURE__ */ jsx("div", { className: "space-y-3 w-full", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-full" }, i)) }),
  /* @__PURE__ */ jsx("div", { className: "h-12 w-full bg-gray-200 rounded-lg mt-6" })
] });
const PlanCard = ({
  title,
  description,
  price,
  onSelectPlan,
  popular = false,
  recommended = false
}) => /* @__PURE__ */ jsxs(
  motion.div,
  {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    className: `relative bg-white border rounded-xl p-8 flex flex-col h-full transition-all duration-300
      ${popular ? "border-blue-500 shadow-xl transform scale-105 z-10" : "border-gray-200 shadow-lg hover:shadow-xl"}`,
    children: [
      popular && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full", children: "MAIS POPULAR" }) }),
      recommended && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ jsx("span", { className: "bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full", children: "RECOMENDADO" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2 text-sm", children: description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center mb-6", children: /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold text-blue-600", children: price }) }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8 flex-grow", children: features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
        /* @__PURE__ */ jsx(FiCheck, { className: "w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: feature.name })
      ] }, index)) }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: SIGESC_GETTING_STARTED_URL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: `w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-300
        ${popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`,
          children: popular ? "Começar Agora" : "Selecionar Plano"
        }
      )
    ]
  }
);
const Prices = () => {
  var _a;
  const { props } = usePage();
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const handleSelectPlan = (route) => {
    router.get(route);
  };
  const defaultPlans = useMemo(() => [
    {
      id: 1,
      name: "Básico",
      description: "Ideal para pequenos negócios",
      price: "199,00",
      features: [
        "Todos os módulos essenciais",
        "Até 500 vendas/mês",
        "Clientes ilimitados",
        "Suporte por email",
        "5GB de armazenamento"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Standard",
      description: "Perfeito para empresas em crescimento",
      price: "399,00",
      features: [
        "Todos os módulos incluídos",
        "Vendas ilimitadas",
        "Clientes e fornecedores ilimitados",
        "Suporte prioritário",
        "20GB de armazenamento",
        "Relatórios avançados"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Premium",
      description: "Para empresas que querem o máximo",
      price: "699,00",
      features: [
        "Todos os módulos + recursos avançados",
        "Vendas ilimitadas",
        "Usuários ilimitados",
        "Suporte 24/7",
        "Armazenamento ilimitado",
        "Treinamento personalizado",
        "Integrações premium"
      ],
      popular: false,
      recommended: true
    }
  ], []);
  const plansToShow = ((_a = props == null ? void 0 : props.plans) == null ? void 0 : _a.length) ? props.plans : defaultPlans;
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Planos e Preços do SIGESC - Software de Gestão Comercial" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Descubra os planos do SIGESC, o software de gestão comercial com PDV avançado, controle financeiro e gestão de estoque. Escolha o plano ideal para o seu negócio e impulsione sua eficiência."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "software de gestão, preços SIGESC, PDV avançado, controle financeiro, gestão de estoque, planos de gestão, software comercial, eficiência empresarial, gestão integrada"
        }
      ),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `${SIGESC_SITE_URL}/prices` }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", children: JSON.stringify({
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
          "offers": plansToShow.map((plan) => ({
            "@type": "Offer",
            "name": plan.name,
            "description": plan.description,
            "price": plan.price.replace(",00", "").replace(".", ""),
            "priceCurrency": "BRL"
          }))
        }
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6",
          children: "Planos que se adaptam ao seu negócio"
        }
      ),
      /* @__PURE__ */ jsx(
        motion.p,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "text-xl text-gray-600 max-w-3xl mx-auto",
          children: "Escolha o plano ideal para sua empresa e tenha acesso a todas as ferramentas necessárias para crescer com eficiência e controle total."
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-8", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(PriceSkeleton, {}, i)) }) : /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex flex-wrap justify-center gap-8",
        children: plansToShow.map((plan, index) => /* @__PURE__ */ jsx("div", { className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(
          PlanCard,
          {
            title: plan.name,
            description: plan.description,
            price: plan.price,
            popular: plan.popular,
            recommended: plan.recommended,
            onSelectPlan: () => handleSelectPlan("/CreateCompany/0")
          }
        ) }, plan.id || index))
      }
    ) }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "mt-16 bg-blue-50 rounded-2xl p-8 text-center",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center bg-white rounded-full px-4 py-2 mb-4", children: [
            /* @__PURE__ */ jsx(FiStar, { className: "w-5 h-5 text-blue-600 mr-2" }),
            /* @__PURE__ */ jsx("span", { className: "text-blue-600 font-semibold", children: "Garantia de 30 dias" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Experimente sem riscos" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 max-w-2xl mx-auto", children: "Se não ficar satisfeito nos primeiros 30 dias, devolvemos seu dinheiro. Sem perguntas, sem complicações." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-20", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-gray-900 mb-12", children: "Perguntas Frequentes" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: [
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
      ].map((faq, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { delay: index * 0.1 },
          viewport: { once: true },
          className: "bg-white p-6 rounded-xl shadow-md",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2 text-gray-900", children: faq.question }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: faq.answer })
          ]
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        className: "mt-20 text-center",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Ainda com dúvidas?" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-8 max-w-2xl mx-auto", children: "Nossa equipe está pronta para ajudar você a escolher a melhor solução para seu negócio." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                href: "/contact",
                className: "inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(FiHelpCircle, { className: "w-5 h-5 mr-2" }),
                  "Falar com Especialista"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                href: SIGESC_GETTING_STARTED_URL,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(FiPlay, { className: "w-5 h-5 mr-2" }),
                  "Demonstração Gratuita"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
};
function PricesComponent(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Planos e Preços do SIGESC - Software de Gestão Comercial" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Descubra os planos do SIGESC, o software de gestão comercial com PDV avançado, controle financeiro e gestão de estoque. Escolha o plano ideal para o seu negócio e impulsione sua eficiência."
        }
      ),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "software de gestão, preços SIGESC, PDV avançado, controle financeiro, gestão de estoque, planos de gestão, software comercial, eficiência empresarial, gestão integrada"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("main", { className: "mt-10 bg-gradient-to-b from-blue-50 to-white py-16", children: /* @__PURE__ */ jsx(Prices, {}) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) }) });
}
export {
  Prices,
  PricesComponent as default
};
