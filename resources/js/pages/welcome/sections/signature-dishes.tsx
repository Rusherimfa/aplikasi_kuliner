import { Link } from '@inertiajs/react';
import { UtensilsCrossed, ArrowRight, Flame, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { login } from '@/routes';
import { motion } from 'framer-motion';

interface SignatureDishesProps {
    bestSellers: any[];
    auth: any;
}

export default function SignatureDishes({ bestSellers, auth }: SignatureDishesProps) {
    return (
        <section className="bg-[#FAFAFA] dark:bg-[#0A0A0B] py-32 transition-colors duration-500 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
                {/* Section header */}
                <div className="mb-20 flex flex-col items-center text-center max-w-3xl mx-auto">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6 inline-block rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase glow-amber"
                    >
                        Chef's Selection
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tight"
                    >
                        Hidangan <span className="italic font-serif opacity-40">Ikonis</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto text-slate-500 dark:text-neutral-400 text-lg font-medium leading-relaxed"
                    >
                        Mahakarya kuliner yang mendefinisikan identitas kami. Dibuat dengan presisi tinggi menggunakan bahan-bahan musiman terbaik.
                    </motion.p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {!bestSellers || bestSellers.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-white/5 p-5 space-y-6">
                                <Skeleton className="h-64 w-full rounded-[2rem] dark:bg-white/5" />
                                <div className="space-y-4">
                                    <Skeleton className="h-6 w-3/4 dark:bg-white/5" />
                                    <Skeleton className="h-4 w-full dark:bg-white/5" />
                                    <Skeleton className="h-12 w-full rounded-2xl dark:bg-white/5" />
                                </div>
                            </div>
                        ))
                    ) : (
                        bestSellers.map((item: any, index: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.7 }}
                            className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-border dark:border-white/5 shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:border-amber-500/30 hover:shadow-amber-500/10 ring-1 ring-transparent hover:ring-amber-500/10"
                        >
                            {/* Image area */}
                            <div className="relative aspect-[4/5] overflow-hidden m-3 rounded-[2rem]">
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-700 opacity-100 group-hover:opacity-0" />
                                
                                {/* Placeholder icon */}
                                <div className="absolute inset-0 flex items-center justify-center bg-muted/30 dark:bg-white/5">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-500 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-12">
                                        <UtensilsCrossed size={40} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Category badge */}
                                <div className="absolute top-5 left-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-widest">
                                    {item.category}
                                </div>

                                {/* Popular badge */}
                                {item.is_best_seller && (
                                    <div className="absolute top-5 right-5 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-1.5 text-[10px] font-black text-black uppercase tracking-widest">
                                        <Flame size={12} />
                                        Signature
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-8 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{item.name}</h3>
                                    <span className="text-sm font-black text-amber-500">
                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <p className="mb-8 line-clamp-2 flex-1 text-sm font-medium leading-relaxed text-slate-500 dark:text-neutral-400">
                                    {item.description || 'Simfoni rasa yang dikurasi khusus for memanjakan setiap indra Anda.'}
                                </p>
                                <Link href={auth.user ? '/dashboard' : login().url}>
                                    <Button className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white/5 border border-transparent dark:border-white/10 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 dark:hover:text-black group">
                                        Pesan Sekarang
                                        <ShoppingCart size={14} className="ml-2 transition-transform group-hover:scale-110" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    ))
                    )}
                </div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <Link href="/catalog">
                        <Button
                            variant="outline"
                            className="h-16 px-12 rounded-2xl border-border bg-transparent text-sm font-black uppercase tracking-[0.2em] transition-all hover:bg-white dark:hover:bg-white/5 hover:scale-105 active:scale-95 group"
                        >
                            Jelajahi Menu Lengkap <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

