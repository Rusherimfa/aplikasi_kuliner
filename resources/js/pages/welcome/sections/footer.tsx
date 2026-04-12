import { Link } from '@inertiajs/react';
import { UtensilsCrossed, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { login } from '@/routes';

export default function Footer() {
    return (
        <footer className="bg-background text-muted-foreground border-t border-border transition-colors duration-500">
            {/* Top decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-900/30">
                                <UtensilsCrossed size={20} />
                            </span>
                            <span className="font-['Playfair_Display',serif] text-2xl font-bold text-foreground">
                                Resto<span className="text-amber-600 dark:text-amber-500">Web</span>
                            </span>
                        </div>
                        <p className="mb-8 max-w-sm text-sm leading-loose">
                            Destinasi kuliner di mana tradisi bertemu inovasi. Kami membuat setiap hidangan dengan niat,
                            setiap momen dengan perhatian.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Facebook, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground/60 shadow-sm transition-all duration-300 hover:border-amber-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-500"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-6 text-xs font-semibold tracking-widest text-foreground uppercase">
                            Navigasi
                        </h4>
                        <ul className="space-y-4 text-sm">
                            {[
                                { label: 'Menu Kami', href: '/catalog' },
                                { label: 'Pesan Meja', href: '/reservations/create' },
                                { label: 'Pengalaman', href: '/experience' },
                                { label: 'Login Staf', href: login().url },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1.5 transition-all hover:text-amber-600 dark:hover:text-amber-500"
                                    >
                                        {link.label}
                                        <ArrowUpRight
                                            size={12}
                                            className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-6 text-xs font-semibold tracking-widest text-foreground uppercase">Kontak</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={14} className="mt-0.5 shrink-0 text-amber-500" />
                                <span className="leading-relaxed">
                                    Jl. Sudirman No. 123, Jakarta Pusat 10220
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={14} className="shrink-0 text-amber-500" />
                                <span>(021) 555-0123</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={14} className="shrink-0 text-amber-500" />
                                <span>hello@restoweb.id</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock size={14} className="shrink-0 text-amber-500" />
                                <span>Setiap Hari 11:00 – 23:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs sm:flex-row">
                    <p>© {new Date().getFullYear()} RestoWeb. Hak cipta dilindungi.</p>
                    <div className="flex gap-6">
                        {['Kebijakan Privasi', 'Syarat Ketentuan'].map((label) => (
                            <a
                                key={label}
                                href="#"
                                className="transition-colors hover:text-amber-600 dark:hover:text-amber-500"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
