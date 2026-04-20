import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren, useState } from 'react';
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
import { User, Lock, Users, Palette, ArrowLeft } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil Akun',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: Lock,
    },

    {
        title: 'Personalisasi',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    const { auth } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-orange-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-[120px]" />

            <Navbar 
                auth={auth} 
                dashboardUrl={dashboard()?.url || '/dashboard'} 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen} 
            />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <Heading
                            title="Account Concierge"
                            description="Kelola preferensi dan detail akun eksklusif Anda."
                        />
                        
                        <Link href="/">
                            <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                                <ArrowLeft size={14} /> Kembali ke Beranda
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:gap-16">
                        <aside className="w-full lg:w-48 lg:flex-none xl:w-64">
                            <nav
                                className="flex flex-col space-y-2"
                                aria-label="Settings"
                            >
                                {sidebarNavItems.map((item, index) => {
                                    const active = isCurrentOrParentUrl(item.href);
                                    return (
                                        <Button
                                            key={`${toUrl(item.href)}-${index}`}
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'w-full justify-start rounded-2xl h-14 px-5 text-[11px] font-black uppercase tracking-widest transition-all duration-300', 
                                                active 
                                                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 scale-[1.02]' 
                                                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.icon && (
                                                    <item.icon className={cn("mr-3 h-4 w-4", active ? "text-black" : "text-orange-500")} />
                                                )}
                                                {item.title}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>
                        </aside>

                        <Separator className="my-10 lg:hidden opacity-5" />

                        <div className="flex-1 lg:max-w-3xl">
                            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {children}
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
