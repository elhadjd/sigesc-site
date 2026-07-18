import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { A as Api } from "./index-DJUNAe3r.js";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
import "axios";
function AiContentDashboard({
  stats,
  recentArticles,
  recentJobs,
  recentLogs,
  categories,
  config
}) {
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);
  const cards = [
    { label: "Artigos", value: stats.total },
    { label: "Publicados", value: stats.published },
    { label: "Em revisão", value: stats.needs_review },
    { label: "Agendados", value: stats.scheduled },
    { label: "SEO médio", value: stats.avg_seo },
    { label: "Filas ativas", value: stats.jobs_running },
    { label: "Falhas", value: stats.failed + stats.jobs_failed },
    { label: "Visitas", value: stats.views }
  ];
  const runDaily = async () => {
    var _a, _b;
    if (busy || !config.llm_ready) {
      return;
    }
    setBusy(true);
    setFlash(null);
    try {
      const { data } = await Api.post("/admin/ai-content/run-daily", null, { timeout: 0 });
      setFlash({ type: "ok", text: data.message || "Pipeline enviado." });
    } catch (error) {
      setFlash({
        type: "error",
        text: ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "Falha ao iniciar o pipeline diário."
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs(AiContentLayout, { title: "Painel operacional", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: runDaily,
          disabled: !config.llm_ready || busy,
          className: "rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50",
          children: busy ? "A enviar…" : "Correr pipeline diário"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-400", children: [
        "Engine ",
        config.enabled ? "ativa" : "desligada",
        " · ",
        config.topics_per_day,
        " temas/dia · auto-publish ",
        config.auto_publish ? "on" : "off",
        " · LLM",
        " ",
        config.llm_provider ?? "não configurado"
      ] })
    ] }),
    flash && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-4 rounded-xl px-4 py-3 text-sm ${flash.type === "ok" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`,
        children: flash.text
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap gap-2 text-xs", children: [
      /* @__PURE__ */ jsxs("span", { className: `rounded-full px-3 py-1 ${config.deepseek_ready ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-200"}`, children: [
        "DeepSeek ",
        config.deepseek_ready ? "ok" : "falta DEEPSEEK_API_KEY"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: `rounded-full px-3 py-1 ${config.tavily_ready ? "bg-slate-500/20 text-slate-300" : "bg-slate-700/40 text-slate-500"}`, children: [
        "Tavily ",
        config.tavily_ready ? "opcional ok" : "opcional"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: `rounded-full px-3 py-1 ${config.openai_ready ? "bg-slate-500/20 text-slate-300" : "bg-slate-700/40 text-slate-500"}`, children: [
        "OpenAI ",
        config.openai_ready ? "opcional ativa" : "opcional"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-sky-500/15 px-3 py-1 text-sky-200", children: [
        "Ask Expert: ",
        config.ask_expert_llm ?? "deepseek",
        config.ask_expert_uses_tavily ? " + Tavily" : " (sem Tavily)"
      ] }),
      !config.llm_ready && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-500/20 px-3 py-1 text-amber-200", children: "Defina DEEPSEEK_API_KEY (ou TAVILY/OPENAI) no .env" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: cards.map((card) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-slate-400", children: card.label }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 font-serif text-3xl text-white", children: card.value })
    ] }, card.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg text-white", children: "Artigos recentes" }),
          /* @__PURE__ */ jsx(Link, { href: "/admin/ai-content/articles", className: "text-sm text-amber-300", children: "Ver todos" })
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: recentArticles.map((article) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/admin/ai-content/articles/${article.id}`,
            className: "block rounded-lg px-2 py-2 hover:bg-white/5",
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-white", children: article.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-400", children: [
                article.status,
                article.category ? ` · ${article.category.name}` : "",
                article.seo_score != null ? ` · SEO ${article.seo_score}` : ""
              ] })
            ]
          }
        ) }, article.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg text-white", children: "Categorias" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: categories.map((cat) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: cat.name }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: cat.articles_count })
        ] }, cat.name)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg text-white", children: "Jobs IA" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: recentJobs.map((job) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between gap-3 border-b border-white/5 py-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: job.type }),
          /* @__PURE__ */ jsxs("span", { className: "text-slate-500", children: [
            job.status,
            " · ",
            job.progress,
            "%"
          ] })
        ] }, job.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg text-white", children: "Logs" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: recentLogs.map((log) => /* @__PURE__ */ jsxs("li", { className: "border-b border-white/5 py-2", children: [
          /* @__PURE__ */ jsx("p", { className: "text-slate-300", children: log.message }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
            log.agent || "system",
            " · ",
            log.level
          ] })
        ] }, log.id)) })
      ] })
    ] })
  ] });
}
export {
  AiContentDashboard as default
};
