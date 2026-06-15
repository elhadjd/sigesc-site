import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import InputLabel from '@/ui/InputLabel'
import LoadingButtons from '@/ui/loadingButtons'
import { Head, Link, useForm } from '@inertiajs/react'
import React, { useEffect } from 'react'

export default function ResetPassword(props: { auth: { user: User }, token: string, email: string, local: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: props.token,
        email: props.email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e: any) => {
        e.preventDefault();
        post(route('password.store'));
    };
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <div className="min-h-screen mt-20 flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                    <div>
                        <Link href={`/${props.local}`}>
                            <img src="https://admin.sisgesc.net/favicon.ico" className='w-20 h-20 rounded-full' alt="SIGESC FAVICON" />
                        </Link>
                    </div>

                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">

                        <Head title="Reset Password" />

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />

                            </div>

                            <span className='text-red-600'>{`${errors.email ? errors.email : ''} ${errors.password ? errors.password : ''}`}</span>

                            <div className="flex items-center justify-end mt-4">
                                <button className="ms-4">
                                    {processing ? <LoadingButtons /> : 'Reset Password'}
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
