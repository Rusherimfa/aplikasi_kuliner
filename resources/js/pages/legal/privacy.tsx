import { Head, usePage } from '@inertiajs/react';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import { useState } from 'react';

export default function Privacy() {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-500 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
            <Head title={`${__('Privacy Protocol')} — Ocean's Resto`} />

            <Navbar 
                auth={auth} 
                dashboardUrl="/dashboard" 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen} 
            />

            <main className="relative z-10 pt-40 pb-32">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-8 ring-1 ring-sky-500/20 shadow-[0_0_50px_rgba(14,165,233,0.1)]"
                        >
                            <Shield size={40} strokeWidth={1.5} />
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic sm:text-5xl"
                        >
                            {__('Privacy Protocol')}
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-lg font-medium text-slate-500 dark:text-neutral-400"
                        >
                            {__('Last updated: April 2026. How we protect your digital gastronomic identity.')}
                        </motion.p>
                    </div>

                    {/* Content */}
                    <div className="space-y-16">
                        {[
                            {
                                icon: Eye,
                                title: __('Data Collection'),
                                content: __('We collect information that you provide directly to us, such as when you create a reservation, order food, or contact us for support. This includes your name, email, phone number, and preferences.')
                            },
                            {
                                icon: Lock,
                                title: __('Information Security'),
                                content: __('Ocean\'s Resto implements state-of-the-art encryption protocols to safeguard your personal data. We treat your privacy with the same precision we apply to our culinary creations.')
                            },
                            {
                                icon: FileText,
                                title: __('Usage of Data'),
                                content: __('Your data is used exclusively to enhance your experience, manage bookings, process payments, and provide concierge assistance via our AI and staff support.')
                            }
                        ].map((section, i) => (
                            <motion.section
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative flex gap-8 items-start"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sky-500 shadow-sm transition-transform group-hover:scale-110">
                                    <section.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic mb-4">
                                        {section.title}
                                    </h3>
                                    <p className="text-base leading-relaxed text-slate-600 dark:text-neutral-400 font-medium">
                                        {section.content}
                                    </p>
                                </div>
                            </motion.section>
                        ))}

                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="p-10 rounded-[3rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                        >
                            <h4 className="text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase mb-4">
                                {__('Need clarification?')}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                                {__('If you have questions about our digital protocols, our concierge team is available 24/7.')}
                            </p>
                            <a href="mailto:privacy@oceans-resto.id" className="inline-flex items-center gap-2 text-sky-500 font-bold uppercase text-[10px] tracking-widest hover:text-sky-600 transition-colors">
                                privacy@oceans-resto.id <ChevronRight size={14} />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
