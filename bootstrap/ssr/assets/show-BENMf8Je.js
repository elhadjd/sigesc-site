import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-7tCmCImi.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
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
const PENDING = /* @__PURE__ */ new Set(["queued", "pending", "researching"]);
function AskExpertShow({
  auth,
  question,
  seo
}) {
  const flash = usePage().props.flash;
  const [live, setLive] = useState(null);
  const status = (live == null ? void 0 : live.status) ?? question.status;
  const answerHtml = (live == null ? void 0 : live.answer_html) ?? question.answer_html;
  const qualityScore = (live == null ? void 0 : live.quality_score) ?? question.quality_score;
  const article = (live == null ? void 0 : live.article) ?? question.article;
  const processing = PENDING.has(status);
  const failed = status === "rejected";
  useEffect(() => {
    if (!PENDING.has(question.status) || !window.Echo) {
      return;
    }
    const channelName = `AskExpert.${question.uuid}`;
    const channel = window.Echo.channel(channelName);
    channel.listen(".ask-expert.ready", (payload) => {
      setLive(payload);
    });
    return () => {
      window.Echo.leave(channelName);
    };
  }, [question.uuid, question.status]);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(SeoHead, { seo, fallbackTitle: "Resposta do Especialista | SIGESC" }),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx("main", { className: "bg-[#f4efe6]", children: /* @__PURE__ */ jsxs("article", { className: "mx-auto max-w-3xl px-4 py-16 sm:px-6", children: [
      /* @__PURE__ */ jsx(Link, { href: "/pergunte-ao-especialista", className: "text-sm text-[#0b3d91]", children: "← Nova pergunta" }),
      (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800", children: flash.success }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-serif text-3xl text-[#14213d] sm:text-4xl", children: question.question }),
      !processing && !failed && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [
        "Qualidade estimada: ",
        qualityScore ?? "—"
      ] }),
      processing ? /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium text-[#14213d]", children: "A preparar a sua resposta…" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-slate-600", children: [
          "Estamos a pesquisar fontes e a organizar a informação. Assim que estiver pronta, aparece aqui automaticamente.",
          question.asker_email ? " Também enviamos o resultado para o seu email." : ""
        ] })
      ] }) : failed ? /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-3xl bg-rose-50 p-6 text-rose-900 ring-1 ring-rose-100", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg font-medium", children: "Não foi possível gerar a resposta agora." }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-rose-800/90", children: "Tente novamente dentro de momentos ou reformule a pergunta." }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/pergunte-ao-especialista",
            className: "mt-4 inline-block text-sm font-semibold text-[#0b3d91] underline",
            children: "Nova pergunta"
          }
        )
      ] }) : /* @__PURE__ */ jsx(
        "div",
        {
          className: "prose blog-prose mt-8 max-w-none rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5",
          dangerouslySetInnerHTML: { __html: answerHtml || "" }
        }
      ),
      article && /* @__PURE__ */ jsxs("p", { className: "mt-8 text-slate-700", children: [
        "Esta resposta gerou um artigo no blog:",
        " ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/blog/posts/${article.slug}`,
            className: "font-semibold text-[#0b3d91] underline",
            children: article.title
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  AskExpertShow as default
};
