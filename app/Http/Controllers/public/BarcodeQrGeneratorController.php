<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class BarcodeQrGeneratorController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        $codeKinds = $this->codeKinds();
        $contentTypes = $this->contentTypes();
        $barcodeFormats = $this->barcodeFormats();
        $errorLevels = $this->errorLevels();

        return $this->renderPublicPage(
            $request,
            'barcode-qr-generator/index',
            [
                'seo' => $this->seo->forBarcodeQrGenerator(),
                'prerender' => $this->content->barcodeQrGenerator(),
                'codeKinds' => $codeKinds,
                'contentTypes' => $contentTypes,
                'barcodeFormats' => $barcodeFormats,
                'errorLevels' => $errorLevels,
                'disclaimer' => 'Os códigos gerados neste ferramenta gratuita NÃO são guardados em nenhum servidor. O conteúdo, o logotipo e as imagens ficam apenas no seu navegador. Descarregue PNG/SVG antes de sair.',
            ],
            'seo.barcode-qr-generator',
            [
                'codeKinds' => $codeKinds,
                'contentTypes' => $contentTypes,
                'barcodeFormats' => $barcodeFormats,
                'errorLevels' => $errorLevels,
            ]
        );
    }

    /**
     * @return list<array{key: string, label: string, description: string}>
     */
    protected function codeKinds(): array
    {
        return [
            ['key' => 'qr', 'label' => 'QR Code', 'description' => 'Ideal para URL, Wi‑Fi, contacto e texto'],
            ['key' => 'barcode', 'label' => 'Código de barras', 'description' => 'EAN, CODE128, CODE39 e outros formatos 1D'],
        ];
    }

    /**
     * @return list<array{key: string, label: string, hint: string}>
     */
    protected function contentTypes(): array
    {
        return [
            ['key' => 'url', 'label' => 'URL / Link', 'hint' => 'Abrir um site, loja ou catálogo'],
            ['key' => 'text', 'label' => 'Texto livre', 'hint' => 'Qualquer mensagem ou referência'],
            ['key' => 'email', 'label' => 'Email', 'hint' => 'Abrir o cliente de email'],
            ['key' => 'phone', 'label' => 'Telefone', 'hint' => 'Ligar ao número indicado'],
            ['key' => 'sms', 'label' => 'SMS', 'hint' => 'Enviar mensagem pré-preenchida'],
            ['key' => 'wifi', 'label' => 'Wi‑Fi', 'hint' => 'Ligar à rede sem escrever a palavra-passe'],
            ['key' => 'vcard', 'label' => 'Contacto (vCard)', 'hint' => 'Guardar nome, telefone e email'],
        ];
    }

    /**
     * @return list<array{key: string, label: string, hint: string}>
     */
    protected function barcodeFormats(): array
    {
        return [
            ['key' => 'CODE128', 'label' => 'CODE128', 'hint' => 'Texto e números (mais versátil)'],
            ['key' => 'CODE39', 'label' => 'CODE39', 'hint' => 'Letras maiúsculas e números'],
            ['key' => 'EAN13', 'label' => 'EAN-13', 'hint' => '13 dígitos (produtos / retalho)'],
            ['key' => 'EAN8', 'label' => 'EAN-8', 'hint' => '8 dígitos'],
            ['key' => 'UPC', 'label' => 'UPC-A', 'hint' => '12 dígitos'],
            ['key' => 'ITF14', 'label' => 'ITF-14', 'hint' => '14 dígitos (caixas / logística)'],
            ['key' => 'MSI', 'label' => 'MSI', 'hint' => 'Inventário (só números)'],
            ['key' => 'pharmacode', 'label' => 'Pharmacode', 'hint' => 'Código farmacêutico'],
        ];
    }

    /**
     * @return list<array{key: string, label: string}>
     */
    protected function errorLevels(): array
    {
        return [
            ['key' => 'L', 'label' => 'L (~7%) — mais dados, menos robusto'],
            ['key' => 'M', 'label' => 'M (~15%) — equilibrado'],
            ['key' => 'Q', 'label' => 'Q (~25%) — bom com logotipo'],
            ['key' => 'H', 'label' => 'H (~30%) — máximo (recomendado com logo)'],
        ];
    }
}
