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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-DkdPI6_N.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-DnaMPa0v.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-C3yDI-x6.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-aaPIdsmm.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-C8bY9ZbE.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-DUnBnxz3.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-B3K-0XuD.js"), "./Pages/blog/index.tsx": () => import("./assets/index-BqcDRTmh.js"), "./Pages/blog/post.tsx": () => import("./assets/post-BzVWkGIo.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-DuodRadE.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-Cj9RtruA.js"), "./Pages/contact/index.tsx": () => import("./assets/index-BTabqPvc.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-6DwjXdGf.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-BPg8x5ra.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-BZMoySue.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-DngNva4G.js"), "./Pages/modules/index.tsx": () => import("./assets/index-DrMFjUoU.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-Dlkz4yno.js"), "./Pages/payments/index.tsx": () => import("./assets/index-DLjo6tY1.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-D8dG4ZVy.js"), "./Pages/prices/index.tsx": () => import("./assets/index-CZoBwpY2.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-DL1XAeDc.js"), "./Pages/profile/index.tsx": () => import("./assets/index-CO2e7mW3.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-wHE4v5Qc.js"), "./Pages/resources/help.tsx": () => import("./assets/help-DRC9OI-H.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-D1Dbqu0_.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-DcKgGgOJ.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-BjYnPGmi.js"), "./Pages/shop/index.tsx": () => import("./assets/index-YAhGwMM8.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
