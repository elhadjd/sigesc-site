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
     * @return array<string, mixed>
     */
    protected function planPayload(): array
    {
        $cfg = config('sigesc.partnership', []);
        $price = (int) ($cfg['monthly_price'] ?? 40000);
        $label = (string) ($cfg['currency_label'] ?? 'Kz');
        $freelancer = is_array($cfg['freelancer'] ?? null) ? $cfg['freelancer'] : [];
        $commission = (int) ($freelancer['commission_percent'] ?? 30);

        return [
            'monthly_price' => $price,
            'currency' => (string) ($cfg['currency'] ?? 'AOA'),
            'currency_label' => $label,
            'price_formatted' => number_format($price, 0, ',', '.').' '.$label,
            'offline_licenses_limited' => (bool) ($cfg['offline_licenses_limited'] ?? false),
            'offline_licenses_note' => (string) ($cfg['offline_licenses_note'] ?? 'Licenças ilimitadas'),
            'contact_url' => url($cfg['contact_path'] ?? '/contact'),
            'register_url' => url($cfg['register_path'] ?? '/auth/register'),
            'admin_url' => (string) config('sigesc.admin_url'),
            'agt_cert' => (string) config('sigesc.agt_certification.number', 'FE/323/AGT/2026'),
            'freelancer' => [
                'enabled' => (bool) ($freelancer['enabled'] ?? true),
                'commission_percent' => $commission,
                'commission_formatted' => $commission.'%',
                'label' => (string) ($freelancer['label'] ?? 'Freelancer'),
                'summary' => (string) ($freelancer['summary'] ?? 'Indique o SIGESC a clientes e ganhe comissão sobre as vendas fechadas.'),
            ],
        ];
    }
}
