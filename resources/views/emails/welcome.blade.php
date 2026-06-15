<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email de Boas-Vindas</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f0f4f8;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
        }

        .header {
            background-color: #00a5cf;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            color: #00a5cf;
        }

        .footer {
            background-color: #f0f4f8;
            color: #888;
            padding: 10px 20px;
            text-align: center;
            font-size: 14px;
        }

        .button {
            background-color: #00a5cf;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }

        .steps {
            margin-top: 20px;
        }

        .step {
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://admin.sisgesc.net/favicon.ico" alt="Logo SIGESC" style="max-height: 50px;">
            <h1>Bem-vindo(a) ao SIGESC!</h1>
        </div>
        <div class="content">
            <p>Olá, {{ $userName }} !</p>
            <p>Estamos muito felizes por você ter escolhido o SIGESC para gerenciar o seu negócio. Nosso software é
                projetado para simplificar suas operações comerciais, permitindo que você se concentre no que realmente
                importa: crescer o seu negócio.</p>
            <h2>Como começar:</h2>
            <div class="steps">
                <div class="step"><strong>1.</strong> Acesse seu painel de controle : <a
                        href="https://admin.sisgesc.net">aqui</a></div>
                <div class="step"><strong>2.</strong> Explore nossos tutoriais : <a
                        href="https://admin.sisgesc.net">aqui</a></div>
                <div class="step"><strong>3.</strong> Precisa de ajuda? Nosso suporte está aqui para você : <a
                        href="https://www.youtube.com/watch?v=qW3YJAcMDrA&list=PL1QcY7p2a9v33f0hTRC0IA_rA8UvDznwU&index=4">aqui</a>
                </div>
            </div>
            <p>Estamos ansiosos para ver o seu negócio prosperar com o SIGESC.</p>
            <a href="https://admin.sisgesc.net" target="_blank" class="button">Acesse o Painel</a>
        </div>
        <div class="footer">
            Siga-nos em nosso canal youtube: <a href="https://www.youtube.com/@sigescTech">SIGESC-TECH</a> <br>
            Para dúvidas, entre em contato conosco: +19735249725
        </div>
    </div>
</body>

</html>
