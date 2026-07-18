import { jsx, jsxs } from "react/jsx-runtime";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
import "@inertiajs/react";
function AiContentLogs({ logs }) {
  return /* @__PURE__ */ jsx(AiContentLayout, { title: "Logs", children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: logs.data.map((log) => /* @__PURE__ */ jsxs("li", { className: "rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-white", children: log.message }),
      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase text-slate-500", children: log.level })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
      log.agent || "system",
      log.article ? ` · ${log.article.title}` : "",
      " · ",
      new Date(log.created_at).toLocaleString("pt-AO")
    ] })
  ] }, log.id)) }) });
}
export {
  AiContentLogs as default
};
