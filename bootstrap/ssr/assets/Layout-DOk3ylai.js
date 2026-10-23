import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
const nav = [
  { href: "/admin/carreiras", label: "Vagas", exact: true },
  { href: "/admin/carreiras/nova", label: "Nova vaga" },
  { href: "/carreiras", label: "Ver página pública" },
  { href: "/admin/ai-content", label: "AI Content" }
];
function CareersAdminLayout({
  title,
  children
}) {
  const url = usePage().url;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0a1614] text-slate-100", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8", children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden w-56 shrink-0 md:block", children: /* @__PURE__ */ jsxs("div", { className: "sticky top-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90", children: "SIGESC" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 font-serif text-2xl text-white", children: "Carreiras" }),
      /* @__PURE__ */ jsx("nav", { className: "mt-8 space-y-1", children: nav.map((item) => {
        const active = item.exact ? url === item.href || url.startsWith("/admin/carreiras?") : url === item.href || url.startsWith(item.href + "/");
        return /* @__PURE__ */ jsx(
          Link,
          {
            href: item.href,
            className: `block rounded-lg px-3 py-2 text-sm transition ${active ? "bg-teal-500/15 text-teal-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`,
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
  CareersAdminLayout as default
};
