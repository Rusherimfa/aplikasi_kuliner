import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UtensilsCrossed,
    Menu as MenuIcon,
    X,
    Home,
    BookOpen,
    CalendarPlus,
    Moon,
    Sun,
    LogOut,
    Quote,
    ShoppingBag,
    User,
    LayoutDashboard,
    MessageSquare,
    Languages,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CartDrawer from '@/components/app/cart-drawer';
import { LogoutConfirmationDialog } from '@/components/app/logout-confirmation-dialog';
import NotificationDropdown from '@/components/app/notification-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useCart } from '@/hooks/use-cart';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';
import { buildAvatarUrl, cn } from '@/lib/utils';
import { login } from '@/routes';
import localeHelper from '@/routes/locale';

interface NavbarProps {
    auth: any;
    dashboardUrl: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
    auth,
    dashboardUrl,
    mobileMenuOpen,
    setMobileMenuOpen,
}: NavbarProps) {
    const { cartCount, setCartOpen } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const { url, props } = usePage();
    const { locale } = props as any;
    const { __ } = useTranslations();
    const avatarUrl = buildAvatarUrl(auth.user?.avatar, auth.user?.updated_at);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Magnetic Refs
    const magneticLogoRef = useMagnetic();
    const magneticThemeRef = useMagnetic();
    const magneticCartRef = useMagnetic();

    const navItems = [
        { href: '/catalog', label: __('Menu') },
        { href: '/reservations/create', label: __('Reservation') },
        { href: '/experience', label: __('Experience') },
        { href: '/testimonials', label: __('Guest Stories') },
    ];

    const mobileMenuLinks = [
        {
            href: '/',
            label: __('Home'),
            subtitle: __('Our main sanctuary'),
            icon: Home,
        },
        {
            href: '/catalog',
            label: __('Menu'),
            subtitle: __('Explore flavors'),
            icon: BookOpen,
        },
        {
            href: '/reservations/create',
            label: __('Reservation'),
            subtitle: __('Book your table'),
            icon: CalendarPlus,
        },
        {
            href: '/experience',
            label: __('Experience'),
            subtitle: __('Behind the scenes'),
            icon: UtensilsCrossed,
        },
        {
            href: '/testimonials',
            label: __('Guest Stories'),
            subtitle: __('Customer impressions'),
            icon: Quote,
        },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (auth.user) {
            const channel = (window as any).Echo.private(
                `user.${auth.user.id}`,
            ).listen('.message.sent', (e: any) => {
                toast.info(
                    `${__('New message from')} ${e.message.sender.name}`,
                    {
                        description: e.message.content,
                        action: {
                            label: __('Open Chat'),
                            onClick: () => {
                                if (e.message.reservation_id) {
                                    router.visit(
                                        `/reservations/${e.message.reservation_id}`,
                                    );
                                } else if (e.message.order_id) {
                                    router.visit(`/orders/history`);
                                }
                            },
                        },
                        icon: <MessageSquare className="h-4 w-4" />,
                        duration: 8000,
                    },
                );
            });

            return () => {
                channel.stopListening('.message.sent');
            };
        }
    }, [auth.user]);

    const isActive = (path: string) =>
        url.startsWith(path) && (path !== '/' || url === '/');

    const requestLogout = () => {
        setMobileMenuOpen(false);
        setLogoutDialogOpen(true);
    };

    return (
        <>
            <header className="pointer-events-none fixed top-0 right-0 left-0 z-[60] p-4 sm:p-6 lg:p-6">
                <motion.nav
                    layout
                    initial={false}
                    animate={{
                        backgroundColor: !mounted
                            ? 'rgba(255, 255, 255, 0.6)'
                            : resolvedAppearance === 'dark'
                              ? scrolled
                                  ? 'rgba(2, 6, 23, 0.9)'
                                  : 'rgba(2, 6, 23, 0.4)'
                              : scrolled
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'rgba(255, 255, 255, 0.6)',
                        backdropFilter:
                            !mounted || scrolled ? 'blur(24px)' : 'blur(16px)',
                        borderRadius: scrolled ? '2rem' : '9999px',
                        width: scrolled ? '95%' : '100%',
                        maxWidth: scrolled ? '1200px' : '1350px',
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 30,
                        mass: 1,
                    }}
                    className={cn(
                        'group pointer-events-auto relative mx-auto flex h-24 items-center justify-between overflow-hidden border border-black/5 shadow-2xl transition-colors duration-500 dark:border-white/10',
                    )}
                >
                    {/* SVG Ocean Wave - Bottom Attached (Full Height) */}
                    <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-full overflow-hidden leading-[0] opacity-60">
                        <svg
                            viewBox="0 0 1200 120"
                            preserveAspectRatio="none"
                            className="animate-wave relative -left-[25%] block h-24 w-[150%] sm:h-32"
                        >
                            <path
                                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                                className="fill-sky-500/15 transition-colors duration-500 dark:fill-sky-400/10"
                            />
                            <path
                                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-23.64V0Z"
                                className="animate-wave-slow fill-sky-600/20 transition-colors duration-500 dark:fill-sky-500/15"
                            />
                        </svg>
                    </div>

                    <div className="relative z-10 flex w-full flex-1 items-center justify-between px-4 sm:px-6 md:px-10">
                        {/* Logo Section */}
                        <div ref={magneticLogoRef as any}>
                            <Link
                                href="/"
                                className="group flex items-center gap-4 outline-none"
                            >
                                <div
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-black/5 p-0.5 shadow-inner transition-all duration-500 group-hover:scale-105 dark:bg-white/10',
                                    )}
                                >
                                    <img
                                        src="/logo.png"
                                        alt="Ocean's Resto"
                                        className="h-full w-full rounded-full object-cover"
                                    />
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
                                            'rounded-full px-6 py-2.5 text-xs font-black tracking-[0.25em] uppercase transition-all duration-300',
                                            active
                                                ? 'bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100 dark:bg-white/5 dark:text-white dark:ring-white/10'
                                                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white',
                                        )}
                                    >
                                        {link.label || '...'}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <div className="mr-2 hidden items-center gap-3 border-r border-black/5 pr-6 transition-colors md:flex dark:border-white/10">
                                {auth.user && <NotificationDropdown />}
                                {auth.user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className={cn(
                                                    'flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black/5 bg-black/5 transition-colors outline-none hover:border-sky-500/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-500/50',
                                                )}
                                            >
                                                <Avatar className="h-full w-full">
                                                    {avatarUrl ? (
                                                        <AvatarImage
                                                            key={avatarUrl}
                                                            src={avatarUrl}
                                                            className="h-full w-full object-cover"
                                                            alt={auth.user.name ?? ''}
                                                        />
                                                    ) : null}
                                                    <AvatarFallback className="bg-transparent text-xs font-bold text-slate-900 dark:text-white">
                                                        {auth.user.name?.charAt(
                                                            0,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="glass-card animate-in fade-in zoom-in mt-4 w-64 border-white/10 p-2 shadow-4xl backdrop-blur-3xl duration-200"
                                        >
                                            <DropdownMenuLabel className="px-4 py-5">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm leading-none font-black text-foreground">
                                                        {auth.user.name}
                                                    </p>
                                                    <p className="overflow-hidden text-[10px] leading-none font-medium tracking-tight text-ellipsis whitespace-nowrap text-muted-foreground">
                                                        {auth.user.email}
                                                    </p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-white/5" />

                                            <DropdownMenuItem
                                                asChild
                                                className="group rounded-xl px-3 py-3.5 transition-all duration-300 focus:bg-primary focus:text-primary-foreground"
                                            >
                                                <Link
                                                    href="/settings/profile"
                                                    className="flex w-full items-center"
                                                >
                                                    <User className="mr-3 h-4 w-4 text-primary transition-colors group-focus:text-primary-foreground" />
                                                    <span className="text-[11px] font-bold tracking-widest uppercase">
                                                        {__('Profile Settings')}
                                                    </span>
                                                </Link>
                                            </DropdownMenuItem>

                                            {auth.user.role === 'customer' ? (
                                                <>
                                                    <DropdownMenuItem
                                                        asChild
                                                        className="group rounded-xl px-3 py-3.5 transition-all duration-300 focus:bg-primary focus:text-primary-foreground"
                                                    >
                                                        <Link
                                                            href="/reservations/history"
                                                            className="flex w-full items-center"
                                                        >
                                                            <CalendarPlus className="mr-3 h-4 w-4 text-primary transition-colors group-focus:text-primary-foreground" />
                                                            <span className="text-[11px] font-bold tracking-widest uppercase">
                                                                {__(
                                                                    'Reservation History',
                                                                )}
                                                            </span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        asChild
                                                        className="group rounded-xl px-3 py-3.5 transition-all duration-300 focus:bg-primary focus:text-primary-foreground"
                                                    >
                                                        <Link
                                                            href="/orders/history"
                                                            className="flex w-full items-center"
                                                        >
                                                            <ShoppingBag className="mr-3 h-4 w-4 text-primary transition-colors group-focus:text-primary-foreground" />
                                                            <span className="text-[11px] font-bold tracking-widest uppercase">
                                                                {__(
                                                                    'Order History',
                                                                )}
                                                            </span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </>
                                            ) : (
                                                <DropdownMenuItem
                                                    asChild
                                                    className="group rounded-xl px-3 py-3.5 transition-all duration-300 focus:bg-primary focus:text-primary-foreground"
                                                >
                                                    <Link
                                                        href={dashboardUrl}
                                                        className="flex w-full items-center"
                                                    >
                                                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary transition-colors group-focus:text-primary-foreground" />
                                                        <span className="text-[11px] font-bold tracking-widest uppercase">
                                                            {__(
                                                                'Dashboard Panel',
                                                            )}
                                                        </span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}

                                            <DropdownMenuSeparator className="bg-white/5" />

                                            <DropdownMenuItem
                                                onClick={requestLogout}
                                                className="group cursor-pointer rounded-xl px-3 py-3.5 text-rose-500 transition-all duration-300 focus:bg-rose-500 focus:text-white"
                                            >
                                                <LogOut className="mr-3 h-4 w-4 transition-colors" />
                                                <span className="text-[11px] font-bold tracking-widest uppercase">
                                                    {__('End Session')}
                                                </span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        href={login().url}
                                        className="rounded-full bg-black/5 px-4 py-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground dark:bg-white/5"
                                    >
                                        {__('Login')}
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Desktop Language & Theme Switchers */}
                                <div className="hidden items-center gap-2 md:flex">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10">
                                                <span className="text-[10px] font-black uppercase">
                                                    {locale}
                                                </span>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="glass-card mt-4 w-40 border-white/10 p-2 backdrop-blur-3xl"
                                        >
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.post(
                                                        localeHelper.update.url(),
                                                        { locale: 'id' },
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-xl px-3 py-2 text-[11px] font-bold tracking-widest uppercase',
                                                    locale === 'id' &&
                                                        'bg-primary text-primary-foreground',
                                                )}
                                            >
                                                Bahasa Indonesia
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    router.post(
                                                        localeHelper.update.url(),
                                                        { locale: 'en' },
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-xl px-3 py-2 text-[11px] font-bold tracking-widest uppercase',
                                                    locale === 'en' &&
                                                        'bg-primary text-primary-foreground',
                                                )}
                                            >
                                                English (US)
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div ref={magneticThemeRef as any}>
                                        <button
                                            onClick={() =>
                                                updateAppearance(
                                                    resolvedAppearance ===
                                                        'dark'
                                                        ? 'light'
                                                        : 'dark',
                                                )
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            {mounted ? (
                                                resolvedAppearance ===
                                                'dark' ? (
                                                    <Sun size={18} />
                                                ) : (
                                                    <Moon size={18} />
                                                )
                                            ) : (
                                                <Moon size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={magneticCartRef as any}
                                    className="hidden md:block"
                                >
                                    <button
                                        onClick={() => setCartOpen(true)}
                                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                                    >
                                        <ShoppingBag size={18} />
                                        {mounted && cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-primary shadow-sm">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Mobile Actions */}
                                <div className="flex items-center gap-2 md:hidden">
                                    <div ref={magneticThemeRef as any}>
                                        <button
                                            onClick={() =>
                                                updateAppearance(
                                                    resolvedAppearance ===
                                                        'dark'
                                                        ? 'light'
                                                        : 'dark',
                                                )
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            {mounted ? (
                                                resolvedAppearance ===
                                                'dark' ? (
                                                    <Sun size={18} />
                                                ) : (
                                                    <Moon size={18} />
                                                )
                                            ) : (
                                                <Moon size={18} />
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(true)}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                                    >
                                        <MenuIcon size={18} />
                                    </button>
                                    {auth.user && <NotificationDropdown />}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.nav>
            </header>

            {/* Mobile App-Style Bottom Nav */}
            <div className="fixed right-4 bottom-6 left-4 z-[60] md:hidden">
                <nav className="flex h-16 w-full items-center justify-around rounded-full border border-black/5 bg-background/80 px-2 shadow-2xl backdrop-blur-3xl dark:border-white/10">
                    {[
                        { href: '/', icon: Home, label: __('Home') },
                        { href: '/catalog', icon: BookOpen, label: __('Menu') },
                        {
                            icon: ShoppingBag,
                            onClick: () => setCartOpen(true),
                            count: cartCount,
                            label: __('Cart'),
                        },
                        {
                            href: '/reservations/create',
                            icon: CalendarPlus,
                            label: __('Reserve'),
                        },
                        {
                            href: auth?.user
                                ? '/settings/profile'
                                : login().url,
                            icon: User,
                            label: auth?.user ? __('Profile') : __('Login'),
                        },
                    ].map((item, i) => {
                        const active = item.href ? isActive(item.href) : false;

                        return item.href ? (
                            <Link
                                key={i}
                                href={item.href}
                                className="group relative flex h-full w-14 flex-col items-center justify-center transition-all"
                            >
                                {active && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-x-0 inset-y-1 rounded-full bg-primary/10 dark:bg-primary/20"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <item.icon
                                    size={20}
                                    className={cn(
                                        'relative z-10 transition-colors',
                                        active
                                            ? 'stroke-[2.5px] text-primary'
                                            : 'stroke-[1.5px] text-muted-foreground group-hover:text-foreground',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'relative z-10 mt-1 text-[8px] font-bold tracking-wider uppercase transition-colors',
                                        active
                                            ? 'text-primary'
                                            : 'text-muted-foreground group-hover:text-foreground',
                                    )}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        ) : (
                            <button
                                key={i}
                                onClick={item.onClick}
                                className="group relative flex h-full w-14 flex-col items-center justify-center transition-all"
                            >
                                <div className="relative z-10">
                                    <item.icon
                                        size={20}
                                        className="stroke-[1.5px] text-muted-foreground transition-colors group-hover:text-foreground"
                                    />
                                    {mounted && item.count ? (
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-primary text-[8px] font-black text-primary-foreground shadow-sm">
                                            {item.count}
                                        </span>
                                    ) : null}
                                </div>
                                <span className="relative z-10 mt-1 text-[8px] font-bold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <CartDrawer />
            <LogoutConfirmationDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
            />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            filter: 'blur(10px)',
                        }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        transition={{
                            type: 'spring',
                            bounce: 0,
                            duration: 0.4,
                        }}
                        className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background/95 p-6 pt-16 backdrop-blur-3xl md:hidden"
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-6 right-6 z-10 rounded-full bg-black/5 p-3 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                            <X size={20} />
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex items-center gap-4"
                        >
                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-black/10 to-transparent p-0.5 shadow-md dark:from-white/20 dark:to-transparent">
                                <img
                                    src="/logo.png"
                                    alt="Ocean's Resto"
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-widest text-foreground uppercase">
                                    Ocean's Resto
                                </h2>
                                <p className="mt-0.5 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                                    Taste the Extraordinary
                                </p>
                            </div>
                        </motion.div>

                        <div className="mt-2 flex flex-col gap-4">
                            {mobileMenuLinks.map((link, i) => {
                                const active = isActive(link.href);

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: i * 0.08,
                                            duration: 0.4,
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className={cn(
                                                'group flex items-center gap-5 rounded-3xl border p-4 transition-all duration-300',
                                                active
                                                    ? 'border-primary/30 bg-primary/10 shadow-[0_10px_40px_-15px_rgba(var(--color-primary),0.3)]'
                                                    : 'border-white/10 bg-black/5 shadow-sm hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner transition-all duration-300',
                                                    active
                                                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/40'
                                                        : 'bg-white text-foreground group-hover:scale-105 dark:bg-black/50',
                                                )}
                                            >
                                                <link.icon
                                                    size={22}
                                                    className={
                                                        active
                                                            ? 'stroke-[2.5px]'
                                                            : 'stroke-[1.5px]'
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col">
                                                <h3
                                                    className={cn(
                                                        'text-lg font-bold tracking-wide transition-colors',
                                                        active
                                                            ? 'text-primary'
                                                            : 'text-foreground group-hover:text-primary',
                                                    )}
                                                >
                                                    {link.label}
                                                </h3>
                                                <p className="mt-0.5 text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
                                                    {link.subtitle}
                                                </p>
                                            </div>
                                            {active && (
                                                <div className="mr-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.8)]" />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="mt-8 flex flex-col gap-4 pb-32"
                        >
                            {/* Language toggle */}
                            <button
                                onClick={() => {
                                    router.post(localeHelper.update.url(), {
                                        locale: locale === 'id' ? 'en' : 'id',
                                    });
                                    setMobileMenuOpen(false);
                                }}
                                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-black/5 p-5 shadow-sm transition-all hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-foreground shadow-inner transition-transform group-hover:scale-105 dark:bg-black/50">
                                        <Languages
                                            size={18}
                                            className="stroke-[1.5px]"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-sm font-bold text-foreground">
                                            {__('Language')}
                                        </h3>
                                        <p className="mt-0.5 text-[10px] tracking-wider text-muted-foreground uppercase">
                                            {locale === 'id'
                                                ? 'Bahasa Indonesia'
                                                : 'English (US)'}
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-black tracking-widest text-primary uppercase">
                                    {__('Change')}
                                </span>
                            </button>

                            {auth?.user ? (
                                <button
                                    onClick={requestLogout}
                                    className="group flex items-center justify-between rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-500 shadow-sm transition-all hover:bg-rose-500/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 transition-transform group-hover:scale-105">
                                            <LogOut
                                                size={18}
                                                className="stroke-[2px]"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold">
                                                {__('End Session')}
                                            </h3>
                                            <p className="mt-0.5 text-[10px] tracking-wider uppercase opacity-70">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href={login().url}
                                    className="group flex items-center justify-between rounded-3xl border border-primary/20 bg-primary/10 p-5 text-primary shadow-sm transition-all hover:bg-primary/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 transition-transform group-hover:scale-105">
                                            <User
                                                size={18}
                                                className="stroke-[2px]"
                                            />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-bold">
                                                {__('Login')}
                                            </h3>
                                            <p className="mt-0.5 text-[10px] tracking-wider uppercase opacity-70">
                                                {__('Access your account')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
