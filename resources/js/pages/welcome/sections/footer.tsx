import { Link } from '@inertiajs/react';
import { UtensilsCrossed, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { login } from '@/routes';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="relative bg-[#FAFAFA] dark:bg-[#0A0A0B] text-slate-500 dark:text-neutral-500 border-t border-border dark:border-white/5 transition-colors duration-500 font-['Inter',sans-serif]">
            {/* Top decorative gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

            <div className="mx-auto max-w-7xl px-8 py-24">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-4">
                            <motion.div 
                                whileHover={{ rotate: 15 }}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl"
                            >
                                <UtensilsCrossed size={24} />
                            </motion.div>
                            <span className="font-['Playfair_Display',serif] text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Resto<span className="italic opacity-40">Web</span>
                            </span>
                        </div>
                        
                        <p className="max-w-md text-base leading-relaxed font-medium">
                            Destinasi di mana tradisi bertemu inovasi. Kami kurasikan setiap hidangan dengan presisi gastronomi untuk menciptakan memori yang abadi.
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
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border dark:border-white/5 bg-white dark:bg-white/5 text-slate-400 transition-all hover:bg-amber-500 hover:text-black hover:border-amber-500 shadow-sm"
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
                                Exploration
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { label: 'Our Selection', href: '/catalog' },
                                    { label: 'Private Booking', href: '/reservations/create' },
                                    { label: 'The Experience', href: '/experience' },
                                    { label: 'Strategic Portal', href: login().url },
                                ].map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all hover:text-amber-500"
                                        >
                                            <span className="h-1 w-0 bg-amber-500 transition-all group-hover:w-4" />
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
                                Headquarters
                            </h4>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-amber-500">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-sm font-medium leading-relaxed">
                                        Pahri Business District <br /> Baratie, samarinda
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-amber-500">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium">pahri@restoweb.com</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-amber-500">
                                        <Clock size={18} />
                                    </div>
                                    <span className="text-sm font-medium uppercase tracking-widest">Open Daily 09:00 — 23:00</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Ecosystem Bar */}
                <div className="mt-20 pt-10 border-t border-border dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                        © {new Date().getFullYear()} RestoWeb Gastronomy Ecosystem. Engineered for Excellence.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Protocol', 'Terms of Engagement'].map((label) => (
                            <a
                                key={label}
                                href="#"
                                className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-amber-500"
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

