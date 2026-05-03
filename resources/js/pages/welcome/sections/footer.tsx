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
        <footer className="relative bg-background pt-32 pb-20 overflow-hidden transition-colors duration-1000">
            {/* Artistic Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-32">
                    {/* Brand Section */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="mb-16 relative group"
                    >
                        <div className="h-32 w-32 overflow-hidden rounded-[3rem] bg-white dark:bg-white/5 p-1.5 shadow-4xl border border-black/5 dark:border-white/10 group-hover:rotate-12 transition-all duration-[1s]">
                            <img src="/logo.png" alt="Ocean's Resto" className="h-full w-full object-cover rounded-[2.5rem]" />
                        </div>
                        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </motion.div>
                    
                    <h3 className="font-serif text-6xl sm:text-8xl md:text-[10rem] font-light text-foreground mb-12 tracking-tighter leading-none">
                        {__('The Fish')} <br />
                        <span className="italic font-light opacity-30">{__('Connection.')}</span>
                    </h3>
                    
                    <p className="max-w-2xl text-lg md:text-2xl leading-relaxed text-muted-foreground font-medium mb-20 opacity-70 italic">
                        {__('A culinary destination where the horizon meets the plate. We bridge the gap between deep sea bounty and gastronomic art.')}
                    </p>

                    <div className="flex gap-8 mb-32">
                        {[
                            { Icon: Instagram, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Facebook, href: '#' },
                        ].map(({ Icon, href }, i) => (
                            <motion.a
                                key={i}
                                href={href}
                                whileHover={{ y: -12, rotate: 12, scale: 1.1 }}
                                className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] glass-elite border border-black/5 dark:border-white/5 text-muted-foreground transition-all hover:bg-primary hover:text-white shadow-2xl"
                            >
                                <Icon size={24} strokeWidth={1} />
                            </motion.a>
                        ))}
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-20 py-24 border-y border-black/5 dark:border-white/5">
                        {/* Quick Links */}
                        <div className="flex flex-col items-center">
                            <h4 className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-12">
                                {__('Navigation')}
                            </h4>
                            <ul className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group relative inline-flex items-center text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground transition-all hover:text-foreground"
                                        >
                                            {link.label}
                                            <ArrowUpRight
                                                size={14}
                                                className="ml-2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 text-primary"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact & Status */}
                        <div className="flex flex-col items-center">
                            <h4 className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-12">
                                {__('Sanctuary')}
                            </h4>
                            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
                                <div className="flex items-center gap-4">
                                    <MapPin size={16} className="text-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Balikpapan, ID</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail size={16} className="text-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">info@oceans.id</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone size={16} className="text-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">+62 811 000 000</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                            © {new Date().getFullYear()} Ocean's Resto Luxury Group.
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/30">
                            Designed for Excellence. Inspired by the Sea.
                        </p>
                    </div>
                    
                    <div className="flex gap-12">
                        {[
                            { label: __('Privacy'), href: '/privacy' },
                            { label: __('Terms'), href: '/terms' }
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-primary"
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

