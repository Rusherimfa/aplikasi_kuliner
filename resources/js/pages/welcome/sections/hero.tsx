import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown, Trophy, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
    const scaleBg = useTransform(scrollY, [0, 1000], [1, 1.15]);
    
    return (
        <main className="relative min-h-[110vh] overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-500">
            {/* Background layers */}
            <motion.div className="absolute inset-0 z-0" style={{ scale: scaleBg }}>
                <img
                    src="https://images.unsplash.com/photo-1550966841-3ee5ad40bf3c?q=80&w=2670&auto=format&fit=crop"
                    alt="Fine dining table setup"
                    className="h-full w-full object-cover opacity-[0.2] dark:opacity-[0.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] dark:from-[#0A0A0B] via-[#FAFAFA]/95 dark:via-[#0A0A0B]/95 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] dark:from-[#0A0A0B] via-transparent to-transparent" />
                
                {/* Textures */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.03] dark:opacity-[0.05]" />
            </motion.div>

            {/* Premium Ambient Orbs */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[140px] animate-pulse" />
            <div className="pointer-events-none absolute bottom-1/4 -left-24 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[100px]" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 pb-24 lg:px-8">
                <div className="grid items-center gap-20 lg:grid-cols-2">
                    {/* Left column - Content */}
                    <div className="max-w-2x animate-in fade-in slide-in-from-left-8 duration-1000">
                        {/* Award badge */}
                        <div className="mb-10 inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase shadow-[0_0_30px_rgba(245,158,11,0.1)] glow-amber">
                            <Trophy size={12} className="text-amber-500" />
                            <span>Michelin Recognized Excellence 2024</span>
                        </div>

                        {/* Headline */}
                        <h1 className="mb-8 font-['Playfair_Display',serif] text-6xl font-black leading-[0.95] text-slate-900 dark:text-white sm:text-7xl lg:text-8xl tracking-tighter">
                            Mahakarya <br />
                            <span className="relative inline-block text-amber-500 italic font-medium mt-2">
                                Gastronomi
                                <motion.span 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-500 to-transparent" 
                                />
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="mb-12 max-w-lg text-lg leading-relaxed font-medium text-slate-600 dark:text-neutral-400 sm:text-xl">
                            Selamat datang di simfoni rasa, di mana setiap hidangan adalah kanvas dan setiap bahan adalah cerita yang dikurasi khusus for lidah Anda.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-5 sm:flex-row">
                            <Link href="/reservations/create">
                                <Button
                                    size="lg"
                                    className="group h-16 w-full rounded-2xl bg-amber-500 px-10 text-sm font-black uppercase tracking-widest text-black shadow-2xl shadow-amber-500/20 transition-all hover:bg-white hover:scale-105 sm:w-auto"
                                >
                                    Pesan Meja
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 w-full rounded-2xl border-border bg-transparent px-10 text-sm font-bold tracking-wide text-foreground shadow-sm transition-all hover:bg-white/5 hover:scale-105 sm:w-auto"
                                >
                                    Jelajahi Menu
                                </Button>
                            </Link>
                        </div>

                        {/* Refined Stats */}
                        <div className="mt-20 flex flex-wrap items-center gap-x-12 gap-y-8 border-t border-border pt-12">
                            {[
                                { value: '4.9', label: 'Global Rating', icon: Star },
                                { value: '15+', label: 'Year Heritage', icon: Medal },
                            ].map((stat) => (
                                <div key={stat.label} className="group flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-amber-500/50 transition-colors">
                                        <stat.icon size={20} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1.5 text-[10px] font-black tracking-[0.2em] text-slate-500 dark:text-neutral-500 uppercase">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right column — Visual Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{ y: y1 }}
                        className="relative hidden lg:block"
                    >
                        {/* Main frame */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent z-10 pointer-events-none" />
                            <img
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
                                alt="Culinary art preparation"
                                className="h-full w-full scale-105 object-cover transition-transform duration-1000 hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />
                            
                            {/* Inner Overlay Label */}
                            <div className="absolute bottom-10 left-10 z-20">
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase mb-2 block">Our Philosophy</span>
                                <h3 className="font-['Playfair_Display',serif] text-3xl font-black text-white leading-tight">Authenticity in <br /> Every Sizzle.</h3>
                            </div>
                        </div>

                        {/* Floating elements using new glass-card classes */}
                        <div className="absolute -bottom-10 -left-12 glass-card rounded-[2.5rem] p-8 shadow-3xl animate-float">
                            <div className="flex items-center gap-5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-amber-500 text-black shadow-xl shadow-amber-500/30">
                                    <CalendarDays size={26} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-1">
                                        Next Reservation
                                    </p>
                                    <p className="text-lg font-bold text-white tracking-tight">Available Tonight 19:30</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating dynamic badge */}
                        <div className="absolute top-10 -right-8 flex items-center gap-3 glass-card rounded-2xl px-6 py-4 shadow-2xl border-amber-500/20">
                            <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_15px_rgba(245,158,11,1)]" />
                            <span className="text-xs font-black tracking-widest text-white uppercase">Sangat Populer</span>
                        </div>
                    </motion.div>
                </div>

                {/* Refined Scroll guide */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4"
                >
                    <div className="h-12 w-[2px] bg-gradient-to-b from-amber-500 to-transparent" />
                    <span className="text-[10px] font-black tracking-[0.5em] text-slate-400 dark:text-neutral-500 uppercase">Jelajahi</span>
                </motion.div>
            </div>
        </main>
    );
}

