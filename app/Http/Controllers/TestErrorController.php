<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TestErrorController extends Controller
{
    public function preview($status)
    {
        return Inertia::render('errors/error', [
            'status' => (int) $status,
        ]);
    }
}
