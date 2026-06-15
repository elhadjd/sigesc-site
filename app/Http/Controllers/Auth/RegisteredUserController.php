<?php

namespace App\Http\Controllers\Auth;

use App\classes\UploadImages;
use App\Events\welcomeUserEvent;
use App\Http\Controllers\Controller;
use App\Mail\EmailVerify;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'accountType'=>'required|string',
            'surname'=>"required|string|max:100",
            'providerId'=>"required|string",
            'country'=>"required",
            'name' => 'required|string|max:100',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        DB::transaction(function () use ($request){
            $user = User::create([
                'socialType'=>$request->providerId,
                'name' => $request->name,
                'accountType'=>$request->accountType,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $imageName = "users/images/avatar.png";

            if($request->image != ''){
                $upload = new UploadImages();
                $imageName = $upload->Upload("users/images/$user->id",$request->image);
            }

            $user->userProfile()->create([
                'surname'=>$request->surname,
                'image'=>"/".$imageName,
                'country'=>$request->country['name'],
            ]);

            event(new Registered($user));

            $data = [
                'userName'=>$user->name,
                'id'=>$user->id,
            ];

            Mail::to($user->email)->send(new EmailVerify($data));
            Auth::login($user);
        });

        return $this->RespondSuccess('Conta criada com sucesso',$request->user()->with('userProfile'));
    }
}
