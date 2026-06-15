export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    socialType:string,
    social_id: string,
    user_profile: UserProfile
}

export interface UserProfile{
    address:string
    country:string,
    id:number,
    image:string,
    phone:string,
    surname:string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
