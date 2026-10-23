import { jsx, jsxs } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import CareersAdminLayout from "./Layout-DOk3ylai.js";
const empty = {
  title: "",
  department: "",
  location: "Luanda, Angola",
  employment_type: "full_time",
  work_mode: "onsite",
  status: "open",
  summary: "",
  description: "",
  requirements: "",
  benefits: "",
  salary_range: ""
};
function AdminCareersForm({
  job,
  meta
}) {
  const editing = Boolean(job == null ? void 0 : job.id);
  const form = useForm({
    ...empty,
    ...job || {},
    department: (job == null ? void 0 : job.department) || "",
    summary: (job == null ? void 0 : job.summary) || "",
    requirements: (job == null ? void 0 : job.requirements) || "",
    benefits: (job == null ? void 0 : job.benefits) || "",
    salary_range: (job == null ? void 0 : job.salary_range) || ""
  });
  const submit = (e) => {
    e.preventDefault();
    if (editing && (job == null ? void 0 : job.id)) {
      form.put(`/admin/carreiras/${job.id}`);
    } else {
      form.post("/admin/carreiras");
    }
  };
  const field = "mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none ring-teal-400/30 focus:ring-2";
  return /* @__PURE__ */ jsx(CareersAdminLayout, { title: editing ? "Editar vaga" : "Nova vaga", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "max-w-3xl space-y-5", children: [
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Título" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: field,
          value: form.data.title,
          onChange: (e) => form.setData("title", e.target.value),
          required: true
        }
      ),
      form.errors.title && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-red-300", children: form.errors.title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Departamento" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: field,
            value: form.data.department || "",
            onChange: (e) => form.setData("department", e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Localização" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: field,
            value: form.data.location,
            onChange: (e) => form.setData("location", e.target.value),
            required: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Tipo" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: field,
            value: form.data.employment_type,
            onChange: (e) => form.setData("employment_type", e.target.value),
            children: Object.entries(meta.employment_types).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Modalidade" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: field,
            value: form.data.work_mode,
            onChange: (e) => form.setData("work_mode", e.target.value),
            children: Object.entries(meta.work_modes).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Estado" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            className: field,
            value: form.data.status,
            onChange: (e) => form.setData("status", e.target.value),
            children: meta.statuses.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: meta.status_labels[s] || s }, s))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Faixa salarial (opcional)" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: field,
          value: form.data.salary_range || "",
          onChange: (e) => form.setData("salary_range", e.target.value),
          placeholder: "Ex.: a combinar / 250.000–400.000 Kz"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Resumo curto" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: field,
          rows: 2,
          value: form.data.summary || "",
          onChange: (e) => form.setData("summary", e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Descrição" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: field,
          rows: 8,
          value: form.data.description,
          onChange: (e) => form.setData("description", e.target.value),
          required: true,
          minLength: 40
        }
      ),
      form.errors.description && /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-red-300", children: form.errors.description })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Requisitos" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: field,
          rows: 5,
          value: form.data.requirements || "",
          onChange: (e) => form.setData("requirements", e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "block text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-slate-300", children: "Benefícios" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: field,
          rows: 4,
          value: form.data.benefits || "",
          onChange: (e) => form.setData("benefits", e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "rounded-lg bg-teal-400 px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60",
          children: form.processing ? "A guardar…" : editing ? "Guardar alterações" : "Publicar vaga"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: "/admin/carreiras",
          className: "rounded-lg border border-white/15 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/5",
          children: "Cancelar"
        }
      )
    ] })
  ] }) });
}
export {
  AdminCareersForm as default
};
