import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
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
function Paragraphs({ text }) {
  if (!text)
    return null;
  return /* @__PURE__ */ jsx("div", { className: "space-y-3 text-[15px] leading-relaxed text-teal-50/85 whitespace-pre-wrap", children: text });
}
function CareersShow({
  auth,
  seo,
  job,
  canManageCareers,
  flash
}) {
  const [ready, setReady] = useState(false);
  const form = useForm({
    name: "",
    email: "",
    phone: "",
    linkedin_url: "",
    portfolio_url: "",
    cover_letter: ""
  });
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  const submit = (e) => {
    e.preventDefault();
    form.post(`/carreiras/${job.slug}/candidatar`, { preserveScroll: true });
  };
  const open = job.status === "open";
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: `${job.title} | Carreiras SIGESC`,
        fallbackDescription: job.summary || job.description.slice(0, 150)
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "careers-page bg-[#06241f] text-white", children: [
      /* @__PURE__ */ jsx("style", { children: `
                        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');
                        .careers-page { font-family: Manrope, sans-serif; }
                        .careers-page .display { font-family: Fraunces, Georgia, serif; }
                    ` }),
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-teal-900/50", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center",
            style: {
              backgroundImage: "linear-gradient(115deg, rgba(6,36,31,.95) 0%, rgba(6,36,31,.82) 50%, rgba(6,36,31,.55) 100%), url('/img/dashboard-sigesc-angola.png')"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,212,191,.22),transparent_40%)]" }),
        /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32", children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: ready ? { opacity: 1, y: 0 } : void 0,
            children: [
              /* @__PURE__ */ jsx(Link, { href: "/carreiras", className: "text-sm font-medium text-teal-300 hover:text-teal-200", children: "← Todas as vagas" }),
              /* @__PURE__ */ jsx("p", { className: "display mt-6 text-4xl tracking-[0.06em] text-teal-200 sm:text-5xl", children: "SIGESC" }),
              job.department && /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300/90", children: job.department }),
              /* @__PURE__ */ jsx("h1", { className: "display mt-2 max-w-3xl text-3xl leading-tight text-white sm:text-5xl", children: job.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-2xl text-base text-teal-50/80 sm:text-lg", children: [job.location, job.employment_type_label, job.work_mode_label, job.salary_range].filter(Boolean).join(" · ") }),
              canManageCareers && /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/admin/carreiras/${job.id}/editar`,
                  className: "mt-6 inline-flex text-sm font-semibold text-teal-300 hover:underline",
                  children: "Editar no painel →"
                }
              )
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: ready ? { opacity: 1, y: 0 } : void 0,
            transition: { delay: 0.08 },
            className: "space-y-10",
            children: [
              job.summary && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white", children: "Resumo" }),
                /* @__PURE__ */ jsx("p", { className: "mt-3 text-[15px] leading-relaxed text-teal-50/85", children: job.summary })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white", children: "Descrição" }),
                /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Paragraphs, { text: job.description }) })
              ] }),
              job.requirements && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white", children: "Requisitos" }),
                /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Paragraphs, { text: job.requirements }) })
              ] }),
              job.benefits && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white", children: "Benefícios" }),
                /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Paragraphs, { text: job.benefits }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.aside,
          {
            initial: { opacity: 0, y: 18 },
            animate: ready ? { opacity: 1, y: 0 } : void 0,
            transition: { delay: 0.14 },
            id: "candidatar",
            className: "lg:sticky lg:top-24 lg:self-start",
            children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-teal-800/80 bg-[#08332c] p-6 sm:p-7", children: [
              /* @__PURE__ */ jsx("h2", { className: "display text-2xl text-white", children: "Candidatar-se" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-teal-100/70", children: "Enviamos confirmação para o seu e-mail e notificamos a equipa SIGESC." }),
              ((flash == null ? void 0 : flash.success) || form.recentlySuccessful) && /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-lg bg-teal-400/15 px-3 py-2 text-sm text-teal-100", children: (flash == null ? void 0 : flash.success) || "Candidatura enviada com sucesso." }),
              (flash == null ? void 0 : flash.error) && /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200", children: flash.error }),
              !open ? /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-amber-200/90", children: "Esta vaga não está a aceitar candidaturas de momento." }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-6 space-y-4", children: [
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "Nome completo" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: form.data.name,
                      onChange: (e) => form.setData("name", e.target.value),
                      required: true,
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  ),
                  form.errors.name && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-red-300", children: form.errors.name })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "E-mail" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: form.data.email,
                      onChange: (e) => form.setData("email", e.target.value),
                      required: true,
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  ),
                  form.errors.email && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-red-300", children: form.errors.email })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "Telefone" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      value: form.data.phone,
                      onChange: (e) => form.setData("phone", e.target.value),
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "LinkedIn (opcional)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "url",
                      value: form.data.linkedin_url,
                      onChange: (e) => form.setData("linkedin_url", e.target.value),
                      placeholder: "https://",
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "Portfólio / CV online (opcional)" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "url",
                      value: form.data.portfolio_url,
                      onChange: (e) => form.setData("portfolio_url", e.target.value),
                      placeholder: "https://",
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-teal-100/80", children: "Carta de apresentação" }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      value: form.data.cover_letter,
                      onChange: (e) => form.setData("cover_letter", e.target.value),
                      required: true,
                      rows: 6,
                      minLength: 40,
                      className: "mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                    }
                  ),
                  form.errors.cover_letter && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-red-300", children: form.errors.cover_letter })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: form.processing,
                    className: "w-full rounded-md bg-teal-300 px-4 py-3 text-sm font-semibold text-[#06241f] transition hover:bg-teal-200 disabled:opacity-60",
                    children: form.processing ? "A enviar…" : "Enviar candidatura"
                  }
                )
              ] })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  CareersShow as default
};
