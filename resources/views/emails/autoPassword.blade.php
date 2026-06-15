<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Nossa Plataforma</title>
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

        .content p {
            margin: 10px 0;
        }

        .button {
            background-color: #00a5cf;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }

        .logo {
            display: block;
            margin: 0 auto 20px;
            max-width: 100px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://admin.sisgesc.net/favicon.ico" alt="Logotipo" class="logo">
            <h1>Bem-vindo(a) à Nossa Plataforma!</h1>
        </div>
        <div class="content">
            <p>Olá {{ $name }},</p>
            <p>Sua conta foi criada com sucesso. Aqui estão os detalhes da sua conta:</p>
            <p><strong>Email:</strong> {{ $email }}</p>
            <p><strong>Senha:</strong> {{ $password }}</p>
            <p>Por motivos de segurança, recomendamos que você altere sua senha após o primeiro login.</p>
            <a href="https://sisgesc.net/auth" class="button">Acessar Conta</a>
            <p>Se precisar de ajuda ou tiver qualquer dúvida, sinta-se à vontade para entrar em contato conosco.</p>
        </div>
    </div>
</body>

</html>
