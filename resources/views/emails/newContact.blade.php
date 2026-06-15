<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email de Notificação de Contato</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
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
            padding: 10px 20px;
            text-align: center;
        }

        .header img {
            max-height: 50px;
        }

        .content {
            padding: 20px;
        }

        .footer {
            background-color: #f2f6fa85;
            color: #888;
            padding: 10px 20px;
            text-align: center;
            font-size: 14px;
        }

        .info-section {
            margin-bottom: 20px;
        }

        .info-section p {
            margin: 5px 0;
        }

        .bold {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img src="https://admin.sisgesc.net/favicon.ico" alt="Logo">
            <h1>Contacto pelo site</h1>
        </div>
        <div class="content">
            <div class="info-section">
                <h2>Detalhes do Contato</h2>
                <p><span class="bold">Nome:</span> {{ $name }}</p>
                <p><span class="bold">Apelido:</span> {{ $surname }}</p>
                <p><span class="bold">Email:</span> {{ $email }}</p>
                <p><span class="bold">Phone:</span> {{ $phone }}</p>
                <p><span class="bold">Mensagem:</span></p>
                <p>{{ $messages }}</p>
            </div>
        </div>
        <div class="footer">
            Este é um email automático, por favor não responda diretamente. <br>
            Para entrar em contato, use os dados fornecidos acima.
        </div>
    </div>
</body>

</html>
