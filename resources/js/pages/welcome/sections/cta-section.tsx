import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

export default function CTASection() {
    const { __ } = useTranslations();
    const magneticReserveRef = useMagnetic();
    const magneticCatalogRef = useMagnetic();

    return (
        <section className="relative py-32 md:py-64 overflow-hidden bg-background transition-colors duration-1000">
            {/* Cinematic Background Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2670&auto=format&fit=crop"
                    alt="Ocean sunset"
                    className="h-full w-full object-cover opacity-30 dark:opacity-20 grayscale-[0.5] scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-primary)/0.05_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-8 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
                    {/* Left Side: Brand Vision */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                        >
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{__('Eternal Connection')}</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="font-serif text-6xl md:text-8xl lg:text-[10rem] font-light text-foreground leading-[0.85] tracking-tighter mb-12"
                        >
                            <span className="text-foreground/40 block mb-4">{__('Capturing')}</span>
                            <span className="italic block">{__('The Ocean')}</span>
                            <span className="font-bold text-primary block">{__('Soul.')}</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl mb-16 opacity-80"
                        >
                            {__('Step into a world where every wave tells a story and every dish is a masterpiece. Your sanctuary of gastronomic excellence awaits.')}
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-8 w-full sm:w-auto">
                            <div ref={magneticReserveRef as any}>
                                <Link href="/reservations/create" className="w-full">
                                    <Button
                                        size="lg"
                                        className="group relative h-20 px-16 rounded-[2rem] bg-primary text-[12px] font-black uppercase tracking-[0.4em] text-white shadow-[0_30px_60px_-15px_oklch(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
                                    >
                                        <span className="relative z-10 flex items-center gap-4">
                                            {__('Reserve Table')}
                                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-3" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </Button>
                                </Link>
                            </div>
                            <div ref={magneticCatalogRef as any}>
                                <Link href="/catalog" className="w-full">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-20 px-12 rounded-[2rem] border-primary/20 bg-background/50 text-[12px] font-black uppercase tracking-[0.4em] backdrop-blur-xl transition-all hover:bg-primary/10 active:scale-95 w-full sm:w-auto"
                                    >
                                        {__('Explore Flavors')}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Visual Frame (To address "empty" feeling) */}
                    <div className="relative hidden lg:block">
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.5 }}
                            className="relative aspect-[3/4] max-w-md ml-auto"
                        >
                            <div className="glass-elite h-full w-full rounded-[4rem] p-4 rotate-3 group-hover:rotate-0 transition-all duration-1000 shadow-4xl">
                                <div className="h-full w-full overflow-hidden rounded-[3rem]">
                                    <img 
                                        src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop" 
                                        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                                        alt="" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-12 left-12">
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-2 block">{__('Fine Dining')}</span>
                                        <h4 className="font-serif text-3xl font-light text-white italic">{__('Beyond the horizon.')}</h4>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Stats */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: -1 }}
                                className="absolute -top-12 -left-12 glass-elite p-8 rounded-3xl shadow-2xl"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mb-2">{__('Rating')}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-serif text-4xl font-bold">4.9</span>
                                    <div className="flex text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}


