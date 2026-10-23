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
var define_import_meta_env_default = { BASE_URL: "/build/", MODE: "production", DEV: false, PROD: true, SSR: true };
const appName = define_import_meta_env_default.VITE_APP_NAME || "SIGESC-SITE";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-D40tviGR.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-D4tJAwsl.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DRagkeEz.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-IZL2yXUz.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-B_0rJn9H.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-D7Mv1S-s.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-CHR_j67s.js"), "./Pages/blog/index.tsx": () => import("./assets/index-DfmYQGig.js"), "./Pages/blog/post.tsx": () => import("./assets/post-87muVLyZ.js"), "./Pages/calculators/index.tsx": () => import("./assets/index--5QYgZnh.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-DEIqN-EW.js"), "./Pages/contact/index.tsx": () => import("./assets/index-CU_v4jPx.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-HAVHuJY4.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-D1oBKqr-.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-S_T_Jy6f.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-CfzlCIQ2.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-BQGGkOnz.js"), "./Pages/modules/conferencias.tsx": () => import("./assets/conferencias-k80DGZE2.js"), "./Pages/modules/crm.tsx": () => import("./assets/crm-CSH4wVCg.js"), "./Pages/modules/index.tsx": () => import("./assets/index-D-4FFW0X.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-XVsGuCdy.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-DqjuNM0k.js"), "./Pages/payments/index.tsx": () => import("./assets/index-4NkWyQ3N.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-8dGiAQAz.js"), "./Pages/prices/index.tsx": () => import("./assets/index-CpJSN-53.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-Cd4DvwOp.js"), "./Pages/profile/index.tsx": () => import("./assets/index-BwkCSAAg.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-YIn-xwuQ.js"), "./Pages/resources/help.tsx": () => import("./assets/help-cRIjSBRt.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-BbyVi4o_.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-BVq4cuNv.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-CyZkw5jf.js"), "./Pages/shop/index.tsx": () => import("./assets/index-BvQGRP5n.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
