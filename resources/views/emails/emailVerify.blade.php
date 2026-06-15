<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boas-Vindas</title>
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
            background-color: #17a2b8;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .footer {
            padding: 20px;
            text-align: center;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://admin.sisgesc.net/favicon.ico" alt="Logo" style="height: 50px;">
        </div>
        <div class="content">
            <h1>Olá, {{ $userName }}!</h1>
            <p>Bem-vindo ao nosso serviço! Estamos muito felizes por ter você conosco.</p>
            <p>Para começar a usar sua conta, por favor confirme seu endereço de email clicando no link abaixo:</p>
            <a href="{{ url('/en/verificar-email/' . $id) }}"
                style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar
                Email</a>
        </div>
        <div class="footer">
            Se precisar de ajuda, não hesite em entrar em contato conosco.
        </div>
    </div>
</body>

</html>
