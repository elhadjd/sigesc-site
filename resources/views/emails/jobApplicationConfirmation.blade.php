<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidatura recebida | SIGESC</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:28px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:#0b3d91;padding:24px 28px;">
                            <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#93c5fd;font-weight:700;">SIGESC · Carreiras</p>
                            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;">Candidatura recebida</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#334155;">
                                Olá {{ $candidateName }},
                            </p>
                            <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#334155;">
                                Recebemos a sua candidatura para <strong>{{ $jobTitle }}</strong>
                                @if($jobLocation) ({{ $jobLocation }})@endif.
                                A equipa SIGESC vai analisar o seu perfil e entrará em contacto se avançarmos para a próxima fase.
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;">
                                <tr>
                                    <td style="border-radius:10px;background:#0b3d91;">
                                        <a href="{{ $jobUrl }}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                                            Ver a vaga
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">
                                Pode ver outras oportunidades em
                                <a href="{{ $careersUrl }}" style="color:#0b3d91;">sisgesc.net/carreiras</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
