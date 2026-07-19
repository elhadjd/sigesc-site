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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-DdTSAKMM.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-DnaMPa0v.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-z35Qi0LS.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-ENqIefMR.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-C8bY9ZbE.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-CUlF3H1N.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-BzAb7OJh.js"), "./Pages/blog/index.tsx": () => import("./assets/index-DaB_8fpj.js"), "./Pages/blog/post.tsx": () => import("./assets/post-Dzc01yXB.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-BjswC1z8.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-BtQ2Y8r7.js"), "./Pages/contact/index.tsx": () => import("./assets/index-DJlHQhbX.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-C-mLjcDY.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-B6tXUwo6.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-9JRTldGR.js"), "./Pages/modules/index.tsx": () => import("./assets/index-td41q1LU.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-C1jW-5zf.js"), "./Pages/payments/index.tsx": () => import("./assets/index-CHhDyQcJ.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-CCxr8cPw.js"), "./Pages/prices/index.tsx": () => import("./assets/index-1iII0cco.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-Dk4AFEDg.js"), "./Pages/profile/index.tsx": () => import("./assets/index-C60hZSqY.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-BR7uTw_H.js"), "./Pages/resources/help.tsx": () => import("./assets/help-B0OYaHzM.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-BYnS5OrL.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-D8iv2ET3.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-C7CCK0qK.js"), "./Pages/shop/index.tsx": () => import("./assets/index-BuI7Aokf.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
