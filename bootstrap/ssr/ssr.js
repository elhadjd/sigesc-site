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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-YOuzyd1Z.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-rKBNsobX.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-D3LfX4zG.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-Bzw-714y.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-CXV5zh5Q.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-CSaNIFvs.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-CboWqynQ.js"), "./Pages/blog/index.tsx": () => import("./assets/index-CHkl5Y33.js"), "./Pages/blog/post.tsx": () => import("./assets/post-CXW_fbmn.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-D2l5CTxG.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-11dUP75O.js"), "./Pages/contact/index.tsx": () => import("./assets/index-BzqBid0G.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-Cvv1P3a9.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-CPlsopRc.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-KKCI1YOi.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-Wcs9mr2R.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-DoBt3UB_.js"), "./Pages/modules/crm.tsx": () => import("./assets/crm-MYOKKNeb.js"), "./Pages/modules/index.tsx": () => import("./assets/index-CqYlaW-N.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-CWNmRjTv.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-kULwQd4s.js"), "./Pages/payments/index.tsx": () => import("./assets/index-BpssI7Y9.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-CksBEcxU.js"), "./Pages/prices/index.tsx": () => import("./assets/index-owqv2sKC.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-CfZ6WmRz.js"), "./Pages/profile/index.tsx": () => import("./assets/index-BGj1fk7S.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-DRAAi0bz.js"), "./Pages/resources/help.tsx": () => import("./assets/help-Dur66OUZ.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-CDzFsj19.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-Bvk8Lllx.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-Bg77P9hD.js"), "./Pages/shop/index.tsx": () => import("./assets/index-tiq-qzy0.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
