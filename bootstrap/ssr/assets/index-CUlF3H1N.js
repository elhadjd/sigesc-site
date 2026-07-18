import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-helmet";
function AskExpertIndex({
  auth,
  seo
}) {
  const [question, setQuestion] = useState("");
  const [askerName, setAskerName] = useState("");
  const [askerEmail, setAskerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const flash = usePage().props.flash;
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    router.post(
      "/pergunte-ao-especialista",
      {
        question,
        asker_name: askerName,
        asker_email: askerEmail
      },
      {
        onFinish: () => setLoading(false)
      }
    );
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(SeoHead, { seo, fallbackTitle: "Pergunte ao Especialista | SIGESC" }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("main", { className: "relative overflow-hidden bg-[#f4efe6]", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d9e2f1,transparent_40%),radial-gradient(circle_at_80%_0%,#f0d9b5,transparent_35%)]" }),
      /* @__PURE__ */ jsxs("section", { className: "relative mx-auto max-w-3xl px-4 py-16 sm:px-6", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#0b3d91]", children: "SIGESC · Conhecimento" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 font-serif text-4xl text-[#14213d] sm:text-5xl", children: "Pergunte ao Especialista" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-slate-600", children: "Pergunte sobre vendas online, anúncios, sistemas de gestão, AGT, IVA, faturação ou empreendedorismo em Angola. A resposta é preparada com pesquisa e pode virar artigo no blog." }),
        (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800", children: flash.success }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-10 space-y-4 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "A sua pergunta" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                required: true,
                minLength: 12,
                rows: 5,
                value: question,
                onChange: (e) => setQuestion(e.target.value),
                className: "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-[#0b3d91] focus:ring-2",
                placeholder: "Ex.: Qual o melhor sistema de gestão comercial para PME em Angola? Ou: como fazer anúncios de sucesso no Instagram?"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Nome (opcional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: askerName,
                  onChange: (e) => setAskerName(e.target.value),
                  className: "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-slate-700", children: "Email (opcional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: askerEmail,
                  onChange: (e) => setAskerEmail(e.target.value),
                  className: "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3",
                  placeholder: "nome@empresa.ao"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "rounded-xl bg-[#e8eef8] px-4 py-3 text-sm leading-relaxed text-slate-700", children: "Se indicar o email, enviamos a resposta quando estiver pronta — e o link do artigo no blog, se a pergunta der origem a um post. Sem email, pode acompanhar a resposta nesta página." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "rounded-xl bg-[#0b3d91] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a347c] disabled:opacity-60",
              children: loading ? "A enviar a pergunta…" : "Obter resposta"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  AskExpertIndex as default
};
