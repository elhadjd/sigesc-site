import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-DS1KgxT3.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
const ResourceItem = ({ title, description, link, type }) => /* @__PURE__ */ jsxs("div", { className: "p-4 border rounded-lg shadow hover:shadow-lg transition-all duration-300", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: title }),
  /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: description }),
  type === "video" ? /* @__PURE__ */ jsx("a", { href: link, target: "_blank", className: "text-blue-500 hover:underline", children: "Assistir vídeo" }) : /* @__PURE__ */ jsx("a", { href: link, className: "text-blue-500 hover:underline", children: "Ler mais" })
] });
function LearningCenter(props) {
  const resources = [
    { title: "Como configurar seu PDV no SIGESC", description: "Um guia rápido para começar a usar o ponto de venda.", link: "/guias/configurar-pdv", type: "article" },
    { title: "Introdução ao SIGESC", description: "Assista ao nosso vídeo de introdução para novos usuários.", link: "https://www.youtube.com/watch?v=pwB3Reib6u0", type: "video" }
    // Mais recursos...
  ];
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center mb-8", children: "Centro de Aprendizagem SIGESC" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: resources.map((resource, index) => /* @__PURE__ */ jsx(ResourceItem, { ...resource }, index)) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  LearningCenter as default
};
