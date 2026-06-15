import { AxiosInstance } from 'axios';
import ziggyRoute from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
        Pusher: any,
        Echo:any
    }

    var route: typeof ziggyRoute;
}
