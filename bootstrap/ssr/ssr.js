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
const appName = "SIGESC-TECH";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, /* @__PURE__ */ Object.assign({ "./Pages/Auth/ForgotPassword.tsx": () => import("./assets/ForgotPassword-CVjRAA--.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-C0k8LpYw.js"), "./Pages/Auth/ResetPassword.tsx": () => import("./assets/ResetPassword-0NlFlg3S.js"), "./Pages/Auth/VerifyEmail.tsx": () => import("./assets/VerifyEmail-DawK34I6.js"), "./Pages/Auth/index.tsx": () => import("./assets/index-HNP2WSSH.js"), "./Pages/about/index.tsx": () => import("./assets/index-BhkrVvzF.js"), "./Pages/admin/ai-content/Layout.tsx": () => import("./assets/Layout-Bj0mdkdN.js"), "./Pages/admin/ai-content/articles.tsx": () => import("./assets/articles-DmktVURK.js"), "./Pages/admin/ai-content/dashboard.tsx": () => import("./assets/dashboard-VWKT7_BF.js"), "./Pages/admin/ai-content/expert.tsx": () => import("./assets/expert-BGZGUXLI.js"), "./Pages/admin/ai-content/jobs.tsx": () => import("./assets/jobs-BMekAAtD.js"), "./Pages/admin/ai-content/logs.tsx": () => import("./assets/logs-B9GNS_Y4.js"), "./Pages/admin/ai-content/research-settings.tsx": () => import("./assets/research-settings-DRycz6PE.js"), "./Pages/admin/ai-content/show.tsx": () => import("./assets/show-C0Ey-8rs.js"), "./Pages/ask-expert/index.tsx": () => import("./assets/index-DRqd8TIC.js"), "./Pages/ask-expert/show.tsx": () => import("./assets/show-DJYpUHXn.js"), "./Pages/barcode-qr-generator/index.tsx": () => import("./assets/index-DBctv-PT.js"), "./Pages/blog/index.tsx": () => import("./assets/index-q9v_IG40.js"), "./Pages/blog/post.tsx": () => import("./assets/post-Dgmx0vba.js"), "./Pages/calculators/index.tsx": () => import("./assets/index-Cv2Jo5XS.js"), "./Pages/clients/depoiments.tsx": () => import("./assets/depoiments-CNGLFAQF.js"), "./Pages/contact/index.tsx": () => import("./assets/index-CnBRPyOq.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-TJahG7x-.js"), "./Pages/downloads/sigesc-admin.tsx": () => import("./assets/sigesc-admin-BaMEw2Xv.js"), "./Pages/downloads/thanks.tsx": () => import("./assets/thanks-C48Jq9rY.js"), "./Pages/invoice-generator/index.tsx": () => import("./assets/index-CASzWy_U.js"), "./Pages/invoice-templates/index.tsx": () => import("./assets/index-B4Mv9qKf.js"), "./Pages/modules/index.tsx": () => import("./assets/index-DuWqfvQS.js"), "./Pages/modules/sigesc-modules.tsx": () => import("./assets/sigesc-modules-ChaJrAP2.js"), "./Pages/partnership/index.tsx": () => import("./assets/index-BfiEjRaQ.js"), "./Pages/payments/index.tsx": () => import("./assets/index-U0QeHOGP.js"), "./Pages/prices/Company.tsx": () => import("./assets/Company-CXUQz__E.js"), "./Pages/prices/index.tsx": () => import("./assets/index-CCv740Hs.js"), "./Pages/profile/UpdatePasswordForm.tsx": () => import("./assets/UpdatePasswordForm-Cte1Ahyr.js"), "./Pages/profile/index.tsx": () => import("./assets/index-pWQz9nwr.js"), "./Pages/resources/faq.tsx": () => import("./assets/faq-BsFooGDn.js"), "./Pages/resources/help.tsx": () => import("./assets/help-DJNqzUiU.js"), "./Pages/resources/learningCenter.tsx": () => import("./assets/learningCenter-sEYoYU2B.js"), "./Pages/resources/privacy.tsx": () => import("./assets/privacy-wpeC5ynI.js"), "./Pages/resources/terms.tsx": () => import("./assets/terms-DHMghhdD.js"), "./Pages/shop/index.tsx": () => import("./assets/index-QDcJymBC.js") })),
    setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
  })
);
