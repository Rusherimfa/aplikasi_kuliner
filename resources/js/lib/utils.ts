import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function buildAvatarUrl(
    avatar?: string | null,
    updatedAt?: string | null,
): string | undefined {
    if (!avatar) {
        return undefined;
    }

    if (!updatedAt) {
        return avatar;
    }

    const separator = avatar.includes('?') ? '&' : '?';

    return `${avatar}${separator}v=${encodeURIComponent(updatedAt)}`;
}
