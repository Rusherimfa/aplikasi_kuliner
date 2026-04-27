import { Head, usePage } from '@inertiajs/react';
import { Scale, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import { useState } from 'react';

export default function Terms() {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-500 selection:bg-sky-100 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
            <Head title={`${__('Terms of Engagement')} — Ocean's Resto`} />

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
                            className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-8 ring-1 ring-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.1)]"
                        >
                            <Scale size={40} strokeWidth={1.5} />
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic sm:text-5xl"
                        >
                            {__('Terms of Engagement')}
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-lg font-medium text-slate-500 dark:text-neutral-400"
                        >
                            {__('The agreement between the guest and Ocean\'s Resto. Our mutual commitment to excellence.')}
                        </motion.p>
                    </div>

                    {/* Content */}
                    <div className="space-y-16">
                        {[
                            {
                                icon: CheckCircle,
                                title: __('Reservation Protocol'),
                                content: __('By booking a table, you agree to arrive within 15 minutes of your scheduled time. Late arrivals may result in the reallocation of your table to ensure optimal flow of our gastronomic experience.')
                            },
                            {
                                icon: AlertCircle,
                                title: __('Cancellations'),
                                content: __('Cancellations must be made at least 24 hours in advance. Deposits for premium experiences or private bookings are non-refundable but may be credited for future visits.')
                            },
                            {
                                icon: FileText,
                                title: __('Code of Conduct'),
                                content: __('We maintain an environment of refined elegance. We reserve the right to refuse service to anyone whose behavior disrupts the sanctuary of flavor we have created for our guests.')
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
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-500 shadow-sm transition-transform group-hover:scale-110">
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
                                {__('Agreement Questions?')}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                                {__('For detailed inquiries regarding our service protocols, please reach out to our legal liaison.')}
                            </p>
                            <a href="mailto:legal@oceans-resto.id" className="inline-flex items-center gap-2 text-amber-500 font-bold uppercase text-[10px] tracking-widest hover:text-amber-600 transition-colors">
                                legal@oceans-resto.id <ChevronRight size={14} />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
