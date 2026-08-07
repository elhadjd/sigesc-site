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

    /*
    |--------------------------------------------------------------------------
    | Programa de Parceria
    |--------------------------------------------------------------------------
    | - Partner: mensalidade com licenças ilimitadas
    | - Freelancer: indicação de clientes com comissão
    */
    'partnership' => [
        'monthly_price' => (int) env('SIGESC_PARTNER_MONTHLY_PRICE', 40000),
        'currency' => 'AOA',
        'currency_label' => 'Kz',
        'billing_period' => 'P1M',
        'offline_licenses_limited' => false,
        'offline_licenses_note' => 'Licenças ilimitadas para a versão offline e cloud',
        'contact_path' => '/contact',
        'register_path' => '/auth/register',
        'freelancer' => [
            'enabled' => true,
            'commission_percent' => (int) env('SIGESC_FREELANCER_COMMISSION', 30),
            'label' => 'Freelancer',
            'summary' => 'Indique o SIGESC a clientes e ganhe comissão sobre as vendas fechadas.',
        ],
    ],

];
