import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { A as Api } from "./index-DJUNAe3r.js";
import AiContentLayout from "./Layout-Bj0mdkdN.js";
import "axios";
function AiContentShow({ article }) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [busy, setBusy] = useState(null);
  const [flash, setFlash] = useState(null);
  const runAction = async (key, request) => {
    var _a, _b;
    if (busy) {
      return;
    }
    setBusy(key);
    setFlash(null);
    try {
      const { data } = await request();
      setFlash({ type: "ok", text: data.message || "Operação concluída." });
    } catch (error) {
      setFlash({
        type: "error",
        text: ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "Falha na operação."
      });
    } finally {
      setBusy(null);
    }
  };
  return /* @__PURE__ */ jsxs(AiContentLayout, { title: article.title, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: !!busy,
          onClick: () => runAction("process", () => Api.post(`/admin/ai-content/articles/${article.id}/process`)),
          className: "rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50",
          children: busy === "process" ? "A enviar…" : "Reprocessar pipeline"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: !!busy,
          onClick: () => runAction("approve", () => Api.post(`/admin/ai-content/articles/${article.id}/approve`)),
          className: "rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50",
          children: busy === "approve" ? "A publicar…" : "Aprovar e publicar"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "datetime-local",
          value: scheduledAt,
          onChange: (e) => setScheduledAt(e.target.value),
          className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          disabled: !scheduledAt || !!busy,
          onClick: () => runAction(
            "schedule",
            () => Api.post(`/admin/ai-content/articles/${article.id}/schedule`, {
              scheduled_at: scheduledAt
            })
          ),
          className: "rounded-lg bg-sky-500/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40",
          children: busy === "schedule" ? "A agendar…" : "Agendar"
        }
      ),
      article.post_id && /* @__PURE__ */ jsx(
        Link,
        {
          href: `/blog/posts/${article.slug}`,
          className: "rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200",
          children: "Ver no blog"
        }
      )
    ] }),
    flash && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-4 rounded-xl px-4 py-3 text-sm ${flash.type === "ok" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`,
        children: flash.text
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("section", { className: "lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400", children: article.excerpt }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "prose prose-invert mt-6 max-w-none",
            dangerouslySetInnerHTML: { __html: article.content_html || "" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(MetaCard, { title: "Estado", value: article.status }),
        /* @__PURE__ */ jsx(MetaCard, { title: "SEO score", value: article.seo_score ?? "—" }),
        /* @__PURE__ */ jsx(MetaCard, { title: "Fact confidence", value: article.fact_confidence ?? "—" }),
        /* @__PURE__ */ jsx(MetaCard, { title: "Focus keyword", value: article.focus_keyword || "—" }),
        /* @__PURE__ */ jsx(MetaCard, { title: "Needs review", value: article.needs_human_review ? "Sim" : "Não" }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm text-slate-400", children: "Fontes" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-sm", children: (article.sources || []).map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: s.url, target: "_blank", rel: "noreferrer", className: "text-amber-200", children: s.title || s.url }) }, s.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm text-slate-400", children: "Social" }),
          /* @__PURE__ */ jsx("pre", { className: "overflow-auto text-xs text-slate-300", children: JSON.stringify(article.social_posts || {}, null, 2) })
        ] })
      ] })
    ] })
  ] });
}
function MetaCard({ title, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/[0.03] p-4", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-wider text-slate-500", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-white", children: value })
  ] });
}
export {
  AiContentShow as default
};
