import FooterComponent from "@/Components/home/Footer";
import { HeaderComponent } from "@/Components/home/Header";
import { routeApi } from "@/axiosConfig";
import { UserLoggedProvider } from "@/contexts/loggedUser";
import { FormStateProvider } from "@/contexts/stateForm";
import { User } from "@/types";
import { Link, router } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function VerifyEmail({ status, local, auth }: { status: string, local: string, auth: { user: User } }) {

    const submit = async (e: any) => {
        e.preventDefault();
        router.get(`/notify-user-to-verify-email/${auth.user.id}`)
    };

    async function logout() {
        router.get(`/authenticate/logout`);
    }

    useEffect(() => {
        window.Echo.private(`user.email.verified.${auth.user.id}`)
            .listen('.email.verified', (e: any) => {
                toast.success('Email verified successfully', { position: 'top-right' })
                router.get(`/`)
            })
    }, [])

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />

                <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>

                        <div className="mt-4 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            <div className="mb-4 text-sm text-gray-600">
                                Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                                link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                            </div>

                            {status === 'verification-link-sent' && (
                                <div className="mb-4 font-medium text-sm text-green-600">
                                    A new verification link has been sent to the email address you provided during registration.
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={submit}>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        disabled={false}
                                    >
                                        Resend Verification Email
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <a href="#"
                                        onClick={logout}
                                        className="underline cursor-pointer text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Log Out
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
