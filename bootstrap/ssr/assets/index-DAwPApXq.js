import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-DF037L4K.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
const emptyParty = () => ({
  name: "",
  nif: "",
  address: "",
  city: "Luanda",
  phone: "",
  email: ""
});
const newLine = (defaultTax) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  description: "",
  quantity: "1",
  unitPrice: "0",
  discount: "0",
  taxKey: defaultTax,
  customTax: "14"
});
const money = (value) => value.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function parseNum(value) {
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function InvoiceGeneratorIndex({
  auth,
  seo,
  taxOptions,
  documentTypes,
  disclaimer
}) {
  var _a, _b, _c, _d;
  const defaultTax = ((_a = taxOptions.find((t) => t.key === "geral")) == null ? void 0 : _a.key) || ((_b = taxOptions[0]) == null ? void 0 : _b.key) || "isento";
  const [docType, setDocType] = useState(((_c = documentTypes[0]) == null ? void 0 : _c.key) || "factura");
  const [series, setSeries] = useState("A");
  const [number, setNumber] = useState("1");
  const [issueDate, setIssueDate] = useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [issuer, setIssuer] = useState(emptyParty());
  const [client, setClient] = useState(emptyParty());
  const [items, setItems] = useState([newLine(defaultTax)]);
  const [globalDiscount, setGlobalDiscount] = useState("0");
  const [retentionEnabled, setRetentionEnabled] = useState(false);
  const [retentionRate, setRetentionRate] = useState("6.5");
  const [notes, setNotes] = useState("Pagamento por transferência bancária ou TPA.");
  const [paymentMethod, setPaymentMethod] = useState("Transferência bancária");
  const [iban, setIban] = useState("");
  const [bankName, setBankName] = useState("");
  const docLabel = ((_d = documentTypes.find((d) => d.key === docType)) == null ? void 0 : _d.label) || "Factura";
  const taxRateFor = (item) => {
    if (item.taxKey === "custom")
      return Math.max(0, parseNum(item.customTax)) / 100;
    const opt = taxOptions.find((t) => t.key === item.taxKey);
    return Math.max(0, (opt == null ? void 0 : opt.rate) ?? 0);
  };
  const computed = useMemo(() => {
    const lines = items.map((item) => {
      const qty = Math.max(0, parseNum(item.quantity));
      const price = Math.max(0, parseNum(item.unitPrice));
      const disc = Math.min(100, Math.max(0, parseNum(item.discount)));
      const net = qty * price * (1 - disc / 100);
      const rate = taxRateFor(item);
      const tax = net * rate;
      return { ...item, qty, price, disc, net, rate, tax, total: net + tax };
    });
    const goodsNet = lines.reduce((s, l) => s + l.net, 0);
    const goodsTax = lines.reduce((s, l) => s + l.tax, 0);
    const gDisc = Math.min(100, Math.max(0, parseNum(globalDiscount)));
    const afterDiscNet = goodsNet * (1 - gDisc / 100);
    const afterDiscTax = goodsTax * (1 - gDisc / 100);
    const beforeRetention = afterDiscNet + afterDiscTax;
    const retRate = retentionEnabled ? Math.max(0, parseNum(retentionRate)) / 100 : 0;
    const retention = afterDiscNet * retRate;
    const grand = beforeRetention - retention;
    return {
      lines,
      goodsNet,
      goodsTax,
      gDisc,
      afterDiscNet,
      afterDiscTax,
      retention,
      beforeRetention,
      grand
    };
  }, [items, globalDiscount, retentionEnabled, retentionRate, taxOptions]);
  const updateParty = (which, field, value) => {
    if (which === "issuer")
      setIssuer((p) => ({ ...p, [field]: value }));
    else
      setClient((p) => ({ ...p, [field]: value }));
  };
  const updateItem = (id, field, value) => {
    setItems((rows) => rows.map((row) => row.id === id ? { ...row, [field]: value } : row));
  };
  const addItem = () => setItems((rows) => [...rows, newLine(defaultTax)]);
  const removeItem = (id) => setItems((rows) => rows.length <= 1 ? rows : rows.filter((r) => r.id !== id));
  const resetAll = () => {
    if (!window.confirm("Limpar todos os dados desta factura? (nada está guardado no servidor)"))
      return;
    setIssuer(emptyParty());
    setClient(emptyParty());
    setItems([newLine(defaultTax)]);
    setGlobalDiscount("0");
    setRetentionEnabled(false);
    setNotes("Pagamento por transferência bancária ou TPA.");
    setIban("");
    setBankName("");
  };
  const printInvoice = () => window.print();
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Criar Fatura Online Grátis Angola | Gerador de Factura com IVA"
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "bg-[#f3f0ea] print:bg-white", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-black/5 print:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,#c9d7f0,transparent_35%),radial-gradient(circle_at_90%_20%,#e8c9a0,transparent_30%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-12 sm:px-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]", children: "SIGESC · Gerador gratuito · Sem conta" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl", children: "Criar fatura online grátis — Angola" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-lg text-slate-600", children: "Adicione artigos, preços, quantidades e IVA. Pré-visualização instantânea. Imprima ou guarde em PDF." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950", children: [
            /* @__PURE__ */ jsx("strong", { children: "Privacidade:" }),
            " ",
            disclaimer
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] sm:px-6 print:block print:max-w-none print:px-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 print:hidden", children: [
          /* @__PURE__ */ jsx(Panel, { title: "Documento", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(Field, { label: "Tipo de documento", children: /* @__PURE__ */ jsx(
              "select",
              {
                className: "field",
                value: docType,
                onChange: (e) => setDocType(e.target.value),
                children: documentTypes.map((d) => /* @__PURE__ */ jsx("option", { value: d.key, children: d.label }, d.key))
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Série", children: /* @__PURE__ */ jsx("input", { className: "field", value: series, onChange: (e) => setSeries(e.target.value) }) }),
            /* @__PURE__ */ jsx(Field, { label: "Número", children: /* @__PURE__ */ jsx("input", { className: "field", value: number, onChange: (e) => setNumber(e.target.value) }) }),
            /* @__PURE__ */ jsx(Field, { label: "Data de emissão", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                className: "field",
                value: issueDate,
                onChange: (e) => setIssueDate(e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Data de vencimento", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                className: "field",
                value: dueDate,
                onChange: (e) => setDueDate(e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Método de pagamento", children: /* @__PURE__ */ jsx(
              "input",
              {
                className: "field",
                value: paymentMethod,
                onChange: (e) => setPaymentMethod(e.target.value)
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxs(Panel, { title: "Emitente (a sua empresa)", children: [
            /* @__PURE__ */ jsx(PartyFields, { party: issuer, onChange: (f, v) => updateParty("issuer", f, v) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "Banco", children: /* @__PURE__ */ jsx("input", { className: "field", value: bankName, onChange: (e) => setBankName(e.target.value) }) }),
              /* @__PURE__ */ jsx(Field, { label: "IBAN", children: /* @__PURE__ */ jsx("input", { className: "field", value: iban, onChange: (e) => setIban(e.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Panel, { title: "Cliente", children: /* @__PURE__ */ jsx(PartyFields, { party: client, onChange: (f, v) => updateParty("client", f, v) }) }),
          /* @__PURE__ */ jsx(
            Panel,
            {
              title: "Artigos / serviços",
              action: /* @__PURE__ */ jsx("button", { type: "button", onClick: addItem, className: "btn-secondary", children: "+ Adicionar artigo" }),
              children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: items.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold text-slate-700", children: [
                    "Linha ",
                    index + 1
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeItem(item.id),
                      className: "text-xs font-medium text-red-700 hover:underline",
                      children: "Remover"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Descrição", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: item.description,
                      onChange: (e) => updateItem(item.id, "description", e.target.value),
                      placeholder: "Ex.: Consultoria, produto, serviço…"
                    }
                  ) }) }),
                  /* @__PURE__ */ jsx(Field, { label: "Quantidade", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: item.quantity,
                      onChange: (e) => updateItem(item.id, "quantity", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Preço unitário (Kz)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: item.unitPrice,
                      onChange: (e) => updateItem(item.id, "unitPrice", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Desconto linha (%)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "number",
                      min: "0",
                      max: "100",
                      step: "0.01",
                      value: item.discount,
                      onChange: (e) => updateItem(item.id, "discount", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Imposto / IVA", children: /* @__PURE__ */ jsx(
                    "select",
                    {
                      className: "field",
                      value: item.taxKey,
                      onChange: (e) => updateItem(item.id, "taxKey", e.target.value),
                      children: taxOptions.map((t) => /* @__PURE__ */ jsx("option", { value: t.key, children: t.label }, t.key))
                    }
                  ) }),
                  item.taxKey === "custom" && /* @__PURE__ */ jsx(Field, { label: "Taxa personalizada (%)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: item.customTax,
                      onChange: (e) => updateItem(item.id, "customTax", e.target.value)
                    }
                  ) })
                ] })
              ] }, item.id)) })
            }
          ),
          /* @__PURE__ */ jsxs(Panel, { title: "Totais e retenção", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "Desconto global (%)", children: /* @__PURE__ */ jsx(
                "input",
                {
                  className: "field",
                  type: "number",
                  min: "0",
                  max: "100",
                  step: "0.01",
                  value: globalDiscount,
                  onChange: (e) => setGlobalDiscount(e.target.value)
                }
              ) }),
              /* @__PURE__ */ jsxs("label", { className: "flex items-end gap-2 pb-2 text-sm text-slate-700", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: retentionEnabled,
                    onChange: (e) => setRetentionEnabled(e.target.checked)
                  }
                ),
                "Aplicar retenção na fonte"
              ] }),
              retentionEnabled && /* @__PURE__ */ jsx(Field, { label: "Retenção (%)", children: /* @__PURE__ */ jsx(
                "input",
                {
                  className: "field",
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: retentionRate,
                  onChange: (e) => setRetentionRate(e.target.value)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx(Field, { label: "Notas / condições", children: /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "field mt-3",
                rows: 3,
                value: notes,
                onChange: (e) => setNotes(e.target.value)
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: printInvoice, className: "btn-primary", children: "Imprimir / Guardar PDF" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: resetAll, className: "btn-secondary", children: "Limpar formulário" }),
            /* @__PURE__ */ jsx("a", { href: "/modelos-de-fatura", className: "btn-secondary", children: "Ver modelos para descarregar" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-6 lg:self-start", children: /* @__PURE__ */ jsxs(
          "div",
          {
            id: "invoice-preview",
            className: "rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0",
            children: [
              /* @__PURE__ */ jsx("div", { className: "mb-4 h-1.5 rounded-full bg-gradient-to-r from-[#0b3d91] to-[#b91c1c] print:mb-6" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#0b3d91]", children: "Pré-visualização" }),
                  /* @__PURE__ */ jsx("h2", { className: "mt-1 font-serif text-2xl text-[#14213d]", children: issuer.name || "A sua empresa" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: [issuer.address, issuer.city, issuer.phone, issuer.email].filter(Boolean).join(" · ") || "Morada e contactos do emitente" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-block rounded-full bg-[#0b3d91] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white", children: docLabel }),
                  /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-slate-600", children: [
                    series,
                    "/",
                    number,
                    /* @__PURE__ */ jsx("br", {}),
                    "Emissão: ",
                    issueDate || "—",
                    dueDate ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("br", {}),
                      "Venc.: ",
                      dueDate
                    ] }) : null
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-3 text-sm", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-[#0b3d91]", children: "Emitente" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 font-medium", children: issuer.name || "—" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
                    "NIF: ",
                    issuer.nif || "—"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 p-3 text-sm", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-[#0b3d91]", children: "Cliente" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 font-medium", children: client.name || "—" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-slate-600", children: [
                    "NIF: ",
                    client.nif || "—"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-slate-600", children: [client.address, client.city].filter(Boolean).join(", ") || "—" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-5 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-left text-sm", children: [
                /* @__PURE__ */ jsx("thead", { className: "bg-[#0b3d91] text-white", children: /* @__PURE__ */ jsxs("tr", { children: [
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 font-medium", children: "Descrição" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Qtd" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Preço" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "IVA" }),
                  /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Total" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: computed.lines.map((line) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-slate-100", children: [
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: line.description || "—" }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right", children: money(line.qty) }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right", children: money(line.price) }),
                  /* @__PURE__ */ jsxs("td", { className: "px-3 py-2 text-right", children: [
                    (line.rate * 100).toFixed(1),
                    "%"
                  ] }),
                  /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right", children: money(line.total) })
                ] }, line.id)) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 ml-auto w-full max-w-xs space-y-1 text-sm", children: [
                /* @__PURE__ */ jsx(Row, { label: "Subtotal (sem IVA)", value: `${money(computed.goodsNet)} Kz` }),
                /* @__PURE__ */ jsx(Row, { label: "IVA", value: `${money(computed.goodsTax)} Kz` }),
                computed.gDisc > 0 && /* @__PURE__ */ jsx(Row, { label: `Desconto global ${computed.gDisc}%`, value: `−` }),
                retentionEnabled && /* @__PURE__ */ jsx(
                  Row,
                  {
                    label: `Retenção ${parseNum(retentionRate)}%`,
                    value: `− ${money(computed.retention)} Kz`
                  }
                ),
                /* @__PURE__ */ jsx(
                  Row,
                  {
                    label: "Total a pagar",
                    value: `${money(computed.grand)} Kz`,
                    strong: true
                  }
                )
              ] }),
              (bankName || iban) && /* @__PURE__ */ jsxs("p", { className: "mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx("strong", { children: "Pagamento:" }),
                " ",
                paymentMethod,
                bankName ? ` · ${bankName}` : "",
                iban ? ` · IBAN ${iban}` : ""
              ] }),
              notes && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-slate-500", children: notes }),
              /* @__PURE__ */ jsx("p", { className: "mt-6 text-[10px] leading-relaxed text-slate-400", children: "Documento gerado no gerador gratuito SIGESC. Não é armazenado no servidor. Para faturação eletrónica oficial AGT use software certificado." })
            ]
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {}),
    /* @__PURE__ */ jsx("style", { children: `
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.7rem 0.9rem; outline: none; background: #fff; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                    .btn-primary { border-radius: 0.75rem; background: #0b3d91; color: #fff; font-weight: 600; font-size: 0.875rem; padding: 0.7rem 1.1rem; }
                    .btn-primary:hover { background: #0a347c; }
                    .btn-secondary { border-radius: 0.75rem; background: #fff; color: #0b3d91; font-weight: 600; font-size: 0.875rem; padding: 0.7rem 1.1rem; box-shadow: inset 0 0 0 1px rgba(11,61,145,.35); }
                    @media print {
                        body * { visibility: hidden; }
                        #invoice-preview, #invoice-preview * { visibility: visible; }
                        #invoice-preview { position: absolute; left: 0; top: 0; width: 100%; }
                        header, footer, .print\\:hidden { display: none !important; }
                    }
                ` })
  ] }) });
}
function Panel({
  title,
  children,
  action
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-serif text-xl text-[#14213d]", children: title }),
      action
    ] }),
    children
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500", children: label }),
    children
  ] });
}
function PartyFields({
  party,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
    /* @__PURE__ */ jsx(Field, { label: "Nome / Empresa", children: /* @__PURE__ */ jsx("input", { className: "field", value: party.name, onChange: (e) => onChange("name", e.target.value) }) }),
    /* @__PURE__ */ jsx(Field, { label: "NIF", children: /* @__PURE__ */ jsx("input", { className: "field", value: party.nif, onChange: (e) => onChange("nif", e.target.value) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Morada", children: /* @__PURE__ */ jsx("input", { className: "field", value: party.address, onChange: (e) => onChange("address", e.target.value) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Cidade", children: /* @__PURE__ */ jsx("input", { className: "field", value: party.city, onChange: (e) => onChange("city", e.target.value) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Telefone", children: /* @__PURE__ */ jsx("input", { className: "field", value: party.phone, onChange: (e) => onChange("phone", e.target.value) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx(
      "input",
      {
        className: "field",
        type: "email",
        value: party.email,
        onChange: (e) => onChange("email", e.target.value)
      }
    ) })
  ] });
}
function Row({ label, value, strong }) {
  return /* @__PURE__ */ jsxs("div", { className: `flex justify-between gap-3 ${strong ? "border-t border-slate-200 pt-2 text-base font-semibold text-[#0b3d91]" : "text-slate-600"}`, children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("span", { children: value })
  ] });
}
export {
  InvoiceGeneratorIndex as default
};
