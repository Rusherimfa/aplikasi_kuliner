<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        // We access ->value since role was casted to App\Enums\Role
        $userRole = Auth::user()->role?->value ?? 'customer';

        // Let admin access any route inside roles unless explicitly prevented (optional design choice, here we enforce strict match or admin override)
        if ($userRole === 'admin') {
            return $next($request);
        }

        if (! in_array($userRole, $roles)) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
