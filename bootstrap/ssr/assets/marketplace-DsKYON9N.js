import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { c as SIGESC_MARKETPLACE_HOME_URL, H as HeaderComponent, a as SIGESC_GETTING_STARTED_URL, F as FooterComponent } from "./Header-D3Ccy15z.js";
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
const faqs = [
  {
    q: "Quem pode listar no Marketplace?",
    a: "Empresas e pessoas singulares podem criar o perfil e publicar produtos ou serviços na cidade onde estão."
  },
  {
    q: "Os clientes precisam do painel SIGESC?",
    a: "Não. Acedem a marketplace.sisgesc.net, pesquisam o negócio e compram ou agendam online."
  },
  {
    q: "Onde está o Marketplace?",
    a: "Em marketplace.sisgesc.net/marketplace — também a partir desta página."
  }
];
function shotFor(module, key) {
  return module.screenshots.find((s) => s.key === key) || module.screenshots[0];
}
function MarketplacePage({
  auth,
  seo,
  module
}) {
  var _a, _b, _c, _d;
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shots = ((_a = module.screenshots) == null ? void 0 : _a.length) ? module.screenshots : [];
  const hero = module.hero_image || ((_b = shots[0]) == null ? void 0 : _b.src) || "/img/dashboard-sigesc-angola.png";
  const marketplaceUrl = module.marketplace_url || SIGESC_MARKETPLACE_HOME_URL;
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (shots.length < 2)
      return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % shots.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [shots.length]);
  const active = shots[activeIndex] || shots[0];
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Marketplace SIGESC | Empresas, Produtos e Serviços Locais em Angola",
        fallbackDescription: module.description
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs(
      "main",
      {
        className: "marketplace-page text-[#1a2332]",
        style: {
          "--mp-ink": "#1a2332",
          "--mp-deep": "#1e3a5f",
          "--mp-accent": "#ea580c",
          "--mp-soft": "#fff4ed",
          "--mp-mist": "#f1f5f9"
        },
        children: [
          /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden bg-[var(--mp-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 scale-105 bg-cover bg-center",
                style: { backgroundImage: `url('${hero}')` }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(108deg,rgba(30,58,95,.94)_0%,rgba(30,58,95,.78)_48%,rgba(30,58,95,.42)_100%)]" }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(234,88,12,.32),transparent_42%)]" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20", children: [
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55 },
                  className: "font-serif text-5xl tracking-[0.1em] text-[#fdba74] sm:text-7xl",
                  children: "SIGESC"
                }
              ),
              /* @__PURE__ */ jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 22 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.6, delay: 0.08 },
                  className: "mt-4 max-w-3xl font-serif text-3xl leading-[1.12] text-white sm:text-5xl",
                  children: module.headline
                }
              ),
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55, delay: 0.16 },
                  className: "mt-5 max-w-xl text-base text-white/85 sm:text-lg",
                  children: module.lead
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 14 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.5, delay: 0.24 },
                  className: "mt-8 flex flex-wrap gap-3",
                  children: [
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: marketplaceUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "bg-[var(--mp-accent)] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#f97316] sm:px-6",
                        children: "Abrir Marketplace"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: "/contact",
                        className: "border border-white/45 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 sm:px-6",
                        children: "Listar o meu negócio"
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--mp-mist)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--mp-ink)] sm:text-4xl", children: "Do perfil à compra na cidade" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--mp-ink)]/70 sm:text-lg", children: "Categorias, cidades, empresas, produtos e serviços — como no Marketplace em marketplace.sisgesc.net." }),
            /* @__PURE__ */ jsxs("div", { className: "relative mt-8 overflow-hidden border border-[var(--mp-deep)]/10 bg-[var(--mp-deep)] shadow-[0_28px_70px_-36px_rgba(30,58,95,.55)] sm:mt-10", children: [
              /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/10] bg-[#0f172a]", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active && /* @__PURE__ */ jsx(
                motion.img,
                {
                  src: active.src,
                  alt: active.alt,
                  initial: { opacity: 0, scale: 1.02 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.5 },
                  className: "absolute inset-0 h-full w-full object-cover"
                },
                active.src
              ) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[#fdba74]", children: active == null ? void 0 : active.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-white/75 sm:text-base", children: active == null ? void 0 : active.summary })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: shots.map((shot, index) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveIndex(index),
                    "aria-label": shot.title,
                    className: `h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "scale-125 bg-[var(--mp-accent)]" : "bg-white/35 hover:bg-white/70"}`
                  },
                  shot.key
                )) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--mp-ink)] sm:text-4xl", children: "Como funciona" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--mp-ink)]/70 sm:text-lg", children: "Para quem vende e para quem procura — no mesmo Marketplace." }),
            /* @__PURE__ */ jsx("div", { className: "mt-12 space-y-16 sm:mt-14 sm:space-y-20", children: (module.capabilities || []).map((cap, index) => {
              const shot = shotFor(module, cap.key);
              const reverse = index % 2 === 1;
              return /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 26 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.28 },
                  transition: { duration: 0.48 },
                  className: "grid items-center gap-6 lg:grid-cols-2 lg:gap-14",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: reverse ? "lg:order-2" : void 0, children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mp-accent)]", children: String(index + 1).padStart(2, "0") }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-3 font-serif text-2xl text-[var(--mp-ink)] sm:text-3xl", children: cap.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-relaxed text-[var(--mp-ink)]/75 sm:text-lg", children: cap.body })
                    ] }),
                    shot && /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `relative ${reverse ? "lg:order-1" : ""}`,
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 bg-[var(--mp-soft)] rotate-1 sm:-inset-3" }),
                          /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: shot.src,
                              alt: shot.alt,
                              className: "relative w-full border border-[var(--mp-deep)]/10 object-cover",
                              loading: "lazy"
                            }
                          )
                        ]
                      }
                    )
                  ]
                },
                cap.key
              );
            }) })
          ] }) }),
          /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[var(--mp-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 bg-cover bg-center opacity-25",
                style: {
                  backgroundImage: `url('${((_c = shotFor(module, "comprar")) == null ? void 0 : _c.src) || hero}')`
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[var(--mp-deep)]/88" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-4xl", children: "Parte do ecossistema SIGESC" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-base text-white/75 sm:text-lg", children: [
                "Marketplace público ligado à marca SIGESC — faturação AGT",
                " ",
                module.agt_cert,
                "."
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6", children: (module.integrations || []).map((item, index) => /* @__PURE__ */ jsx(
                motion.li,
                {
                  initial: { opacity: 0, y: 14 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.4 },
                  transition: { duration: 0.4, delay: index * 0.05 },
                  className: "border-l-2 border-[var(--mp-accent)] pl-4 text-base text-white/90 sm:text-lg",
                  children: item
                },
                item
              )) }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: marketplaceUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "mt-10 inline-flex bg-[var(--mp-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f97316]",
                  children: "Ir para marketplace.sisgesc.net"
                }
              )
            ] })
          ] }),
          ((_d = module.highlights) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ jsx("section", { className: "bg-[var(--mp-soft)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--mp-ink)]", children: "Porque usar o Marketplace SIGESC" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2", children: module.highlights.map((item) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex gap-3 text-[var(--mp-ink)]/85",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mp-accent)]" }),
                  /* @__PURE__ */ jsx("span", { children: item })
                ]
              },
              item
            )) })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--mp-ink)]", children: "Perguntas frequentes" }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[var(--mp-ink)]", children: faq.q }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[var(--mp-ink)]/75", children: faq.a })
            ] }, faq.q)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: marketplaceUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "bg-[var(--mp-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f97316]",
                  children: "Abrir Marketplace"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/contact",
                  className: "border border-[var(--mp-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--mp-ink)] transition hover:bg-[var(--mp-mist)]",
                  children: "Falar com a equipa"
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: SIGESC_GETTING_STARTED_URL,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "border border-[var(--mp-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--mp-ink)] transition hover:bg-[var(--mp-mist)]",
                  children: "Testar SIGESC"
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
  MarketplacePage as default
};
