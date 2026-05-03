<?php

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Laravel\Fortify\Features;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function skipUnlessFortifyHas(string $feature, ?string $message = null): void
{
    if (! Features::enabled($feature)) {
        test()->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
    }
}

function flushSession(): void
{
    test()->flushSession();
}

/**
 * Set the currently logged in user for the application.
 *
 * @param  Authenticatable|User  $user
 * @param  string|null  $guard
 * @return TestCase
 */
function actingAs($user, $guard = null)
{
    return test()->actingAs($user, $guard);
}

/**
 * Visit the given URI with a GET request.
 *
 * @return TestResponse
 */
function get(string $uri, array $headers = [])
{
    return test()->get($uri, $headers);
}

/**
 * Visit the given URI with a POST request.
 *
 * @return TestResponse
 */
function post(string $uri, array $data = [], array $headers = [])
{
    return test()->post($uri, $data, $headers);
}

/**
 * Visit the given URI with a PUT request.
 *
 * @return TestResponse
 */
function put(string $uri, array $data = [], array $headers = [])
{
    return test()->put($uri, $data, $headers);
}

/**
 * Visit the given URI with a PATCH request.
 *
 * @return TestResponse
 */
function patch(string $uri, array $data = [], array $headers = [])
{
    return test()->patch($uri, $data, $headers);
}

/**
 * Visit the given URI with a DELETE request.
 *
 * @return TestResponse
 */
function delete(string $uri, array $data = [], array $headers = [])
{
    return test()->delete($uri, $data, $headers);
}

/**
 * Visit the given URI with a GET request, expecting a JSON response.
 *
 * @return TestResponse
 */
function getJson(string $uri, array $headers = [])
{
    return test()->getJson($uri, $headers);
}

/**
 * Visit the given URI with a POST request, expecting a JSON response.
 *
 * @return TestResponse
 */
function postJson(string $uri, array $data = [], array $headers = [])
{
    return test()->postJson($uri, $data, $headers);
}

/**
 * Set the "from" address for the next request.
 *
 * @return TestCase
 */
function from(string $url)
{
    return test()->from($url);
}

/**
 * Assert that the user is authenticated.
 *
 * @param  string|null  $guard
 * @return TestCase
 */
function assertAuthenticated($guard = null)
{
    return test()->assertAuthenticated($guard);
}

/**
 * Assert that the given user is authenticated.
 *
 * @param  Authenticatable  $user
 * @param  string|null  $guard
 * @return TestCase
 */
function assertAuthenticatedAs($user, $guard = null)
{
    return test()->assertAuthenticatedAs($user, $guard);
}

/**
 * Assert that the user is not authenticated.
 *
 * @param  string|null  $guard
 * @return TestCase
 */
function assertGuest($guard = null)
{
    return test()->assertGuest($guard);
}

/**
 * Disable exception handling for the test.
 *
 * @return TestCase
 */
function withoutExceptionHandling(array $except = [])
{
    return test()->withoutExceptionHandling($except);
}

/**
 * Restore exception handling for the test.
 *
 * @return TestCase
 */
function withExceptionHandling()
{
    return test()->withExceptionHandling();
}
