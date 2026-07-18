import axios from 'axios';

function csrfToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (meta) {
        return meta;
    }

    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export const Api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
});

Api.interceptors.request.use((config) => {
    const token = csrfToken();
    if (token) {
        config.headers.set('X-CSRF-TOKEN', token);
        config.headers.set('X-XSRF-TOKEN', token);
    }
    return config;
});

export const routeApi = () => {
    const loginWithSocial = async (type: string) => {
        // Full browser navigation — OAuth redirect cannot run inside XHR.
        window.location.href = `/loginWithSocial/${type}`;
        return Promise.resolve();
    };

    const checkLoggedUser = (data: unknown) => {
        return Api.post('checkLoggedUser', { ...(data as object) });
    };

    const Login = async (data: unknown) => {
        return Api.post('auth/login', data);
    };

    const RoutePost = async (route: string, data: unknown) => {
        return Api.post(route, data);
    };

    const RouteGet = async (route: string) => {
        return Api.get(route);
    };

    const RouteDelete = async (route: string) => {
        return Api.get(route);
    };

    return {
        loginWithSocial,
        checkLoggedUser,
        Login,
        RoutePost,
        RouteGet,
        RouteDelete,
    };
};
