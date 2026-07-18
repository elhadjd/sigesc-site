import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
function AiContentArticles({
  articles,
  filters,
  statuses
}) {
  const [search, setSearch] = useState(filters.search);
  const [status, setStatus] = useState(filters.status);
  const apply = () => {
    router.get("/admin/ai-content/articles", { search, status }, { preserveState: true });
  };
  return /* @__PURE__ */ jsxs(AiContentLayout, { title: "Artigos", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Pesquisar título ou keyword",
          className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        }
      ),
      /* @__PURE__ */ jsx(
        "select",
        {
          value: status,
          onChange: (e) => setStatus(e.target.value),
          className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white",
          children: statuses.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: apply,
          className: "rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black",
          children: "Filtrar"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-white/10", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white/5 text-slate-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Título" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Estado" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "SEO" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Confiança" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: articles.data.map((article) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-white/5", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-white", children: article.title }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: article.status }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: article.seo_score ?? "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-slate-400", children: article.fact_confidence ?? "—" }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx(
          Link,
          {
            href: `/admin/ai-content/articles/${article.id}`,
            className: "text-amber-300 hover:underline",
            children: "Abrir"
          }
        ) })
      ] }, article.id)) })
    ] }) })
  ] });
}
export {
  AiContentArticles as default
};
