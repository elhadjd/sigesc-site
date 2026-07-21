import { jsx, jsxs } from "react/jsx-runtime";
import { b as SIGESC_GETTING_STARTED_URL, H as HeaderComponent, F as FooterComponent } from "./Header-DF037L4K.js";
import { u as useStateChatToggle, U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { useState } from "react";
import { FiSearch, FiChevronUp, FiChevronDown, FiMail, FiMessageCircle, FiShield, FiCreditCard } from "react-icons/fi";
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
function FaqComponent() {
  const [openItems, setOpenItems] = useState({
    faq1: true,
    faq2: false,
    faq3: false,
    faq4: false,
    faq5: false
  });
  const { setStateToggleChat } = useStateChatToggle();
  const [searchTerm, setSearchTerm] = useState("");
  const toggleItem = (itemId) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  const faqItems = [
    {
      id: "faq1",
      question: "Como posso acessar o SIGESC?",
      answer: "Você pode acessar o SIGESC através do nosso site, fazendo login com suas credenciais de usuário. Se você ainda não tem uma conta,",
      link: {
        text: "clique aqui para se registrar gratuitamente",
        url: SIGESC_GETTING_STARTED_URL
      },
      icon: /* @__PURE__ */ jsx(FiMessageCircle, { className: "w-5 h-5" })
    },
    {
      id: "faq2",
      question: "Quais funcionalidades o SIGESC oferece?",
      answer: "O SIGESC oferece diversas funcionalidades, incluindo gestão de ponto de venda, faturamento, compras, estoque e gerenciamento de funcionários, entre outros.",
      icon: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) })
    },
    {
      id: "faq3",
      question: "Existe suporte ao cliente disponível?",
      answer: "Sim, oferecemos suporte ao cliente através de chat ao vivo, e-mail e telefone. Nossa equipe está disponível para ajudar com quaisquer dúvidas ou problemas que você possa ter.",
      icon: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" }) })
    },
    {
      id: "faq4",
      question: "Como o SIGESC protege meus dados?",
      answer: "Levamos a segurança dos seus dados muito a sério. Utilizamos criptografia de ponta a ponta e outras tecnologias de segurança para proteger suas informações pessoais e de sua empresa.",
      icon: /* @__PURE__ */ jsx(FiShield, { className: "w-5 h-5" })
    },
    {
      id: "faq5",
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura do SIGESC a qualquer momento. Entre em contato com nosso suporte ao cliente para obter assistência com o processo de cancelamento.",
      icon: /* @__PURE__ */ jsx(FiCreditCard, { className: "w-5 h-5" })
    }
  ];
  const filteredFaqItems = faqItems.filter(
    (item) => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsx("div", { className: "mt-10 bg-gradient-to-b from-gray-50 to-gray-100 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("header", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: [
        "Perguntas ",
        /* @__PURE__ */ jsx("span", { className: "text-blue-500", children: "Frequentes" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Encontre respostas para as dúvidas mais comuns sobre o SIGESC" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl shadow-md p-4 mb-10 border border-blue-100", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Pesquisar perguntas...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: "w-full px-4 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }
      ),
      /* @__PURE__ */ jsx(FiSearch, { className: "absolute left-4 top-3.5 w-5 h-5 text-gray-400" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredFaqItems.length > 0 ? filteredFaqItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => toggleItem(item.id),
          className: "w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200",
          "aria-expanded": openItems[item.id],
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-blue-500 flex-shrink-0", children: item.icon }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900", children: item.question })
            ] }),
            openItems[item.id] ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-5 h-5 text-blue-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-5 h-5 text-blue-500 flex-shrink-0" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `px-6 pb-6 transition-all duration-300 ${openItems[item.id] ? "block" : "hidden"}`, children: /* @__PURE__ */ jsx("div", { className: "pl-9", children: /* @__PURE__ */ jsxs("p", { className: "text-gray-700 mb-4", children: [
        item.answer,
        item.link && /* @__PURE__ */ jsx(
          "a",
          {
            href: item.link.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:text-blue-700 font-medium ml-1 transition-colors duration-200",
            children: item.link.text
          }
        )
      ] }) }) })
    ] }, item.id)) : /* @__PURE__ */ jsxs("div", { className: "text-center py-10", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-16 h-16 text-gray-300 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Nenhum resultado encontrado" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Tente usar outros termos de pesquisa" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-4 text-center", children: "Ainda precisa de ajuda?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-center mb-6", children: "Nossa equipe de suporte está pronta para ajudar com suas dúvidas" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-lg border border-gray-200 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(FiMail, { className: "w-6 h-6 text-blue-500" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Envie um e-mail" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Respondemos em até 24 horas" }),
          /* @__PURE__ */ jsx("a", { href: "mailto:sigesctec@gmail.com", className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "sigesctec@gmail.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-lg border border-gray-200 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" }) }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Chat ao vivo" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-3", children: "Suporte instantâneo" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setStateToggleChat(true), className: "text-blue-500 hover:text-blue-700 text-sm font-medium", children: "Iniciar conversa" })
        ] })
      ] })
    ] })
  ] }) });
}
function Faq({ auth, local }) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx(FaqComponent, {}),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  Faq as default
};
