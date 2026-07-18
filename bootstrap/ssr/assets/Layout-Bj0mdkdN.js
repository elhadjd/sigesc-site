import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
const nav = [
  { href: "/admin/ai-content", label: "Dashboard", routeName: "admin.ai-content.dashboard" },
  { href: "/admin/ai-content/articles", label: "Artigos", routeName: "admin.ai-content.articles" },
  { href: "/admin/ai-content/jobs", label: "Processamentos", routeName: "admin.ai-content.jobs" },
  { href: "/admin/ai-content/logs", label: "Logs", routeName: "admin.ai-content.logs" },
  { href: "/admin/ai-content/research-settings", label: "Research Engine", routeName: "admin.ai-content.research-settings" },
  { href: "/admin/ai-content/expert", label: "Especialista", routeName: "admin.ai-content.expert" }
];
function AiContentLayout({ title, children }) {
  const url = usePage().url;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0f1419] text-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8", children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden w-56 shrink-0 md:block", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90", children: "SIGESC" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 font-serif text-2xl text-white", children: "AI Content Engine" }),
      /* @__PURE__ */ jsx("nav", { className: "mt-8 space-y-1", children: nav.map((item) => {
        const active = url === item.href || url.startsWith(item.href + "/");
        return /* @__PURE__ */ jsx(
          Link,
          {
            href: item.href,
            className: `block rounded-lg px-3 py-2 text-sm transition ${active ? "bg-amber-500/15 text-amber-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`,
            children: item.label
          },
          item.href
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsx("header", { className: "mb-8 border-b border-white/10 pb-4", children: /* @__PURE__ */ jsx("h2", { className: "font-serif text-3xl text-white", children: title }) }),
      children
    ] })
  ] }) });
}
export {
  AiContentLayout as default
};
