<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    public function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Disable exception handling for the test.
     *
     * @return $this
     */
    public function withoutExceptionHandling(array $except = [])
    {
        return parent::withoutExceptionHandling($except);
    }

    /**
     * Restore exception handling for the test.
     *
     * @return $this
     */
    public function withExceptionHandling()
    {
        return parent::withExceptionHandling();
    }
}
