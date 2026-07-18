import { jsxs, jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet";
function SeoHead({ seo, fallbackTitle, fallbackDescription }) {
  var _a, _b, _c;
  const title = (seo == null ? void 0 : seo.title) || fallbackTitle || "SIGESC";
  const description = (seo == null ? void 0 : seo.description) || fallbackDescription || "";
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    description && /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    (seo == null ? void 0 : seo.keywords) && /* @__PURE__ */ jsx("meta", { name: "keywords", content: seo.keywords }),
    (seo == null ? void 0 : seo.robots) && /* @__PURE__ */ jsx("meta", { name: "robots", content: seo.robots }),
    (seo == null ? void 0 : seo.canonical) && /* @__PURE__ */ jsx("link", { rel: "canonical", href: seo.canonical }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    description && /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    (seo == null ? void 0 : seo.og_image) && /* @__PURE__ */ jsx("meta", { property: "og:image", content: seo.og_image }),
    (seo == null ? void 0 : seo.og_type) && /* @__PURE__ */ jsx("meta", { property: "og:type", content: seo.og_type }),
    (seo == null ? void 0 : seo.canonical) && /* @__PURE__ */ jsx("meta", { property: "og:url", content: seo.canonical }),
    ((_a = seo == null ? void 0 : seo.article) == null ? void 0 : _a.published_time) && /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: seo.article.published_time }),
    ((_b = seo == null ? void 0 : seo.article) == null ? void 0 : _b.author) && /* @__PURE__ */ jsx("meta", { property: "article:author", content: seo.article.author }),
    ((_c = seo == null ? void 0 : seo.article) == null ? void 0 : _c.section) && /* @__PURE__ */ jsx("meta", { property: "article:section", content: seo.article.section }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: (seo == null ? void 0 : seo.twitter_card) || "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    description && /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    (seo == null ? void 0 : seo.og_image) && /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: seo.og_image })
  ] });
}
export {
  SeoHead as S
};
