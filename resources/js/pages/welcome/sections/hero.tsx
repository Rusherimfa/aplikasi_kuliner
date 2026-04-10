import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 250]); // Moving down slowly
    const scaleBg = useTransform(scrollY, [0, 1000], [1, 1.15]);
    
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#FAFAFA] dark:bg-neutral-950 transition-colors duration-500">
            {/* Background layers */}
            <motion.div className="absolute inset-0" style={{ scale: scaleBg }}>
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
                    alt="Restaurant ambiance"
                    className="h-full w-full object-cover opacity-[0.15] dark:opacity-[0.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] dark:from-neutral-950 via-[#FAFAFA]/95 dark:via-neutral-950/95 to-[#FAFAFA]/40 dark:to-neutral-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] dark:from-neutral-950 via-transparent to-[#FAFAFA]/60 dark:to-neutral-950/60" />
            </motion.div>

            {/* Decorative ambient orbs */}
            <div className="pointer-events-none absolute top-1/3 right-[20%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-1/4 left-[10%] h-[300px] w-[300px] rounded-full bg-amber-400/10 blur-[80px]" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left column */}
                    <div className="max-w-2xl">
                        {/* Award badge */}
                        <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-400 uppercase duration-700 fade-in slide-in-from-bottom-4 shadow-sm">
                            <Star size={11} className="fill-amber-500 text-amber-500" />
                            <span>Pengalaman Pemenang Penghargaan</span>
                        </div>

                        {/* Headline */}
                        <h1 className="mb-6 animate-in font-['Playfair_Display',serif] text-5xl font-bold leading-[1.05] text-slate-900 dark:text-white duration-1000 fade-in slide-in-from-bottom-6 sm:text-6xl lg:text-7xl">
                            Rasakan yang{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent italic">
                                    luar biasa
                                </span>
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-amber-400/60 to-transparent" />
                            </span>{' '}
                            dalam setiap detailnya.
                        </h1>

                        {/* Subtext */}
                        <p className="mb-10 max-w-lg animate-in text-lg leading-relaxed font-light text-slate-600 dark:text-neutral-400 delay-150 duration-1000 fade-in slide-in-from-bottom-8 sm:text-xl">
                            Nikmati keunggulan kuliner di mana bahan-bahan premium bertemu dengan persiapan ahli. Suasana bersantap yang diciptakan untuk malam yang sempurna.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex animate-in flex-col gap-4 delay-300 duration-1000 fade-in slide-in-from-bottom-10 sm:flex-row">
                            <Link href="/reservations/create">
                                <Button
                                    size="lg"
                                    className="group h-14 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-8 text-base font-semibold text-white shadow-xl shadow-amber-900/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 sm:w-auto"
                                >
                                    Pesan Meja
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 w-full rounded-full border-slate-200 bg-white px-8 text-base font-medium text-slate-700 shadow-sm transition-all hover:scale-105 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
                                >
                                    Jelajahi Menu
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex animate-in items-center gap-8 border-t border-slate-200/60 pt-8 delay-500 duration-1000 fade-in">
                            {[
                                { value: '4.9', label: '1rb+ Ulasan' },
                                { value: '12+', label: 'Tahun Keunggulan' },
                                { value: '3', label: 'Lokasi' },
                            ].map((stat, i) => (
                                <>
                                    {i > 0 && <div key={`div-${i}`} className="h-10 w-px bg-slate-200" />}
                                    <div key={stat.label}>
                                        <p className="font-['Playfair_Display',serif] text-3xl font-bold text-slate-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs tracking-widest text-slate-500 dark:text-neutral-500 uppercase">{stat.label}</p>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>

                    {/* Right column — image card */}
                    <motion.div 
                        style={{ y: y1 }}
                        className="relative hidden animate-in delay-300 duration-1000 fade-in slide-in-from-right-8 lg:block"
                    >
                        {/* Main image */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-slate-900/5">
                            <img
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
                                alt="Chef preparing premium dish"
                                className="h-full w-full scale-105 object-cover transition-transform duration-700 hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        </div>

                        {/* Floating card – bottom left */}
                        <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl border border-white/60 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl ring-1 ring-slate-900/5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500">
                                <CalendarDays size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-widest text-slate-500 dark:text-neutral-400 uppercase">
                                    Tersedia Berikutnya
                                </p>
                                <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">Malam ini pukul 19:00</p>
                            </div>
                        </div>

                        {/* Floating badge – top right */}
                        <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-4 text-white shadow-xl shadow-amber-900/20">
                            <Flame size={18} />
                            <span className="text-sm font-bold">Paling Populer</span>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 md:flex">
                    <span className="text-xs tracking-widest text-slate-400 uppercase">Gulir</span>
                    <ChevronDown size={16} className="text-slate-400" />
                </div>
            </div>
        </main>
    );
}
