<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Producer / HR notification email
    |--------------------------------------------------------------------------
    |
    | Applications are emailed to the candidate and to this address (the
    | SIGESC producer / commercial inbox).
    |
    */
    'notify_email' => env(
        'SIGESC_CAREERS_NOTIFY_EMAIL',
        env('SIGESC_CHAT_NOTIFY_EMAIL', 'comercial.sigesc@gmail.com')
    ),

    'statuses' => ['open', 'paused', 'closed'],

    'employment_types' => [
        'full_time' => 'Tempo inteiro',
        'part_time' => 'Tempo parcial',
        'contract' => 'Contrato',
        'internship' => 'Estágio',
        'freelance' => 'Freelance',
    ],

    'work_modes' => [
        'onsite' => 'Presencial',
        'hybrid' => 'Híbrido',
        'remote' => 'Remoto',
    ],

];
