import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { H as HeaderComponent, a as SIGESC_GETTING_STARTED_URL, F as FooterComponent } from "./Header-D4IePXS7.js";
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
    q: "O cliente precisa de conta no SIGESC?",
    a: "Não. Crie o link da conferência, envie ao cliente e ele entra na reunião sem registo."
  },
  {
    q: "Posso ligar só a um colega?",
    a: "Sim. Além das salas, há chamadas diretas entre utilizadores da empresa."
  },
  {
    q: "Dá para partilhar e gravar o ecrã?",
    a: "Sim. Partilhe o ecrã com a sala e grave a sessão quando precisar de arquivo ou formação."
  }
];
function shotFor(module, key) {
  return module.screenshots.find((s) => s.key === key) || module.screenshots[0];
}
function ConferenciasPage({
  auth,
  seo,
  module
}) {
  var _a, _b, _c, _d;
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shots = ((_a = module.screenshots) == null ? void 0 : _a.length) ? module.screenshots : [];
  const hero = module.hero_image || ((_b = shots[0]) == null ? void 0 : _b.src) || "/img/dashboard-sigesc-angola.png";
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
        fallbackTitle: "Chamadas e Conferências SIGESC | Videoconferência para PME em Angola",
        fallbackDescription: module.description
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs(
      "main",
      {
        className: "conferencias-page text-[#0f2740]",
        style: {
          "--cf-ink": "#0f2740",
          "--cf-deep": "#0c2f3d",
          "--cf-accent": "#1496ad",
          "--cf-soft": "#e7f3f6",
          "--cf-warm": "#f2efe6"
        },
        children: [
          /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden bg-[var(--cf-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 scale-105 bg-cover bg-center",
                style: { backgroundImage: `url('${hero}')` }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(108deg,rgba(12,47,61,.94)_0%,rgba(12,47,61,.78)_50%,rgba(12,47,61,.4)_100%)]" }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(20,150,173,.38),transparent_42%)]" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20", children: [
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55 },
                  className: "font-serif text-5xl tracking-[0.1em] text-[#9ed7e3] sm:text-7xl",
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
                      Link,
                      {
                        href: "/contact",
                        className: "bg-[var(--cf-accent)] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1fb0c9] sm:px-6",
                        children: "Pedir demonstração"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: SIGESC_GETTING_STARTED_URL,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "border border-white/45 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 sm:px-6",
                        children: "Testar online"
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--cf-warm)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--cf-ink)] sm:text-4xl", children: "Veja o módulo em ação" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--cf-ink)]/70 sm:text-lg", children: "Conferências, link para convidados, chamadas diretas, partilha e gravação de ecrã." }),
            /* @__PURE__ */ jsxs("div", { className: "relative mt-8 overflow-hidden border border-[var(--cf-deep)]/10 bg-[var(--cf-deep)] shadow-[0_28px_70px_-36px_rgba(12,47,61,.55)] sm:mt-10", children: [
              /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/10] bg-[#071820]", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active && /* @__PURE__ */ jsx(
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
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[#9ed7e3]", children: active == null ? void 0 : active.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-white/75 sm:text-base", children: active == null ? void 0 : active.summary })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: shots.map((shot, index) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveIndex(index),
                    "aria-label": shot.title,
                    className: `h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "scale-125 bg-[var(--cf-accent)]" : "bg-white/35 hover:bg-white/70"}`
                  },
                  shot.key
                )) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--cf-ink)] sm:text-4xl", children: "Do link ao fecho da reunião" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--cf-ink)]/70 sm:text-lg", children: "Interno ou com cliente — áudio, vídeo, partilha e gravação no mesmo fluxo." }),
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
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cf-accent)]", children: String(index + 1).padStart(2, "0") }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-3 font-serif text-2xl text-[var(--cf-ink)] sm:text-3xl", children: cap.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-relaxed text-[var(--cf-ink)]/75 sm:text-lg", children: cap.body })
                    ] }),
                    shot && /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: `relative ${reverse ? "lg:order-1" : ""}`,
                        children: [
                          /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 bg-[var(--cf-soft)] rotate-1 sm:-inset-3" }),
                          /* @__PURE__ */ jsx(
                            "img",
                            {
                              src: shot.src,
                              alt: shot.alt,
                              className: "relative w-full border border-[var(--cf-deep)]/10 object-cover",
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
          /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[var(--cf-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 bg-cover bg-center opacity-25",
                style: {
                  backgroundImage: `url('${((_c = shotFor(module, "partilha")) == null ? void 0 : _c.src) || hero}')`
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[var(--cf-deep)]/88" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-4xl", children: "No mesmo software da faturação AGT" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-base text-white/75 sm:text-lg", children: [
                "Reuniões comerciais junto do CRM e da gestão — certificado AGT",
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
                  className: "border-l-2 border-[var(--cf-accent)] pl-4 text-base text-white/90 sm:text-lg",
                  children: item
                },
                item
              )) })
            ] })
          ] }),
          ((_d = module.highlights) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ jsx("section", { className: "bg-[var(--cf-soft)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--cf-ink)]", children: "Porque usar conferências no SIGESC" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2", children: module.highlights.map((item) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex gap-3 text-[var(--cf-ink)]/85",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cf-accent)]" }),
                  /* @__PURE__ */ jsx("span", { children: item })
                ]
              },
              item
            )) })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--cf-ink)]", children: "Perguntas frequentes" }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[var(--cf-ink)]", children: faq.q }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[var(--cf-ink)]/75", children: faq.a })
            ] }, faq.q)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/contact",
                  className: "bg-[var(--cf-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb0c9]",
                  children: "Falar com especialista"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/modules/crm",
                  className: "border border-[var(--cf-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--cf-ink)] transition hover:bg-[var(--cf-soft)]",
                  children: "Ver CRM"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/solutions",
                  className: "border border-[var(--cf-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--cf-ink)] transition hover:bg-[var(--cf-soft)]",
                  children: "Todas as soluções"
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
  ConferenciasPage as default
};
