import { Link } from '@inertiajs/react';
import { UtensilsCrossed, Menu as MenuIcon, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

interface NavbarProps {
    auth: any;
    dashboardUrl: string;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ auth, dashboardUrl, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                            <UtensilsCrossed size={20} />
                        </span>
                        <span className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-slate-900">
                            Resto
                            <span className="text-amber-700">Web</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
                        <Link
                            href="/catalog"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-amber-700"
                        >
                            Our Menu
                        </Link>
                        <Link
                            href="/reservations/create"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-amber-700"
                        >
                            Reservations
                        </Link>
                        <Link
                            href="/experience"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-amber-700"
                        >
                            The Experience
                        </Link>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden shrink-0 items-center gap-4 md:flex">
                        {auth.user ? (
                            <Link href={dashboardUrl}>
                                <Button
                                    variant="outline"
                                    className="rounded-full border-slate-300 px-6 font-medium hover:bg-slate-50"
                                >
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login().url}
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                                >
                                    Staff Login
                                </Link>
                                <Link href="/reservations/create">
                                    <Button className="rounded-full bg-amber-700 px-6 font-medium text-white shadow-lg shadow-amber-900/10 hover:bg-amber-800">
                                        Book a Table
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="space-y-4 border-t border-slate-100 bg-white px-4 py-6 shadow-lg md:hidden">
                    <Link
                        href="/catalog"
                        className="flex items-center justify-between py-2 font-medium text-slate-700"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Our Menu <ChevronRight size={16} className="text-slate-400" />
                    </Link>
                    <Link
                        href="/reservations/create"
                        className="flex items-center justify-between py-2 font-medium text-slate-700"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Reservations <ChevronRight size={16} className="text-slate-400" />
                    </Link>
                    <Link
                        href="/experience"
                        className="flex items-center justify-between py-2 font-medium text-slate-700"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        The Experience <ChevronRight size={16} className="text-slate-400" />
                    </Link>
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                        <Link href="/reservations/create" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full rounded-full bg-amber-700 text-white hover:bg-amber-800">
                                Book a Table
                            </Button>
                        </Link>
                        {!auth.user && (
                            <Link href={login().url} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full rounded-full border-slate-300">
                                    Staff Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
