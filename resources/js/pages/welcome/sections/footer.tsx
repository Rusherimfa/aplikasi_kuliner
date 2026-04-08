import { Link } from '@inertiajs/react';
import { UtensilsCrossed, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { login } from '@/routes';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white text-slate-500">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                                <UtensilsCrossed size={20} />
                            </span>
                            <span className="font-['Playfair_Display',serif] text-2xl font-bold text-slate-900">
                                Resto<span className="text-amber-700">Web</span>
                            </span>
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-500">
                            A culinary destination where tradition meets innovation. We craft every dish with intention, every
                            moment with care.
                        </p>
                        <div className="flex gap-3">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-amber-700 hover:text-white"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-5 text-sm font-semibold tracking-wider text-slate-900 uppercase">Navigation</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: 'Our Menu', href: '/catalog' },
                                { label: 'Reserve a Table', href: '/reservations/create' },
                                { label: 'The Experience', href: '/experience' },
                                { label: 'Staff Login', href: login().url },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="inline-block transition-all hover:translate-x-1 hover:text-amber-700"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-5 text-sm font-semibold tracking-wider text-slate-900 uppercase">Contact</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-600" />
                                <span>Jl. Sudirman No. 123, Jakarta Pusat 10220</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={15} className="shrink-0 text-amber-600" />
                                <span>(021) 555-0123</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={15} className="shrink-0 text-amber-600" />
                                <span>hello@restoweb.id</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock size={15} className="shrink-0 text-amber-600" />
                                <span>Daily 11:00 AM – 11:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} RestoWeb. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-amber-700 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-amber-700 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
