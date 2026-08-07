import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-0-Q0W_KU.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-yLNXfAPy.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
function AboutIndex({
  auth,
  seo,
  knowledge
}) {
  var _a;
  const cert = knowledge.certification || {};
  const partner = knowledge.partnership || {};
  const brand = knowledge.brand || {};
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Sobre o SIGESC | Software de Gestão Comercial Certificado AGT"
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "bg-[#f3f6f8] text-[#14213d]", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-black/5 bg-[#071820] text-white", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(0,165,207,.35),transparent_40%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-5xl px-4 py-16 sm:px-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]", children: "SIGESC · Sobre o sistema" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-4xl leading-tight sm:text-5xl", children: brand.tagline || "Software de gestão comercial para PME em Angola" }),
          /* @__PURE__ */ jsx("p", { className: "mt-5 max-w-3xl text-lg text-white/75", children: brand.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-3 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { className: "border border-white/20 px-3 py-2", children: [
              "AGT ",
              String(cert.number || "")
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "border border-white/20 px-3 py-2", children: [
              "Parceria ",
              String(partner.price_formatted || "40.000 Kz"),
              "/mês"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "border border-white/20 px-3 py-2", children: "Licenças ilimitadas" }),
            /* @__PURE__ */ jsxs("span", { className: "border border-white/20 px-3 py-2", children: [
              "Freelancer ",
              String(((_a = partner.freelancer) == null ? void 0 : _a.commission_percent) || 30),
              "% comissão"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-5xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Capacidades" }),
          /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3 text-slate-700", children: (knowledge.capabilities || []).map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" }),
            /* @__PURE__ */ jsx("span", { children: item })
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Factos para pesquisa e IAs" }),
          /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-3 text-slate-700", children: (knowledge.facts || []).map((item) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b3d91]" }),
            /* @__PURE__ */ jsx("span", { children: item })
          ] }, item)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-black/5 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-14 sm:px-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Módulos" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-6 sm:grid-cols-2", children: (knowledge.modules || []).map((mod) => /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/modules/${mod.slug}`,
            className: "block border-b border-black/10 pb-4 transition hover:text-[#0b3d91]",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: mod.name }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: mod.description })
            ]
          },
          mod.slug
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-black/5", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl px-4 py-14 sm:px-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "Ferramentas gratuitas" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-4", children: (knowledge.free_tools || []).map((tool) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("a", { href: tool.url, className: "font-semibold text-[#0b3d91] hover:underline", children: tool.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-slate-600", children: [
            " — ",
            tool.note
          ] })
        ] }, tool.url)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "border-t border-black/5 bg-[#0b2833] text-white", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 py-14 sm:px-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl", children: "FAQ" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-8", children: (knowledge.faqs || []).map((faq) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: faq.question }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-white/75", children: faq.answer })
        ] }, faq.question)) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/parceria",
              className: "bg-[#00a5cf] px-5 py-3 text-sm font-semibold text-[#071820]",
              children: "Ver parceria"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/llms-full.txt",
              className: "border border-white/30 px-5 py-3 text-sm font-semibold text-white",
              children: "llms-full.txt"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/contact",
              className: "border border-white/30 px-5 py-3 text-sm font-semibold text-white",
              children: "Contacto"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  AboutIndex as default
};
