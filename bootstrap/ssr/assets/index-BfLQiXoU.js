import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { H as HeaderComponent, F as FooterComponent } from "./Header-BXKYyj2J.js";
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
const benefits = [
  "Revenda e implantação do SIGESC junto de PME",
  "Faturação eletrónica certificada AGT",
  "PDV, stock, finanças, compras e RH",
  "Suporte comercial para o seu território",
  "Material para apresentar o sistema a clientes"
];
const faqs = [
  {
    q: "Quanto custa a parceria?",
    a: "A mensalidade do programa de parceria com o sistema SIGESC é de 30.000 Kz."
  },
  {
    q: "A versão offline tem licenças limitadas?",
    a: "Sim. Os cupos da versão offline são limitados e atribuídos conforme disponibilidade e região."
  },
  {
    q: "Como me candidatar?",
    a: "Peça parceria pelo contacto ou registe uma conta Parceiro. A equipa confirma o cupo offline e os próximos passos."
  }
];
function PartnershipIndex({
  auth,
  seo,
  plan
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Parceria SIGESC | 30.000 Kz/mês · Licenças Offline Limitadas",
        fallbackDescription: "Torne-se parceiro SIGESC: revenda software de gestão comercial certificado AGT em Angola. Mensalidade 30.000 Kz com licenças offline limitadas."
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "partnership-page bg-[#071820] text-white", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center",
            style: {
              backgroundImage: "linear-gradient(105deg, rgba(7,24,32,.92) 0%, rgba(7,24,32,.72) 42%, rgba(7,24,32,.35) 100%), url('/img/dashboard-sigesc-angola.png')"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,165,207,.28),transparent_42%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-16 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20 sm:pt-20", children: [
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 16 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.55 },
              className: "font-serif text-5xl tracking-[0.08em] text-[#7fd4e8] sm:text-7xl",
              children: "SIGESC"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.h1,
            {
              initial: { opacity: 0, y: 22 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.6, delay: 0.08 },
              className: "mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl",
              children: [
                "Parceria com o nosso sistema — ",
                plan.price_formatted,
                "/mês"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 18 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.55, delay: 0.16 },
              className: "mt-5 max-w-xl text-lg text-white/80",
              children: "Revenda e implemente gestão comercial certificada AGT em Angola. Licenças limitadas para a versão offline."
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
                    className: "bg-[#00a5cf] px-6 py-3 text-sm font-semibold tracking-wide text-[#071820] transition hover:bg-[#3ec4e6]",
                    children: "Pedir parceria"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: plan.register_url,
                    className: "border border-white/40 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/10",
                    children: "Registar como parceiro"
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "relative border-t border-white/10 bg-[#0b2833]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white sm:text-4xl", children: "Plano de parceria mensal" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-lg text-white/75", children: "Um valor claro para crescer com o SIGESC: apresente o sistema, feche clientes e acompanhe implantações na sua região." }),
          /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3 text-white/85", children: benefits.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" }),
            /* @__PURE__ */ jsx("span", { children: item })
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden border border-white/15 bg-[#071820] p-8 sm:p-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]", children: "Mensalidade" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3 font-serif text-5xl text-white sm:text-6xl", children: [
            plan.price_formatted,
            /* @__PURE__ */ jsx("span", { className: "ml-2 text-xl text-white/60", children: "/mês" })
          ] }),
          plan.offline_licenses_limited && /* @__PURE__ */ jsx("p", { className: "mt-5 border-t border-white/10 pt-5 text-white/80", children: plan.offline_licenses_note }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-white/55", children: [
            "Certificação AGT ",
            plan.agt_cert
          ] }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "mt-8 inline-flex bg-white px-5 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#7fd4e8]",
              children: "Quero ser parceiro"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-t border-white/10", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center opacity-30",
            style: {
              backgroundImage: "url('/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png')"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#071820]/85" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-16 sm:px-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white sm:text-4xl", children: "Versão offline com cupos limitados" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-lg text-white/75", children: "Ideal para lojas e escritórios com internet instável. A instalação local continua a emitir e gerir o negócio — as licenças offline para parceiros não são ilimitadas." }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-8 sm:grid-cols-3", children: [
            {
              title: "Instalação local",
              body: "Windows ou Linux no posto do cliente, com sincronização quando houver rede."
            },
            {
              title: "Cupos por região",
              body: "Distribuição controlada para proteger território e qualidade de suporte."
            },
            {
              title: "Aprovação comercial",
              body: "Cada pedido de parceria e licença offline passa por validação da equipa SIGESC."
            }
          ].map((block, index) => /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.4 },
              transition: { duration: 0.45, delay: index * 0.08 },
              children: [
                /* @__PURE__ */ jsx("h3", { className: "font-serif text-2xl text-[#7fd4e8]", children: block.title }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-white/75", children: block.body })
              ]
            },
            block.title
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-white/10 bg-[#0b2833]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white", children: "Perguntas frequentes" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: faqs.map((faq) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: faq.q }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-white/75", children: faq.q.includes("custa") ? `A mensalidade do programa de parceria com o sistema SIGESC é de ${plan.price_formatted}.` : faq.a })
        ] }, faq.q)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "bg-[#00a5cf] px-6 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#3ec4e6]",
              children: "Contactar comercial"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/prices",
              className: "border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10",
              children: "Ver preços cloud"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  PartnershipIndex as default
};
