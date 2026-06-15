<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-C4R6W7PSK6"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-C4R6W7PSK6');
    </script>

    <meta charset="utf-8">
    <meta name="generator" content="SIGESC">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="https://admin.sisgesc.net/favicon.ico" type="image/x-icon">
    <meta name="keywords"
        content="openerp, código aberto, odoo, negócios, aplicativos, saas, nuvem, insider, erp, software empresarial, software de gestão, PDV avançado, controle financeiro, gestão de estoque, gestão de compras, pequenas e médias empresas, eficiência empresarial" />
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="SIGESC">
    <link rel="canonical" href="https://www.sisgesc.net" />
    <meta property="og:url" content="https://www.sisgesc.net">
    <meta property="og:title" content="Software de gestão comercial" />
    <meta property="og:image" content="https://admin.sisgesc.net/favicon.ico" />
    <meta name="description"
        content="O SIGESC é o software de gestão comercial completo para pequenas e médias empresas. Gerencie PDV, estoque, finanças e compras em uma única plataforma. Simplifique seus processos e impulsione seu negócio com eficiência e inovação.">

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SIGESC - Software de Gestão Integrado",
        "description": "O SIGESC é um software de gestão completo para pequenas e médias empresas, oferecendo PDV, controle financeiro, estoque e compras em uma única plataforma.",
        "url": "https://www.sisgesc.net",
        "logo": "https://admin.sisgesc.net/favicon.ico",
        "image": "https://admin.sisgesc.net/logo.png",
        "applicationCategory": "BusinessApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BRL"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SIGESC",
            "url": "https://www.sisgesc.net"
        }
    }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <title>SIGESC - Software de Gestão Integrado para Empresas</title>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
