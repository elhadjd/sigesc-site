<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova candidatura | SIGESC</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:28px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:#0f172a;padding:24px 28px;">
                            <p style="margin:0;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#94a3b8;font-weight:700;">SIGESC · Produtor</p>
                            <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">Nova candidatura</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;font-weight:700;">Vaga</p>
                            <p style="margin:0 0 18px;font-size:17px;line-height:1.4;color:#0f172a;font-weight:700;">
                                <a href="{{ $jobUrl }}" style="color:#0b3d91;text-decoration:none;">{{ $jobTitle }}</a>
                                @if($jobLocation)
                                    <span style="font-weight:500;color:#64748b;"> · {{ $jobLocation }}</span>
                                @endif
                            </p>

                            <p style="margin:0 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;font-weight:700;">Candidato</p>
                            <p style="margin:0 0 4px;font-size:16px;color:#0f172a;font-weight:600;">{{ $candidateName }}</p>
                            <p style="margin:0 0 4px;font-size:14px;color:#334155;">
                                <a href="mailto:{{ $candidateEmail }}" style="color:#0b3d91;">{{ $candidateEmail }}</a>
                            </p>
                            @if($candidatePhone)
                                <p style="margin:0 0 4px;font-size:14px;color:#334155;">{{ $candidatePhone }}</p>
                            @endif
                            @if($linkedinUrl)
                                <p style="margin:0 0 4px;font-size:14px;"><a href="{{ $linkedinUrl }}" style="color:#0b3d91;">LinkedIn</a></p>
                            @endif
                            @if($portfolioUrl)
                                <p style="margin:0 0 16px;font-size:14px;"><a href="{{ $portfolioUrl }}" style="color:#0b3d91;">Portfólio</a></p>
                            @endif

                            <p style="margin:16px 0 8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;font-weight:700;">Carta de apresentação</p>
                            <div style="padding:16px 18px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#334155;white-space:pre-wrap;">{{ $coverLetter }}</div>

                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:22px 0 0;">
                                <tr>
                                    <td style="border-radius:10px;background:#0b3d91;">
                                        <a href="{{ $adminUrl }}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                                            Abrir painel de carreiras
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
