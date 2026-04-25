import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import localeHelper from '@/routes/locale';

export function LanguageSwitcher() {
    const { props } = usePage();
    const { locale } = props as any;

    const locales = [
        { id: 'en', name: 'English (US)' },
        { id: 'id', name: 'Bahasa Indonesia' },
    ];

    const switchLocale = (newLocale: string) => {
        router.post(localeHelper.update.url(), { locale: newLocale });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="group h-9 w-9">
                    <Languages className="size-5! opacity-80 group-hover:opacity-100" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {locales.map((l) => (
                    <DropdownMenuItem
                        key={l.id}
                        onClick={() => switchLocale(l.id)}
                        className={cn(
                            'cursor-pointer',
                            locale === l.id && 'bg-accent text-accent-foreground'
                        )}
                    >
                        {l.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
