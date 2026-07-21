import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useState, useMemo, useEffect } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { H as HeaderComponent, F as FooterComponent } from "./Header-7tCmCImi.js";
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
function buildPayload(contentType, fields, wifiAuth) {
  switch (contentType) {
    case "url":
      return (fields.url || "").trim();
    case "email": {
      const email = (fields.email || "").trim();
      const subject = encodeURIComponent(fields.emailSubject || "");
      const body = encodeURIComponent(fields.emailBody || "");
      return `mailto:${email}?subject=${subject}&body=${body}`;
    }
    case "phone":
      return `tel:${(fields.phone || "").trim()}`;
    case "sms": {
      const phone = (fields.smsPhone || "").trim();
      const body = encodeURIComponent(fields.smsBody || "");
      return `sms:${phone}?body=${body}`;
    }
    case "wifi": {
      const ssid = (fields.wifiSsid || "").replace(/([\\;,:"])/g, "\\$1");
      const pass = (fields.wifiPassword || "").replace(/([\\;,:"])/g, "\\$1");
      const hidden = fields.wifiHidden === "1" ? "H:true;" : "";
      if (wifiAuth === "nopass") {
        return `WIFI:T:nopass;S:${ssid};${hidden};`;
      }
      return `WIFI:T:${wifiAuth};S:${ssid};P:${pass};${hidden};`;
    }
    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fields.vcardName || ""}`,
        fields.vcardOrg ? `ORG:${fields.vcardOrg}` : "",
        fields.vcardPhone ? `TEL:${fields.vcardPhone}` : "",
        fields.vcardEmail ? `EMAIL:${fields.vcardEmail}` : "",
        fields.vcardUrl ? `URL:${fields.vcardUrl}` : "",
        "END:VCARD"
      ];
      return lines.filter(Boolean).join("\n");
    }
    case "text":
    default:
      return fields.text || "";
  }
}
function BarcodeQrGeneratorIndex({
  auth,
  seo,
  codeKinds,
  contentTypes,
  barcodeFormats,
  errorLevels,
  disclaimer
}) {
  var _a, _b, _c, _d;
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [kind, setKind] = useState("qr");
  const [contentType, setContentType] = useState(((_a = contentTypes[0]) == null ? void 0 : _a.key) || "url");
  const [barcodeFormat, setBarcodeFormat] = useState(((_b = barcodeFormats[0]) == null ? void 0 : _b.key) || "CODE128");
  const [errorLevel, setErrorLevel] = useState("H");
  const [fgColor, setFgColor] = useState("#14213d");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [showBarcodeText, setShowBarcodeText] = useState(true);
  const [barcodeValue, setBarcodeValue] = useState("SIGESC12345");
  const [wifiAuth, setWifiAuth] = useState("WPA");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoScale, setLogoScale] = useState(22);
  const [error, setError] = useState(null);
  const [fields, setFields] = useState({
    url: "https://sisgesc.net",
    text: "SIGESC — gestão comercial Angola",
    email: "comercial.sigesc@gmail.com",
    emailSubject: "Pedido de informação",
    emailBody: "",
    phone: "+244929147445",
    smsPhone: "+244929147445",
    smsBody: "Olá!",
    wifiSsid: "MinhaRede",
    wifiPassword: "",
    wifiHidden: "0",
    vcardName: "Nome da Empresa",
    vcardOrg: "SIGESC",
    vcardPhone: "+244929147445",
    vcardEmail: "comercial.sigesc@gmail.com",
    vcardUrl: "https://sisgesc.net"
  });
  const payload = useMemo(() => {
    if (kind === "barcode")
      return barcodeValue;
    return buildPayload(contentType, fields, wifiAuth);
  }, [kind, contentType, fields, wifiAuth, barcodeValue]);
  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };
  const onLogoFile = (file) => {
    if (!file) {
      setLogoUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Seleccione uma imagem (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 2e6) {
      setError("A imagem deve ter no máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const drawLogo = (canvas, src, scalePercent) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponível"));
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      const box = Math.min(w, h) * (Math.min(40, Math.max(10, scalePercent)) / 100);
      const x = (w - box) / 2;
      const y = (h - box) / 2;
      const pad = box * 0.12;
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      const r = box * 0.12;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + box, y, x + box, y + box, r);
      ctx.arcTo(x + box, y + box, x, y + box, r);
      ctx.arcTo(x, y + box, x, y, r);
      ctx.arcTo(x, y, x + box, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.drawImage(img, x + pad, y + pad, box - pad * 2, box - pad * 2);
      resolve();
    };
    img.onerror = () => reject(new Error("Não foi possível carregar o logotipo"));
    img.src = src;
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    let cancelled = false;
    const run = async () => {
      setError(null);
      try {
        if (!payload.trim()) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          setError("Introduza o conteúdo do código.");
          return;
        }
        if (kind === "qr") {
          await QRCode.toCanvas(canvas, payload, {
            errorCorrectionLevel: errorLevel,
            margin,
            width: size,
            color: { dark: fgColor, light: bgColor }
          });
          if (!cancelled && logoUrl) {
            await drawLogo(canvas, logoUrl, logoScale);
          }
        } else {
          canvas.width = Math.max(size, 280);
          canvas.height = Math.round(size * 0.45);
          JsBarcode(canvas, payload, {
            format: barcodeFormat,
            lineColor: fgColor,
            background: bgColor,
            displayValue: showBarcodeText,
            margin,
            width: 2,
            height: Math.round(size * 0.28),
            fontSize: 16
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Não foi possível gerar o código. Verifique o formato e o valor."
          );
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [
    kind,
    payload,
    errorLevel,
    fgColor,
    bgColor,
    size,
    margin,
    logoUrl,
    logoScale,
    barcodeFormat,
    showBarcodeText
  ]);
  const download = (type) => {
    const canvas = canvasRef.current;
    if (!canvas || error)
      return;
    if (type === "png") {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = kind === "qr" ? "qr-code-sigesc.png" : "codigo-barras-sigesc.png";
      a.click();
      return;
    }
    if (kind === "qr") {
      void QRCode.toString(payload, {
        type: "svg",
        errorCorrectionLevel: errorLevel,
        margin,
        width: size,
        color: { dark: fgColor, light: bgColor }
      }).then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "qr-code-sigesc.svg";
        a.click();
        URL.revokeObjectURL(a.href);
      });
    } else {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      try {
        JsBarcode(svg, payload, {
          format: barcodeFormat,
          lineColor: fgColor,
          background: bgColor,
          displayValue: showBarcodeText,
          margin,
          width: 2,
          height: Math.round(size * 0.28)
        });
        const xml = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([xml], { type: "image/svg+xml" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "codigo-barras-sigesc.svg";
        a.click();
        URL.revokeObjectURL(a.href);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao exportar SVG");
      }
    }
  };
  const printCode = () => window.print();
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Gerador de Código de Barras e QR Code Grátis | Com Logotipo"
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "bg-[#eef2f7] print:bg-white", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-black/5 print:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,#b8d4c8,transparent_40%),radial-gradient(circle_at_88%_10%,#c5d4f0,transparent_35%)]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-12 sm:px-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]", children: "SIGESC · Gerador gratuito · Sem conta" }),
          /* @__PURE__ */ jsx("h1", { className: "mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl", children: "Gerador de código de barras e QR Code" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-3xl text-lg text-slate-600", children: "Crie QR Codes com logotipo, Wi‑Fi, contactos ou URLs — e códigos de barras EAN / CODE128. Descarregue PNG ou SVG." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950", children: [
            /* @__PURE__ */ jsx("strong", { children: "Privacidade:" }),
            " ",
            disclaimer
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] sm:px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 print:hidden", children: [
          /* @__PURE__ */ jsx(Panel, { title: "Tipo de código", children: /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: codeKinds.map((k) => /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setKind(k.key),
              className: `rounded-2xl border px-4 py-3 text-left transition ${kind === k.key ? "border-[#0b3d91] bg-[#0b3d91]/5 text-[#0b3d91]" : "border-slate-200 bg-white hover:border-slate-300"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "block font-semibold", children: k.label }),
                /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-slate-500", children: k.description })
              ]
            },
            k.key
          )) }) }),
          kind === "qr" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(Panel, { title: "Conteúdo do QR Code", children: [
              /* @__PURE__ */ jsx(Field, { label: "Tipo de informação", children: /* @__PURE__ */ jsx(
                "select",
                {
                  className: "field",
                  value: contentType,
                  onChange: (e) => setContentType(e.target.value),
                  children: contentTypes.map((t) => /* @__PURE__ */ jsx("option", { value: t.key, children: t.label }, t.key))
                }
              ) }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: (_c = contentTypes.find((t) => t.key === contentType)) == null ? void 0 : _c.hint }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [
                contentType === "url" && /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "URL", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "field",
                    value: fields.url,
                    onChange: (e) => setField("url", e.target.value),
                    placeholder: "https://"
                  }
                ) }) }),
                contentType === "text" && /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Texto", children: /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    className: "field",
                    rows: 3,
                    value: fields.text,
                    onChange: (e) => setField("text", e.target.value)
                  }
                ) }) }),
                contentType === "email" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "email",
                      value: fields.email,
                      onChange: (e) => setField("email", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Assunto", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.emailSubject,
                      onChange: (e) => setField("emailSubject", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Mensagem", children: /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      className: "field",
                      rows: 2,
                      value: fields.emailBody,
                      onChange: (e) => setField("emailBody", e.target.value)
                    }
                  ) }) })
                ] }),
                contentType === "phone" && /* @__PURE__ */ jsx(Field, { label: "Telefone", children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "field",
                    value: fields.phone,
                    onChange: (e) => setField("phone", e.target.value)
                  }
                ) }),
                contentType === "sms" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Número", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.smsPhone,
                      onChange: (e) => setField("smsPhone", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Mensagem", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.smsBody,
                      onChange: (e) => setField("smsBody", e.target.value)
                    }
                  ) })
                ] }),
                contentType === "wifi" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Nome da rede (SSID)", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.wifiSsid,
                      onChange: (e) => setField("wifiSsid", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Segurança", children: /* @__PURE__ */ jsxs(
                    "select",
                    {
                      className: "field",
                      value: wifiAuth,
                      onChange: (e) => setWifiAuth(e.target.value),
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "WPA", children: "WPA / WPA2" }),
                        /* @__PURE__ */ jsx("option", { value: "WEP", children: "WEP" }),
                        /* @__PURE__ */ jsx("option", { value: "nopass", children: "Sem palavra-passe" })
                      ]
                    }
                  ) }),
                  wifiAuth !== "nopass" && /* @__PURE__ */ jsx(Field, { label: "Palavra-passe", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      type: "password",
                      value: fields.wifiPassword,
                      onChange: (e) => setField("wifiPassword", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("label", { className: "flex items-end gap-2 pb-2 text-sm text-slate-700", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: fields.wifiHidden === "1",
                        onChange: (e) => setField("wifiHidden", e.target.checked ? "1" : "0")
                      }
                    ),
                    "Rede oculta"
                  ] })
                ] }),
                contentType === "vcard" && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Field, { label: "Nome", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.vcardName,
                      onChange: (e) => setField("vcardName", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Empresa", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.vcardOrg,
                      onChange: (e) => setField("vcardOrg", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Telefone", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.vcardPhone,
                      onChange: (e) => setField("vcardPhone", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.vcardEmail,
                      onChange: (e) => setField("vcardEmail", e.target.value)
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Website", children: /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "field",
                      value: fields.vcardUrl,
                      onChange: (e) => setField("vcardUrl", e.target.value)
                    }
                  ) }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Panel, { title: "Logotipo no centro", children: [
              /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm text-slate-600", children: "Carregue o logotipo da empresa ou qualquer imagem. Use correção de erro Q ou H para o QR continuar legível." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => {
                      var _a2;
                      return (_a2 = fileRef.current) == null ? void 0 : _a2.click();
                    },
                    children: "Escolher imagem"
                  }
                ),
                logoUrl && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn-secondary",
                    onClick: () => {
                      setLogoUrl(null);
                      if (fileRef.current)
                        fileRef.current.value = "";
                    },
                    children: "Remover logo"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref: fileRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: (e) => {
                      var _a2;
                      return onLogoFile(((_a2 = e.target.files) == null ? void 0 : _a2[0]) || null);
                    }
                  }
                )
              ] }),
              logoUrl && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsx(Field, { label: `Tamanho do logo (${logoScale}%)`, children: /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "range",
                    min: 12,
                    max: 32,
                    value: logoScale,
                    onChange: (e) => setLogoScale(Number(e.target.value)),
                    className: "w-full"
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: logoUrl,
                    alt: "Pré-visualização do logotipo",
                    className: "h-14 w-14 rounded-xl object-contain ring-1 ring-black/10"
                  }
                ) })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx(Panel, { title: "Código de barras", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx(Field, { label: "Formato", children: /* @__PURE__ */ jsx(
              "select",
              {
                className: "field",
                value: barcodeFormat,
                onChange: (e) => setBarcodeFormat(e.target.value),
                children: barcodeFormats.map((f) => /* @__PURE__ */ jsx("option", { value: f.key, children: f.label }, f.key))
              }
            ) }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-end gap-2 pb-2 text-sm text-slate-700", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: showBarcodeText,
                  onChange: (e) => setShowBarcodeText(e.target.checked)
                }
              ),
              "Mostrar texto sob o código"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx(Field, { label: "Valor / dados", children: /* @__PURE__ */ jsx(
                "input",
                {
                  className: "field",
                  value: barcodeValue,
                  onChange: (e) => setBarcodeValue(e.target.value),
                  placeholder: "Ex.: 5901234123457 ou SKU-001"
                }
              ) }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-slate-500", children: (_d = barcodeFormats.find((f) => f.key === barcodeFormat)) == null ? void 0 : _d.hint })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Panel, { title: "Aparência", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            kind === "qr" && /* @__PURE__ */ jsx(Field, { label: "Correção de erro", children: /* @__PURE__ */ jsx(
              "select",
              {
                className: "field",
                value: errorLevel,
                onChange: (e) => setErrorLevel(e.target.value),
                children: errorLevels.map((l) => /* @__PURE__ */ jsx("option", { value: l.key, children: l.label }, l.key))
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: `Tamanho (${size}px)`, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: 180,
                max: 560,
                step: 10,
                value: size,
                onChange: (e) => setSize(Number(e.target.value)),
                className: "w-full"
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Cor do código", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                className: "field h-11 p-1",
                value: fgColor,
                onChange: (e) => setFgColor(e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: "Cor de fundo", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "color",
                className: "field h-11 p-1",
                value: bgColor,
                onChange: (e) => setBgColor(e.target.value)
              }
            ) }),
            /* @__PURE__ */ jsx(Field, { label: `Margem (${margin})`, children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 8,
                value: margin,
                onChange: (e) => setMargin(Number(e.target.value)),
                className: "w-full"
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => download("png"), className: "btn-primary", children: "Descarregar PNG" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => download("svg"), className: "btn-secondary", children: "Descarregar SVG" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: printCode, className: "btn-secondary", children: "Imprimir" }),
            /* @__PURE__ */ jsx("a", { href: "/gerador-de-fatura", className: "btn-secondary", children: "Criar fatura grátis" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-6 lg:self-start", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.16em] text-[#0b3d91]", children: "Pré-visualização" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-1 font-serif text-2xl text-[#14213d]", children: kind === "qr" ? "QR Code" : "Código de barras" }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 flex min-h-[280px] items-center justify-center rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5", children: /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "max-w-full" }) }),
          error && /* @__PURE__ */ jsx("p", { className: "mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800", children: error }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-600", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: "Dados:" }),
            " ",
            payload || "—"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-slate-500", children: "Nada é enviado ao servidor. Use a câmara do telemóvel para testar o QR Code." })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {}),
    /* @__PURE__ */ jsx("style", { children: `
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.7rem 0.9rem; outline: none; background: #fff; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                    .btn-primary { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; background: #0b3d91; color: #fff; padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600; }
                    .btn-primary:hover { background: #093278; }
                    .btn-secondary { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; background: #fff; color: #0b3d91; padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600; border: 1px solid #c7d2e8; }
                    .btn-secondary:hover { background: #f8fafc; }
                    @media print {
                        header, footer, .print\\:hidden { display: none !important; }
                        canvas { max-width: 100% !important; }
                    }
                ` })
  ] }) });
}
function Panel({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5", children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-4 font-serif text-xl text-[#14213d]", children: title }),
    children
  ] });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500", children: label }),
    children
  ] });
}
export {
  BarcodeQrGeneratorIndex as default
};
