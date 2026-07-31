<?php

/**
 * Domínios oficiais SIGESC.
 * Site público / marketing: sisgesc.net (nunca "sigesc.net").
 * Painel / trial / clientes: admin.sisgesc.net
 */
return [

    'site_host' => 'sisgesc.net',

    // Canonical público sem www (www.sisgesc.net pode não resolver / redirecionar mal).
    'site_url' => rtrim(env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/'),

    'admin_url' => rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/'),

    'getting_started_url' => rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/').'/getting-started',

    'admin_login_url' => rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/').'/auth/login',

    'logo_url' => rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/').'/logo.png',

    'favicon_url' => rtrim(env('SIGESC_ADMIN_URL', 'https://admin.sisgesc.net'), '/').'/favicon.ico',

    /*
    |--------------------------------------------------------------------------
    | Certificação AGT (faturação eletrónica)
    |--------------------------------------------------------------------------
    */
    'agt_certification' => [
        'number' => env('SIGESC_AGT_CERT_NUMBER', 'FE/323/AGT/2026'),
        'label' => env('SIGESC_AGT_CERT_LABEL', 'Software certificado AGT'),
        'authority' => 'AGT',
        'year' => 2026,
    ],

];
