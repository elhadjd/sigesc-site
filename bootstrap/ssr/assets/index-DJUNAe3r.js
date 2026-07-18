import axios from "axios";
function csrfToken() {
  var _a;
  const meta = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
  if (meta) {
    return meta;
  }
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
const Api = axios.create({
  baseURL: "/",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json"
  }
});
Api.interceptors.request.use((config) => {
  const token = csrfToken();
  if (token) {
    config.headers.set("X-CSRF-TOKEN", token);
    config.headers.set("X-XSRF-TOKEN", token);
  }
  return config;
});
const routeApi = () => {
  const loginWithSocial = async (type) => {
    window.location.href = `/loginWithSocial/${type}`;
    return Promise.resolve();
  };
  const checkLoggedUser = (data) => {
    return Api.post("checkLoggedUser", { ...data });
  };
  const Login = async (data) => {
    return Api.post("auth/login", data);
  };
  const RoutePost = async (route, data) => {
    return Api.post(route, data);
  };
  const RouteGet = async (route) => {
    return Api.get(route);
  };
  const RouteDelete = async (route) => {
    return Api.get(route);
  };
  return {
    loginWithSocial,
    checkLoggedUser,
    Login,
    RoutePost,
    RouteGet,
    RouteDelete
  };
};
export {
  Api as A,
  routeApi as r
};
