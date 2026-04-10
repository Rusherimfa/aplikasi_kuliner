import { Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, Home, BookOpen, CalendarPlus, ChevronRight, Moon, Sun, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { useCart } from '@/hooks/use-cart';
import { useAppearance } from '@/hooks/use-appearance';
import { ShoppingBag } from 'lucide-react';
import CartDrawer from '@/components/app/cart-drawer';

interface NavbarProps {
    auth: any;
    dashboardUrl: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ auth, dashboardUrl, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
    const { cartCount, setCartOpen } = useCart();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();
    const mobileMenuLinks = [
        { href: '/', label: 'Beranda', subtitle: 'Kembali ke halaman utama', icon: Home },
        { href: '/catalog', label: 'Menu Kami', subtitle: 'Jelajahi hidangan unggulan', icon: BookOpen },
        { href: '/reservations/create', label: 'Reservasi', subtitle: 'Pesan meja dalam hitungan detik', icon: CalendarPlus },
        { href: '/experience', label: 'Pengalaman', subtitle: 'Lihat suasana & cerita kami', icon: UtensilsCrossed },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const isActive = (path: string) => url.startsWith(path) && (path !== '/' || url === '/');

    return (
        <>
            {/* Top Pill Header (Desktop + Mobile Logo) */}
            <header className="fixed top-0 left-0 right-0 z-40 p-4 transition-all duration-500 sm:p-6 lg:p-8 pointer-events-none">
                <nav
                    className={`mx-auto flex h-16 max-w-6xl items-center justify-between pointer-events-auto rounded-full border px-4 transition-all duration-500 sm:px-6 md:pl-8 ${
                        scrolled || mobileMenuOpen
                            ? 'border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/50'
                            : 'border-slate-200/50 bg-white/50 backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50'
                    } ${mobileMenuOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}
                >
                    {/* Logo (Centered on mobile, Left on Desktop) */}
                    <Link 
                        href="/" 
                        className="group flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 outline-none" 
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-900/20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-amber-500/40">
                            <UtensilsCrossed size={14} />
                        </span>
                        <span className="font-['Playfair_Display',serif] text-xl font-semibold tracking-wide text-slate-900 dark:text-white">
                            Resto<span className="text-amber-600 italic">Web</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden flex-1 items-center justify-center space-x-2 md:flex">
                        {[
                            { href: '/catalog', label: 'Menu Kami' },
                            { href: '/reservations/create', label: 'Reservasi' },
                            { href: '/experience', label: 'Pengalaman' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-neutral-800 dark:hover:text-white ${
                                    isActive(link.href) ? 'bg-slate-100 text-amber-700 shadow-sm dark:bg-neutral-800 dark:text-amber-500' : 'text-slate-600 dark:text-neutral-400'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden shrink-0 items-center gap-3 md:flex">
                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                {auth.user.avatar ? (
                                    <img 
                                        src={auth.user.avatar} 
                                        alt={auth.user.name} 
                                        className="h-10 w-10 rounded-full border border-slate-200 dark:border-neutral-700 object-cover shadow-sm bg-white dark:bg-neutral-800"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-sm font-bold text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700">
                                        {auth.user.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                {auth.user.role === 'customer' ? (
                                    <Link href="/reservations/history">
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-full border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                        >
                                            Reservasi Saya
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={dashboardUrl}>
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-full border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                                        >
                                            Ke Dasbor
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/logout" method="post" as="button">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 shrink-0 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={login().url}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                                >
                                    Login Staf
                                </Link>
                                <Link href="/reservations/create">
                                    <Button className="h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-900/20 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/30">
                                        Pesan Meja
                                    </Button>
                                </Link>
                            </>
                        )}
                        <button
                            onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            {resolvedAppearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                        >
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <div 
                className={`fixed bottom-0 left-0 right-0 z-40 p-4 transition-transform duration-500 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                }`}
            >
                <nav className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full border border-slate-200/60 bg-white/90 px-6 py-2 pb-3 pt-2 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-neutral-800/60 dark:bg-neutral-900/90">
                    <Link href="/" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/') ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500' : 'text-slate-400 dark:text-neutral-500 group-hover:text-slate-700 dark:group-hover:text-neutral-300 group-hover:bg-slate-50 dark:group-hover:bg-neutral-800'}`}>
                            <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/') ? 'text-amber-700 dark:text-amber-500' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-300'}`}>Beranda</span>
                    </Link>
                    
                    <Link href="/catalog" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/catalog') ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500' : 'text-slate-400 dark:text-neutral-500 group-hover:text-slate-700 dark:group-hover:text-neutral-300 group-hover:bg-slate-50 dark:group-hover:bg-neutral-800'}`}>
                            <BookOpen size={20} strokeWidth={isActive('/catalog') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/catalog') ? 'text-amber-700 dark:text-amber-500' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-300'}`}>Menu</span>
                    </Link>
                    
                    <button 
                        onClick={() => setCartOpen(true)}
                        className="group flex flex-col items-center gap-1 mt-1 transition-colors relative"
                    >
                        <div className="p-1.5 rounded-full text-slate-400 dark:text-neutral-500 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-neutral-800 group-hover:text-slate-700 dark:group-hover:text-neutral-300">
                            <ShoppingBag size={20} strokeWidth={2} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-300">Keranjang</span>
                    </button>
                    
                    <Link href="/reservations/create" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/reservations') ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500' : 'text-slate-400 dark:text-neutral-500 group-hover:text-slate-700 dark:group-hover:text-neutral-300 group-hover:bg-slate-50 dark:group-hover:bg-neutral-800'}`}>
                            <CalendarPlus size={20} strokeWidth={isActive('/reservations') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/reservations') ? 'text-amber-700 dark:text-amber-500' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-300'}`}>Pesan</span>
                    </Link>
                    
                    <button 
                        className="group flex flex-col items-center gap-1 mt-1 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <div className="p-1.5 rounded-full text-slate-400 dark:text-neutral-500 transition-colors group-hover:bg-slate-50 dark:group-hover:bg-neutral-800 group-hover:text-slate-700 dark:group-hover:text-neutral-300">
                            <MenuIcon size={20} strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide text-slate-500 dark:text-neutral-500 group-hover:text-slate-800 dark:group-hover:text-neutral-300">Lainnya</span>
                    </button>
                </nav>
            </div>

            {/* Premium Full-screen Mobile Overlay */}
            <div
                className={`fixed inset-0 z-50 bg-slate-50/95 dark:bg-neutral-950/95 p-4 backdrop-blur-2xl transition-all duration-500 md:hidden pointer-events-auto ${
                    mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                <div className="pointer-events-none absolute left-1/3 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-500/15 dark:bg-amber-500/5 blur-[110px]" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 translate-x-1/2 rounded-full bg-amber-600/10 dark:bg-amber-600/5 blur-[110px]" />

                <div className="relative mx-auto flex h-full w-full max-w-md flex-col rounded-[2rem] border border-slate-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 p-5 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.1)] dark:shadow-[0_18px_60px_-24px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-neutral-800 bg-slate-50/80 dark:bg-neutral-800/50 px-3 py-2">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 outline-none"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/10 transition-all duration-500 group-hover:scale-105">
                                <UtensilsCrossed size={14} />
                            </span>
                            <span className="font-['Playfair_Display',serif] text-xl font-semibold tracking-wide text-slate-900 dark:text-white">
                                Resto<span className="text-amber-600 dark:text-amber-500 italic">Web</span>
                            </span>
                        </Link>

                        <div className="flex gap-2">
                            <button
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white"
                                aria-label="Toggle tema"
                            >
                                {resolvedAppearance === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white"
                                aria-label="Tutup menu"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        {mobileMenuLinks.map((link, index) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                                        active
                                            ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-500/10 shadow-sm'
                                            : 'border-slate-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 hover:border-slate-200 hover:bg-slate-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            active ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 group-hover:text-slate-700 dark:group-hover:text-neutral-200'
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={`block text-base font-semibold ${
                                                active ? 'text-amber-900 dark:text-amber-500' : 'text-slate-800 dark:text-neutral-200'
                                            }`}
                                        >
                                            {link.label}
                                        </span>
                                        <span className="block truncate text-xs text-slate-500 dark:text-neutral-400">{link.subtitle}</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-300 dark:text-neutral-600">0{index + 1}</span>
                                        <ChevronRight
                                            size={16}
                                            className={`transition-transform group-hover:translate-x-0.5 ${
                                                active ? 'text-amber-600 dark:text-amber-500' : 'text-slate-300 dark:text-neutral-600'
                                            }`}
                                        />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                        <Link href="/reservations/create" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="h-13 w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 text-base font-semibold text-white shadow-xl shadow-amber-900/20 transition-all duration-300 hover:brightness-110">
                                Pesan Meja Sekarang
                            </Button>
                        </Link>
                        {!auth.user ? (
                            <Link href={login().url} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                <Button
                                    variant="outline"
                                    className="h-13 w-full rounded-2xl border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-medium text-slate-700 dark:text-neutral-300 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                                >
                                    Login Area Staf
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex gap-3">
                                {auth.user.avatar ? (
                                    <img 
                                        src={auth.user.avatar} 
                                        alt={auth.user.name} 
                                        className="h-13 w-13 shrink-0 rounded-2xl border border-slate-200 dark:border-neutral-700 object-cover shadow-sm bg-white dark:bg-neutral-800"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="flex h-13 w-13 shrink-0 flex-col items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-900/50">
                                        <span className="text-sm font-bold">{auth.user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    </div>
                                )}
                                {auth.user.role === 'customer' ? (
                                    <Link href="/reservations/history" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="h-13 w-full rounded-2xl border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-medium text-slate-700 dark:text-neutral-300 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                                        >
                                            Reservasi Saya
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={dashboardUrl} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                                        <Button
                                            variant="outline"
                                            className="h-13 w-full rounded-2xl border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-base font-medium text-slate-700 dark:text-neutral-300 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
                                        >
                                            Ke Dasbor
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/logout" method="post" as="button" className="shrink-0" onClick={() => setMobileMenuOpen(false)}>
                                    <Button
                                        variant="outline"
                                        className="h-13 w-13 shrink-0 rounded-2xl border-slate-200 bg-white px-4 text-rose-500 hover:bg-rose-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-rose-950/30"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <CartDrawer />
        </>
    );
}
