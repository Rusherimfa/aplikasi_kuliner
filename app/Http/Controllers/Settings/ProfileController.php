<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $previousAvatarPath = $user->avatar;
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = '/storage/'.$path;

            $this->deleteStoredAvatar($previousAvatarPath);
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    protected function deleteStoredAvatar(?string $avatarPath): void
    {
        $relativeAvatarPath = $this->extractLocalAvatarPath($avatarPath);

        if ($relativeAvatarPath === null) {
            return;
        }

        Storage::disk('public')->delete($relativeAvatarPath);
    }

    protected function extractLocalAvatarPath(?string $avatarPath): ?string
    {
        if (! is_string($avatarPath) || $avatarPath === '') {
            return null;
        }

        $path = parse_url($avatarPath, PHP_URL_PATH);
        $host = parse_url($avatarPath, PHP_URL_HOST);

        if (! is_string($path) || ! str_starts_with($path, '/storage/avatars/')) {
            return null;
        }

        $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);
        $localHosts = array_filter([
            $appHost,
            'localhost',
            '127.0.0.1',
        ]);

        if ($host !== null && ! in_array($host, $localHosts, true)) {
            return null;
        }

        return ltrim(str_replace('/storage/', '', $path), '/');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
