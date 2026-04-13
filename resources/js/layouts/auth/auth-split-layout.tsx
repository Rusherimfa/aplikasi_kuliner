import { Link, usePage } from '@inertiajs/react';
import { ChefHat } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative min-h-dvh w-full flex items-center justify-center selection:bg-orange-500/30 selection:text-orange-200 bg-background transition-colors duration-500">
            {/* Full Screen Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                    alt="Premium Restaurant Atmosphere"
                    className="h-full w-full object-cover grayscale-[0.2] opacity-60"
                />
                {/* Gradient Overlays for readability - Theme Aware */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md px-4 py-12 sm:px-0">
                {/* Brand Logo - Centered Above Form */}
                <div className="mb-8 flex flex-col items-center justify-center">
                    <Link
                        href={home()}
                        className="group flex flex-col items-center gap-4 transition-transform hover:scale-105"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-700 shadow-xl shadow-orange-900/30 ring-1 ring-white/20 transition-all group-hover:shadow-orange-500/30">
                            <ChefHat size={32} className="text-white drop-shadow-md" />
                        </div>
                        <h2 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-widest text-foreground drop-shadow-lg">
                            {name || 'RESTOWEB'}
                        </h2>
                    </Link>
                </div>

                {/* Glassmorphism Form Card */}
                <div className="overflow-hidden rounded-3xl border border-border/40 bg-card/40 p-8 shadow-2xl backdrop-blur-xl sm:p-10 relative">
                    
                    {/* Subtle inner highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent"></div>

                    {/* Header */}
                    <div className="mb-8 text-center space-y-2">
                        <h1 className="font-['Playfair_Display',serif] text-2xl font-semibold text-foreground tracking-wide">
                            {title}
                        </h1>
                        <p className="text-sm font-light tracking-wide text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* Form Container (Children) */}
                    <div className="w-full text-foreground">
                        {children}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="font-['Playfair_Display',serif] text-sm italic text-muted-foreground/60 drop-shadow-md">
                        "Holistic dining experience for the senses."
                    </p>
                </div>
            </div>
        </div>
    );
}
