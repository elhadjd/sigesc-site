import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { H as HeaderComponent, F as FooterComponent } from "./Header-0-Q0W_KU.js";
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
const partnerBenefits = [
  "Revenda e implantação do SIGESC junto de PME",
  "Licenças ilimitadas (cloud e offline)",
  "Faturação eletrónica certificada AGT",
  "PDV, stock, finanças, compras e RH",
  "Suporte comercial para o seu território"
];
const freelancerBenefits = [
  "Indique o SIGESC a empresas e empresários",
  "Ganhe 30% de comissão sobre cada venda fechada",
  "Sem mensalidade — só comissão",
  "Ideal para consultores, contabilistas e comerciais",
  "Acompanhe as indicações com a equipa SIGESC"
];
function PartnershipIndex({
  auth,
  seo,
  plan
}) {
  const [ready, setReady] = useState(false);
  const freelancer = plan.freelancer;
  const commission = (freelancer == null ? void 0 : freelancer.commission_formatted) || "30%";
  const faqs = [
    {
      q: "Quanto custa a parceria Parceiro?",
      a: `A mensalidade do programa Parceiro SIGESC é de ${plan.price_formatted}, com licenças ilimitadas.`
    },
    {
      q: "As licenças são ilimitadas?",
      a: "Sim. No plano Parceiro as licenças são ilimitadas para cloud e versão offline."
    },
    {
      q: "O que é a parceria Freelancer?",
      a: `Freelancers indicam o SIGESC a clientes e ganham ${commission} de comissão sobre as vendas fechadas. Não há mensalidade.`
    },
    {
      q: "Como me candidatar?",
      a: "Peça parceria pelo contacto ou registe uma conta. Indique se pretende o plano Parceiro ou Freelancer."
    }
  ];
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: `Parceria SIGESC | ${plan.price_formatted}/mês · Freelancer ${commission}`,
        fallbackDescription: `Parceiro SIGESC: ${plan.price_formatted}/mês com licenças ilimitadas. Freelancer: indique clientes e ganhe ${commission} de comissão.`
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
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 22 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.6, delay: 0.08 },
              className: "mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl",
              children: "Dois caminhos de parceria com o nosso sistema"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0, y: 18 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.55, delay: 0.16 },
              className: "mt-5 max-w-xl text-lg text-white/80",
              children: [
                "Parceiro: ",
                plan.price_formatted,
                "/mês com licenças ilimitadas. Freelancer: indique clientes e ganhe ",
                commission,
                " de comissão."
              ]
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
                    children: "Registar conta"
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "relative border-t border-white/10 bg-[#0b2833]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-4 py-16 sm:px-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white sm:text-4xl", children: "Escolha o tipo de parceria" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-white/75", children: "Revenda e implantar como Parceiro, ou indicar clientes como Freelancer." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.35 },
              transition: { duration: 0.45 },
              className: "border border-white/15 bg-[#071820] p-8 sm:p-10",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]", children: "Parceiro" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-3 font-serif text-5xl text-white sm:text-6xl", children: [
                  plan.price_formatted,
                  /* @__PURE__ */ jsx("span", { className: "ml-2 text-xl text-white/60", children: "/mês" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-white/80", children: plan.offline_licenses_note }),
                /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3 text-white/85", children: partnerBenefits.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" }),
                  /* @__PURE__ */ jsx("span", { children: item })
                ] }, item)) }),
                /* @__PURE__ */ jsxs("p", { className: "mt-5 text-sm text-white/55", children: [
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
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.35 },
              transition: { duration: 0.45, delay: 0.08 },
              className: "border border-[#00a5cf]/35 bg-[#071820] p-8 sm:p-10",
              children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]", children: (freelancer == null ? void 0 : freelancer.label) || "Freelancer" }),
                /* @__PURE__ */ jsxs("p", { className: "mt-3 font-serif text-5xl text-white sm:text-6xl", children: [
                  commission,
                  /* @__PURE__ */ jsx("span", { className: "ml-2 text-xl text-white/60", children: "comissão" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-4 text-white/80", children: (freelancer == null ? void 0 : freelancer.summary) || "Indique o SIGESC a clientes e ganhe comissão sobre as vendas fechadas." }),
                /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-3 text-white/85", children: freelancerBenefits.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7fd4e8]" }),
                  /* @__PURE__ */ jsx("span", { children: item.replace("30%", commission) })
                ] }, item)) }),
                /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm text-white/55", children: "Sem mensalidade · só comissão" }),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: "/contact",
                    className: "mt-8 inline-flex bg-[#00a5cf] px-5 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#3ec4e6]",
                    children: "Quero ser freelancer"
                  }
                )
              ]
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
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white sm:text-4xl", children: "Licenças ilimitadas para parceiros" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-lg text-white/75", children: "No plano Parceiro, as licenças cloud e offline são ilimitadas — ideal para crescer a sua carteira de clientes em Angola sem teto de cupos." }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-8 sm:grid-cols-3", children: [
            {
              title: "Cloud e offline",
              body: "Implante no posto do cliente ou na nuvem, com sincronização quando houver rede."
            },
            {
              title: "Sem limite de licenças",
              body: "Escale a sua operação comercial sem restrição de cupos no plano Parceiro."
            },
            {
              title: "Freelancer à parte",
              body: `Se preferir só indicar clientes, o modelo Freelancer paga ${commission} de comissão.`
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
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-white/75", children: faq.a })
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
