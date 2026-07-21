import { jsx, jsxs } from "react/jsx-runtime";
import { b as SIGESC_GETTING_STARTED_URL, c as SIGESC_ADMIN_URL, S as SIGESC_ADMIN_LOGIN_URL, H as HeaderComponent, F as FooterComponent } from "./Header-7tCmCImi.js";
import { u as useStateChatToggle, U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { useState } from "react";
import { FiHelpCircle, FiChevronUp, FiChevronDown, FiExternalLink, FiArrowRight, FiMessageSquare, FiMail } from "react-icons/fi";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
function HelpComponent() {
  const [openSections, setOpenSections] = useState({
    "getting-started": true,
    "features": false,
    "support": false
  });
  const { setStateToggleChat } = useStateChatToggle();
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  return /* @__PURE__ */ jsx("div", { className: "mt-10 bg-gradient-to-b from-gray-50 to-gray-100 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md", children: /* @__PURE__ */ jsx(FiHelpCircle, { className: "w-10 h-10 text-blue-500" }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: [
        "Centro de ",
        /* @__PURE__ */ jsx("span", { className: "text-blue-500", children: "Ajuda" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Encontre respostas para suas perguntas e recursos para aproveitar ao máximo o SIGESC" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-md p-4 mb-10 border border-blue-100", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Pesquisar tópicos de ajuda...",
          className: "w-full px-4 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }
      ),
      /* @__PURE__ */ jsx("svg", { className: "absolute left-4 top-3.5 w-5 h-5 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleSection("getting-started"),
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Começando" })
            ] }),
            openSections["getting-started"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500" })
          ]
        }
      ),
      openSections["getting-started"] && /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("li", { className: "flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-500 rounded-md p-2 mr-4", children: /* @__PURE__ */ jsx(FiExternalLink, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("a", { href: SIGESC_GETTING_STARTED_URL, target: "_blank", className: "text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200", children: "Como criar sua conta no SIGESC" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Guia passo a passo para configurar sua conta" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-500 rounded-md p-2 mr-4", children: /* @__PURE__ */ jsx(FiExternalLink, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("a", { href: SIGESC_ADMIN_URL, target: "_blank", className: "text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200", children: "Acessar admin SIGESC" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Painel administrativo do sistema" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-blue-100 text-blue-500 rounded-md p-2 mr-4", children: /* @__PURE__ */ jsx(FiExternalLink, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("a", { href: SIGESC_ADMIN_LOGIN_URL, target: "_blank", rel: "noopener noreferrer", className: "text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200", children: "Entrar no painel SIGESC" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Registro para novos usuários" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleSection("features"),
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Guias de Funcionalidades" })
            ] }),
            openSections["features"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500" })
          ]
        }
      ),
      openSections["features"] && /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Gerenciando seu ponto de venda" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Aprenda a configurar e operar seu PDV com eficiência" }),
          /* @__PURE__ */ jsxs("button", { className: "text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center", children: [
            "Ver guia ",
            /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Usando o sistema de faturamento" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Tutorial completo sobre emissão de faturas e relatórios" }),
          /* @__PURE__ */ jsxs("button", { className: "text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center", children: [
            "Ver guia ",
            /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Otimizando seu estoque" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Controle de inventário e gestão de produtos" }),
          /* @__PURE__ */ jsxs("button", { className: "text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center", children: [
            "Ver guia ",
            /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Relatórios e Analytics" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Como extrair insights dos seus dados comerciais" }),
          /* @__PURE__ */ jsxs("button", { className: "text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center", children: [
            "Ver guia ",
            /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-1" })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleSection("support"),
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FiMessageSquare, { className: "w-6 h-6 text-blue-500" }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "Suporte e Assistência" })
            ] }),
            openSections["support"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500" })
          ]
        }
      ),
      openSections["support"] && /* @__PURE__ */ jsxs("div", { className: "px-6 pb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-6", children: "Se você precisar de assistência adicional, nossa equipe de suporte está aqui para ajudar." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-5 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(FiMessageSquare, { className: "w-5 h-5 text-blue-500" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Chat ao Vivo" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Converse com nossa equipe em tempo real" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setStateToggleChat(true), className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "Iniciar conversa →" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-5 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(FiMail, { className: "w-5 h-5 text-blue-500" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "E-mail" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Envie-nos uma mensagem detalhada" }),
            /* @__PURE__ */ jsx("a", { href: "mailto:sigesctec@gmail.com", className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "sigesctec@gmail.com →" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-5 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Formulário de Contacto" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Preencha nosso formulário online" }),
            /* @__PURE__ */ jsx("a", { href: "/contact", className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "Acessar formulário →" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-5 rounded-lg border border-blue-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx(FiHelpCircle, { className: "w-5 h-5 text-blue-500" }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900", children: "FAQ" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Perguntas frequentes e soluções" }),
            /* @__PURE__ */ jsx("a", { href: "/resources/faq", className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "Ver perguntas frequentes →" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Recursos Adicionais" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("a", { href: "https://www.youtube.com/@SigescSistemadeFactura%C3%A7%C3%A3o", target: "_blank", className: "bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: "Vídeo Tutoriais" })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "#", className: "bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: "Documentação" })
        ] }),
        /* @__PURE__ */ jsxs("a", { href: "#", className: "bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: "Webinars" })
        ] })
      ] })
    ] })
  ] }) });
}
function Help({ auth, local }) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx(HelpComponent, {}),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  Help as default
};
