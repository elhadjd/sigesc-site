<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class PartnershipController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        $plan = $this->planPayload();

        return $this->renderPublicPage(
            $request,
            'partnership/index',
            [
                'seo' => $this->seo->forPartnership(),
                'prerender' => $this->content->partnership(),
                'plan' => $plan,
            ],
            'seo.partnership',
            [
                'plan' => $plan,
            ]
        );
    }

    /**
     * @return array{
     *     monthly_price: int,
     *     currency: string,
     *     currency_label: string,
     *     price_formatted: string,
     *     offline_licenses_limited: bool,
     *     offline_licenses_note: string,
     *     contact_url: string,
     *     register_url: string,
     *     admin_url: string,
     *     agt_cert: string
     * }
     */
    protected function planPayload(): array
    {
        $cfg = config('sigesc.partnership', []);
        $price = (int) ($cfg['monthly_price'] ?? 30000);
        $label = (string) ($cfg['currency_label'] ?? 'Kz');

        return [
            'monthly_price' => $price,
            'currency' => (string) ($cfg['currency'] ?? 'AOA'),
            'currency_label' => $label,
            'price_formatted' => number_format($price, 0, ',', '.').' '.$label,
            'offline_licenses_limited' => (bool) ($cfg['offline_licenses_limited'] ?? true),
            'offline_licenses_note' => (string) ($cfg['offline_licenses_note'] ?? 'Licenças limitadas para a versão offline'),
            'contact_url' => url($cfg['contact_path'] ?? '/contact'),
            'register_url' => url($cfg['register_path'] ?? '/auth/register'),
            'admin_url' => (string) config('sigesc.admin_url'),
            'agt_cert' => (string) config('sigesc.agt_certification.number', 'FE/323/AGT/2026'),
        ];
    }
}
