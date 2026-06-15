<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Conversa - SIGESC TECH</title>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f0f4f8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; }
        .header { background-color: #0056b3; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f0f4f8; color: #888; padding: 20px; text-align: center; font-size: 14px; }
        .conversation-start { background-color: #f9f9f9; padding: 15px; margin-top: 20px; border-radius: 8px; }
        .conversation-start p { margin: 0; padding: 10px 0; }
        .start-btn { background-color: #28a745; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bem-vindo à SIGESC TECH</h1>
        </div>
        <div class="content">
            <h2>Inicie uma Conversa</h2>
            <p>Estamos aqui para ajudar. Inicie uma conversa conosco para tirar suas dúvidas ou para suporte técnico.</p>
            <div class="conversation-start">
                <p>Para começar, clique no botão abaixo e diga-nos como podemos ajudar você hoje.</p>
                <a href={{ url('/en/?session=' . $session) }} class="start-btn">Iniciar Conversa</a>
            </div>
        </div>
        <div class="footer">
            SIGESC TECH - Compromisso com a Excelência
        </div>
    </div>
</body>
</html>
