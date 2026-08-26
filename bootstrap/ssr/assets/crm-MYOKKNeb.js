import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { H as HeaderComponent, a as SIGESC_GETTING_STARTED_URL, F as FooterComponent } from "./Header-DYoPkiI6.js";
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
    q: "O que é o CRM do SIGESC?",
    a: "É o módulo comercial para organizar leads, pipeline, follow-ups e comunicação com clientes — no mesmo sistema da faturação AGT."
  },
  {
    q: "Integra WhatsApp e email?",
    a: "Sim. As conversas ficam ligadas ao contacto e ao negócio no funil."
  },
  {
    q: "Serve para PME em Angola?",
    a: "Sim. Fluxos pensados para equipas comerciais em Luanda e noutras províncias."
  }
];
function shotFor(module, key) {
  return module.screenshots.find((s) => s.key === key) || module.screenshots[0];
}
function CrmModulePage({
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
    }, 4500);
    return () => window.clearInterval(timer);
  }, [shots.length]);
  const active = shots[activeIndex] || shots[0];
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "CRM SIGESC | Pipeline, WhatsApp e Gestão de Clientes em Angola",
        fallbackDescription: module.description
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs(
      "main",
      {
        className: "crm-page text-[#102a32]",
        style: {
          "--crm-ink": "#102a32",
          "--crm-deep": "#0a3a44",
          "--crm-mid": "#125a68",
          "--crm-accent": "#1f9bb0",
          "--crm-mist": "#e8f4f6",
          "--crm-sand": "#f3f0e8"
        },
        children: [
          /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden bg-[var(--crm-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 bg-cover bg-center scale-105",
                style: {
                  backgroundImage: `url('${hero}')`
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(105deg,rgba(10,58,68,.94)_0%,rgba(10,58,68,.78)_48%,rgba(10,58,68,.42)_100%)]" }),
            /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(31,155,176,.35),transparent_40%)]" }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "pointer-events-none absolute inset-0 opacity-[0.12]",
                style: {
                  backgroundImage: "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
                  backgroundSize: "48px 48px"
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-20 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20", children: [
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.6 },
                  className: "font-serif text-5xl tracking-[0.1em] text-[#9fd8e2] sm:text-7xl",
                  children: "SIGESC"
                }
              ),
              /* @__PURE__ */ jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 24 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.65, delay: 0.08 },
                  className: "mt-4 max-w-3xl font-serif text-3xl leading-[1.12] text-white sm:text-5xl",
                  children: module.headline
                }
              ),
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55, delay: 0.16 },
                  className: "mt-5 max-w-xl text-lg text-white/82",
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
                        className: "bg-[var(--crm-accent)] px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#2eb3c8]",
                        children: "Pedir demonstração"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: SIGESC_GETTING_STARTED_URL,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "border border-white/45 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/10",
                        children: "Testar online"
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[var(--crm-sand)]", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--crm-deep)]/10 to-transparent" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--crm-ink)] sm:text-4xl", children: "Veja o CRM em ação" }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-lg text-[var(--crm-ink)]/70", children: "Ecrãs reais do módulo: painel, pipeline, contactos, WhatsApp, email e relatórios." }),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-10 overflow-hidden border border-[var(--crm-deep)]/10 bg-[var(--crm-deep)] shadow-[0_30px_80px_-40px_rgba(10,58,68,.55)]", children: [
                /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/10] bg-[#071820]", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active && /* @__PURE__ */ jsx(
                  motion.img,
                  {
                    src: active.src,
                    alt: active.alt,
                    initial: { opacity: 0, scale: 1.02 },
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.55 },
                    className: "absolute inset-0 h-full w-full object-contain object-top"
                  },
                  active.src
                ) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.18em] text-[#9fd8e2]", children: active == null ? void 0 : active.title }),
                    /* @__PURE__ */ jsx("p", { className: "mt-1 text-white/75", children: active == null ? void 0 : active.summary })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: shots.map((shot, index) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setActiveIndex(index),
                      "aria-label": shot.title,
                      className: `h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "bg-[var(--crm-accent)] scale-125" : "bg-white/35 hover:bg-white/70"}`
                    },
                    shot.key
                  )) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--crm-ink)] sm:text-4xl", children: "Tudo o que a equipa comercial precisa" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-lg text-[var(--crm-ink)]/70", children: "Do primeiro contacto ao fecho — com comunicação e indicadores no mesmo sítio." }),
            /* @__PURE__ */ jsx("div", { className: "mt-14 space-y-20", children: (module.capabilities || []).map((cap, index) => {
              const shot = shotFor(module, cap.key);
              const reverse = index % 2 === 1;
              return /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 28 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.3 },
                  transition: { duration: 0.5 },
                  className: "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: reverse ? "lg:order-2" : void 0, children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[var(--crm-accent)]", children: String(index + 1).padStart(2, "0") }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-3 font-serif text-3xl text-[var(--crm-ink)]", children: cap.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg leading-relaxed text-[var(--crm-ink)]/75", children: cap.body })
                    ] }),
                    shot && /* @__PURE__ */ jsxs("div", { className: `relative ${reverse ? "lg:order-1" : ""}`, children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute -inset-3 bg-[var(--crm-mist)] rotate-1" }),
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: shot.src,
                          alt: shot.alt,
                          className: "relative w-full border border-[var(--crm-deep)]/10 bg-[var(--crm-deep)] object-cover",
                          loading: "lazy"
                        }
                      )
                    ] })
                  ]
                },
                cap.key
              );
            }) })
          ] }) }),
          /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[var(--crm-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 bg-cover bg-center opacity-25",
                style: {
                  backgroundImage: `url('${((_c = shotFor(module, "relatorios")) == null ? void 0 : _c.src) || hero}')`
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[var(--crm-deep)]/88" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-4xl", children: "CRM ligado à faturação AGT" }),
              /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-lg text-white/75", children: [
                "O comercial fecha no CRM; a empresa fatura e opera no SIGESC — certificado AGT ",
                module.agt_cert,
                "."
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mt-10 grid gap-6 sm:grid-cols-2", children: (module.integrations || []).map((item, index) => /* @__PURE__ */ jsx(
                motion.li,
                {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.4 },
                  transition: { duration: 0.4, delay: index * 0.06 },
                  className: "border-l-2 border-[var(--crm-accent)] pl-4 text-lg text-white/90",
                  children: item
                },
                item
              )) })
            ] })
          ] }),
          ((_d = module.highlights) == null ? void 0 : _d.length) > 0 && /* @__PURE__ */ jsx("section", { className: "bg-[var(--crm-mist)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-16 sm:px-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--crm-ink)]", children: "Porque escolher o CRM SIGESC" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2", children: module.highlights.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3 text-[var(--crm-ink)]/85", children: [
              /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--crm-accent)]" }),
              /* @__PURE__ */ jsx("span", { children: item })
            ] }, item)) })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--crm-ink)]", children: "Perguntas frequentes" }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[var(--crm-ink)]", children: faq.q }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[var(--crm-ink)]/75", children: faq.a })
            ] }, faq.q)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/contact",
                  className: "bg-[var(--crm-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2eb3c8]",
                  children: "Falar com especialista"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/solutions",
                  className: "border border-[var(--crm-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--crm-ink)] transition hover:bg-[var(--crm-mist)]",
                  children: "Ver todas as soluções"
                }
              ),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: SIGESC_GETTING_STARTED_URL,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "border border-[var(--crm-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--crm-ink)] transition hover:bg-[var(--crm-mist)]",
                  children: "Testar grátis"
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
  CrmModulePage as default
};
