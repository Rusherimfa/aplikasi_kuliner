<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $locale = app()->getLocale();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'notifications' => [
                    'unreadCount' => $user ? $user->unreadNotifications()->count() : 0,
                ],
            ],
            'locale' => $locale,
            'translations' => $this->getTranslations($locale),
            'sidebarOpen' => true,
            'currentTeam' => fn () => $user?->currentTeam ? $user->toUserTeam($user->currentTeam) : null,
            'teams' => fn () => $user?->toUserTeams(includeCurrent: true) ?? [],
            'flash' => [
                'status' => $request->session()->get('status'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'config' => [
                'resto_lat' => env('RESTO_LAT', -6.1754),
                'resto_lng' => env('RESTO_LNG', 106.8272),
                'delivery_fee_per_km' => env('DELIVERY_FEE_PER_KM', 5000),
            ],
        ];
    }

    protected function getTranslations(string $locale): array
    {
        $path = base_path("lang/{$locale}.json");

        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true);
        }

        return [];
    }
}
