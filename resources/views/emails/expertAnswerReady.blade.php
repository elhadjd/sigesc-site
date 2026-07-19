<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resposta do Especialista SIGESC</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:28px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:#0b3d91;padding:24px 28px;">
                            <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#93c5fd;font-weight:700;">SIGESC · Especialista</p>
                            <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;">A sua resposta está pronta</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#334155;">
                                Olá {{ $askerName }},
                            </p>

                            <p style="margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;font-weight:700;">
                                A sua pergunta
                            </p>
                            <p style="margin:0 0 22px;font-size:17px;line-height:1.45;color:#0f172a;font-weight:600;">
                                {{ $questionText }}
                            </p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 22px;">
                                <tr>
                                    <td style="padding:18px 20px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                                        <p style="margin:0 0 10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#0b3d91;font-weight:700;">
                                            Resposta completa
                                        </p>
                                        <div style="margin:0;font-size:15px;line-height:1.65;color:#334155;">
                                            {!! $answerHtml !!}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
                                <tr>
                                    <td style="border-radius:10px;background:#0b3d91;">
                                        <a href="{{ $answerUrl }}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                                            Abrir no site SIGESC
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            @if($postUrl)
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;">
                                    <tr>
                                        <td style="padding:18px 20px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;">
                                            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#1d4ed8;font-weight:700;">
                                                Artigo no blog
                                            </p>
                                            <p style="margin:0 0 10px;font-size:16px;line-height:1.4;color:#0f172a;font-weight:700;">
                                                {{ $postTitle ?: 'Artigo preparado a partir da sua pergunta' }}
                                            </p>
                                            <p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#475569;">
                                                @if($postReady)
                                                    Já está publicado — abra o link para ler e partilhar.
                                                @else
                                                    Estamos a finalizar a publicação. Guarde o link abaixo.
                                                @endif
                                            </p>
                                            <a href="{{ $postUrl }}" style="font-size:14px;font-weight:700;color:#0b3d91;text-decoration:underline;word-break:break-all;">
                                                {{ $postUrl }}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#64748b;">
                                Quer organizar faturação, stock e vendas num só sistema?
                                <a href="{{ $solutionsUrl }}" style="color:#0b3d91;font-weight:700;text-decoration:none;">Experimente o SIGESC</a>
                                em <a href="{{ $adminUrl }}" style="color:#0b3d91;font-weight:700;text-decoration:none;">admin.sisgesc.net</a>.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:18px 28px 24px;background:#f1f5f9;font-size:12px;line-height:1.5;color:#64748b;">
                            Recebeu este email porque pediu uma resposta em
                            <a href="{{ $siteUrl }}" style="color:#0b3d91;text-decoration:none;">{{ $siteHost }}</a>.
                            Confirme sempre informação fiscal na AGT e na legislação vigente.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
