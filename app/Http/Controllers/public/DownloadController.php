<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\SetupDownload;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function Page(Request $request)
    {
        $checkDownload = SetupDownload::where('ip_client', request()->ip())->where('viewed', false)->exists();
        if ($checkDownload) {
            return redirect()->route('download.thanks');
        }

        $seo = $this->seo->forDownloads();
        $prerender = [
            'kicker' => 'Downloads',
            'headline' => 'Descarregue o SIGESC',
            'lead' => 'Instale o SIGESC Admin e comece a gerir vendas, stock e faturação na sua empresa.',
            'sections' => [
                [
                    'heading' => 'Antes de instalar',
                    'items' => [
                        'Escolha a versão adequada (online ou offline)',
                        'Confirme os requisitos do sistema',
                        'Contacte o suporte se precisar de ajuda na instalação',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/prices'), 'label' => 'Ver planos'],
                ['href' => url('/contact'), 'label' => 'Suporte'],
                ['href' => url('/solutions'), 'label' => 'Soluções'],
            ],
        ];

        return $this->renderPublicPage($request, 'downloads/sigesc-admin', [
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    /**
     * Baixar aplicativo.
     *
     * @param string $appType
     * @param string $appVersion
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\JsonResponse
     */
    public function Download(string $appType, string $appVersion)
    {
        try {
            if (!in_array($appType, ['online', 'offline'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tipo de aplicativo inválido.',
                ], 400);
            }

            $filePath = "sigesc-apps/{$appType}/sigesc-3.0.0.exe";
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Arquivo não encontrado.',
                ], 404);
            }

            SetupDownload::create([
                'ip_client' => request()->ip(),
                'app_type' => $appType,
                'version' => "3.0.0",
                'user_id' => Auth::check() ? Auth::id() : null,
            ]);

            $fullPath = storage_path("app/public/{$filePath}");
            $checksum = hash_file('sha256', $fullPath);

            return response()->download($fullPath, "sigesc-3.0.0.exe", [
                'Content-Type' => \Illuminate\Support\Facades\File::mimeType($fullPath),
                'Content-Disposition' => 'attachment; filename="sigesc-' . "3.0.0" . '.exe"',
                'Content-Length' => filesize($fullPath),
                'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                'Pragma' => 'no-cache',
                'Expires' => '0',
                'X-Checksum' => $checksum,
            ]);
        } catch (\Exception $e) {
            Log::error("Erro ao realizar download: {$e->getMessage()}");

            return response()->json([
                'status' => 'error',
                'message' => 'Não foi possível realizar o download no momento.',
            ], 500);
        }
    }

    // public function Download($local, $appType, $appVersion)
    // {
    //     try {
    //         if (!in_array($appType, ['online', 'offline'])) {
    //             return response()->json([
    //                 'status' => 'error',
    //                 'message' => 'Tipo de aplicativo inválido.',
    //             ], 400);
    //         }

    //         $driveFiles = [
    //             'online' => [
    //                 '3_0_0' => '1qQIAqPuWNfwuG4zqbp-hBEiwlFXOiG8_'
    //             ],
    //             'offline' => [
    //                 '2_0_3' => '1g5-aOgkLc8xPqCfuL_5tfRUU3E5jHeSb',
    //             ]
    //         ];

    //         if (!isset($driveFiles[$appType][$appVersion])) {
    //             return response()->json([
    //                 'status' => 'error',
    //                 'message' => 'Arquivo não encontrado no Google Drive.',
    //             ], 404);
    //         }

    //         $fileId = $driveFiles[$appType][$appVersion];

    //         $googleDriveLink = "https://drive.google.com/drive/folders/1ZzJyjJ0Bdbqj6VZNQ4wossmnCwU0dYFP?usp=sharing";

    //         SetupDownload::create([
    //             'ip_client' => request()->ip(),
    //             'app_type' => $appType,
    //             'version' => $appVersion,
    //             'user_id' => Auth::check() ? Auth::id() : null,
    //         ]);
    //         return redirect()->away($googleDriveLink);
    //     } catch (\Exception $e) {
    //         // Registrar erro
    //         Log::error("Erro ao realizar download: {$e->getMessage()}");

    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Não foi possível realizar o download no momento.',
    //         ], 500);
    //     }
    // }

    public function Thanks(Request $request)
    {
        $checkDownload = SetupDownload::where('ip_client', request()->ip())->where('viewed', false)->exists();
        if ($checkDownload) {
            SetupDownload::where('ip_client', request()->ip())->update([
                'viewed' => true,
            ]);

            $seo = $this->seo->forPage([
                'title' => 'Obrigado pelo download | SIGESC',
                'description' => 'Obrigado por descarregar o SIGESC. Siga as instruções de instalação para começar.',
                'path' => '/downloads/thanks',
            ]);

            return $this->renderPublicPage($request, 'downloads/thanks', [
                'local' => $request->getLocale(),
                'seo' => $seo,
                'prerender' => [
                    'headline' => 'Obrigado pelo download',
                    'lead' => 'O ficheiro do SIGESC está pronto. Siga as instruções de instalação.',
                    'links' => [
                        ['href' => url('/contact'), 'label' => 'Precisa de ajuda?'],
                        ['href' => url('/blog/posts'), 'label' => 'Ler o blog'],
                    ],
                ],
            ]);
        }

        return redirect()->route('download-page');
    }
}
