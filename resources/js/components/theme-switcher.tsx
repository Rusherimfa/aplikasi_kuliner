import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';

export function ThemeSwitcher() {
    const { appearance, updateAppearance } = useAppearance();
    const { __ } = useTranslations();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="group h-9 w-9">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 opacity-80 group-hover:opacity-100" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 opacity-80 group-hover:opacity-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                    onClick={() => updateAppearance('light')}
                    className={cn('cursor-pointer', appearance === 'light' && 'bg-accent')}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>{__('Light')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => updateAppearance('dark')}
                    className={cn('cursor-pointer', appearance === 'dark' && 'bg-accent')}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>{__('Dark')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => updateAppearance('system')}
                    className={cn('cursor-pointer', appearance === 'system' && 'bg-accent')}
                >
                    <span className="ml-6">{__('System')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
