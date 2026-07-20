import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import Contacts from "./index-BUg1uR8k.js";
import { H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import "react";
import "react-icons/bi";
import "react-icons/bs";
import "@inertiajs/react";
import "react-toastify";
import "./loadingButtons-CO2cJ9-s.js";
import "react-icons/vsc";
import "react-icons/ai";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "axios";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
function ContactPage(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsx(FormStateProvider, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Contato SIGESC - Suporte e Demonstrações" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Entre em contato com a SIGESC para saber mais sobre nosso software de gestão comercial. Oferecemos suporte dedicado, demonstrações e soluções personalizadas para o seu negócio."
        }
      ),
      /* @__PURE__ */ jsx(Helmet, { children: /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "contato SIGESC, software de gestão, suporte SIGESC, demonstração SIGESC, gestão comercial, PDV avançado, controle financeiro, gestão de estoque"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsx(
      motion.main,
      {
        className: "mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
        children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto bg-white shadow-lg rounded-lg overflow-hidden", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center text-blue-600", children: "Entre em Contato com a SIGESC" }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700 mb-8 text-center md:text-left", children: [
              "O ",
              /* @__PURE__ */ jsx("strong", { children: "software de gestão SIGESC" }),
              " é a solução ideal para empresas que buscam ",
              /* @__PURE__ */ jsx("strong", { children: "eficiência" }),
              ", ",
              /* @__PURE__ */ jsx("strong", { children: "organização" }),
              " e ",
              /* @__PURE__ */ jsx("strong", { children: "crescimento" }),
              ". Se você precisa de um ",
              /* @__PURE__ */ jsx("strong", { children: "sistema de gestão comercial" }),
              " completo, entre em contato conosco. Nossa equipe está pronta para ajudar você a alcançar seus objetivos."
            ] }),
            /* @__PURE__ */ jsx(Contacts, { compact: false, auth: props.auth })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) }) });
}
export {
  ContactPage as default
};
