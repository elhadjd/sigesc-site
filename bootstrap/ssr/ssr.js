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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-DAIbpVXi.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-BfkTwx47.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DbAqYgaH.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-9aRgRLA-.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-A5kBK0D_.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-B35i5_20.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-B47tpCgg.js"), "./Pages/blog/index.tsx": () => import("./assets/index-D17jVhg5.js"), "./Pages/blog/post.tsx": () => import("./assets/post-CQjBvrZY.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-DnKAyPhS.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-T1lraKlo.js"), "./Pages/contact/index.tsx": () => import("./assets/index-Db0KV5PU.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-Den_9SJi.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-CYatBrui.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-BwZdvd_X.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-Bc001DPY.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-CVIgWzbe.js"), "./Pages/modules/conferencias.tsx": () => import("./assets/conferencias-BVo5_1PV.js"), "./Pages/modules/crm.tsx": () => import("./assets/crm-9vdhDfBk.js"), "./Pages/modules/index.tsx": () => import("./assets/index-0y8XMglF.js"), "./Pages/modules/marketplace.tsx": () => import("./assets/marketplace-DsKYON9N.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-BayaQHaS.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-B3R31hVU.js"), "./Pages/payments/index.tsx": () => import("./assets/index-DknIl7jH.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-BGAOl6I7.js"), "./Pages/prices/index.tsx": () => import("./assets/index-1IVt8y4A.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-CC9MZ02s.js"), "./Pages/profile/index.tsx": () => import("./assets/index-D8nwp2gx.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-CtHNt46W.js"), "./Pages/resources/help.tsx": () => import("./assets/help-C-i5myBC.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-Dwjfl_d2.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-ByBa_1KY.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-hWRlgVw3.js"), "./Pages/shop/index.tsx": () => import("./assets/index-DRUU3RJw.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
