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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-D6JMRw-f.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-DCMkPSgj.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-CGYrByo7.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-CCPek0-R.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-BENMf8Je.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-Bp_IvAZ7.js"), "./Pages/blog/index.tsx": () => import("./assets/index-DC1t9_bw.js"), "./Pages/blog/post.tsx": () => import("./assets/post-C9QT9Vrz.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-DcUCFD5e.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-DuUCfVsj.js"), "./Pages/contact/index.tsx": () => import("./assets/index-DspHaVyo.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-CtDpJvP1.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-DjTE5Dsf.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-C0V3rhmf.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-CPG_DCCt.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-Def7kUKy.js"), "./Pages/modules/index.tsx": () => import("./assets/index-Maijydn_.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-CMby69gp.js"), "./Pages/payments/index.tsx": () => import("./assets/index-Dhw9IJyF.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-DrXVmPVc.js"), "./Pages/prices/index.tsx": () => import("./assets/index-Dl7xK9el.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-C4kR5jet.js"), "./Pages/profile/index.tsx": () => import("./assets/index-JkYOBNmC.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-D63-2Cwc.js"), "./Pages/resources/help.tsx": () => import("./assets/help-DtA6CRGm.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-Ds354xkr.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-C83hil2m.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-CEgu34dK.js"), "./Pages/shop/index.tsx": () => import("./assets/index-CfvUn3AX.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
