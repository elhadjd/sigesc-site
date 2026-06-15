<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à Newsletter do SIGESC TECH</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-collapse: collapse;
        }

        .logo-header {
            background-color: #ffffff;
            padding: 10px;
            text-align: center;
        }

        .content {
            padding: 20px;
            color: #333;
        }

        .footer {
            background-color: #eeeeee;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }

        .button {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
        }
    </style>
</head>

<body>
    <table class="container">
        <tr>
            <td class="logo-header">
                <img src="https://admin.sisgesc.net/favicon.ico" alt="Logo SIGESC TECH" style="max-height: 50px;">
            </td>
        </tr>
        <tr>
            <td class="content">
                <h1>Bem-vindo, {{ $name }}!</h1>
                <p>Obrigado por se inscrever na nossa newsletter. Estamos entusiasmados para compartilhar com você as
                    últimas novidades e atualizações sobre o nosso software de gestão comercial, SIGESC TECH.</p>
                <p>Seu email registrado conosco é: <strong>{{ $email }}</strong></p>
                <p>Para garantir que você não perca nenhuma atualização, confira nossas últimas notícias e mantenha-se
                    informado sobre as novidades mais recentes do setor.</p>
                <a href="https://sisgesc.net" class="button">Confira as Últimas Notícias</a>
            </td>
        </tr>
        <tr>
            <td class="footer">
                Você está recebendo este email porque se inscreveu na nossa newsletter. <br>
                Se você deseja cancelar a subscrição, clique <a href="https://sisgesc.net">aqui</a>.
            </td>
        </tr>
    </table>
</body>

</html>
