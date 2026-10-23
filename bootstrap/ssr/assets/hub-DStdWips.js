import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { e as SIGESC_HUB_URL, H as HeaderComponent, F as FooterComponent } from "./Header-CZCIToSw.js";
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
    q: "Para quem é o SIGESC HUB?",
    a: "Para quem tem várias empresas ou contas SIGESC e quer gerir tudo num único lugar — grupos, gabinetes e contabilidades."
  },
  {
    q: "O HUB tem contabilidade?",
    a: "Sim. Plano de contas, diários, lançamentos, razão, balancetes e reconciliação — um sistema completo de contabilidade."
  },
  {
    q: "Onde aceder?",
    a: "Em hub.sisgesc.net — também a partir desta página."
  }
];
function shotFor(product, key) {
  return product.screenshots.find((s) => s.key === key) || product.screenshots[0];
}
function HubPage({
  auth,
  seo,
  product
}) {
  var _a, _b, _c;
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shots = ((_a = product.screenshots) == null ? void 0 : _a.length) ? product.screenshots : [];
  const hero = product.hero_image || ((_b = shots[0]) == null ? void 0 : _b.src) || "/img/produtos/hub/hero.jpg";
  const productUrl = product.product_url || SIGESC_HUB_URL;
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (shots.length < 2)
      return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % shots.length);
    }, 5e3);
    return () => window.clearInterval(timer);
  }, [shots.length]);
  const active = shots[activeIndex] || shots[0];
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "SIGESC HUB | Multiempresa e Contabilidade",
        fallbackDescription: product.description
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs(
      "main",
      {
        className: "hub-page text-[#12151a]",
        style: {
          "--hb-ink": "#12151a",
          "--hb-deep": "#0b1f20",
          "--hb-accent": "#2dd4bf",
          "--hb-soft": "#e8f3f3",
          "--hb-mist": "#f3f7f7"
        },
        children: [
          /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden bg-[var(--hb-deep)] text-white", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 scale-105 bg-cover bg-center",
                style: { backgroundImage: `url('${hero}')` }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(112deg,rgba(11,31,32,.96)_0%,rgba(11,31,32,.84)_46%,rgba(11,31,32,.42)_100%)]" }),
            /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20", children: [
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 18 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55 },
                  className: "font-serif text-5xl tracking-[0.08em] text-[#5eead4] sm:text-7xl",
                  children: "SIGESC HUB"
                }
              ),
              /* @__PURE__ */ jsx(
                motion.h1,
                {
                  initial: { opacity: 0, y: 22 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.6, delay: 0.08 },
                  className: "mt-4 max-w-3xl font-serif text-3xl leading-[1.12] sm:text-5xl",
                  children: product.headline
                }
              ),
              /* @__PURE__ */ jsx(
                motion.p,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: ready ? { opacity: 1, y: 0 } : void 0,
                  transition: { duration: 0.55, delay: 0.16 },
                  className: "mt-5 max-w-xl text-base text-white/85 sm:text-lg",
                  children: product.lead
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
                        href: productUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "bg-[var(--hb-accent)] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] sm:px-6",
                        children: "Abrir hub.sisgesc.net"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: "/produtos",
                        className: "border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6",
                        children: "Todos os produtos"
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--hb-mist)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--hb-ink)] sm:text-4xl", children: "Do SIGESC ao painel do grupo" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--hb-ink)]/70 sm:text-lg", children: "O SIGESC fatura e gere cada empresa. O HUB consolida várias e acrescenta contabilidade — no mesmo ecossistema." }),
            /* @__PURE__ */ jsxs("div", { className: "relative mt-8 overflow-hidden border border-[var(--hb-deep)]/10 bg-[var(--hb-deep)] sm:mt-10", children: [
              /* @__PURE__ */ jsx("div", { className: "relative aspect-[16/10] bg-[#061314]", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active && /* @__PURE__ */ jsx(
                motion.img,
                {
                  src: active.src,
                  alt: active.alt,
                  initial: { opacity: 0, scale: 1.02 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.5 },
                  className: "absolute inset-0 h-full w-full object-cover object-top"
                },
                active.src
              ) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.18em] text-[#5eead4]", children: active == null ? void 0 : active.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-white/75 sm:text-base", children: active == null ? void 0 : active.summary })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: shots.map((shot, index) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveIndex(index),
                    "aria-label": shot.title,
                    className: `h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? "scale-125 bg-[var(--hb-accent)]" : "bg-white/35 hover:bg-white/70"}`
                  },
                  shot.key
                )) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--hb-ink)] sm:text-4xl", children: "Multiempresa e contabilidade" }),
            /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-[var(--hb-ink)]/70 sm:text-lg", children: "Vista do grupo, vista por empresa, e lançamentos contabilísticos no mesmo produto." }),
            /* @__PURE__ */ jsx("div", { className: "mt-12 space-y-16 sm:mt-14 sm:space-y-20", children: (product.capabilities || []).map((cap, index) => {
              const shot = shotFor(product, cap.key);
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
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-teal-700", children: String(index + 1).padStart(2, "0") }),
                      /* @__PURE__ */ jsx("h3", { className: "mt-3 font-serif text-2xl text-[var(--hb-ink)] sm:text-3xl", children: cap.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-relaxed text-[var(--hb-ink)]/75 sm:text-lg", children: cap.body })
                    ] }),
                    shot && /* @__PURE__ */ jsx("div", { className: reverse ? "lg:order-1" : void 0, children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: shot.src,
                        alt: shot.alt,
                        className: "w-full border border-[var(--hb-deep)]/10 object-cover object-top",
                        loading: "lazy"
                      }
                    ) })
                  ]
                },
                cap.key
              );
            }) })
          ] }) }),
          ((_c = product.highlights) == null ? void 0 : _c.length) > 0 && /* @__PURE__ */ jsx("section", { className: "bg-[var(--hb-soft)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--hb-ink)]", children: "Porque usar o SIGESC HUB" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2", children: product.highlights.map((item) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex gap-3 text-[var(--hb-ink)]/85",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" }),
                  /* @__PURE__ */ jsx("span", { children: item })
                ]
              },
              item
            )) })
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-[var(--hb-deep)] text-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl sm:text-4xl", children: "Ligado ao SIGESC certificado AGT" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-white/75", children: [
              "Sincroniza com o SIGESC (AGT ",
              product.agt_cert,
              ") e completa o ecossistema com Hospitalar e Marketplace."
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "mt-8 grid gap-5 sm:grid-cols-2", children: (product.integrations || []).map((item) => /* @__PURE__ */ jsx(
              "li",
              {
                className: "border-l-2 border-[var(--hb-accent)] pl-4 text-base text-white/90",
                children: item
              },
              item
            )) }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: productUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "mt-10 inline-flex bg-[var(--hb-accent)] px-6 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4]",
                children: "Ir para hub.sisgesc.net"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("section", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-[var(--hb-ink)]", children: "Perguntas frequentes" }),
            /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-[var(--hb-ink)]", children: faq.q }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-[var(--hb-ink)]/75", children: faq.a })
            ] }, faq.q)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: productUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "bg-[var(--hb-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#143334]",
                  children: "Abrir HUB"
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: "/contact",
                  className: "border border-[var(--hb-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--hb-ink)] transition hover:bg-[var(--hb-mist)]",
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
  HubPage as default
};
