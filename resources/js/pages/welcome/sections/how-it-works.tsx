import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, ClipboardCheck, MailCheck, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Pilih Jadwal',
        desc: 'Tentukan tanggal and waktu yang Anda inginkan untuk pengalaman yang tak terlupakan.',
        icon: Calendar,
    },
    {
        step: '02',
        title: 'Konfigurasi',
        desc: 'Lengkapi kriteria reservasi and preferensi khusus Anda melalui sistem kami.',
        icon: ClipboardCheck,
    },
    {
        step: '03',
        title: 'Validasi',
        desc: "Sistem kami akan memproses and memvalidasi ketersediaan secara instan.",
        icon: MailCheck,
    },
    {
        step: '04',
        title: 'Experience',
        desc: 'Hadir and biarkan tim kurasi kami memberikan pelayanan gastronomi terbaik.',
        icon: Rocket,
    },
];

export default function HowItWorks() {
    return (
        <section className="relative overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0B] py-32 transition-colors duration-500 font-['Inter',sans-serif]">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-8">
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase glow-amber"
                    >
                        The Process
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter"
                    >
                        Arsitektur <span className="italic font-serif opacity-30">Pemesanan</span>
                    </motion.h2>
                    <p className="mx-auto max-w-2xl text-slate-500 dark:text-neutral-400 text-lg font-medium">
                        Empat langkah presisi untuk mengamankan tempat Anda di destinasi kuliner paling eksklusif.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map((step, idx) => (
                        <motion.div 
                            key={step.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className="glass-card flex h-full flex-col items-center text-center p-10 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-border dark:border-white/5 transition-all duration-700 hover:-translate-y-4 hover:border-amber-500/30 hover:shadow-amber-500/10">
                                {/* Icon & Step Number */}
                                <div className="relative mb-10">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-50 dark:bg-white/5 transition-all duration-700 group-hover:bg-amber-500 group-hover:rotate-[15deg]">
                                        <step.icon className="h-8 w-8 text-amber-600 dark:text-amber-500 transition-colors duration-700 group-hover:text-black" />
                                    </div>
                                    <span className="absolute -bottom-4 -right-4 font-['Playfair_Display',serif] text-4xl font-black text-slate-200 dark:text-neutral-800 transition-colors duration-700 group-hover:text-amber-500/40">
                                        {step.step}
                                    </span>
                                </div>

                                <h3 className="mb-4 text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                    {step.title}
                                </h3>
                                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-neutral-500">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Action */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <Link href="/reservations/create">
                        <Button
                            className="group h-16 rounded-[1.25rem] bg-slate-900 dark:bg-white px-12 text-[11px] font-black uppercase tracking-[0.2em] text-white dark:text-black shadow-2xl transition-all hover:scale-105 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500"
                        >
                            Initiate Reservation Now
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

