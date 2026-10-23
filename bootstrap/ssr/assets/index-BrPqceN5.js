import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { H as HeaderComponent, F as FooterComponent } from "./Header-wqgBzPGG.js";
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
function CareersIndex({
  auth,
  seo,
  jobs,
  canManageCareers
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
        fallbackTitle: "Carreiras SIGESC | Vagas em Angola",
        fallbackDescription: "Trabalhe no SIGESC — vagas em produto, engenharia, comercial e operações em Angola."
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "careers-page bg-[#06241f] text-white", children: [
      /* @__PURE__ */ jsx("style", { children: `
                        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');
                        .careers-page { font-family: Manrope, sans-serif; }
                        .careers-page .display { font-family: Fraunces, Georgia, serif; }
                    ` }),
      /* @__PURE__ */ jsxs("section", { className: "relative min-h-[100svh] overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center",
            style: {
              backgroundImage: "linear-gradient(115deg, rgba(6,36,31,.94) 0%, rgba(6,36,31,.78) 45%, rgba(6,36,31,.42) 100%), url('/img/dashboard-sigesc-angola.png')"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,.28),transparent_44%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-16 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20 sm:pt-20", children: [
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 16 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.55 },
              className: "display text-5xl tracking-[0.08em] text-teal-200 sm:text-7xl",
              children: "SIGESC"
            }
          ),
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 22 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.6, delay: 0.08 },
              className: "display mt-4 max-w-3xl text-3xl leading-tight text-white sm:text-5xl",
              children: "Carreiras"
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 18 },
              animate: ready ? { opacity: 1, y: 0 } : void 0,
              transition: { duration: 0.55, delay: 0.16 },
              className: "mt-5 max-w-xl text-base leading-relaxed text-teal-50/85 sm:text-lg",
              children: "Ajude empresas angolanas a digitalizar a gestão — vagas em produto, engenharia e comercial."
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
                    href: "#vagas",
                    className: "inline-flex items-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-[#06241f] transition hover:bg-teal-200",
                    children: "Ver vagas abertas"
                  }
                ),
                canManageCareers && /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: "/admin/carreiras",
                    className: "inline-flex items-center rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10",
                    children: "Gerir vagas"
                  }
                )
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { id: "vagas", className: "relative border-t border-teal-900/60 bg-[#08332c] px-4 py-20 sm:px-6", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-400/10 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl", children: [
          /* @__PURE__ */ jsx("h2", { className: "display text-3xl text-white sm:text-4xl", children: "Vagas abertas" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-2xl text-teal-100/75", children: jobs.length === 0 ? "Não há vagas abertas neste momento. Volte em breve ou contacte-nos." : `${jobs.length} oportunidade${jobs.length === 1 ? "" : "s"} para crescer com a equipa SIGESC.` }),
          jobs.length === 0 ? /* @__PURE__ */ jsx("div", { className: "mt-12 max-w-xl", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "inline-flex rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-[#06241f] hover:bg-teal-200",
              children: "Enviar candidatura espontânea"
            }
          ) }) : /* @__PURE__ */ jsx("ul", { className: "mt-12 divide-y divide-teal-800/80 border-y border-teal-800/80", children: jobs.map((job, index) => /* @__PURE__ */ jsx(
            motion.li,
            {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-40px" },
              transition: { duration: 0.45, delay: Math.min(index * 0.05, 0.3) },
              children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/carreiras/${job.slug}`,
                  className: "group flex flex-col gap-3 py-7 transition sm:flex-row sm:items-end sm:justify-between sm:gap-8",
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                      job.department && /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.14em] text-teal-300/90", children: job.department }),
                      /* @__PURE__ */ jsx("h3", { className: "display mt-1 text-2xl text-white transition group-hover:text-teal-200 sm:text-3xl", children: job.title }),
                      /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-2xl text-sm leading-relaxed text-teal-100/70", children: job.summary || (job.description.length > 140 ? `${job.description.slice(0, 140)}…` : job.description) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-sm text-teal-100/80 sm:text-right", children: [
                      /* @__PURE__ */ jsx("p", { children: job.location }),
                      /* @__PURE__ */ jsxs("p", { className: "mt-1", children: [
                        job.employment_type_label,
                        " · ",
                        job.work_mode_label
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "mt-3 inline-flex text-teal-300 group-hover:underline", children: "Candidatar-se →" })
                    ] })
                  ]
                }
              )
            },
            job.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-teal-900/50 bg-[#06241f] px-4 py-16 sm:px-6", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white sm:text-3xl", children: "Porquê o SIGESC?" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xl text-teal-100/75", children: "Produto certificado AGT, impacto real em PME angolanas e uma equipa que constrói software com propósito." })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/sobre",
            className: "inline-flex text-sm font-semibold text-teal-300 hover:text-teal-200",
            children: "Conhecer a marca →"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-teal-900/40 bg-[#08332c] px-4 py-14 sm:px-6", "aria-label": "SEO carreiras Angola", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
        /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white sm:text-3xl", children: "Emprego em software e comercial B2B em Angola" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-sm leading-relaxed text-teal-100/80 sm:text-base", children: "A página de carreiras SIGESC concentra vagas de emprego em Luanda e Angola nas áreas de engenharia de software, full stack, produto e consultor comercial B2B para software de gestão e faturação eletrónica certificada AGT. Candidate-se gratuitamente — sem taxas de recrutamento." }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-teal-200/70 sm:text-sm", children: [
          "vagas emprego Luanda",
          "emprego tecnologia Angola",
          "desenvolvedor software Luanda",
          "consultor comercial B2B Angola",
          "emprego SaaS / ERP Angola",
          "vagas faturação eletrónica"
        ].map((kw) => /* @__PURE__ */ jsx("li", { children: kw }, kw)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  CareersIndex as default
};
