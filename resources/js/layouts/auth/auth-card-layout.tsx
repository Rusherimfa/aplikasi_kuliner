import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import { motion } from 'framer-motion';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-[#FAFAFA] dark:bg-[#0A0A0B] p-6 md:p-10 transition-colors duration-500 overflow-hidden font-['Inter',sans-serif]">
            {/* Premium Decorative Ambient */}
            <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-sky-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-sky-600/5 blur-[100px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex w-full max-w-md flex-col gap-8"
            >
                <Link
                    href={home()}
                    className="flex items-center gap-3 self-center transition-all hover:scale-105 active:scale-95"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl">
                        <AppLogoIcon className="size-8 fill-current" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="glass-card border-border dark:border-white/5 bg-white/70 dark:bg-white/[0.02] rounded-[2.5rem] shadow-2xl backdrop-blur-3xl overflow-hidden">
                        <CardHeader className="px-10 pt-10 pb-2 text-center space-y-3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase glow-primary"
                            >
                                Security Gate
                            </motion.div>
                            <CardTitle className="font-['Playfair_Display',serif] text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-sm font-medium text-slate-500 dark:text-neutral-500">
                                {description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-10">
                            {children}
                        </CardContent>
                    </Card>
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-neutral-600">
                    &copy; {new Date().getFullYear()} Ocean's Resto Premium. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}


