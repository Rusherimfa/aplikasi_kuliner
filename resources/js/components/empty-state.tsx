import { UtensilsCrossed } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center animate-in fade-in duration-700 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sky-50 text-sky-500 shadow-sm dark:bg-sky-500/10 dark:text-sky-400">
                {icon || <UtensilsCrossed size={40} strokeWidth={1.5} />}
            </div>
            <h3 className="mb-2 font-['Playfair_Display',serif] text-2xl font-bold text-slate-900 dark:text-white">
                {title}
            </h3>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
}

