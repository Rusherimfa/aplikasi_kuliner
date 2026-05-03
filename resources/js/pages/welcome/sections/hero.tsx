import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown, Trophy, Medal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const { __ } = useTranslations();
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const magneticBadgeRef = useMagnetic();
    const orbsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {


        // Background Parallax
        gsap.to(bgRef.current, {
            yPercent: 15,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Ambient Orbs Subtle Movement
        orbsRef.current.forEach((orb, i) => {
            gsap.to(orb, {
                y: (i + 1) * 150,
                x: i % 2 === 0 ? 80 : -80,
                scale: 1.2,
                opacity: 0.15,
                duration: 10 + i * 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

    }, { scope: containerRef });
    
    return (
        <main 
            ref={containerRef} 
            className="premium-noise relative min-h-screen overflow-hidden bg-background transition-colors duration-700"
        >
            {/* Cinematic Background */}
            <div ref={bgRef} className="absolute inset-0 z-0 origin-top">
                <img
                    src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop"
                    alt="Ocean view"
                    className="h-full w-full object-cover opacity-[0.8] dark:opacity-[0.35] transition-transform duration-1000"
                />
                
                {/* Advanced Light Beams */}
                <div className="light-beam top-[-20%] left-[-20%] animate-pulse-orange" style={{ animationDuration: '8s' }} />
                <div className="light-beam bottom-[-20%] right-[-20%] opacity-20" style={{ animationDuration: '12s' }} />
                
                {/* Atmospheric Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 dark:from-sky-950/40 via-background/60 to-background transition-colors duration-1000" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--color-primary)/0.08_0%,transparent_60%)]" />
                
                {/* Refined Grid */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.03] dark:opacity-[0.07]" />
            </div>

            {/* Floating Atmospheric Orbs */}
            <div 
                ref={(el) => { if (el) orbsRef.current[0] = el; }}
                className="pointer-events-none absolute -top-48 -right-48 h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[200px] opacity-40 mix-blend-screen" 
            />
            <div 
                ref={(el) => { if (el) orbsRef.current[1] = el; }}
                className="pointer-events-none absolute bottom-1/4 -left-64 h-[800px] w-[800px] rounded-full bg-indigo-500/5 blur-[180px] opacity-30 mix-blend-plus-lighter" 
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 sm:px-10 pt-20 pb-16 lg:px-8">
                <div className="grid items-center gap-16 md:gap-24 lg:grid-cols-2">
                    {/* Content Column */}
                    <div className="relative py-8 md:py-12">
                        {/* Elite Badge */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            className="mb-10 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 backdrop-blur-xl"
                        >
                            <Sparkles size={14} className="text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{__('Experience Extraordinary')}</span>
                        </motion.div>
 
                        {/* Cinematic Headline */}
                        <h1 className="mb-10 font-serif text-7xl sm:text-9xl md:text-[10rem] lg:text-[13rem] leading-[0.8] tracking-tighter transition-all">
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="block font-light text-slate-900/30 dark:text-white/20"
                            >
                                {__("Ocean's")}
                            </motion.span>
                            <motion.span 
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                                className="block italic text-slate-900 dark:text-white drop-shadow-2xl"
                            >
                                {__('Resto')}
                            </motion.span>
                            <motion.div 
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                                className="mt-6 md:mt-12 flex items-center gap-4 md:gap-8"
                            >
                                <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-primary whitespace-nowrap">
                                    {__('The Fish Connection')}
                                </span>
                            </motion.div>
                        </h1>
 
                        {/* Descriptive Text with Glass Backing */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mb-12 border-l-2 border-primary/30 pl-6 md:pl-10"
                        >
                            <p className="max-w-xl text-base font-medium leading-relaxed text-slate-600 dark:text-sky-100/60 sm:text-xl transition-colors">
                                {__('Where the horizon meets your plate. We bridge the gap between deep sea bounty and culinary art, serving only the freshest catch with a side of sunset.')}
                            </p>
                        </motion.div>
  
                        {/* Elite CTA Buttons */}
                        <div className="flex flex-col gap-6 sm:flex-row">
                            <Link href="/reservations/create" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary px-12 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_20px_40px_-10px_oklch(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {__('Begin Journey')}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                </Button>
                            </Link>
                            <Link href="/catalog" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 w-full rounded-2xl border-primary/20 bg-white/5 px-10 text-[11px] font-black uppercase tracking-[0.3em] backdrop-blur-md transition-all hover:bg-white/10 hover:border-primary/40 active:scale-95"
                                >
                                    {__('Discover Menu')}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Column - The Frame */}
                    <div className="relative">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            className="perspective-1000"
                        >
                            <div className="glass-elite relative aspect-[4/5] max-w-[520px] mx-auto overflow-hidden rounded-[4rem] p-4">
                                <div className="h-full w-full overflow-hidden rounded-[3rem]">
                                    <img
                                        src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2574&auto=format&fit=crop"
                                        alt="Signature Seafood"
                                        className="h-full w-full object-cover transition-transform duration-[2000ms] hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    
                                    {/* Frame Label */}
                                    <div className="absolute bottom-16 left-16 right-16">
                                        <div className="mb-4 h-px w-12 bg-primary" />
                                        <h3 className="font-serif text-4xl font-light text-white italic leading-tight">
                                            {__('The Ocean’s')} <br /> {__('Finest selection.')}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative card */}
                            <motion.div 
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: -1, ease: "easeInOut" }}
                                className="absolute -bottom-10 -right-10 hidden md:block"
                            >
                                <div className="glass-elite flex items-center gap-6 rounded-3xl p-6 pr-10">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl glow-primary">
                                        <Medal className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{__('Authentic')}</span>
                                        <p className="font-serif text-2xl italic text-white">{__('Awarded Taste')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Stats / Social Guide */}
                <div className="absolute bottom-12 left-6 sm:left-10 hidden lg:flex flex-col gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">{__('Established')}</span>
                        <span className="text-sm font-serif italic text-slate-400 dark:text-white/40 transition-colors">MMXXIV</span>
                    </div>
                </div>

                {/* Center Scroll Guide */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
                >
                    <div className="relative h-16 w-px bg-white/10 overflow-hidden">
                        <motion.div 
                            animate={{ y: [0, 64, 0] }}
                            transition={{ duration: 2, repeat: -1, ease: "easeInOut" }}
                            className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-primary to-transparent"
                        />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-white/20 transition-colors">{__('Dive Deeper')}</span>
                </motion.div>
            </div>
        </main>
    );
}
