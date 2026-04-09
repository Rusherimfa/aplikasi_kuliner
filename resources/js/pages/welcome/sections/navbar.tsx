import { Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, Home, BookOpen, CalendarPlus, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { useCart } from '@/hooks/use-cart';
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
                            ? 'border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-2xl'
                            : 'border-slate-200/50 bg-white/50 backdrop-blur-sm'
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
                        <span className="font-['Playfair_Display',serif] text-xl font-semibold tracking-wide text-slate-900">
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
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 ${
                                    isActive(link.href) ? 'bg-slate-100 text-amber-700 shadow-sm' : 'text-slate-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden shrink-0 items-center gap-3 md:flex">
                        {auth.user ? (
                            <Link href={dashboardUrl}>
                                <Button
                                    variant="outline"
                                    className="h-10 rounded-full border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                                >
                                    Ke Dasbor
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login().url}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
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
                            onClick={() => setCartOpen(true)}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
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
                <nav className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full border border-slate-200/60 bg-white/90 px-6 py-2 pb-3 pt-2 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
                    <Link href="/" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/') ? 'bg-amber-100 text-amber-700' : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-50'}`}>
                            <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/') ? 'text-amber-700' : 'text-slate-500 group-hover:text-slate-800'}`}>Beranda</span>
                    </Link>
                    
                    <Link href="/catalog" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/catalog') ? 'bg-amber-100 text-amber-700' : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-50'}`}>
                            <BookOpen size={20} strokeWidth={isActive('/catalog') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/catalog') ? 'text-amber-700' : 'text-slate-500 group-hover:text-slate-800'}`}>Menu</span>
                    </Link>
                    
                    <button 
                        onClick={() => setCartOpen(true)}
                        className="group flex flex-col items-center gap-1 mt-1 transition-colors relative"
                    >
                        <div className="p-1.5 rounded-full text-slate-400 transition-colors group-hover:bg-slate-50 group-hover:text-slate-700">
                            <ShoppingBag size={20} strokeWidth={2} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-600 text-[8px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide text-slate-500 group-hover:text-slate-800">Keranjang</span>
                    </button>
                    
                    <Link href="/reservations/create" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/reservations') ? 'bg-amber-100 text-amber-700' : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-50'}`}>
                            <CalendarPlus size={20} strokeWidth={isActive('/reservations') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/reservations') ? 'text-amber-700' : 'text-slate-500 group-hover:text-slate-800'}`}>Pesan</span>
                    </Link>
                    
                    <button 
                        className="group flex flex-col items-center gap-1 mt-1 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <div className="p-1.5 rounded-full text-slate-400 transition-colors group-hover:bg-slate-50 group-hover:text-slate-700">
                            <MenuIcon size={20} strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide text-slate-500 group-hover:text-slate-800">Lainnya</span>
                    </button>
                </nav>
            </div>

            {/* Premium Full-screen Mobile Overlay */}
            <div
                className={`fixed inset-0 z-50 bg-slate-50/95 p-4 backdrop-blur-2xl transition-all duration-500 md:hidden ${
                    mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                <div className="pointer-events-none absolute left-1/3 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-500/15 blur-[110px]" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 translate-x-1/2 rounded-full bg-amber-600/10 blur-[110px]" />

                <div className="relative mx-auto flex h-full w-full max-w-md flex-col rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-[0_18px_60px_-24px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 outline-none"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/10 transition-all duration-500 group-hover:scale-105">
                                <UtensilsCrossed size={14} />
                            </span>
                            <span className="font-['Playfair_Display',serif] text-xl font-semibold tracking-wide text-slate-900">
                                Resto<span className="text-amber-600 italic">Web</span>
                            </span>
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            aria-label="Tutup menu"
                        >
                            <X size={18} />
                        </button>
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
                                            ? 'border-amber-200 bg-amber-50 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    <span
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            active ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span
                                            className={`block text-base font-semibold ${
                                                active ? 'text-amber-900' : 'text-slate-800'
                                            }`}
                                        >
                                            {link.label}
                                        </span>
                                        <span className="block truncate text-xs text-slate-500">{link.subtitle}</span>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-300">0{index + 1}</span>
                                        <ChevronRight
                                            size={16}
                                            className={`transition-transform group-hover:translate-x-0.5 ${
                                                active ? 'text-amber-600' : 'text-slate-300'
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
                                    className="h-13 w-full rounded-2xl border-slate-200 bg-white text-base font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Login Area Staf
                                </Button>
                            </Link>
                        ) : (
                            <Link href={dashboardUrl} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                <Button
                                    variant="outline"
                                    className="h-13 w-full rounded-2xl border-slate-200 bg-white text-base font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Ke Dasbor
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            
            <CartDrawer />
        </>
    );
}
