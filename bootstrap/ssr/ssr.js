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
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-DaIpRirG.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-CgVztRBq.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DeJiLaO7.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-k9c0bizt.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-DZGWfk61.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-0Alh9T_M.js"), "./Pages/blog/index.tsx": () => import("./assets/index-Cit_B1ZR.js"), "./Pages/blog/post.tsx": () => import("./assets/post-jNhBAwcs.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-anxnAN1r.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-CwuExgjx.js"), "./Pages/contact/index.tsx": () => import("./assets/index-BKNugAd-.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-5D78d_IZ.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-B3gLGHgj.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-xv-aIOmB.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-CHhHAu7x.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-Dawbrk8k.js"), "./Pages/modules/index.tsx": () => import("./assets/index-Dt1WsHzv.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-B_F4n0Ob.js"), "./Pages/payments/index.tsx": () => import("./assets/index-C31sbfcX.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-C4FvOUlg.js"), "./Pages/prices/index.tsx": () => import("./assets/index-CLx4T89f.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-D8hKi57K.js"), "./Pages/profile/index.tsx": () => import("./assets/index-Bk4Elevz.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-DSwvf12B.js"), "./Pages/resources/help.tsx": () => import("./assets/help-CQ8ObV0l.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-CSq8SGaQ.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-CAqaJPHl.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-BZubxLuf.js"), "./Pages/shop/index.tsx": () => import("./assets/index-DclCzsee.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
