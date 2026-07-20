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
const appName = "SIGESC-SITE";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-ChP__-vg.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-Q3TgrYy8.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DJop5uRF.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-BTq4mQis.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-BjxYw3Jh.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-C8aIryQ8.js"), "./Pages/blog/index.tsx": () => import("./assets/index-QVNkgD7q.js"), "./Pages/blog/post.tsx": () => import("./assets/post-VErVW44a.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-COXiOMlD.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-BcDKM8Pr.js"), "./Pages/contact/index.tsx": () => import("./assets/index-B4PU_KHN.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-8wS-9y6q.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-DAr3m0EM.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-D-68ToSa.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-2J3cXeOx.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-XLJaDitw.js"), "./Pages/modules/index.tsx": () => import("./assets/index-CNXkS_JR.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-BW_cxFmP.js"), "./Pages/payments/index.tsx": () => import("./assets/index-BU72Y-m6.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-rKGMXXmY.js"), "./Pages/prices/index.tsx": () => import("./assets/index-D5M3Yt4a.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-DtXMNXGY.js"), "./Pages/profile/index.tsx": () => import("./assets/index-B7_a52Ik.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-CdNn1Msx.js"), "./Pages/resources/help.tsx": () => import("./assets/help-RjtYSTFI.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-DO9Jx-Xo.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-BrM2S-8B.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-CEKxJaGb.js"), "./Pages/shop/index.tsx": () => import("./assets/index-BvSxfYbK.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
