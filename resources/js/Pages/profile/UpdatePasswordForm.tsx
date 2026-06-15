import { useRef } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import InputLabel from '@/ui/InputLabel';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { HeaderComponent } from '@/Components/home/Header';
import { User } from '@/types';
import FooterComponent from '@/Components/home/Footer';
import LoadingButtons from '@/ui/loadingButtons';

export default function UpdatePasswordForm({ auth, local }: { auth: { user: User }, local: string }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e: any) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }

                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <div className="min-h-screen flex flex-col mt-20 sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                    <div>
                        <Link href={``}>
                            <img src="https://admin.sisgesc.net/favicon.ico" className='w-20 h-20 rounded-full' alt="SIGESC FAVICON" />
                        </Link>
                    </div>

                    <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">

                        <section >
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                            </header>

                            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="current_password" value="Current Password" />

                                    <input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="New Password" />

                                    <input
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        autoComplete="new-password"
                                    />

                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                                    <input
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        className="mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        autoComplete="new-password"
                                    />

                                </div>
                                <span className='text-red-500'>{errors.password} {errors.current_password}</span>
                                <div className="flex items-center gap-4">
                                    <button type='submit' className='p-2 w-48 flex justify-center text-white rounded' style={{ backgroundColor: 'var(--buttonsColor)' }}>
                                        {processing ? <LoadingButtons /> : 'Save'}
                                    </button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600 ">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
