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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-C3mOjvt1.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-pj9IsF73.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail--aB3qgDq.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-DFe0Q1w-.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-ARiA0KeS.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-BwJIo8fs.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-DPemfyoL.js"), "./Pages/blog/index.tsx": () => import("./assets/index-PvWRYLmY.js"), "./Pages/blog/post.tsx": () => import("./assets/post-2DBT0Gz2.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-Ce6W95WH.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-C2FZUVbe.js"), "./Pages/contact/index.tsx": () => import("./assets/index-BLu5Zemg.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-QsZs5CJm.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-DTXLTWKi.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-C0cI06gI.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-uGJTGtkS.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-BMXenREr.js"), "./Pages/modules/conferencias.tsx": () => import("./assets/conferencias-VgJikOGo.js"), "./Pages/modules/crm.tsx": () => import("./assets/crm-D5K3VG0E.js"), "./Pages/modules/index.tsx": () => import("./assets/index-CWGYc8D9.js"), "./Pages/modules/marketplace.tsx": () => import("./assets/marketplace-CZlkIXHy.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-C8CiUkbl.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-Cy5Yv8Bj.js"), "./Pages/payments/index.tsx": () => import("./assets/index-B17qDqYn.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-C7VljlVB.js"), "./Pages/prices/index.tsx": () => import("./assets/index-Ybj1_SyN.js"), "./Pages/produtos/hospitalar.tsx": () => import("./assets/hospitalar-D2-ETUTB.js"), "./Pages/produtos/hub.tsx": () => import("./assets/hub-CH-9RDFW.js"), "./Pages/produtos/index.tsx": () => import("./assets/index-BDeTePVF.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-DsyUH7I1.js"), "./Pages/profile/index.tsx": () => import("./assets/index-BH1aoyTe.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-WVWaF0lG.js"), "./Pages/resources/help.tsx": () => import("./assets/help-BICV6WsA.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-CEUhF-y8.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-CdiQ-Bsb.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-DEIYsOFd.js"), "./Pages/shop/index.tsx": () => import("./assets/index-sslH4isN.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
