import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type Option = { key: string; label: string; description?: string; hint?: string };

type WifiAuth = 'WPA' | 'WEP' | 'nopass';

function buildPayload(
    contentType: string,
    fields: Record<string, string>,
    wifiAuth: WifiAuth
): string {
    switch (contentType) {
        case 'url':
            return (fields.url || '').trim();
        case 'email': {
            const email = (fields.email || '').trim();
            const subject = encodeURIComponent(fields.emailSubject || '');
            const body = encodeURIComponent(fields.emailBody || '');
            return `mailto:${email}?subject=${subject}&body=${body}`;
        }
        case 'phone':
            return `tel:${(fields.phone || '').trim()}`;
        case 'sms': {
            const phone = (fields.smsPhone || '').trim();
            const body = encodeURIComponent(fields.smsBody || '');
            return `sms:${phone}?body=${body}`;
        }
        case 'wifi': {
            const ssid = (fields.wifiSsid || '').replace(/([\\;,:"])/g, '\\$1');
            const pass = (fields.wifiPassword || '').replace(/([\\;,:"])/g, '\\$1');
            const hidden = fields.wifiHidden === '1' ? 'H:true;' : '';
            if (wifiAuth === 'nopass') {
                return `WIFI:T:nopass;S:${ssid};${hidden};`;
            }
            return `WIFI:T:${wifiAuth};S:${ssid};P:${pass};${hidden};`;
        }
        case 'vcard': {
            const lines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${fields.vcardName || ''}`,
                fields.vcardOrg ? `ORG:${fields.vcardOrg}` : '',
                fields.vcardPhone ? `TEL:${fields.vcardPhone}` : '',
                fields.vcardEmail ? `EMAIL:${fields.vcardEmail}` : '',
                fields.vcardUrl ? `URL:${fields.vcardUrl}` : '',
                'END:VCARD',
            ];
            return lines.filter(Boolean).join('\n');
        }
        case 'text':
        default:
            return fields.text || '';
    }
}

export default function BarcodeQrGeneratorIndex({
    auth,
    seo,
    codeKinds,
    contentTypes,
    barcodeFormats,
    errorLevels,
    disclaimer,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    codeKinds: Option[];
    contentTypes: Option[];
    barcodeFormats: Option[];
    errorLevels: Option[];
    disclaimer: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [kind, setKind] = useState<'qr' | 'barcode'>('qr');
    const [contentType, setContentType] = useState(contentTypes[0]?.key || 'url');
    const [barcodeFormat, setBarcodeFormat] = useState(barcodeFormats[0]?.key || 'CODE128');
    const [errorLevel, setErrorLevel] = useState('H');
    const [fgColor, setFgColor] = useState('#14213d');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(320);
    const [margin, setMargin] = useState(2);
    const [showBarcodeText, setShowBarcodeText] = useState(true);
    const [barcodeValue, setBarcodeValue] = useState('SIGESC12345');
    const [wifiAuth, setWifiAuth] = useState<WifiAuth>('WPA');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoScale, setLogoScale] = useState(22);
    const [error, setError] = useState<string | null>(null);
    const [fields, setFields] = useState<Record<string, string>>({
        url: 'https://www.sisgesc.net',
        text: 'SIGESC — gestão comercial Angola',
        email: 'contacto@empresa.ao',
        emailSubject: 'Pedido de informação',
        emailBody: '',
        phone: '+244900000000',
        smsPhone: '+244900000000',
        smsBody: 'Olá!',
        wifiSsid: 'MinhaRede',
        wifiPassword: '',
        wifiHidden: '0',
        vcardName: 'Nome da Empresa',
        vcardOrg: 'SIGESC',
        vcardPhone: '+244900000000',
        vcardEmail: 'contacto@empresa.ao',
        vcardUrl: 'https://www.sisgesc.net',
    });

    const payload = useMemo(() => {
        if (kind === 'barcode') return barcodeValue;
        return buildPayload(contentType, fields, wifiAuth);
    }, [kind, contentType, fields, wifiAuth, barcodeValue]);

    const setField = (key: string, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const onLogoFile = (file: File | null) => {
        if (!file) {
            setLogoUrl(null);
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Seleccione uma imagem (PNG, JPG, SVG, WebP).');
            return;
        }
        if (file.size > 2_000_000) {
            setError('A imagem deve ter no máximo 2 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setLogoUrl(String(reader.result || ''));
        reader.readAsDataURL(file);
    };

    const drawLogo = (canvas: HTMLCanvasElement, src: string, scalePercent: number) =>
        new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas indisponível'));
                    return;
                }
                const w = canvas.width;
                const h = canvas.height;
                const box = Math.min(w, h) * (Math.min(40, Math.max(10, scalePercent)) / 100);
                const x = (w - box) / 2;
                const y = (h - box) / 2;
                const pad = box * 0.12;
                ctx.fillStyle = bgColor;
                ctx.beginPath();
                const r = box * 0.12;
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + box, y, x + box, y + box, r);
                ctx.arcTo(x + box, y + box, x, y + box, r);
                ctx.arcTo(x, y + box, x, y, r);
                ctx.arcTo(x, y, x + box, y, r);
                ctx.closePath();
                ctx.fill();
                ctx.drawImage(img, x + pad, y + pad, box - pad * 2, box - pad * 2);
                resolve();
            };
            img.onerror = () => reject(new Error('Não foi possível carregar o logotipo'));
            img.src = src;
        });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let cancelled = false;

        const run = async () => {
            setError(null);
            try {
                if (!payload.trim()) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    setError('Introduza o conteúdo do código.');
                    return;
                }

                if (kind === 'qr') {
                    await QRCode.toCanvas(canvas, payload, {
                        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
                        margin,
                        width: size,
                        color: { dark: fgColor, light: bgColor },
                    });
                    if (!cancelled && logoUrl) {
                        await drawLogo(canvas, logoUrl, logoScale);
                    }
                } else {
                    // JsBarcode draws on SVG or canvas; set height via options
                    canvas.width = Math.max(size, 280);
                    canvas.height = Math.round(size * 0.45);
                    JsBarcode(canvas, payload, {
                        format: barcodeFormat,
                        lineColor: fgColor,
                        background: bgColor,
                        displayValue: showBarcodeText,
                        margin,
                        width: 2,
                        height: Math.round(size * 0.28),
                        fontSize: 16,
                    });
                }
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : 'Não foi possível gerar o código. Verifique o formato e o valor.'
                    );
                }
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        kind,
        payload,
        errorLevel,
        fgColor,
        bgColor,
        size,
        margin,
        logoUrl,
        logoScale,
        barcodeFormat,
        showBarcodeText,
    ]);

    const download = (type: 'png' | 'svg') => {
        const canvas = canvasRef.current;
        if (!canvas || error) return;

        if (type === 'png') {
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = kind === 'qr' ? 'qr-code-sigesc.png' : 'codigo-barras-sigesc.png';
            a.click();
            return;
        }

        // SVG export: regenerate for QR; for barcode use JsBarcode SVG
        if (kind === 'qr') {
            void QRCode.toString(payload, {
                type: 'svg',
                errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
                margin,
                width: size,
                color: { dark: fgColor, light: bgColor },
            }).then((svg) => {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'qr-code-sigesc.svg';
                a.click();
                URL.revokeObjectURL(a.href);
            });
        } else {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            try {
                JsBarcode(svg, payload, {
                    format: barcodeFormat,
                    lineColor: fgColor,
                    background: bgColor,
                    displayValue: showBarcodeText,
                    margin,
                    width: 2,
                    height: Math.round(size * 0.28),
                });
                const xml = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([xml], { type: 'image/svg+xml' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'codigo-barras-sigesc.svg';
                a.click();
                URL.revokeObjectURL(a.href);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Falha ao exportar SVG');
            }
        }
    };

    const printCode = () => window.print();

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Gerador de Código de Barras e QR Code Grátis | Com Logotipo"
                />
                <HeaderComponent auth={auth as any} />
                <main className="bg-[#eef2f7] print:bg-white">
                    <section className="relative overflow-hidden border-b border-black/5 print:hidden">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,#b8d4c8,transparent_40%),radial-gradient(circle_at_88%_10%,#c5d4f0,transparent_35%)]" />
                        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]">
                                SIGESC · Gerador gratuito · Sem conta
                            </p>
                            <h1 className="mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl">
                                Gerador de código de barras e QR Code
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-slate-600">
                                Crie QR Codes com logotipo, Wi‑Fi, contactos ou URLs — e códigos de barras EAN /
                                CODE128. Descarregue PNG ou SVG.
                            </p>
                            <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                                <strong>Privacidade:</strong> {disclaimer}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] sm:px-6">
                        <div className="space-y-6 print:hidden">
                            <Panel title="Tipo de código">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {codeKinds.map((k) => (
                                        <button
                                            key={k.key}
                                            type="button"
                                            onClick={() => setKind(k.key as 'qr' | 'barcode')}
                                            className={`rounded-2xl border px-4 py-3 text-left transition ${
                                                kind === k.key
                                                    ? 'border-[#0b3d91] bg-[#0b3d91]/5 text-[#0b3d91]'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <span className="block font-semibold">{k.label}</span>
                                            <span className="mt-1 block text-xs text-slate-500">
                                                {k.description}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </Panel>

                            {kind === 'qr' ? (
                                <>
                                    <Panel title="Conteúdo do QR Code">
                                        <Field label="Tipo de informação">
                                            <select
                                                className="field"
                                                value={contentType}
                                                onChange={(e) => setContentType(e.target.value)}
                                            >
                                                {contentTypes.map((t) => (
                                                    <option key={t.key} value={t.key}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <p className="mt-2 text-xs text-slate-500">
                                            {contentTypes.find((t) => t.key === contentType)?.hint}
                                        </p>
                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            {contentType === 'url' && (
                                                <div className="sm:col-span-2">
                                                    <Field label="URL">
                                                        <input
                                                            className="field"
                                                            value={fields.url}
                                                            onChange={(e) => setField('url', e.target.value)}
                                                            placeholder="https://"
                                                        />
                                                    </Field>
                                                </div>
                                            )}
                                            {contentType === 'text' && (
                                                <div className="sm:col-span-2">
                                                    <Field label="Texto">
                                                        <textarea
                                                            className="field"
                                                            rows={3}
                                                            value={fields.text}
                                                            onChange={(e) => setField('text', e.target.value)}
                                                        />
                                                    </Field>
                                                </div>
                                            )}
                                            {contentType === 'email' && (
                                                <>
                                                    <Field label="Email">
                                                        <input
                                                            className="field"
                                                            type="email"
                                                            value={fields.email}
                                                            onChange={(e) => setField('email', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Assunto">
                                                        <input
                                                            className="field"
                                                            value={fields.emailSubject}
                                                            onChange={(e) =>
                                                                setField('emailSubject', e.target.value)
                                                            }
                                                        />
                                                    </Field>
                                                    <div className="sm:col-span-2">
                                                        <Field label="Mensagem">
                                                            <textarea
                                                                className="field"
                                                                rows={2}
                                                                value={fields.emailBody}
                                                                onChange={(e) =>
                                                                    setField('emailBody', e.target.value)
                                                                }
                                                            />
                                                        </Field>
                                                    </div>
                                                </>
                                            )}
                                            {contentType === 'phone' && (
                                                <Field label="Telefone">
                                                    <input
                                                        className="field"
                                                        value={fields.phone}
                                                        onChange={(e) => setField('phone', e.target.value)}
                                                    />
                                                </Field>
                                            )}
                                            {contentType === 'sms' && (
                                                <>
                                                    <Field label="Número">
                                                        <input
                                                            className="field"
                                                            value={fields.smsPhone}
                                                            onChange={(e) => setField('smsPhone', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Mensagem">
                                                        <input
                                                            className="field"
                                                            value={fields.smsBody}
                                                            onChange={(e) => setField('smsBody', e.target.value)}
                                                        />
                                                    </Field>
                                                </>
                                            )}
                                            {contentType === 'wifi' && (
                                                <>
                                                    <Field label="Nome da rede (SSID)">
                                                        <input
                                                            className="field"
                                                            value={fields.wifiSsid}
                                                            onChange={(e) => setField('wifiSsid', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Segurança">
                                                        <select
                                                            className="field"
                                                            value={wifiAuth}
                                                            onChange={(e) =>
                                                                setWifiAuth(e.target.value as WifiAuth)
                                                            }
                                                        >
                                                            <option value="WPA">WPA / WPA2</option>
                                                            <option value="WEP">WEP</option>
                                                            <option value="nopass">Sem palavra-passe</option>
                                                        </select>
                                                    </Field>
                                                    {wifiAuth !== 'nopass' && (
                                                        <Field label="Palavra-passe">
                                                            <input
                                                                className="field"
                                                                type="password"
                                                                value={fields.wifiPassword}
                                                                onChange={(e) =>
                                                                    setField('wifiPassword', e.target.value)
                                                                }
                                                            />
                                                        </Field>
                                                    )}
                                                    <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={fields.wifiHidden === '1'}
                                                            onChange={(e) =>
                                                                setField('wifiHidden', e.target.checked ? '1' : '0')
                                                            }
                                                        />
                                                        Rede oculta
                                                    </label>
                                                </>
                                            )}
                                            {contentType === 'vcard' && (
                                                <>
                                                    <Field label="Nome">
                                                        <input
                                                            className="field"
                                                            value={fields.vcardName}
                                                            onChange={(e) => setField('vcardName', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Empresa">
                                                        <input
                                                            className="field"
                                                            value={fields.vcardOrg}
                                                            onChange={(e) => setField('vcardOrg', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Telefone">
                                                        <input
                                                            className="field"
                                                            value={fields.vcardPhone}
                                                            onChange={(e) => setField('vcardPhone', e.target.value)}
                                                        />
                                                    </Field>
                                                    <Field label="Email">
                                                        <input
                                                            className="field"
                                                            value={fields.vcardEmail}
                                                            onChange={(e) => setField('vcardEmail', e.target.value)}
                                                        />
                                                    </Field>
                                                    <div className="sm:col-span-2">
                                                        <Field label="Website">
                                                            <input
                                                                className="field"
                                                                value={fields.vcardUrl}
                                                                onChange={(e) => setField('vcardUrl', e.target.value)}
                                                            />
                                                        </Field>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Panel>

                                    <Panel title="Logotipo no centro">
                                        <p className="mb-3 text-sm text-slate-600">
                                            Carregue o logotipo da empresa ou qualquer imagem. Use correção de erro Q
                                            ou H para o QR continuar legível.
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => fileRef.current?.click()}
                                            >
                                                Escolher imagem
                                            </button>
                                            {logoUrl && (
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => {
                                                        setLogoUrl(null);
                                                        if (fileRef.current) fileRef.current.value = '';
                                                    }}
                                                >
                                                    Remover logo
                                                </button>
                                            )}
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => onLogoFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                        {logoUrl && (
                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <Field label={`Tamanho do logo (${logoScale}%)`}>
                                                    <input
                                                        type="range"
                                                        min={12}
                                                        max={32}
                                                        value={logoScale}
                                                        onChange={(e) => setLogoScale(Number(e.target.value))}
                                                        className="w-full"
                                                    />
                                                </Field>
                                                <div className="flex items-end">
                                                    <img
                                                        src={logoUrl}
                                                        alt="Pré-visualização do logotipo"
                                                        className="h-14 w-14 rounded-xl object-contain ring-1 ring-black/10"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Panel>
                                </>
                            ) : (
                                <Panel title="Código de barras">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Field label="Formato">
                                            <select
                                                className="field"
                                                value={barcodeFormat}
                                                onChange={(e) => setBarcodeFormat(e.target.value)}
                                            >
                                                {barcodeFormats.map((f) => (
                                                    <option key={f.key} value={f.key}>
                                                        {f.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={showBarcodeText}
                                                onChange={(e) => setShowBarcodeText(e.target.checked)}
                                            />
                                            Mostrar texto sob o código
                                        </label>
                                        <div className="sm:col-span-2">
                                            <Field label="Valor / dados">
                                                <input
                                                    className="field"
                                                    value={barcodeValue}
                                                    onChange={(e) => setBarcodeValue(e.target.value)}
                                                    placeholder="Ex.: 5901234123457 ou SKU-001"
                                                />
                                            </Field>
                                            <p className="mt-2 text-xs text-slate-500">
                                                {barcodeFormats.find((f) => f.key === barcodeFormat)?.hint}
                                            </p>
                                        </div>
                                    </div>
                                </Panel>
                            )}

                            <Panel title="Aparência">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {kind === 'qr' && (
                                        <Field label="Correção de erro">
                                            <select
                                                className="field"
                                                value={errorLevel}
                                                onChange={(e) => setErrorLevel(e.target.value)}
                                            >
                                                {errorLevels.map((l) => (
                                                    <option key={l.key} value={l.key}>
                                                        {l.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    )}
                                    <Field label={`Tamanho (${size}px)`}>
                                        <input
                                            type="range"
                                            min={180}
                                            max={560}
                                            step={10}
                                            value={size}
                                            onChange={(e) => setSize(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </Field>
                                    <Field label="Cor do código">
                                        <input
                                            type="color"
                                            className="field h-11 p-1"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Cor de fundo">
                                        <input
                                            type="color"
                                            className="field h-11 p-1"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                        />
                                    </Field>
                                    <Field label={`Margem (${margin})`}>
                                        <input
                                            type="range"
                                            min={0}
                                            max={8}
                                            value={margin}
                                            onChange={(e) => setMargin(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </Field>
                                </div>
                            </Panel>

                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={() => download('png')} className="btn-primary">
                                    Descarregar PNG
                                </button>
                                <button type="button" onClick={() => download('svg')} className="btn-secondary">
                                    Descarregar SVG
                                </button>
                                <button type="button" onClick={printCode} className="btn-secondary">
                                    Imprimir
                                </button>
                                <a href="/gerador-de-fatura" className="btn-secondary">
                                    Criar fatura grátis
                                </a>
                            </div>
                        </div>

                        <aside className="lg:sticky lg:top-6 lg:self-start">
                            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b3d91]">
                                    Pré-visualização
                                </p>
                                <h2 className="mt-1 font-serif text-2xl text-[#14213d]">
                                    {kind === 'qr' ? 'QR Code' : 'Código de barras'}
                                </h2>
                                <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5">
                                    <canvas ref={canvasRef} className="max-w-full" />
                                </div>
                                {error && (
                                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                                        {error}
                                    </p>
                                )}
                                <div className="mt-4 break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                                    <span className="font-semibold text-slate-800">Dados:</span> {payload || '—'}
                                </div>
                                <p className="mt-4 text-xs text-slate-500">
                                    Nada é enviado ao servidor. Use a câmara do telemóvel para testar o QR Code.
                                </p>
                            </div>
                        </aside>
                    </section>
                </main>
                <FooterComponent />
                <style>{`
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.7rem 0.9rem; outline: none; background: #fff; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                    .btn-primary { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; background: #0b3d91; color: #fff; padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600; }
                    .btn-primary:hover { background: #093278; }
                    .btn-secondary { display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; background: #fff; color: #0b3d91; padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600; border: 1px solid #c7d2e8; }
                    .btn-secondary:hover { background: #f8fafc; }
                    @media print {
                        header, footer, .print\\:hidden { display: none !important; }
                        canvas { max-width: 100% !important; }
                    }
                `}</style>
            </FormStateProvider>
        </UserLoggedProvider>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-4 font-serif text-xl text-[#14213d]">{title}</h2>
            {children}
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </span>
            {children}
        </label>
    );
}
