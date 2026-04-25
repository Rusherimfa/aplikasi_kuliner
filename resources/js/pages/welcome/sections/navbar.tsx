import { Link, usePage, router } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, Home, BookOpen, CalendarPlus, ChevronRight, Moon, Sun, LogOut, Quote, ShoppingBag, User, LayoutDashboard, History, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import localeHelper from '@/routes/locale';
import { useCart } from '@/hooks/use-cart';
import { useAppearance } from '@/hooks/use-appearance';
import CartDrawer from '@/components/app/cart-drawer';
import { useMagnetic } from '@/hooks/use-magnetic';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';

interface NavbarProps {
    auth: any;
    dashboardUrl: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ auth, dashboardUrl, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
    const { cartCount, setCartOpen } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { url, props } = usePage();
    const { locale } = props as any;
    const { __ } = useTranslations();
    const [scrolled, setScrolled] = useState(false);
    
    // Magnetic Refs
    const magneticLogoRef = useMagnetic();
    const magneticCtaRef = useMagnetic();
    const magneticThemeRef = useMagnetic();
    const magneticCartRef = useMagnetic();

    const navItems = [
        { href: '/catalog', label: __('Menu') },
        { href: '/reservations/create', label: __('Reservation') },
        { href: '/experience', label: __('Experience') },
        { href: '/testimonials', label: __('Guest Stories') },
    ];

    const mobileMenuLinks = [
        { href: '/', label: __('Home'), subtitle: __('Our main sanctuary'), icon: Home },
        { href: '/catalog', label: __('Menu'), subtitle: __('Explore flavors'), icon: BookOpen },
        { href: '/reservations/create', label: __('Reservation'), subtitle: __('Book your table'), icon: CalendarPlus },
        { href: '/experience', label: __('Experience'), subtitle: __('Behind the scenes'), icon: UtensilsCrossed },
        { href: '/testimonials', label: __('Guest Stories'), subtitle: __('Customer impressions'), icon: Quote },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (auth.user) {
            const channel = (window as any).Echo.private(`user.${auth.user.id}`)
                .listen('.message.sent', (e: any) => {
                    // Only show notification if the message is from staff/courier
                    // and we are not already on the page where that specific chat is active
                    // But since BoutiqueChat handles its own visibility, we can just show a global toast
                    // unless the user is specifically viewing that chat.
                    // For now, a simple toast is good.
                    
                    toast.info(`Pesan baru dari ${e.message.sender.name}`, {
                        description: e.message.content,
                        action: {
                            label: 'Buka Chat',
                            onClick: () => {
                                if (e.message.reservation_id) {
                                    router.visit(`/reservations/${e.message.reservation_id}`);
                                } else if (e.message.order_id) {
                                    router.visit(`/orders/history`);
                                }
                            }
                        },
                        icon: <MessageSquare className="h-4 w-4" />,
                        duration: 8000,
                    });
                });

            return () => {
                channel.stopListening('.message.sent');
            };
        }
    }, [auth.user]);

    const isActive = (path: string) => url.startsWith(path) && (path !== '/' || url === '/');

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[60] p-4 sm:p-6 lg:p-6 pointer-events-none">
                <motion.nav
                    layout
                    initial={false}
                    animate={{
                        backgroundColor: resolvedAppearance === 'dark' 
                            ? (scrolled ? 'rgba(2, 6, 23, 0.9)' : 'rgba(2, 6, 23, 0.4)')
                            : (scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)'),
                        backdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
                        borderRadius: scrolled ? '2.5rem' : '9999px',
                        paddingLeft: scrolled ? '1.5rem' : '2.5rem',
                        paddingRight: scrolled ? '1.5rem' : '2.5rem',
                        width: scrolled ? '95%' : '100%',
                        maxWidth: scrolled ? '1100px' : '1152px',
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30,
                        mass: 1,
                    }}
                    className={cn(
                        "mx-auto flex h-20 items-center justify-between pointer-events-auto relative shadow-2xl overflow-hidden group border transition-colors duration-500",
                        resolvedAppearance === 'dark' ? "border-white/10" : "border-black/5"
                    )}
                >
                    {/* SVG Ocean Wave - Enhanced Visibility */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none z-0 opacity-60">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-[150%] h-14 sm:h-20 block relative -left-[25%]">
                            <path 
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                className={cn("transition-colors duration-500", resolvedAppearance === 'dark' ? "fill-sky-400/10" : "fill-sky-500/15")}
                            />
                            <path 
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-23.64V0Z"
                                className={cn("transition-colors duration-500", resolvedAppearance === 'dark' ? "fill-sky-500/15" : "fill-sky-600/20")}
                            />
                            <path 
                                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                                className={cn("transition-colors duration-500", resolvedAppearance === 'dark' ? "fill-sky-700/20" : "fill-sky-800/25")}
                            />
                        </svg>
                    </div>
 
                    <div className="flex flex-1 items-center justify-between px-6 md:px-10 relative z-10">
                        {/* Logo Section */}
                        <div ref={magneticLogoRef as any}>
                            <Link 
                                href="/" 
                                className="group flex items-center gap-4 outline-none" 
                            >
                                <div className={cn(
                                    "flex h-10 w-10 items-center justify-center transition-all duration-500 group-hover:scale-105 rounded-full overflow-hidden p-0.5 shadow-inner",
                                    resolvedAppearance === 'dark' ? "bg-white/10" : "bg-black/5"
                                )}>
                                    <img src="/logo.png" alt="Ocean's Resto" className="h-full w-full object-cover rounded-full" />
                                </div>
                            </Link>
                        </div>
 
                        {/* Desktop Menu */}
                        <div className="hidden flex-1 items-center justify-center space-x-2 md:flex">
                            {navItems.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300",
                                            resolvedAppearance === 'dark' 
                                                ? (active ? 'text-white bg-white/5 shadow-inner ring-1 ring-white/10' : 'text-white/60 hover:text-white hover:bg-white/10')
                                                : (active ? 'text-sky-600 bg-sky-50 shadow-sm ring-1 ring-sky-100' : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50')
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "hidden md:flex items-center gap-4 border-r pr-6 mr-2 transition-colors",
                                resolvedAppearance === 'dark' ? "border-white/10" : "border-black/5"
                            )}>
                                {auth.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full transition-colors overflow-hidden outline-none cursor-pointer border",
                                                resolvedAppearance === 'dark' 
                                                    ? "bg-white/5 border-white/10 hover:border-sky-500/50" 
                                                    : "bg-black/5 border-black/5 hover:border-sky-500/50"
                                            )}>
                                                {auth.user.avatar ? (
                                                    <img src={auth.user.avatar} className="h-full w-full object-cover" alt="" />
                                                ) : (
                                                    <span className="text-xs font-bold">{auth.user.name?.charAt(0)}</span>
                                                )}
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 mt-4 p-2 glass-card border-white/10 backdrop-blur-3xl shadow-4xl animate-in fade-in zoom-in duration-200">
                                            <DropdownMenuLabel className="px-4 py-5">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-black leading-none text-foreground">{auth.user.name}</p>
                                                    <p className="text-[10px] leading-none text-muted-foreground font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">{auth.user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            
                                            <DropdownMenuItem asChild className="rounded-xl px-3 py-3.5 focus:bg-primary focus:text-primary-foreground group transition-all duration-300">
                                                <Link href="/settings/profile" className="flex items-center w-full">
                                                    <User className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">{__('Profile Settings')}</span>
                                                </Link>
                                            </DropdownMenuItem>

                                            {auth.user.role === 'customer' ? (
                                                <>
                                                    <DropdownMenuItem asChild className="rounded-xl px-3 py-3.5 focus:bg-primary focus:text-primary-foreground group transition-all duration-300">
                                                        <Link href="/reservations/history" className="flex items-center w-full">
                                                            <CalendarPlus className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                            <span className="text-[11px] font-bold uppercase tracking-widest">{__('Reservation History')}</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="rounded-xl px-3 py-3.5 focus:bg-primary focus:text-primary-foreground group transition-all duration-300">
                                                        <Link href="/orders/history" className="flex items-center w-full">
                                                            <ShoppingBag className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                            <span className="text-[11px] font-bold uppercase tracking-widest">{__('Order History')}</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <DropdownMenuItem asChild className="rounded-xl px-3 py-3.5 focus:bg-primary focus:text-primary-foreground group transition-all duration-300">
                                                    <Link href={dashboardUrl} className="flex items-center w-full">
                                                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                        <span className="text-[11px] font-bold uppercase tracking-widest">{__('Dashboard Panel')}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            
                                            <DropdownMenuItem 
                                                onClick={() => router.post('/logout')}
                                                className="rounded-xl px-3 py-3.5 text-rose-500 focus:bg-rose-500 focus:text-white group transition-all duration-300 cursor-pointer"
                                            >
                                                <LogOut className="mr-3 h-4 w-4 transition-colors" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest">{__('End Session')}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link 
                                        href={login().url}
                                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                            resolvedAppearance === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                                        )}>
                                            <span className="text-[10px] font-black uppercase">{locale}</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 mt-4 glass-card border-white/10 backdrop-blur-3xl p-2">
                                        <DropdownMenuItem 
                                            onClick={() => router.post(localeHelper.update.url(), { locale: 'id' })}
                                            className={cn("rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-widest", locale === 'id' && "bg-primary text-primary-foreground")}
                                        >
                                            Bahasa Indonesia
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onClick={() => router.post(localeHelper.update.url(), { locale: 'en' })}
                                            className={cn("rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-widest", locale === 'en' && "bg-primary text-primary-foreground")}
                                        >
                                            English (US)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div ref={magneticThemeRef as any}>
                                    <button
                                        onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                            resolvedAppearance === 'dark' ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"
                                        )}
                                    >
                                        {resolvedAppearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                    </button>
                                </div>
                                
                                <div ref={magneticCartRef as any}>
                                    <button
                                        onClick={() => setCartOpen(true)}
                                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                                    >
                                        <ShoppingBag size={18} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[9px] font-black text-primary shadow-sm">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Mobile Hamburger */}
                                <button
                                    className={cn(
                                        "md:hidden flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                        resolvedAppearance === 'dark' ? "bg-white/5" : "bg-black/5"
                                    )}
                                    onClick={() => setMobileMenuOpen(true)}
                                >
                                    <MenuIcon size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.nav>
            </header>

            {/* Mobile Bottom Nav */}
            {!mobileMenuOpen && (
                <div className="fixed bottom-6 left-4 right-4 z-[60] md:hidden">
                    <nav className="mx-auto flex h-16 max-w-sm items-center justify-around rounded-full border border-white/10 bg-background/80 backdrop-blur-2xl px-6 shadow-2xl transition-all duration-500">
                        {[
                            { href: '/', icon: Home },
                            { href: '/catalog', icon: BookOpen },
                            { icon: ShoppingBag, onClick: () => setCartOpen(true), count: cartCount },
                            { href: '/reservations/create', icon: CalendarPlus }
                        ].map((item, i) => (
                            item.href ? (
                                <Link key={i} href={item.href} className={`relative p-3 rounded-full transition-all duration-300 active:scale-90 ${isActive(item.href) ? 'text-primary bg-primary/10 shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}>
                                    <item.icon size={22} className={isActive(item.href) ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
                                    {isActive(item.href) && (
                                        <motion.span layoutId="bottomNavDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                    )}
                                </Link>
                            ) : (
                                <button key={i} onClick={item.onClick} className="relative p-3 text-foreground/60 active:scale-90 transition-transform">
                                    <item.icon size={22} className="stroke-[1.5px]" />
                                    {item.count ? (
                                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-primary-foreground border-2 border-background shadow-sm">
                                            {item.count}
                                        </span>
                                    ) : null}
                                </button>
                            )
                        ))}
                    </nav>
                </div>
            )}

            {/* Full-screen Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-3xl p-6 md:hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-12">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden bg-white/10 p-0.5">
                                <img src="/logo.png" alt="Ocean's Resto" className="h-full w-full object-cover rounded-full" />
                             </div>
                             <button onClick={() => setMobileMenuOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 cursor-pointer">
                                <X size={24} />
                             </button>
                        </div>
                        
                        <div className="flex flex-col gap-4 overflow-y-auto pb-32">
                            {mobileMenuLinks.map((link, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.05 }}
                                >
                                    <Link 
                                        href={link.href} 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center justify-between border-b border-white/5 pb-6"
                                    >
                                        <div className="flex flex-col">
                                            <span className={`text-4xl font-serif ${isActive(link.href) ? 'text-primary italic' : 'text-foreground'}`}>{link.label}</span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{link.subtitle}</span>
                                        </div>
                                        <ChevronRight size={20} className="text-primary/40 group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Profile & Logout for Mobile */}
                            {auth.user && (
                                <div className="mt-4 flex flex-col gap-4">
                                    {[
                                        { href: "/settings/profile", label: __("My Profile"), subtitle: __("Account settings & avatar"), icon: User },
                                        ...(auth.user.role === 'customer' ? [
                                            { href: "/reservations/history", label: __("Reservation History"), subtitle: __("Book your table"), icon: CalendarPlus },
                                            { href: "/orders/history", label: __("Order History"), subtitle: __("Explore flavors"), icon: ShoppingBag }
                                        ] : [
                                            { href: dashboardUrl, label: __("Dashboard Panel"), subtitle: __("Behind the scenes"), icon: LayoutDashboard }
                                        ])
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={`auth-${idx}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.05 }}
                                        >
                                            <Link 
                                                href={item.href} 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="group flex items-center justify-between border-b border-white/5 pb-6"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-4xl font-serif text-foreground">{item.label}</span>
                                                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{item.subtitle}</span>
                                                </div>
                                                <item.icon size={20} className="text-primary/40 group-hover:translate-x-2 transition-transform" />
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <motion.button 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            router.post('/logout');
                                        }}
                                        className="group flex items-center justify-between border-b border-white/5 pb-6 text-rose-500 cursor-pointer"
                                    >
                                        <div className="flex flex-col text-left">
                                            <span className="text-4xl font-serif">{__('End Session')}</span>
                                            <span className="text-xs opacity-50 uppercase tracking-widest mt-1">{__('Complete your visit')}</span>
                                        </div>
                                        <LogOut size={20} className="opacity-40 group-hover:translate-x-2 transition-transform" />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="absolute bottom-12 left-6 right-6"
                        >
                            <Link href="/reservations/create" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full h-18 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] overflow-hidden group">
                                   {__('Reserve a Table Now')}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer />
        </>
    );
}

