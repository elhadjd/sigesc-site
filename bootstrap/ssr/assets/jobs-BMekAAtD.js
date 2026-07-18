import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
import "@inertiajs/react";
const statusLabel = {
  pending: "Em espera",
  running: "A processar",
  failed: "Falhou",
  completed: "Concluído"
};
function AiContentJobs({
  jobs,
  queueStats,
  queueDriver,
  laravelQueue,
  workerHint
}) {
  return /* @__PURE__ */ jsxs(AiContentLayout, { title: "Processamentos", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-50", children: [
      /* @__PURE__ */ jsx("p", { children: "Aqui vê o estado dos processamentos da IA (artigos, pipeline diário e perguntas ao especialista)." }),
      laravelQueue ? /* @__PURE__ */ jsxs("p", { children: [
        "Em segundo plano agora: ",
        /* @__PURE__ */ jsx("strong", { children: laravelQueue.pending }),
        laravelQueue.failed > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          "falhas técnicas: ",
          /* @__PURE__ */ jsx("strong", { children: laravelQueue.failed })
        ] }) : null,
        laravelQueue.pending === 0 ? /* @__PURE__ */ jsx("span", { className: "text-sky-100/80", children: " — nada à espera; o trabalhador já consumiu a lista." }) : /* @__PURE__ */ jsx("span", { className: "text-sky-100/80", children: " — a serem tratados pelo trabalhador em segundo plano." })
      ] }) : null,
      workerHint ? /* @__PURE__ */ jsxs("p", { className: "text-xs text-sky-100/85", children: [
        "Para o segundo plano funcionar com driver ",
        /* @__PURE__ */ jsx("strong", { children: queueDriver }),
        ", mantenha num terminal:",
        " ",
        /* @__PURE__ */ jsx("code", { className: "rounded bg-black/30 px-1.5 py-0.5 font-mono", children: workerHint })
      ] }) : /* @__PURE__ */ jsxs("p", { className: "text-xs text-sky-100/80", children: [
        "Modo atual (",
        queueDriver || "n/d",
        "): o processamento corre no próprio pedido HTTP."
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 grid gap-4 sm:grid-cols-4", children: Object.entries(queueStats).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs uppercase text-slate-500", children: statusLabel[key] || key }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 font-serif text-2xl text-white", children: value })
    ] }, key)) }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-white/10", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white/5 text-slate-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Tipo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Artigo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Etapa" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Estado" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Progresso" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Detalhe" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: jobs.data.map((job) => {
        var _a;
        return /* @__PURE__ */ jsxs("tr", { className: "border-t border-white/5 align-top", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: job.uuid.slice(0, 8) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-white", children: job.type }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-300", children: ((_a = job.article) == null ? void 0 : _a.title) ? /* @__PURE__ */ jsx("span", { className: "line-clamp-2 max-w-[220px]", children: job.article.title }) : "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: job.current_agent || "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: statusLabel[job.status] || job.status }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-slate-400", children: [
            job.progress,
            "%"
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-rose-300/90", children: job.error ? /* @__PURE__ */ jsx("span", { className: "line-clamp-3 max-w-[280px] text-xs", title: job.error, children: job.error }) : "—" })
        ] }, job.id);
      }) })
    ] }) })
  ] });
}
export {
  AiContentJobs as default
};
