import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { m as moduleData, a as SIGESC_SITE_URL, H as HeaderComponent, b as SIGESC_GETTING_STARTED_URL, F as FooterComponent } from "./Header-D07wN13G.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { Link } from "@inertiajs/react";
import { Helmet } from "react-helmet";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
function ModulePage(props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const module = moduleData[props.moduleName.replace(/[-\s]/g, "").toLowerCase()] || moduleData.faturamento;
  const { images, imageAlts } = module;
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5e3);
    return () => clearInterval(interval);
  }, [images.length]);
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };
  const FeatureIcon = ({ iconPath }) => /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: iconPath }) });
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: module.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: module.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: module.keywords }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: module.title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: module.description }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `${SIGESC_SITE_URL}/${props.moduleName}` })
    ] }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col md:flex-row items-center justify-between mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "md:w-1/2 mb-10 md:mb-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight", children: module.heroTitle }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-8", children: module.heroSubtitle }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                href: `/downloads`,
                className: "flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 group-hover:scale-110 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" }) }),
                  "Solicitar Demonstração"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: SIGESC_GETTING_STARTED_URL,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 group",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 group-hover:scale-110 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }),
                  "Testar Online"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-blue-100 rounded-2xl rotate-2 opacity-70" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: images[0],
              alt: imageAlts[0],
              className: "relative rounded-xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
            }
          )
        ] }) })
      ] }),
      images.length > 1 && /* @__PURE__ */ jsxs("div", { className: "py-12", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-center text-gray-900 mb-4", children: [
          "Sistema de ",
          props.moduleName.charAt(0).toUpperCase() + props.moduleName.slice(1),
          " Completo"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center max-w-2xl mx-auto mb-12", children: "Conheça as funcionalidades do melhor software para sua empresa" }),
        /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden shadow-xl bg-white p-4 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative h-96 overflow-hidden rounded-lg", children: [
            images.map((image, index) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`,
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: image,
                    alt: imageAlts[index],
                    className: "w-full h-full object-contain"
                  }
                )
              },
              index
            )),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: goToPrevImage,
                className: "absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300",
                "aria-label": "Imagem anterior",
                children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: goToNextImage,
                className: "absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300",
                "aria-label": "Próxima imagem",
                children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5l7 7-7 7" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-4 space-x-2", children: images.map((_, index) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => goToImage(index),
              className: `w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"}`,
              "aria-label": `Ir para imagem ${index + 1}`
            },
            index
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center mt-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-700 font-medium", children: imageAlts[currentImageIndex] }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-500 text-sm", children: [
              currentImageIndex + 1,
              " de ",
              images.length
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-gray-900 mb-4", children: "Funcionalidades Principais" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-center max-w-2xl mx-auto mb-12", children: "Descubra como nosso sistema pode transformar sua gestão" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: module.features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(FeatureIcon, { iconPath: feature.icon }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: feature.description })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-16 bg-white rounded-2xl shadow-sm p-8 mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-gray-900 mb-12", children: "Vantagens do Sistema" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: module.benefits.map((benefit, index) => /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsx("div", { className: "mr-6", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-xl font-bold text-2xl", children: benefit.number }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3", children: benefit.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: benefit.description })
          ] })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-center text-white shadow-xl mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-4", children: "Pronto para Transformar sua Gestão?" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-100 text-xl mb-8 max-w-2xl mx-auto", children: "Experimente gratuitamente nossa solução completa para seu negócio." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center flex-wrap gap-4", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: `/contact`,
              className: "bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg",
              children: "Falar com Especialista"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: SIGESC_GETTING_STARTED_URL,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "border border-white text-white hover:bg-blue-700 font-medium py-3 px-8 rounded-lg transition-all duration-300",
              children: "Testar Grátis por 30 Dias"
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/downloads",
              className: "bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }),
                "Baixar Setup"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  ModulePage as default
};
