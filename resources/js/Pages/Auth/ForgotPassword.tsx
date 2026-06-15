import FooterComponent from '@/Components/home/Footer';
import { HeaderComponent } from '@/Components/home/Header';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react'

export default function ForgotPassword(props: { local: string, auth: { user: User }, status: boolean }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const submit = (e: any) => {
        e.preventDefault();
        post(route('password.email', props.local));
    };
    window.Echo.private(`resetPassword.${data.email}`)
        .listen('.password.reset', (e: any) => {
            console.log(e);
        })
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                    <div>
                        <Link href={`/${props.local}`}>
                            <img src="https://admin.sisgesc.net/favicon.ico" className='w-20 h-20 rounded-full' alt="SIGESC FAVICON" />
                        </Link>
                    </div>

                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                        <Head title="Forgot Password" />

                        <div className="mb-4 text-sm text-gray-600">
                            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </div>

                        {props.status && <div className="mb-4 font-medium text-sm text-green-600">{props.status}</div>}
                        <span className='text-red-500'>{errors.email}</span>
                        {errors.email != null && <Link href={`/${props.local}/auth`} className='underline ' style={{ color: 'var(--buttonsColor)' }}> Create a new account</Link>}

                        <form onSubmit={submit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    disabled={processing}
                                >
                                    Email Password Reset Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>

    )
}
