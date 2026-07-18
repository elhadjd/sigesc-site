<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resposta do Especialista SIGESC</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(160deg,#0f172a 0%,#1e293b 55%,#0b3d91 140%);padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.35);">
                    <tr>
                        <td style="background:#0b3d91;padding:28px 32px;text-align:left;">
                            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#93c5fd;">SIGESC · Especialista</p>
                            <h1 style="margin:10px 0 0;font-size:28px;line-height:1.25;color:#ffffff;font-weight:700;">A sua resposta está pronta</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#334155;">
                                Olá {{ $askerName }},
                            </p>
                            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">
                                A sua pergunta
                            </p>
                            <p style="margin:0 0 24px;font-size:20px;line-height:1.4;color:#0f172a;">
                                {{ $question }}
                            </p>

                            <div style="margin:0 0 28px;padding:20px 22px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
                                <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#0b3d91;">
                                    Resumo da resposta
                                </p>
                                <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#334155;">
                                    {!! \Illuminate\Support\Str::limit(strip_tags($answerHtml ?? ''), 420, '…') !!}
                                </div>
                            </div>

                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
                                <tr>
                                    <td style="border-radius:12px;background:#0b3d91;">
                                        <a href="{{ $answerUrl }}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                                            Ver resposta completa
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            @if($postUrl)
                                <div style="margin:28px 0;padding:22px;border-radius:16px;background:linear-gradient(135deg,#eff6ff,#f8fafc);border:1px solid #bfdbfe;">
                                    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#1d4ed8;">
                                        Artigo no blog SIGESC
                                    </p>
                                    <p style="margin:0 0 16px;font-size:18px;line-height:1.35;color:#0f172a;">
                                        {{ $postTitle ?: 'Conteúdo preparado a partir da sua pergunta' }}
                                    </p>
                                    <p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#475569;">
                                        @if($postReady)
                                            O artigo já está publicado. Abra o link para ler e partilhar com a sua equipa.
                                        @else
                                            Estamos a finalizar o artigo. Guarde este link — ficará disponível no blog assim que for publicado.
                                        @endif
                                    </p>
                                    <a href="{{ $postUrl }}" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#0b3d91;text-decoration:underline;">
                                        {{ $postUrl }}
                                    </a>
                                </div>
                            @endif

                            <p style="margin:28px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#64748b;">
                                Quer organizar faturação, stock e vendas num só sistema?
                                <a href="{{ $solutionsUrl }}" style="color:#0b3d91;font-weight:700;text-decoration:none;">Experimente o SIGESC</a>
                                no painel <a href="{{ $adminUrl }}" style="color:#0b3d91;font-weight:700;text-decoration:none;">admin.sisgesc.net</a>
                                — software de gestão comercial feito para empresas em Angola.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px 28px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#64748b;">
                            Recebeu este email porque pediu uma resposta em <a href="{{ $siteUrl }}" style="color:#0b3d91;">{{ $siteHost }}</a>.
                            Confirme sempre informação fiscal na AGT e na legislação vigente.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
