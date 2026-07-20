import { jsxs, jsx } from "react/jsx-runtime";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { f as features, p as performanceMetrics, H as HeaderComponent, F as FooterComponent } from "./Header-DS1KgxT3.js";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { router } from "@inertiajs/react";
import { FiPlay, FiDownload, FiPlayCircle, FiGrid, FiChevronDown } from "react-icons/fi";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
const App = "_App_1diu2_1";
const style$1 = {
  App
};
const container = "_container_g9xbb_1";
const header = "_header_g9xbb_10";
const content_left = "_content_left_g9xbb_13";
const buttons = "_buttons_g9xbb_42";
const contact = "_contact_g9xbb_48";
const demo = "_demo_g9xbb_145";
const content_right = "_content_right_g9xbb_163";
const banner = "_banner_g9xbb_197";
const why = "_why_g9xbb_217";
const apps = "_apps_g9xbb_229";
const Cards$1 = "_Cards_g9xbb_232";
const style = {
  container,
  header,
  content_left,
  buttons,
  contact,
  "border-top": "_border-top_g9xbb_1",
  "border-bottom": "_border-bottom_g9xbb_1",
  demo,
  content_right,
  banner,
  why,
  apps,
  Cards: Cards$1
};
const SliderImg = React.lazy(() => import("./sliderImg-CFRVf-F4.js"));
const Why = React.lazy(() => import("./Why-Cyg_ZaiJ.js"));
const Apps = React.lazy(() => import("./apps-aa8QECeO.js"));
const Cards = React.lazy(() => import("./Cards-CcsS2QZc.js"));
const Contacts = React.lazy(() => import("./index-BUg1uR8k.js"));
const BecomePartnerSection = React.lazy(() => import("./PartnerSection-Brhs6g69.js"));
const CEOSection = React.lazy(() => import("./ceo-CJiNBsxc.js"));
const LoadingPlaceholder = ({ height = "200px" }) => /* @__PURE__ */ jsx("div", { className: "bg-gray-100 animate-pulse rounded-lg", style: { height } });
const useIsInViewport = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);
  return [ref, isIntersecting];
};
const LazyRender = ({ children, height = "200px", options = { threshold: 0.1 } }) => {
  const [ref, isInViewport] = useIsInViewport(options);
  return /* @__PURE__ */ jsx("div", { ref, style: { minHeight: height }, children: isInViewport ? children : /* @__PURE__ */ jsx(LoadingPlaceholder, { height }) });
};
const Demonstration = ({ auth }) => {
  const [textPreview, setTextPreview] = useState({
    state: false,
    content: ""
  });
  const [isCriticalContentLoaded, setIsCriticalContentLoaded] = useState(false);
  const handlerPreviewText = (id) => {
    var _a;
    if (id != "false") {
      const text = (_a = document.getElementById(id)) == null ? void 0 : _a.textContent;
      textPreview.content = text;
    }
    textPreview.state = !textPreview.state;
    setTextPreview({ ...textPreview });
  };
  useWindowSize();
  const title = "SIGESC - Software de Gestão Integrado para Empresas";
  const description = "O SIGESC é um software de gestão completo que simplifica a administração do seu negócio. Com PDV, controle financeiro, estoque e compras integrados, ele centraliza operações para mais eficiência e crescimento. Ideal para otimizar processos e decisões.";
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCriticalContentLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const HeroImage = useMemo(() => /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-gradient-to-r from-blue-400/5 to-purple-400/5 blur-xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl overflow-hidden border border-gray-200/50 bg-white shadow-2xl", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png",
          alt: "Dashboard completo do SIGESC mostrando todas as funcionalidades",
          width: 600,
          height: 400,
          className: "w-full h-auto rounded-xl",
          loading: "eager",
          decoding: "sync",
          fetchPriority: "high",
          style: { contentVisibility: "auto" }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer",
          onClick: () => router.get("/demo"),
          children: /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(FiPlay, { className: "text-blue-600 text-lg" }) })
        }
      )
    ] })
  ] }), []);
  return /* @__PURE__ */ jsxs("main", { className: "bg-gray-50", children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "software de gestão, sistema de gestão comercial, PDV, controle financeiro, gestão de estoque, ERP, gestão empresarial, software integrado" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "SIGESC" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }),
      /* @__PURE__ */ jsx("link", { rel: "preload", href: "/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png", as: "image" })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24 lg:pt-24 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-10% right-10% w-80 h-80 bg-blue-100/20 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-10% left-10% w-96 h-96 bg-blue-200/10 rounded-full blur-3xl" }),
      /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between gap-12 pb-10 lg:gap-16", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            className: "lg:w-1/2 text-center lg:text-left",
            children: [
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.5, delay: 0.2 },
                  className: "inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full animate-pulse" }),
                    /* @__PURE__ */ jsx("span", { className: "text-blue-700 text-sm font-medium", children: "Sistema Completo para Empresas em Angola" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-900", children: "Tudo que sua empresa" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "precisa em um só lugar" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed", children: "Sistema completo de gestão empresarial com 10 módulos integrados para transformar sua gestão em Angola." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10", children: [
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    whileHover: { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.15)" },
                    whileTap: { scale: 0.98 },
                    className: "px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 group",
                    onClick: () => router.get(route("download-page")),
                    children: [
                      /* @__PURE__ */ jsx(FiDownload, { className: "text-xl" }),
                      /* @__PURE__ */ jsx("span", { children: "Experimente Grátis" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    whileHover: { scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.05)" },
                    whileTap: { scale: 0.98 },
                    className: "px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 group",
                    onClick: () => router.get("/demo"),
                    children: [
                      /* @__PURE__ */ jsx(FiPlayCircle, { className: "text-xl" }),
                      /* @__PURE__ */ jsx("span", { children: "Ver Demonstração" })
                    ]
                  }
                )
              ] }),
              isCriticalContentLoaded && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.6, delay: 0.4 },
                  className: "grid grid-cols-2 gap-4 mb-8",
                  children: features.filter((feature) => feature.name !== "Compras" && feature.name !== "Gestão de Fornecedores" && feature.name !== "Gestão de Funcionários" && feature.name !== "Logísticas" && feature.name !== "Marketing" && feature.name !== "Loja Virtual").map((feature, index) => /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: feature.href,
                      className: "flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group",
                      children: [
                        /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg bg-${feature.color}-50 text-${feature.color}-600`, children: React.createElement(feature.icon) }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 group-hover:text-gray-900", children: feature.name })
                      ]
                    },
                    index
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.8, delay: 0.3 },
            className: "lg:w-1/2 relative",
            children: [
              HeroImage,
              isCriticalContentLoaded && /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.8 },
                  className: "grid grid-cols-2 gap-4 mt-6",
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-blue-50 rounded-xl p-4 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors group",
                        onClick: () => router.get("/features"),
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(FiGrid, { className: "text-blue-600 group-hover:scale-110 transition-transform" }),
                          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900", children: "Ver Todos os Módulos" }) })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors group",
                        onClick: () => router.get("/demo"),
                        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                          /* @__PURE__ */ jsx(FiPlay, { className: "text-gray-600 group-hover:scale-110 transition-transform" }),
                          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: "Tour Guiado" }) })
                        ] })
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ jsx("div", { className: "animate-bounce", children: /* @__PURE__ */ jsx(FiChevronDown, { className: "text-gray-400 text-xl" }) }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: performanceMetrics.map((stat, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl md:text-4xl font-bold text-blue-600 mb-2", children: stat.number }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-600 font-medium", children: stat.label })
        ]
      },
      index
    )) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white", children: [
      /* @__PURE__ */ jsx(LazyRender, { height: "400px", children: /* @__PURE__ */ jsx("div", { className: style.banner, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "400px" }), children: /* @__PURE__ */ jsx(SliderImg, {}) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-8 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(LazyRender, { height: "300px", children: /* @__PURE__ */ jsx("div", { className: style.Cards, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "300px" }), children: /* @__PURE__ */ jsx(Cards, {}) }) }) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(LazyRender, { height: "400px", children: /* @__PURE__ */ jsx("div", { className: style.apps, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "400px" }), children: /* @__PURE__ */ jsx(Apps, {}) }) }) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-8 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(LazyRender, { height: "500px", children: /* @__PURE__ */ jsx("div", { className: style.why, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "500px" }), children: /* @__PURE__ */ jsx(Why, { actionPreviewText: handlerPreviewText }) }) }) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(LazyRender, { height: "300px", children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "300px" }), children: /* @__PURE__ */ jsx(BecomePartnerSection, {}) }) }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-8 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(LazyRender, { height: "400px", children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "400px" }), children: /* @__PURE__ */ jsx(CEOSection, {}) }) }) }) }),
      /* @__PURE__ */ jsx(LazyRender, { height: "250px", children: /* @__PURE__ */ jsx("section", { className: "py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: "Pronto para transformar seu negócio?" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-100 mb-8", children: "Comece hoje mesmo e experimente todos os benefícios do SIGESC" }),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto",
                onClick: () => router.get(route("download-page")),
                children: [
                  /* @__PURE__ */ jsx(FiDownload, {}),
                  "Começar Agora - Grátis"
                ]
              }
            )
          ]
        }
      ) }) }) }),
      /* @__PURE__ */ jsx(LazyRender, { height: "500px", children: /* @__PURE__ */ jsx("section", { className: "py-16 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          viewport: { once: true },
          className: "bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg",
          children: /* @__PURE__ */ jsx("div", { className: style.contact, children: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(LoadingPlaceholder, { height: "400px" }), children: /* @__PURE__ */ jsx(Contacts, { auth }) }) })
        }
      ) }) }) })
    ] })
  ] });
};
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });
  useEffect(() => {
    if (typeof window === "undefined")
      return;
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);
  return windowSize;
}
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function dashboard(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsx("div", { className: `${style$1.App} relative`, children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsx(Demonstration, { auth: props.auth }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) }) });
}
export {
  dashboard as default
};
