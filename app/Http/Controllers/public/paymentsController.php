<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class paymentsController extends Controller
{
    function index($email = null, $fiscalIdentification = null)
    {
        return Inertia::render(
            'payments/index',
            [
                'email' => $email,
                'fiscalIdentification' => $fiscalIdentification
            ]
        );
    }
}
