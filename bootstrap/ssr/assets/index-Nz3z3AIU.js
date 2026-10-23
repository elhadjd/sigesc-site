import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import CareersAdminLayout from "./Layout-DOk3ylai.js";
const statusTone = {
  open: "bg-teal-500/15 text-teal-200",
  paused: "bg-amber-500/15 text-amber-200",
  closed: "bg-slate-500/20 text-slate-300"
};
function AdminCareersIndex({
  jobs,
  recentApplications,
  filters,
  meta,
  flash
}) {
  const [search, setSearch] = useState(filters.search || "");
  const [status, setStatus] = useState(filters.status || "all");
  const applyFilters = () => {
    router.get("/admin/carreiras", { search, status }, { preserveState: true });
  };
  const act = (path, method = "post") => {
    if (method === "delete" && !window.confirm("Eliminar esta vaga e as candidaturas associadas?")) {
      return;
    }
    router[method](path);
  };
  return /* @__PURE__ */ jsxs(CareersAdminLayout, { title: "Vagas de emprego", children: [
    (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsx("p", { className: "mb-4 rounded-lg bg-teal-500/15 px-3 py-2 text-sm text-teal-100", children: flash.success }),
    (flash == null ? void 0 : flash.error) && /* @__PURE__ */ jsx("p", { className: "mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200", children: flash.error }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Pesquisar título, departamento…",
          className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: status,
          onChange: (e) => setStatus(e.target.value),
          className: "rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white",
          children: [
            /* @__PURE__ */ jsx("option", { value: "all", children: "Todos os estados" }),
            meta.statuses.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s === "open" ? "Aberta" : s === "paused" ? "Pausada" : "Fechada" }, s))
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: applyFilters,
          className: "rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-black",
          children: "Filtrar"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/carreiras/nova",
          className: "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black",
          children: "Criar vaga"
        }
      )
    ] }),
    meta.notify_email && /* @__PURE__ */ jsxs("p", { className: "mb-6 text-xs text-slate-400", children: [
      "Candidaturas notificadas para o e-mail do produtor: ",
      meta.notify_email
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-white/10", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-white/5 text-slate-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Vaga" }),
        /* @__PURE__ */ jsx("th", { className: "hidden px-4 py-3 font-medium sm:table-cell", children: "Estado" }),
        /* @__PURE__ */ jsx("th", { className: "hidden px-4 py-3 font-medium md:table-cell", children: "Candidaturas" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-white/10", children: [
        jobs.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-4 py-10 text-center text-slate-400", children: "Ainda não há vagas. Crie a primeira." }) }),
        jobs.map((job) => /* @__PURE__ */ jsxs("tr", { className: "align-top hover:bg-white/[0.03]", children: [
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-4", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `/carreiras/${job.slug}`,
                className: "font-medium text-white hover:text-teal-200",
                children: job.title
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-400", children: [job.department, job.location, job.employment_type_label].filter(Boolean).join(" · ") }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium sm:hidden ${statusTone[job.status] || statusTone.closed}`,
                children: job.status_label
              }
            )
          ] }),
          /* @__PURE__ */ jsx("td", { className: "hidden px-4 py-4 sm:table-cell", children: /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[job.status] || statusTone.closed}`,
              children: job.status_label
            }
          ) }),
          /* @__PURE__ */ jsx("td", { className: "hidden px-4 py-4 md:table-cell", children: job.applications_count }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `/admin/carreiras/${job.id}/editar`,
                className: "rounded-md bg-white/10 px-2.5 py-1.5 text-xs hover:bg-white/15",
                children: "Editar"
              }
            ),
            job.status !== "paused" && job.status !== "closed" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => act(`/admin/carreiras/${job.id}/pausar`),
                className: "rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs text-amber-100 hover:bg-amber-500/30",
                children: "Pausar"
              }
            ),
            job.status !== "closed" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => act(`/admin/carreiras/${job.id}/fechar`),
                className: "rounded-md bg-slate-500/25 px-2.5 py-1.5 text-xs hover:bg-slate-500/35",
                children: "Fechar"
              }
            ),
            job.status !== "open" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => act(`/admin/carreiras/${job.id}/reabrir`),
                className: "rounded-md bg-teal-500/20 px-2.5 py-1.5 text-xs text-teal-100 hover:bg-teal-500/30",
                children: "Reabrir"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => act(`/admin/carreiras/${job.id}`, "delete"),
                className: "rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs text-red-200 hover:bg-red-500/30",
                children: "Eliminar"
              }
            )
          ] }) })
        ] }, job.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 font-serif text-xl text-white", children: "Candidaturas recentes" }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-white/10", children: /* @__PURE__ */ jsxs("ul", { className: "divide-y divide-white/10", children: [
        recentApplications.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-4 py-8 text-center text-sm text-slate-400", children: "Ainda sem candidaturas." }),
        recentApplications.map((app) => /* @__PURE__ */ jsxs("li", { className: "flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-white", children: app.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-400", children: [
              /* @__PURE__ */ jsx("a", { href: `mailto:${app.email}`, className: "hover:text-teal-200", children: app.email }),
              app.phone ? ` · ${app.phone}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-400", children: app.job ? /* @__PURE__ */ jsx(Link, { href: `/carreiras/${app.job.slug}`, className: "hover:text-teal-200", children: app.job.title }) : "—" })
        ] }, app.id))
      ] }) })
    ] })
  ] });
}
export {
  AdminCareersIndex as default
};
