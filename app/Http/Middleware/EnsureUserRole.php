<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_if(! $user, 401);

        $allowedRoles = collect($roles)
            ->map(fn (string $role) => UserRole::tryFrom($role))
            ->filter()
            ->values();

        abort_if($allowedRoles->isEmpty(), 403);
        abort_unless($allowedRoles->contains($user->role), 403);

        return $next($request);
    }
}
