import { Link, usePage, router } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, Home, BookOpen, CalendarPlus, ChevronRight, Moon, Sun, LogOut, Quote, ShoppingBag, User, LayoutDashboard, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
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
    
    // Magnetic Refs
    const magneticLogoRef = useMagnetic();
    const magneticCtaRef = useMagnetic();
    const magneticThemeRef = useMagnetic();
    const magneticCartRef = useMagnetic();

    const mobileMenuLinks = [
        { href: '/', label: 'Beranda', subtitle: 'Halaman utama kami', icon: Home },
        { href: '/catalog', label: 'Menu', subtitle: 'Eksplorasi rasa', icon: BookOpen },
        { href: '/reservations/create', label: 'Reservasi', subtitle: 'Pesan meja Anda', icon: CalendarPlus },
        { href: '/experience', label: 'Pengalaman', subtitle: 'Cerita dibalik layar', icon: UtensilsCrossed },
        { href: '/testimonials', label: 'Cerita Tamu', subtitle: 'Kesan pelanggan', icon: Quote },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (path: string) => url.startsWith(path) && (path !== '/' || url === '/');

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[60] p-4 sm:p-6 lg:p-10 pointer-events-none">
                <nav
                    className={`mx-auto flex h-20 max-w-6xl items-center justify-between pointer-events-auto rounded-full border px-6 transition-all duration-700 glass-card glass-highlight shadow-2xl ${
                        scrolled 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-0 opacity-100 border-white/5 bg-background/20'
                    }`}
                >
                    {/* Logo Section */}
                    <div ref={magneticLogoRef as any}>
                        <Link 
                            href="/" 
                            className="group flex items-center gap-4 outline-none" 
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xl transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                                <UtensilsCrossed size={18} />
                            </span>
                            <span className="font-serif text-2xl font-light tracking-tight text-foreground">
                                Resto<span className="italic text-primary font-medium">Web</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden flex-1 items-center justify-center space-x-2 md:flex">
                        {[
                            { href: '/catalog', label: 'Menu' },
                            { href: '/reservations/create', label: 'Reservasi' },
                            { href: '/experience', label: 'Pengalaman' },
                            { href: '/testimonials', label: 'Cerita Tamu' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:text-primary ${
                                    isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-colors overflow-hidden outline-none cursor-pointer">
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
                                                <span className="text-[11px] font-bold uppercase tracking-widest">Pengaturan Profil</span>
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild className="rounded-xl px-3 py-3.5 focus:bg-primary focus:text-primary-foreground group transition-all duration-300">
                                            <Link href={auth.user.role === 'customer' ? '/reservations/history' : dashboardUrl} className="flex items-center w-full">
                                                {auth.user.role === 'customer' ? (
                                                    <History className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                ) : (
                                                    <LayoutDashboard className="mr-3 h-4 w-4 text-primary group-focus:text-primary-foreground transition-colors" />
                                                )}
                                                <span className="text-[11px] font-bold uppercase tracking-widest">
                                                    {auth.user.role === 'customer' ? 'Riwayat Pesanan' : 'Panel Dashboard'}
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        
                                        <DropdownMenuItem 
                                            onClick={() => router.post('/logout')}
                                            className="rounded-xl px-3 py-3.5 text-rose-500 focus:bg-rose-500 focus:text-white group transition-all duration-300 cursor-pointer"
                                        >
                                            <LogOut className="mr-3 h-4 w-4 transition-colors" />
                                            <span className="text-[11px] font-bold uppercase tracking-widest">Keluar Sesi</span>
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
                            <div ref={magneticThemeRef as any}>
                                <button
                                    onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
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
                                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/5"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <MenuIcon size={20} />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Nav */}
            {!mobileMenuOpen && (
                <div className="fixed bottom-8 left-4 right-4 z-[60] md:hidden">
                    <nav className="mx-auto flex h-16 max-w-sm items-center justify-around rounded-full glass-card glass-highlight px-6 shadow-2xl">
                        {[
                            { href: '/', icon: Home },
                            { href: '/catalog', icon: BookOpen },
                            { icon: ShoppingBag, onClick: () => setCartOpen(true), count: cartCount },
                            { href: '/reservations/create', icon: CalendarPlus }
                        ].map((item, i) => (
                            item.href ? (
                                <Link key={i} href={item.href} className={`relative p-2 rounded-full transition-colors ${isActive(item.href) ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}>
                                    <item.icon size={22} />
                                </Link>
                            ) : (
                                <button key={i} onClick={item.onClick} className="relative p-2 text-muted-foreground">
                                    <item.icon size={22} />
                                    {item.count ? (
                                        <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary" />
                                    ) : null}
                                </button>
                            )
                        ))}
                    </nav>
                </div>
            )}

            {/* Full-screen Mobile Menu */}
            <div className={`fixed inset-0 z-[100] bg-background p-6 transition-all duration-700 md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible scale-110'}`}>
                <div className="flex items-center justify-between mb-12">
                     <span className="font-serif text-3xl font-light">Resto<span className="italic text-primary">Web</span></span>
                     <button onClick={() => setMobileMenuOpen(false)} className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5">
                        <X size={24} />
                     </button>
                </div>
                
                <div className="flex flex-col gap-6">
                    {mobileMenuLinks.map((link, idx) => (
                        <Link 
                            key={idx} 
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
                    ))}

                    {/* Profile & Logout for Mobile */}
                    {auth.user && (
                        <>
                            <Link 
                                href="/settings/profile" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center justify-between border-b border-white/5 pb-6"
                            >
                                <div className="flex flex-col">
                                    <span className="text-4xl font-serif text-foreground">Profil Saya</span>
                                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Pengaturan akun & avatar</span>
                                </div>
                                <User size={20} className="text-primary/40 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    router.post('/logout');
                                }}
                                className="group flex items-center justify-between border-b border-white/5 pb-6 text-rose-500"
                            >
                                <div className="flex flex-col text-left">
                                    <span className="text-4xl font-serif">Keluar Sesi</span>
                                    <span className="text-xs opacity-50 uppercase tracking-widest mt-1">Selesaikan kunjungan Anda</span>
                                </div>
                                <LogOut size={20} className="opacity-40 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </>
                    )}
                </div>

                <div className="absolute bottom-12 left-6 right-6">
                    <Link href="/reservations/create" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full h-18 rounded-[2rem] bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] overflow-hidden group">
                           Pesan Meja Sekarang
                        </Button>
                    </Link>
                </div>
            </div>

            <CartDrawer />
        </>
    );
}

