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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-BYsCnnpx.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-t-7vgHZ-.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-CDX4XhK5.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-DcqQazdf.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-DAafRADM.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-BrU8rdQq.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-B7z-MDNl.js"), "./Pages/blog/index.tsx": () => import("./assets/index-BxhqhBtK.js"), "./Pages/blog/post.tsx": () => import("./assets/post-BELr03Q5.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-Da7j8C2u.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-B6VgO3hE.js"), "./Pages/contact/index.tsx": () => import("./assets/index-Cn7RQd3W.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-BeGb4HI_.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-DcZe2Dc0.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-rBB8aoDK.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-BuAfH5Dk.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-D5_0rpgc.js"), "./Pages/modules/conferencias.tsx": () => import("./assets/conferencias-CP-c-R6-.js"), "./Pages/modules/crm.tsx": () => import("./assets/crm-BUsPMlMC.js"), "./Pages/modules/index.tsx": () => import("./assets/index-VkwaRv2G.js"), "./Pages/modules/marketplace.tsx": () => import("./assets/marketplace-ClrwUKHC.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-DEwSyDHD.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-CsQIxsKi.js"), "./Pages/payments/index.tsx": () => import("./assets/index-BG9szZOt.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-ChTtIkj1.js"), "./Pages/prices/index.tsx": () => import("./assets/index-DvpFOUpx.js"), "./Pages/produtos/hospitalar.tsx": () => import("./assets/hospitalar-DHSY4eI5.js"), "./Pages/produtos/hub.tsx": () => import("./assets/hub-DStdWips.js"), "./Pages/produtos/index.tsx": () => import("./assets/index-Bl_jQh5e.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-CyTHn1xx.js"), "./Pages/profile/index.tsx": () => import("./assets/index-CylMQGvS.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-DhBjXZGW.js"), "./Pages/resources/help.tsx": () => import("./assets/help-CGzA9T0j.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-BQRi9-wD.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-CJ1JGMuT.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-DY6zJS5E.js"), "./Pages/shop/index.tsx": () => import("./assets/index-Ct8pTdKp.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
