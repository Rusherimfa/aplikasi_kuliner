import { usePage } from '@inertiajs/react';

export function useTranslations() {
    const { translations } = usePage().props as any;

    const { locale } = usePage().props as any;

    const __ = (key: string, replacements: Record<string, string> = {}) => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach((replacementKey) => {
            translation = translation.replace(`:${replacementKey}`, replacements[replacementKey]);
        });

        return translation;
    };

    return { __, locale };
}
