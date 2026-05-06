<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        $request = request();

        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            'phone' => ['nullable', 'numeric'],
            'avatar' => ['nullable', 'image'],
        ];

        // Only require password if name or email is being changed and user is authenticated
        $user = $request->user();
        if ($user && ($request->filled('name') && $request->name !== $user->name ||
            $request->filled('email') && $request->email !== $user->email)) {
            $rules['current_password'] = ['required', 'string', 'current_password'];
        } else {
            $rules['current_password'] = ['nullable', 'string'];
        }

        return $rules;
    }

    /**
     * Get the validation messages for profile rules.
     */
    protected function profileMessages(): array
    {
        return [
            'avatar.image' => 'File harus berupa gambar.',
            'current_password.current_password' => 'Kata sandi saat ini tidak valid.',
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['sometimes', 'required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'sometimes',
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
