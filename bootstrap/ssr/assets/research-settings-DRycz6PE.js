import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
function ResearchSettingsPage({
  settings,
  sources,
  recentLogs
}) {
  const form = useForm({
    tavily_enabled: !!settings.tavily_enabled,
    news_enabled: !!settings.news_enabled,
    internal_knowledge_enabled: !!settings.internal_knowledge_enabled,
    max_sources: Number(settings.max_sources ?? 12),
    min_trust_score: Number(settings.min_trust_score ?? 50),
    cache_days: Number(settings.cache_days ?? 30)
  });
  const [filter, setFilter] = useState("");
  const filteredSources = sources.filter((s) => {
    if (!filter.trim())
      return true;
    const q = filter.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.domain || "").toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxs(AiContentLayout, { title: "Research Engine Settings", children: [
    /* @__PURE__ */ jsx("p", { className: "mb-6 max-w-2xl text-sm text-slate-400", children: "Configura o Hybrid Research Engine. A pesquisa web usa Tavily AI; fontes oficiais angolanas mantêm prioridade máxima no ranking de confiança." }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          form.put("/admin/ai-content/research-settings");
        },
        className: "mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6",
        children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg text-white", children: "Parâmetros do motor" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm text-slate-200", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.data.tavily_enabled,
                  onChange: (e) => form.setData("tavily_enabled", e.target.checked),
                  className: "h-4 w-4 rounded border-white/20 bg-transparent"
                }
              ),
              "Ativar Tavily AI (pesquisa web principal)"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm text-slate-200", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.data.news_enabled,
                  onChange: (e) => form.setData("news_enabled", e.target.checked),
                  className: "h-4 w-4 rounded border-white/20 bg-transparent"
                }
              ),
              "Ativar pesquisa de notícias"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 text-sm text-slate-200 sm:col-span-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.data.internal_knowledge_enabled,
                  onChange: (e) => form.setData("internal_knowledge_enabled", e.target.checked),
                  className: "h-4 w-4 rounded border-white/20 bg-transparent"
                }
              ),
              "Usar base de conhecimento interna (blog + artigos)"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block text-sm text-slate-300", children: [
              "Máximo de fontes",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 1,
                  max: 40,
                  value: form.data.max_sources,
                  onChange: (e) => form.setData("max_sources", Number(e.target.value)),
                  className: "mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block text-sm text-slate-300", children: [
              "Score mínimo permitido",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 0,
                  max: 100,
                  value: form.data.min_trust_score,
                  onChange: (e) => form.setData("min_trust_score", Number(e.target.value)),
                  className: "mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block text-sm text-slate-300 sm:col-span-2", children: [
              "Tempo de cache (dias)",
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: 1,
                  max: 365,
                  value: form.data.cache_days,
                  onChange: (e) => form.setData("cache_days", Number(e.target.value)),
                  className: "mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-slate-500", children: "RESEARCH_CACHE_DAYS — evita repetir pesquisas recentes (ex.: IVA Angola 2026)." })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "mt-6 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-60",
              children: "Guardar definições"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxs("section", { className: "mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-white", children: "Fontes oficiais ativas" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "search",
            placeholder: "Filtrar fontes…",
            value: filter,
            onChange: (e) => setFilter(e.target.value),
            className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-xs uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "Fonte" }),
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "Categoria" }),
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "Prioridade" }),
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "Trust" }),
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "País" }),
          /* @__PURE__ */ jsx("th", { className: "px-2 py-2", children: "Ativa" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: filteredSources.map((source) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-white/5", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-2 py-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white", children: source.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: source.domain || source.url })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-slate-300", children: source.category || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-slate-300", children: source.priority ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-amber-200", children: source.trust_score ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3 text-slate-300", children: source.country || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-2 py-3", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => router.put(
                `/admin/ai-content/research-sources/${source.id}`,
                { is_active: !source.is_active },
                { preserveScroll: true }
              ),
              className: `rounded px-2 py-1 text-xs font-medium ${source.is_active ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-400"}`,
              children: source.is_active ? "Ativa" : "Off"
            }
          ) })
        ] }, source.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg text-white", children: "Research logs recentes" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: recentLogs.length === 0 ? /* @__PURE__ */ jsx("li", { className: "text-slate-500", children: "Sem logs ainda." }) : recentLogs.map((log) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: "flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 py-2",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "text-slate-300", children: [
              log.agent,
              " · ",
              log.action,
              log.provider ? ` · ${log.provider}` : ""
            ] }),
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: log.status === "ok" ? "text-emerald-300" : "text-rose-300",
                children: [
                  log.status,
                  " · ",
                  log.execution_time_ms,
                  "ms"
                ]
              }
            )
          ]
        },
        log.id
      )) })
    ] })
  ] });
}
export {
  ResearchSettingsPage as default
};
