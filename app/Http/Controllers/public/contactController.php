<?php

namespace App\Http\Controllers\public;

use App\Events\contactFormEvent;
use App\Http\Controllers\Controller;
use App\Http\Controllers\NewsletterController;
use App\Mail\autoPassword;
use App\Mail\EmailVerify;
use App\Models\costumerContact;
use App\Models\User;
use App\Services\Seo\SeoBuilder;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class contactController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request)
    {
        $seo = $this->seo->forContact();
        $prerender = [
            'kicker' => 'Contacto',
            'headline' => 'Fale com a equipa SIGESC',
            'lead' => 'Suporte comercial e técnico para empresas em Angola. Estamos disponíveis para ajudar na implementação do SIGESC.',
            'sections' => [
                [
                    'heading' => 'Contactos',
                    'items' => [
                        'Telefone: +244 929147445',
                        'Email: comercial.sigesc@gmail.com',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista'],
                ['href' => url('/prices'), 'label' => 'Ver preços'],
                ['href' => url('/downloads'), 'label' => 'Downloads'],
            ],
        ];

        return $this->renderPublicPage($request, 'contact/index', [
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function senMessage(Request $request, costumerContact $costumerContact)
    {
        $request->validate([
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'message' => 'required|string|min:20',
            'newsletter' => 'required|boolean',
        ]);

        try {
            DB::transaction(function () use ($request, $costumerContact) {
                $data = [
                    'name' => $request->name,
                    'surname' => $request->surname,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'messages' => $request->message,
                ];

                if ($request->account) {
                    $this->newUser($request);
                }

                if ($request->newsletter) {
                    $newsletter = new NewsletterController;
                    $newsletter->create($request->email, $request->name, $request->surname);
                }

                $costumerContact->create($request->all());

                event(new contactFormEvent($data));
            });

            return redirect()->back()->with('message', 'E-mail enviado com sucesso!');
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors('Erro ao enviar o e-mail, tente novamente mais tarde!');
        }
    }

    public function newUser($data)
    {
        if (! User::where('email', $data->email)->first()) {
            DB::transaction(function () use ($data) {
                $password = Str::random(10);
                $user = User::create([
                    'socialType' => 'sisgesc.net',
                    'name' => $data->name,
                    'accountType' => 'client',
                    'email' => $data->email,
                    'password' => Hash::make($password),
                ]);

                $user->userProfile()->create([
                    'surname' => $data->surname,
                    'country' => 'United State',
                ]);

                $autoPasswordData = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $password,
                ];

                Mail::to($user->email)->send(new autoPassword($autoPasswordData));

                event(new Registered($user));

                $mailData = [
                    'userName' => $user->name,
                    'id' => $user->id,
                ];

                Mail::to($user->email)->send(new EmailVerify($mailData));

                Auth::login($user->fresh());
            });
        }
    }
}
