import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { useState } from "react";
import { FiFileText, FiChevronUp, FiChevronDown, FiCheck, FiUser, FiLock, FiRefreshCw, FiMail } from "react-icons/fi";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
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
function TermsComponent() {
  const [openSections, setOpenSections] = useState({
    "introduction": true,
    "usage": false,
    "accounts": false,
    "intellectual-property": false,
    "changes": false,
    "contact": false
  });
  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  return /* @__PURE__ */ jsx("div", { className: "mt-6 bg-gradient-to-b from-gray-50 to-gray-100 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md", children: /* @__PURE__ */ jsx(FiFileText, { className: "w-10 h-10 text-blue-500" }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: [
        "Termos de ",
        /* @__PURE__ */ jsx("span", { className: "text-blue-500", children: "Serviço" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 mb-2", children: "Conheça os termos que regem o uso do SIGESC" }),
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 bg-blue-50 text-blue-500 px-4 py-2 rounded-full", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Última atualização: 01/01/2024" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-md p-6 mb-10 border border-blue-100", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold text-gray-900 mb-4 flex items-center", children: [
        /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 text-blue-500 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
        "Navegação Rápida"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
        { id: "introduction", title: "Introdução" },
        { id: "usage", title: "Uso do Serviço" },
        { id: "accounts", title: "Contas" },
        { id: "intellectual-property", title: "Propriedade Intelectual" },
        { id: "changes", title: "Alterações" },
        { id: "contact", title: "Contato" }
      ].map((item) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            const element = document.getElementById(item.id);
            element == null ? void 0 : element.scrollIntoView({ behavior: "smooth" });
          },
          className: "text-left text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-all duration-200 flex items-start",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-blue-500 rounded-md px-2 py-1 text-xs font-medium mr-2", children: [
              item.id === "introduction" && "1",
              item.id === "usage" && "2",
              item.id === "accounts" && "3",
              item.id === "intellectual-property" && "4",
              item.id === "changes" && "5",
              item.id === "contact" && "6"
            ] }),
            /* @__PURE__ */ jsx("span", { children: item.title })
          ]
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { id: "introduction", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("introduction"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["introduction"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx(FiFileText, {}) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "1. Introdução" })
              ] }),
              openSections["introduction"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["introduction"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Bem-vindo ao SIGESC. Ao acessar nosso software ou utilizar nossos serviços, você concorda em estar vinculado por estes Termos de Serviço. Estes Termos aplicam-se a todos os visitantes, usuários e outros que desejam acessar ou usar o serviço." }),
          /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r", children: /* @__PURE__ */ jsx("p", { className: "text-blue-700 text-sm", children: "Ao utilizar nossos serviços, você confirma que leu, compreendeu e concorda com estes termos." }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "usage", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("usage"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["usage"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "2. Uso do Serviço" })
              ] }),
              openSections["usage"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["usage"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "O SIGESC fornece um conjunto de ferramentas para gestão comercial, incluindo, mas não limitado a, ponto de venda, faturamento, gerenciamento de compras, estoque e funcionários. Ao usar nosso software, você concorda em utilizá-lo de maneira responsável e conforme as leis aplicáveis." }),
          /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 mb-2", children: "Permitido:" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FiCheck, { className: "w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700 text-sm", children: "Uso para gestão do seu negócio" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(FiCheck, { className: "w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-700 text-sm", children: "Acesso através de múltiplos dispositivos autorizados" })
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "accounts", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("accounts"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["accounts"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx(FiUser, {}) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "3. Contas" })
              ] }),
              openSections["accounts"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["accounts"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Quando você cria uma conta conosco, você garante que as informações fornecidas são precisas, completas e atualizadas em todos os momentos. A inobservância desta condição constitui uma violação dos Termos, o que pode resultar no encerramento imediato de sua conta em nosso serviço." }),
          /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r mb-4", children: /* @__PURE__ */ jsx("p", { className: "text-yellow-700 text-sm", children: "Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta." }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "intellectual-property", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("intellectual-property"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["intellectual-property"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx(FiLock, {}) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "4. Propriedade Intelectual" })
              ] }),
              openSections["intellectual-property"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["intellectual-property"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "O software, seus elementos originais, recursos e funcionalidades são e permanecerão propriedade exclusiva do SIGESC e seus licenciadores. Nosso software é fornecido sob licença e não é vendido, concedendo-lhe direitos limitados de uso sob estes Termos." }),
          /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 rounded-r", children: /* @__PURE__ */ jsx("p", { className: "text-red-700 text-sm", children: "É expressamente proibida a reprodução, modificação, distribuição ou engenharia reversa do software sem autorização prévia por escrito." }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "changes", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("changes"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["changes"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx(FiRefreshCw, {}) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "5. Alterações" })
              ] }),
              openSections["changes"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["changes"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento, a nosso exclusivo critério. Se uma revisão for material, forneceremos um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor." }),
          /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r", children: /* @__PURE__ */ jsx("p", { className: "text-blue-700 text-sm", children: "O uso continuado de nossos serviços após quaisquer alterações constitui aceitação dos novos termos." }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "contact", className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => toggleSection("contact"),
            className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
            "aria-expanded": openSections["contact"],
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-blue-500 text-2xl flex-shrink-0", children: /* @__PURE__ */ jsx(FiMail, {}) }),
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900", children: "6. Contato" })
              ] }),
              openSections["contact"] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openSections["contact"] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsxs("div", { className: "pl-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-4", children: "Se você tiver alguma dúvida sobre estes Termos, por favor, entre em contato conosco através de:" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-4 rounded-lg border border-gray-200", children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(FiMail, { className: "w-4 h-4 text-blue-500 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "comercial.sisgesc@gmail.com" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-blue-500 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "+244 923 456 789" })
            ] })
          ] }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-gray-900 mb-4 text-center", children: "Aceitação dos Termos" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-center mb-6", children: "Ao utilizar nossos serviços, você confirma que leu, compreendeu e concorda com estes Termos de Serviço em sua totalidade." }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Última atualização:" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900", children: "01 de Janeiro de 2024" })
      ] }) })
    ] })
  ] }) });
}
function Terms({ auth, local }) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx(TermsComponent, {}),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  Terms as default
};
