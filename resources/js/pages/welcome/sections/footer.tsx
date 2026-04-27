import { Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { login, dashboard } from '@/routes';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';

export default function Footer() {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const dashboardUrl = dashboard().url;

    const links = [
        { label: __('Our Selection'), href: '/catalog' },
        { label: __('Private Booking'), href: '/reservations/create' },
        { label: __('The Experience'), href: '/experience' },
    ];

    if (auth.user && auth.user.role !== 'customer') {
        links.push({ label: __('Dashboard Panel'), href: dashboardUrl });
    }
    return (
        <footer className="relative bg-[#FAFAFA] dark:bg-[#0A0A0B] text-slate-500 dark:text-neutral-500 border-t border-border dark:border-white/5 transition-colors duration-500 font-['Inter',sans-serif]">
            {/* Top decorative gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />

            <div className="mx-auto max-w-7xl px-8 py-24">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="flex h-16 items-center justify-center"
                            >
                                <div className="h-16 w-16 overflow-hidden rounded-full bg-white/10 p-0.5 shadow-xl">
                                    <img src="/logo.png" alt="Ocean's Resto" className="h-full w-full object-cover rounded-full drop-shadow-md" />
                                </div>
                            </motion.div>
                        </div>
                        
                        <p className="max-w-md text-base leading-relaxed font-medium">
                            {__('A destination where tradition meets innovation. We curate every dish with gastronomic precision to create eternal memories.')}
                        </p>

                        <div className="flex gap-4">
                            {[
                                { Icon: Instagram, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Facebook, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <motion.a
                                    key={i}
                                    href={href}
                                    whileHover={{ y: -5 }}
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border dark:border-white/5 bg-white dark:bg-white/5 text-slate-400 transition-all hover:bg-sky-500 hover:text-white hover:border-sky-500 shadow-sm"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Quick Links */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase px-1">
                                {__('Exploration')}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all hover:text-sky-500"
                                        >
                                            <span className="h-1 w-0 bg-sky-500 transition-all group-hover:w-4" />
                                            {link.label}
                                            <ArrowUpRight
                                                size={14}
                                                className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact & Status */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-900 dark:text-white uppercase px-1">
                                {__('Headquarters')}
                            </h4>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-sky-500">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-sm font-medium leading-relaxed">
                                        {__('Kompleks Ruko Bandar Blok N1, Jl. Jenderal Sudirman No.26, Balikpapan')}
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-sky-500">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium">info@oceans-balikpapan.id</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-sky-500">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-sm font-medium uppercase tracking-widest">{__('Open Daily 10:00 AM — 11:00 PM')}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Ecosystem Bar */}
                <div className="mt-20 pt-10 border-t border-border dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        © {new Date().getFullYear()} Ocean's Resto The Fish Connection.
                    </p>
                    <div className="flex gap-8">
                        {[
                            { label: __('Privacy Protocol'), href: '/privacy' },
                            { label: __('Terms of Engagement'), href: '/terms' }
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-sky-500"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

