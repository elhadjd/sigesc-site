import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
function AiContentExpert({ questions }) {
  return /* @__PURE__ */ jsx(AiContentLayout, { title: "Pergunte ao Especialista", children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: questions.data.map((q) => /* @__PURE__ */ jsxs("li", { className: "rounded-xl border border-white/10 bg-white/[0.03] p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-white", children: q.question }),
    /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-slate-500", children: [
      q.status,
      " · qualidade ",
      q.quality_score ?? "—",
      q.article ? /* @__PURE__ */ jsxs(Fragment, { children: [
        " · ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/ai-content/articles/${q.article.id}`,
            className: "text-amber-300",
            children: "artigo gerado"
          }
        )
      ] }) : null
    ] })
  ] }, q.id)) }) });
}
export {
  AiContentExpert as default
};
