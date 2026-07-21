import { jsx } from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "SIGESC-TECH";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-CFcXq4Kz.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-BpAlw-5g.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-2rH4ylc5.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-C55LTybY.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-CwfQzcT1.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-52QpuZ5Z.js"), "./Pages/blog/index.tsx": () => import("./assets/index-wJNSKVco.js"), "./Pages/blog/post.tsx": () => import("./assets/post-CLVScCdn.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-Bni60TSt.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-B0VLzoH5.js"), "./Pages/contact/index.tsx": () => import("./assets/index-BXB6LH53.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-CNs6X4Xo.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-BQ9ML7JT.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-CmGDYo4v.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-DAwPApXq.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-D04k6mFs.js"), "./Pages/modules/index.tsx": () => import("./assets/index-D4ZtZeZC.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-B7VUQar_.js"), "./Pages/payments/index.tsx": () => import("./assets/index-D_4OPPmC.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-B3otzXmL.js"), "./Pages/prices/index.tsx": () => import("./assets/index-Bnj2vwor.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-DvPq50k_.js"), "./Pages/profile/index.tsx": () => import("./assets/index-Cmwzoopy.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-DHyu6UGp.js"), "./Pages/resources/help.tsx": () => import("./assets/help-Dy-dtjm0.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-DSB_4ssv.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-CnNrV302.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-DlKi7Str.js"), "./Pages/shop/index.tsx": () => import("./assets/index-9vBdXJEH.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
