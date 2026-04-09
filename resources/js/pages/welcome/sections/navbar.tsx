import { Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, Home, BookOpen, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { useEffect, useState } from 'react';

interface NavbarProps {
    auth: any;
    dashboardUrl: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ auth, dashboardUrl, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();

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
                            ? 'border-white/10 bg-[#0A0A0B]/80 shadow-2xl backdrop-blur-2xl'
                            : 'border-white/10 bg-white/[0.02] backdrop-blur-sm'
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
                        <span className="font-['Playfair_Display',serif] text-xl font-semibold tracking-wide text-white">
                            Resto<span className="text-amber-500 italic">Web</span>
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
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:text-white ${
                                    isActive(link.href) ? 'bg-white/10 text-white' : 'text-white/70'
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
                                    className="h-10 rounded-full border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
                                >
                                    Ke Dasbor
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login().url}
                                    className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
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
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation Bar */}
            <div 
                className={`fixed bottom-0 left-0 right-0 z-40 p-4 transition-transform duration-500 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                }`}
            >
                <nav className="mx-auto flex w-full max-w-sm items-center justify-between rounded-full border border-white/10 bg-[#0A0A0B]/80 px-6 py-2 pb-3 pt-2 shadow-2xl backdrop-blur-2xl">
                    <Link href="/" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/') ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 group-hover:text-white group-hover:bg-white/5'}`}>
                            <Home size={20} strokeWidth={isActive('/') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/') ? 'text-amber-500' : 'text-white/50 group-hover:text-white'}`}>Beranda</span>
                    </Link>
                    
                    <Link href="/catalog" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/catalog') ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 group-hover:text-white group-hover:bg-white/5'}`}>
                            <BookOpen size={20} strokeWidth={isActive('/catalog') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/catalog') ? 'text-amber-500' : 'text-white/50 group-hover:text-white'}`}>Menu</span>
                    </Link>
                    
                    <Link href="/reservations/create" className="group flex flex-col items-center gap-1 mt-1 transition-colors">
                        <div className={`p-1.5 rounded-full transition-colors ${isActive('/reservations') ? 'bg-amber-500/20 text-amber-500' : 'text-white/50 group-hover:text-white group-hover:bg-white/5'}`}>
                            <CalendarPlus size={20} strokeWidth={isActive('/reservations') ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-medium tracking-wide ${isActive('/reservations') ? 'text-amber-500' : 'text-white/50 group-hover:text-white'}`}>Pesan</span>
                    </Link>
                    
                    <button 
                        className="group flex flex-col items-center gap-1 mt-1 transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <div className="p-1.5 rounded-full text-white/50 transition-colors group-hover:bg-white/5 group-hover:text-white">
                            <MenuIcon size={20} strokeWidth={2} />
                        </div>
                        <span className="text-[10px] font-medium tracking-wide text-white/50 group-hover:text-white">Lainnya</span>
                    </button>
                </nav>
            </div>

            {/* Premium Full-screen Mobile Overlay */}
            <div
                className={`fixed inset-0 z-50 flex flex-col justify-center bg-[#0A0A0B]/95 px-8 pt-20 pb-12 backdrop-blur-3xl transition-all duration-500 md:hidden ${
                    mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Decorative floating lights for the menu */}
                <div className="pointer-events-none absolute left-0 top-1/4 h-64 w-64 rounded-full bg-amber-600/10 blur-[100px]" />
                <div className="pointer-events-none absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-amber-800/10 blur-[100px]" />
                
                <div className="relative z-10 flex flex-col items-center gap-10">
                    <div className="flex flex-col items-center gap-8 space-y-2">
                        {[
                            { href: '/', label: 'Beranda' },
                            { href: '/catalog', label: 'Menu Kami' },
                            { href: '/reservations/create', label: 'Reservasi' },
                            { href: '/experience', label: 'Pengalaman' },
                        ].map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative font-['Playfair_Display',serif] text-4xl font-medium transition-colors duration-300 hover:text-amber-400 ${
                                    isActive(link.href) ? 'text-amber-500' : 'text-white/70'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {link.label}
                                <span className={`absolute -bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-amber-500 transition-all duration-300 group-hover:w-full ${isActive(link.href) ? 'w-full' : ''}`} />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 flex w-full max-w-sm flex-col gap-4">
                        <Link href="/reservations/create" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="h-14 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-base font-semibold text-white shadow-xl shadow-amber-900/30 transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-amber-600">
                                Pesan Meja Sekarang
                            </Button>
                        </Link>
                        {!auth.user ? (
                            <Link href={login().url} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="h-14 w-full rounded-full border-white/20 bg-transparent text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/30">
                                    Login Area Staf
                                </Button>
                            </Link>
                        ) : (
                            <Link href={dashboardUrl} className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="h-14 w-full rounded-full border-white/20 bg-transparent text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/30">
                                    Ke Dasbor
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
