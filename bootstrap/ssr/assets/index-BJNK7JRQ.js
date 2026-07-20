import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
function InvoiceTemplatesIndex({
  auth,
  seo,
  templates,
  levels,
  categories
}) {
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((item) => {
      if (level !== "all" && item.level !== level)
        return false;
      if (category !== "all" && item.category !== category)
        return false;
      if (!q)
        return true;
      const hay = `${item.title} ${item.description} ${item.features.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [templates, level, category, query]);
  const counts = useMemo(() => {
    return {
      basico: templates.filter((t) => t.level === "basico").length,
      intermedio: templates.filter((t) => t.level === "intermedio").length,
      avancado: templates.filter((t) => t.level === "avancado").length
    };
  }, [templates]);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Modelos de Fatura Gratuitos Angola | Factura, Recibo e Proforma"
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "bg-[#f3f0ea]", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-black/5", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,#c9d7f0,transparent_38%),radial-gradient(circle_at_88%_10%,#e8c9a0,transparent_32%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-4 py-14 sm:px-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]", children: "SIGESC · Biblioteca gratuita" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl", children: "Modelos de fatura gratuitos Angola" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-lg text-slate-600", children: [
            templates.length,
            " modelos de factura, factura-recibo, proforma, recibo e orçamento — do básico ao avançado AGT. Descarregue, edite e imprima em PDF."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap gap-6 text-sm text-slate-700", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl text-[#0b3d91]", children: counts.basico }),
              /* @__PURE__ */ jsx("p", { children: "Básicos" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl text-[#0b3d91]", children: counts.intermedio }),
              /* @__PURE__ */ jsx("p", { children: "Intermédios" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-serif text-3xl text-[#0b3d91]", children: counts.avancado }),
              /* @__PURE__ */ jsx("p", { children: "Avançados" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-4 py-10 sm:px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-3xl bg-white/80 p-4 ring-1 ring-black/5 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Pesquisar: IVA, AGT, recibo, proforma…",
              className: "w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-[#0b3d91] focus:ring-2"
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: level,
              onChange: (e) => setLevel(e.target.value),
              className: "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todos os níveis" }),
                Object.entries(levels).map(([key, meta]) => /* @__PURE__ */ jsx("option", { value: key, children: meta.label }, key))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: category,
              onChange: (e) => setCategory(e.target.value),
              className: "rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "Todas as categorias" }),
                Object.entries(categories).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((item) => /* @__PURE__ */ jsxs(
          "article",
          {
            className: "flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#e8eef8] px-3 py-1 text-xs font-semibold text-[#0b3d91]", children: item.level_label || item.level }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-slate-500", children: item.category_label || item.category })
              ] }),
              /* @__PURE__ */ jsx("h2", { className: "mt-4 font-serif text-xl text-[#14213d]", children: item.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 flex-1 text-sm leading-relaxed text-slate-600", children: item.description }),
              /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-1 text-xs text-slate-500", children: item.features.slice(0, 3).map((feature) => /* @__PURE__ */ jsxs("li", { children: [
                "· ",
                feature
              ] }, feature)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 flex gap-2", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: item.preview_url,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "flex-1 rounded-xl bg-[#0b3d91] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0a347c]",
                    children: "Ver modelo"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: item.download_url,
                    className: "flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0b3d91] ring-1 ring-[#0b3d91]/50 hover:bg-[#e8eef8]",
                    children: "Descarregar"
                  }
                )
              ] })
            ]
          },
          item.slug
        )) }),
        filtered.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-10 text-center text-slate-600", children: "Nenhum modelo encontrado com esses filtros." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-14 max-w-3xl space-y-4 text-slate-700", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-[#14213d]", children: "Como usar os modelos de fatura" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", children: "Abra o modelo, substitua os dados de exemplo (empresa, NIF, cliente, itens) e use Imprimir → Guardar como PDF. Para emitir documentos fiscais oficiais junto da AGT, use o software de faturação SIGESC." }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Relacionado:",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/gerador-de-fatura", className: "font-medium text-[#0b3d91] underline", children: "criar fatura online grátis" }),
            " ",
            "·",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/calculadoras", className: "font-medium text-[#0b3d91] underline", children: "calculadoras de IVA" }),
            " ",
            "·",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/pergunte-ao-especialista", className: "font-medium text-[#0b3d91] underline", children: "pergunte ao especialista" }),
            "."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  InvoiceTemplatesIndex as default
};
