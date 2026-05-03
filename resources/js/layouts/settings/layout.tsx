import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';
import Navbar from '@/pages/welcome/sections/navbar';
import { dashboard } from '@/routes';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as teams } from '@/routes/teams';
import type { NavItem } from '@/types';
import { User, Lock, Users, Palette, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTranslations } from '@/hooks/use-translations';

const sidebarNavItems = (translate: (key: string) => string): NavItem[] => [
    {
        title: translate('Profil Akun'),
        href: edit(),
        icon: User,
    },
    {
        title: translate('Keamanan'),
        href: editSecurity(),
        icon: Lock,
    },
    {
        title: translate('Personalisasi'),
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const items = sidebarNavItems(__);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-sky-500/30 overflow-x-hidden relative transition-colors duration-500">
            {/* Cinematic Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Theme-aware Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/[0.05] via-transparent to-transparent dark:from-sky-950/20 dark:via-[#020617] dark:to-[#020617]" />
                
                {/* Animated Background Glows */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] h-[1000px] w-[1000px] rounded-full bg-sky-500/10 dark:bg-sky-500/10 blur-[160px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-sky-600/10 dark:bg-sky-600/10 blur-[140px]" 
                />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noise%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.03),transparent_70%)]" />
            </div>

            <Navbar 
                auth={auth} 
                dashboardUrl={dashboard()?.url || '/dashboard'} 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen} 
            />

            <main className="relative z-10 pt-32 pb-40">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
                    {/* Cinematic Hero Header */}
                    <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 dark:text-sky-400">{__('Personal Space')}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic">
                                Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400 dark:from-sky-400 dark:to-sky-200">Concierge</span>
                            </h1>
                            <p className="max-w-xl text-lg font-medium text-muted-foreground/60 leading-relaxed">
                                {__('Curate your identity and manage your exclusive culinary preferences in our sanctuary of taste.')}
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Link href="/">
                                <Button className="h-16 px-10 rounded-full border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-xl hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20 text-[11px] font-black uppercase tracking-[0.25em] text-foreground transition-all duration-500 group">
                                    <ArrowLeft size={16} className="mr-3 transition-transform group-hover:-translate-x-1" />
                                    {__('Escape to Home')}
                                </Button>
                            </Link>
                        </motion.div>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                        {/* Glass Sidebar */}
                        <aside className="w-full lg:w-80 lg:flex-none">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="sticky top-32 p-1 rounded-[2.5rem] bg-gradient-to-b from-black/5 to-transparent dark:from-white/10 dark:to-transparent shadow-xl dark:shadow-2xl backdrop-blur-2xl"
                            >
                                <nav className="flex flex-row lg:flex-col p-2 space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-visible scrollbar-none">
                                    {items.map((item, index) => {
                                        const active = isCurrentOrParentUrl(item.href);
                                        return (
                                            <Button
                                                key={`${toUrl(item.href)}-${index}`}
                                                variant="ghost"
                                                asChild
                                                className={cn(
                                                    'relative whitespace-nowrap justify-start rounded-[1.8rem] h-16 px-8 text-[11px] font-black uppercase tracking-widest transition-all duration-500 group overflow-hidden', 
                                                    active 
                                                        ? 'text-white' 
                                                        : 'text-muted-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    {active && (
                                                        <motion.div 
                                                            layoutId="sidebar-active-bg"
                                                            className="absolute inset-0 bg-sky-600 dark:bg-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.3)]" 
                                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10 flex items-center">
                                                        {item.icon && (
                                                            <item.icon className={cn("mr-4 h-4 w-4 transition-colors", active ? "text-white" : "text-sky-600 dark:text-sky-500 group-hover:text-sky-500 dark:group-hover:text-sky-400")} />
                                                        )}
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </Button>
                                        );
                                    })}
                                </nav>
                            </motion.div>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1 lg:max-w-4xl">
                            <AnimatePresence mode="wait">
                                <motion.section 
                                    key={usePage().url}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="space-y-16"
                                >
                                    {children}
                                </motion.section>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Glow */}
            <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent shadow-[0_0_50px_rgba(14,165,233,0.2)] dark:shadow-[0_0_50px_rgba(14,165,233,0.5)] z-20" />
        </div>
    );
}

