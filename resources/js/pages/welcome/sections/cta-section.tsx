import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0B] py-32 transition-colors duration-500 font-['Inter',sans-serif]">
            {/* Background Texture & Ambient */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
                    alt="Atmosphere"
                    className="h-full w-full object-cover opacity-10 dark:opacity-[0.05] grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-transparent to-[#FAFAFA] dark:from-[#0A0A0B] dark:via-transparent dark:to-[#0A0A0B]" />
            </div>

            {/* Premium Decorative Ambient */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
            
            <div className="relative z-10 mx-auto max-w-5xl px-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-card relative overflow-hidden rounded-[3rem] bg-slate-900 dark:bg-white/[0.02] border border-white/5 p-12 md:p-24 text-center shadow-3xl"
                >
                    {/* Inner Decoration */}
                    <div className="absolute top-0 left-0 h-40 w-40 bg-amber-500/10 blur-[80px]" />
                    <div className="absolute bottom-0 right-0 h-40 w-40 bg-amber-600/10 blur-[80px]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase glow-amber"
                        >
                            <Sparkles size={12} />
                            <span>Reserved Excellence</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="font-['Playfair_Display',serif] text-5xl font-black text-white md:text-7xl tracking-tight leading-tight"
                        >
                            Malam Sempurnamu <br />
                            <span className="italic font-serif opacity-40">Menanti Anda</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-lg font-medium text-slate-400 max-w-2xl mx-auto"
                        >
                            Kurasi pengalaman bersantap yang tak terlupakan. Dari persiapan bahan pilihan hingga penyajian yang artistik.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col justify-center gap-6 pt-6 sm:flex-row"
                        >
                            <Link href="/reservations/create">
                                <Button
                                    className="group h-16 rounded-[1.25rem] bg-amber-500 px-12 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-amber-500/20 transition-all hover:scale-105 hover:bg-white active:scale-95"
                                >
                                    Reserver Now
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/catalog">
                                <Button
                                    variant="outline"
                                    className="h-16 rounded-[1.25rem] border-white/10 bg-white/5 px-12 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
                                >
                                    Explore Catalog
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

