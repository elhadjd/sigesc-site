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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-oCA4oFf4.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-xW95sVYt.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-Dt37gorG.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-Bds2OJ6Y.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-DwCt_6PS.js"), "./Pages/blog/index.tsx": () => import("./assets/index-BiPyHKLH.js"), "./Pages/blog/post.tsx": () => import("./assets/post-rF3f4EF6.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-CFjrwbGb.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-CkKKeeKG.js"), "./Pages/contact/index.tsx": () => import("./assets/index-B0N2uI9U.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-K83M0rs4.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-C3HI9bBE.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-B4ioX2fj.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-BrJFAFbz.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-BJNK7JRQ.js"), "./Pages/modules/index.tsx": () => import("./assets/index-4tazRkiZ.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-Dqe4cZLA.js"), "./Pages/payments/index.tsx": () => import("./assets/index-K8V6XYfo.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-CpALKyC8.js"), "./Pages/prices/index.tsx": () => import("./assets/index-lr0yHXzE.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-DG5d7PDD.js"), "./Pages/profile/index.tsx": () => import("./assets/index-Dc8880lW.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-Drg9tRmI.js"), "./Pages/resources/help.tsx": () => import("./assets/help-CUYR-1Up.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-gsbvenqP.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-DaoFJCBo.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-DUT2AHrr.js"), "./Pages/shop/index.tsx": () => import("./assets/index-ds_Ak9xS.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
