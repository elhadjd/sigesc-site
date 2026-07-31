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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-XHB0wg-G.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-r4suRQWn.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DjZ-o8h0.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-BMVlelR_.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-D5wkmMo0.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-CfW8t7Cs.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-ftIEvd35.js"), "./Pages/blog/index.tsx": () => import("./assets/index-DuGPDsVe.js"), "./Pages/blog/post.tsx": () => import("./assets/post-Dzan6ttw.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-YanM9uUL.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-BQzrmycd.js"), "./Pages/contact/index.tsx": () => import("./assets/index-C0A2FnPj.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-Cvf9RSc5.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-BhEl82el.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-BDGHAOwm.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-C4kHtRqv.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-x2EjRmc6.js"), "./Pages/modules/index.tsx": () => import("./assets/index-V5AveY_A.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-CzpOr_gL.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-BfLQiXoU.js"), "./Pages/payments/index.tsx": () => import("./assets/index-ha-op4cJ.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-BBBfiQQ8.js"), "./Pages/prices/index.tsx": () => import("./assets/index-CdIWR9Ny.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-Dh8hStgU.js"), "./Pages/profile/index.tsx": () => import("./assets/index-C0Sn0uEF.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-DKAx9jzB.js"), "./Pages/resources/help.tsx": () => import("./assets/help-C4ntJwwO.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-BSgakkk-.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy--dsA6rHR.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-BG0lGqlQ.js"), "./Pages/shop/index.tsx": () => import("./assets/index-BI5hyYLS.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
