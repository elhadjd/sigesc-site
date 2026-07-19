import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import axios from "axios";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
const tabs = [
  { id: "irt_grupo_a", label: "IRT Salários" },
  { id: "irt_grupo_c", label: "IRT Grupo C" },
  { id: "iva", label: "IVA" },
  { id: "imposto_industrial", label: "Imp. Industrial" },
  { id: "retencao_servicos", label: "Retenção 6,5%" },
  { id: "cambio", label: "Câmbio" }
];
function CalculatorsIndex({
  auth,
  meta,
  seo
}) {
  var _a, _b;
  const [tab, setTab] = useState("irt_grupo_a");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [grossMonthly, setGrossMonthly] = useState("250000");
  const [annualTurnover, setAnnualTurnover] = useState("8000000");
  const [primarySector, setPrimarySector] = useState(false);
  const [ivaAmount, setIvaAmount] = useState("100000");
  const [ivaRate, setIvaRate] = useState("geral");
  const [ivaMode, setIvaMode] = useState("add");
  const [profit, setProfit] = useState("5000000");
  const [iiRate, setIiRate] = useState("geral");
  const [invoice, setInvoice] = useState("1000000");
  const [transfer, setTransfer] = useState("1000000");
  const [personType, setPersonType] = useState("pessoa_colectiva");
  const ivaOptions = useMemo(() => Object.entries(meta.iva_rates || {}), [meta]);
  const iiOptions = useMemo(() => Object.entries(meta.imposto_industrial_rates || {}), [meta]);
  const submit = async (e) => {
    var _a2, _b2;
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const payload = { type: tab };
    if (tab === "irt_grupo_a")
      payload.gross_monthly = Number(grossMonthly);
    if (tab === "irt_grupo_c") {
      payload.annual_turnover = Number(annualTurnover);
      payload.primary_sector = primarySector;
    }
    if (tab === "iva") {
      payload.amount = Number(ivaAmount);
      payload.rate_key = ivaRate;
      payload.mode = ivaMode;
    }
    if (tab === "imposto_industrial") {
      payload.taxable_profit = Number(profit);
      payload.rate_key = iiRate;
    }
    if (tab === "retencao_servicos")
      payload.invoice_amount = Number(invoice);
    if (tab === "cambio") {
      payload.transfer_amount = Number(transfer);
      payload.person_type = personType;
    }
    try {
      const { data } = await axios.post(route("calculators.calculate"), payload);
      setResult(data);
    } catch (err) {
      setError(((_b2 = (_a2 = err == null ? void 0 : err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || "Não foi possível calcular. Verifique os valores.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(SeoHead, { seo, fallbackTitle: "Calculadoras Fiscais Angola | SIGESC" }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "bg-[#f3f0ea]", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-black/5", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,#c9d7f0,transparent_35%),radial-gradient(circle_at_90%_20%,#e8c9a0,transparent_30%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-5xl px-4 py-14 sm:px-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]", children: "SIGESC · Calculadoras fiscais AGT" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl text-[#14213d] sm:text-5xl", children: "Calculadora IVA e IRT Angola 2026 — impostos AGT gratuitos" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-4 max-w-2xl text-lg text-slate-600", children: [
            "Simule IVA, IRT 2026 (Lei n.º 14/25), Imposto Industrial, retenção na fonte 6,5% e contribuição cambial. Cálculos no servidor com a legislação configurada (vigência",
            " ",
            meta.effective_from,
            ")."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-5xl px-4 py-10 sm:px-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((item) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setTab(item.id);
              setResult(null);
              setError("");
            },
            className: `rounded-full px-4 py-2 text-sm font-medium transition ${tab === item.id ? "bg-[#0b3d91] text-white" : "bg-white text-slate-700 ring-1 ring-black/10 hover:bg-slate-50"}`,
            children: item.label
          },
          item.id
        )) }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: submit,
            className: "mt-8 grid gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:grid-cols-[1.1fr_0.9fr]",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                tab === "irt_grupo_a" && /* @__PURE__ */ jsx(Field, { label: "Rendimento bruto mensal (Kz)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: 0,
                    step: "0.01",
                    required: true,
                    value: grossMonthly,
                    onChange: (e) => setGrossMonthly(e.target.value),
                    className: "field"
                  }
                ) }),
                tab === "irt_grupo_c" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Volume de negócios anual (Kz)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: "0.01",
                      required: true,
                      value: annualTurnover,
                      onChange: (e) => setAnnualTurnover(e.target.value),
                      className: "field"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-700", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: primarySector,
                        onChange: (e) => setPrimarySector(e.target.checked)
                      }
                    ),
                    "Sector primário (agricultura, pecuária, pescas, silvicultura)"
                  ] })
                ] }),
                tab === "iva" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Valor (Kz)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: "0.01",
                      required: true,
                      value: ivaAmount,
                      onChange: (e) => setIvaAmount(e.target.value),
                      className: "field"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Taxa IVA", children: /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: ivaRate,
                      onChange: (e) => setIvaRate(e.target.value),
                      className: "field",
                      children: ivaOptions.map(([key, value]) => /* @__PURE__ */ jsx("option", { value: key, children: value.label }, key))
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Modo", children: /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: ivaMode,
                      onChange: (e) => setIvaMode(e.target.value),
                      className: "field",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "add", children: "Acrescentar IVA ao valor líquido" }),
                        /* @__PURE__ */ jsx("option", { value: "extract", children: "Extrair IVA de valor com imposto" })
                      ]
                    }
                  ) })
                ] }),
                tab === "imposto_industrial" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Lucro tributável (Kz)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      step: "0.01",
                      required: true,
                      value: profit,
                      onChange: (e) => setProfit(e.target.value),
                      className: "field"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Taxa", children: /* @__PURE__ */ jsx(
                    "select",
                    {
                      value: iiRate,
                      onChange: (e) => setIiRate(e.target.value),
                      className: "field",
                      children: iiOptions.map(([key, value]) => /* @__PURE__ */ jsx("option", { value: key, children: value.label }, key))
                    }
                  ) })
                ] }),
                tab === "retencao_servicos" && /* @__PURE__ */ jsx(Field, { label: "Valor da factura de serviços (Kz)", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    min: 0,
                    step: "0.01",
                    required: true,
                    value: invoice,
                    onChange: (e) => setInvoice(e.target.value),
                    className: "field"
                  }
                ) }),
                tab === "cambio" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Montante da transferência (Kz)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      step: "0.01",
                      required: true,
                      value: transfer,
                      onChange: (e) => setTransfer(e.target.value),
                      className: "field"
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Tipo de pessoa", children: /* @__PURE__ */ jsxs(
                    "select",
                    {
                      value: personType,
                      onChange: (e) => setPersonType(e.target.value),
                      className: "field",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "pessoa_singular", children: "Pessoa singular (2,5%)" }),
                        /* @__PURE__ */ jsx("option", { value: "pessoa_colectiva", children: "Pessoa colectiva (10%)" })
                      ]
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: loading,
                    className: "rounded-xl bg-[#0b3d91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#092f70] disabled:opacity-60",
                    children: loading ? "A calcular no servidor…" : "Calcular"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("aside", { className: "rounded-2xl bg-[#f7f4ef] p-5", children: [
                /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-[#14213d]", children: "Resultado" }),
                error && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-red-700", children: error }),
                !error && !result && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-slate-600", children: "Introduza os valores e calcule. O motor usa a tabela/lei configurada no servidor." }),
                result && /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3 text-sm text-slate-800", children: [
                  result.blocked && /* @__PURE__ */ jsx("p", { className: "text-amber-800", children: result.message }),
                  result.result && Object.entries(result.result).map(([key, value]) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3 border-b border-black/5 py-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500", children: key }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: String(value) })
                  ] }, key)),
                  result.bracket && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
                    "Escalão: ",
                    result.bracket.label,
                    " · taxa",
                    " ",
                    (result.bracket.rate * 100).toFixed(1),
                    "%"
                  ] }),
                  result.formula && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
                    "Fórmula: ",
                    result.formula
                  ] }),
                  ((_a = result.legal) == null ? void 0 : _a.name) && /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500", children: [
                    "Base legal: ",
                    result.legal.name,
                    result.legal.simulator && /* @__PURE__ */ jsxs(Fragment, { children: [
                      " · ",
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: result.legal.simulator,
                          target: "_blank",
                          rel: "noreferrer",
                          className: "text-[#0b3d91] underline",
                          children: "Simulador AGT"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 rounded-3xl bg-white p-6 ring-1 ring-black/5", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-[#14213d]", children: "Tabela IRT 2026 (Grupo A)" }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "text-slate-500", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "py-2 pr-4", children: "Escalão" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 pr-4", children: "De" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 pr-4", children: "Até" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 pr-4", children: "Taxa" }),
              /* @__PURE__ */ jsx("th", { className: "py-2", children: "Parcela fixa" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: (_b = meta.irt_brackets) == null ? void 0 : _b.map((b) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-black/5", children: [
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4", children: b.label }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4", children: b.min.toLocaleString("pt-AO") }),
              /* @__PURE__ */ jsx("td", { className: "py-2 pr-4", children: b.max == null ? "∞" : b.max.toLocaleString("pt-AO") }),
              /* @__PURE__ */ jsxs("td", { className: "py-2 pr-4", children: [
                (b.rate * 100).toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "py-2", children: [
                b.fixed.toLocaleString("pt-AO"),
                " Kz"
              ] })
            ] }, b.label)) })
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-slate-600", children: meta.disclaimer })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-4 text-slate-700", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl text-[#14213d]", children: "Perguntas frequentes — calculadora de impostos Angola" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#14213d]", children: "Como calcular o IVA numa factura em Angola?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed", children: "Use o separador IVA: indique o valor, a taxa e o modo acrescentar ou extrair. Serve para estimar o imposto sobre o valor acrescentado antes de faturar na AGT." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-[#14213d]", children: "Como calcular o IRT sobre salários em 2026?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed", children: "No separador IRT Salários, introduza o rendimento bruto mensal. A tabela da Lei n.º 14/25 (OGE 2026) aplica isenção até 150.000 Kz e escalões progressivos." })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
            "Tem dúvidas sobre a lei?",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/pergunte-ao-especialista", className: "font-medium text-[#0b3d91] underline", children: "Pergunte ao Especialista" }),
            "."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {}),
    /* @__PURE__ */ jsx("style", { children: `
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.75rem 1rem; outline: none; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                ` })
  ] }) });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-2", children })
  ] });
}
export {
  CalculatorsIndex as default
};
