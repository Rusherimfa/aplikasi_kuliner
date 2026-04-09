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
        <div className="relative grid h-dvh flex-col items-center justify-center bg-[#0A0A0B] selection:bg-amber-500/30 selection:text-amber-200 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Side: Image Banner */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop"
                        alt="RestoWeb Premium Interior"
                        className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/80 via-[#0A0A0B]/40 to-transparent"></div>
                </div>

                {/* Logo Area */}
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-xl font-['Playfair_Display',serif] font-bold text-white transition-opacity hover:opacity-80"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-900/20">
                        <ChefHat size={20} className="text-white" />
                    </div>
                    {name || 'RestoWeb'}
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="font-['Playfair_Display',serif] text-3xl font-medium leading-relaxed italic text-white/90">
                            "Makan malam bukan sekadar tentang kebutuhan gizi, melainkan perjalanan holistik yang memanjakan seluruh pancaindra."
                        </p>
                        <footer className="text-sm font-medium tracking-widest text-amber-500 uppercase">
                            — RestoWeb Philosophy
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side: Form Content */}
            <div className="flex w-full items-center justify-center lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px] rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl lg:bg-transparent lg:border-none lg:shadow-none lg:p-0">
                    
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="relative z-20 flex flex-col items-center justify-center gap-3 lg:hidden"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-900/40">
                            <ChefHat size={28} className="text-white" />
                        </div>
                        <span className="font-['Playfair_Display',serif] text-2xl font-bold text-white">
                            {name || 'RestoWeb'}
                        </span>
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-white">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-white/60">
                            {description}
                        </p>
                    </div>

                    {/* Form Container (Children) */}
                    <div className="w-full text-slate-300 [&_label]:text-white/80 [&_input]:border-white/10 [&_input]:bg-white/5 [&_input]:text-white focus:[&_input]:border-amber-500/50 focus:[&_input]:ring-amber-500/50 [&_button[type=submit]]:rounded-full [&_button[type=submit]]:bg-gradient-to-r [&_button[type=submit]]:from-amber-500 [&_button[type=submit]]:to-amber-700 [&_button[type=submit]]:font-semibold [&_button[type=submit]]:text-white [&_button[type=submit]]:shadow-xl [&_button[type=submit]]:shadow-amber-900/40 hover:[&_button[type=submit]]:scale-[1.02] hover:[&_button[type=submit]]:from-amber-400 hover:[&_button[type=submit]]:to-amber-600">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
