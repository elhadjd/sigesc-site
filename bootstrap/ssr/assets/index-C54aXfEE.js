import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { H as HeaderComponent, a as SIGESC_GETTING_STARTED_URL, F as FooterComponent } from "./Header-wqgBzPGG.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-yLNXfAPy.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
function ProdutosIndex({
  auth,
  seo,
  products
}) {
  var _a;
  const [ready, setReady] = useState(false);
  const list = (products == null ? void 0 : products.length) ? products : [];
  const heroImage = ((_a = list[0]) == null ? void 0 : _a.image) || "/img/dashboard-sigesc-angola.png";
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Produtos SIGESC | Faturação, Hospitalar e HUB",
        fallbackDescription: "Conheça os produtos SIGESC: faturação e gestão, Hospitalar para clínicas e HUB multiempresa com contabilidade."
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs(
      "main",
      {
        className: "produtos-page text-[#12202a]",
        style: {
          "--pr-ink": "#12202a",
          "--pr-deep": "#0c2f38",
          "--pr-accent": "#0d9488",
          "--pr-mist": "#eef6f7"
        },
        children: [
          /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden bg-[var(--pr-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 scale-105 bg-cover bg-center",
                style: { backgroundImage: `url('${heroImage}')` }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(115deg,rgba(12,47,56,.96)_0%,rgba(12,47,56,.82)_50%,rgba(12,47,56,.45)_100%)]" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20", children: [
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55 },
                  className: "font-serif text-5xl tracking-[0.08em] text-[#99f6e4] sm:text-7xl",
                  children: "SIGESC"
                }
              ),
              /* @__PURE__ */ jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.6, delay: 0.08 },
                  className: "mt-4 max-w-3xl font-serif text-3xl leading-[1.12] sm:text-5xl",
                  children: "Outros produtos do ecossistema"
                }
              ),
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 14 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55, delay: 0.16 },
                  className: "mt-5 max-w-xl text-base text-white/85 sm:text-lg",
                  children: "Além da faturação e gestão de empresas: Hospitalar para clínicas e hospitais, e HUB para várias empresas com contabilidade."
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 12 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.5, delay: 0.24 },
                  className: "mt-8 flex flex-wrap gap-3",
                  children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: "/produtos/hospitalar",
                        className: "bg-[var(--pr-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f766e] sm:px-6",
                        children: "SIGESC Hospitalar"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: "/produtos/hub",
                        className: "border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6",
                        children: "SIGESC HUB"
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--pr-mist)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--pr-ink)] sm:text-4xl", children: "Três produtos, um ecossistema" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--pr-ink)]/70 sm:text-lg", children: "Escolha o produto certo para o seu contexto — ou combine-os." }),
            /* @__PURE__ */ jsx("div", { className: "mt-12 space-y-16 sm:mt-14 sm:space-y-20", children: list.map((product, index) => {
              const reverse = index % 2 === 1;
              return /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.28 },
                  transition: { duration: 0.48 },
                  className: "grid items-center gap-6 lg:grid-cols-2 lg:gap-14",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: reverse ? "lg:order-2" : void 0, children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pr-accent)]", children: product.badge }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-3 font-serif text-2xl text-[var(--pr-ink)] sm:text-3xl", children: product.name }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium text-[var(--pr-ink)]/55", children: product.tagline }),
                      /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-relaxed text-[var(--pr-ink)]/75 sm:text-lg", children: product.description }),
                      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
                        /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: product.href,
                            className: "bg-[var(--pr-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3d48]",
                            children: product.cta
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "a",
                          {
                            href: product.external_url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "border border-[var(--pr-deep)]/25 px-5 py-2.5 text-sm font-semibold text-[var(--pr-ink)] transition hover:bg-white",
                            children: "Abrir site"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: reverse ? "lg:order-1" : void 0, children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image,
                        alt: product.name,
                        className: "w-full border border-[var(--pr-deep)]/10 object-cover",
                        loading: index === 0 ? "eager" : "lazy"
                      }
                    ) })
                  ]
                },
                product.key
              );
            }) })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--pr-deep)] text-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-4xl", children: "Pronto para começar?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-xl text-white/75", children: "Experimente o SIGESC, o Hospitalar ou o HUB — ou fale connosco para escolher o caminho certo." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: SIGESC_GETTING_STARTED_URL,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "bg-[var(--pr-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f766e]",
                  children: "Testar SIGESC"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/contact",
                  className: "border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10",
                  children: "Falar com a equipa"
                }
              )
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  ProdutosIndex as default
};
