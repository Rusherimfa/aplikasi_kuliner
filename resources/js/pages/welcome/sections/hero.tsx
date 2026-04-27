import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown, Trophy, Medal } from 'lucide-react';
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
                    className="h-full w-full object-cover opacity-[0.8] dark:opacity-[0.4] transition-transform duration-1000"
                />
                
                {/* Animated Mesh Gradients - made more transparent so bg is visible */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-background/60 to-background/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-primary)/0.05_0%,transparent_50%)]" />
                
                {/* Textures */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.03] dark:opacity-[0.05]" />
            </div>

            {/* Atmospheric Orbs - Enhanced for depth */}
            <div 
                ref={(el) => { if (el) orbsRef.current[0] = el; }}
                className="pointer-events-none absolute -top-48 -right-48 h-[1000px] w-[1000px] rounded-full bg-sky-500/15 blur-[200px] opacity-60 mix-blend-screen" 
            />
            <div 
                ref={(el) => { if (el) orbsRef.current[1] = el; }}
                className="pointer-events-none absolute bottom-1/4 -left-64 h-[800px] w-[800px] rounded-full bg-indigo-600/10 blur-[180px] opacity-40 mix-blend-plus-lighter" 
            />
            <div 
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_80%)] opacity-80"
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24 pb-16 lg:px-8">
                <div className="grid items-center gap-12 md:gap-20 lg:grid-cols-2">
                    {/* Left column - Content */}
                    <div className="max-w-2xl py-12">
                        {/* Award badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-12 inline-flex items-center gap-3 rounded-full border border-sky-500/30 bg-sky-500/10 px-6 py-2.5 text-[10px] font-black tracking-[0.4em] text-sky-600 dark:text-sky-400 uppercase shadow-[0_0_40px_rgba(14,165,233,0.15)]"
                        >
                            <span className="text-sky-500">🌊</span>
                            <span>{__('Fresh Seafood Daily')}</span>
                        </motion.div>

                        {/* Headline */}
                        <h1 
                            className="mb-6 font-serif text-4xl leading-[1.1] font-light tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-wrap-balance"
                        >
                            <motion.span 
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                className="block text-sky-900 dark:text-sky-50"
                            >
                                Ocean's
                            </motion.span>
                            <motion.span 
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                                className="block italic text-sky-700 dark:text-sky-200"
                            >
                                Resto
                            </motion.span>
                            <motion.span 
                                 initial={{ y: 40, opacity: 0 }}
                                 animate={{ y: 0, opacity: 1 }}
                                 transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
                                 className="block text-sky-500 font-medium tracking-[-0.05em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2"
                            >
                                {__('The Fish Connection.')}
                            </motion.span>
                        </h1>

                        {/* Subtext */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 1 }}
                            className="mb-14 max-w-lg text-sm leading-relaxed font-medium text-slate-600 dark:text-sky-100/70 sm:text-lg"
                        >
                            {__('Experience the sensation of fresh seafood with a stunning beach panorama. A culinary destination where flavor meets the waves.')}
                        </motion.p>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <Link 
                                href="/reservations/create"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="group h-16 w-full rounded-full bg-sky-600 hover:bg-sky-700 text-white px-10 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-sky-900/20 transition-all hover:scale-[1.02] active:scale-95 sm:h-18 sm:px-12 sm:text-sm border-none"
                                >
                                    {__('Reserve a Table')}
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link 
                                href="/catalog"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 w-full rounded-full border-border bg-transparent px-10 text-[11px] font-bold uppercase tracking-widest text-foreground shadow-sm transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-95 sm:h-18 sm:px-12 sm:text-sm"
                                >
                                    {__('Explore Menu')}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right column â€” Visual Card */}
                    <div className="relative hidden lg:block">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="relative"
                        >
                            {/* Main frame with glass-highlight */}
                            <div className="glass-highlight relative aspect-[4/5] overflow-hidden rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(14,165,233,0.3)] ring-1 ring-white/20">
                                <img
                                    src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2574&auto=format&fit=crop"
                                    alt="Fresh seafood plate"
                                    className="h-full w-full scale-105 object-cover transition-transform duration-1000 hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/30 to-transparent opacity-90 mix-blend-multiply" />
                                
                                {/* Inner Overlay Label */}
                                <div className="absolute bottom-12 left-12 z-20">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-sky-300 uppercase mb-4 block font-sans">{__('Our Specialization')}</span>
                                    <h3 className="font-serif text-5xl font-light text-white leading-tight italic">
                                        Ocean <br /> Fresh.
                                    </h3>
                                </div>
                            </div>
                        </motion.div>

                        {/* THE ELITE STATUS BADGE (Magnetic) */}
                        <div 
                            ref={magneticBadgeRef as any}
                            className="absolute -bottom-10 -left-20 z-40 hidden xl:block"
                        >
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="group flex items-center gap-5 rounded-full border border-white/20 bg-slate-950/80 p-3 pr-8 backdrop-blur-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-all hover:border-primary/40 hover:bg-slate-950 cursor-pointer"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl glow-primary">
                                    <CalendarDays size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase font-sans">{__('Outdoor Area')}</span>
                                    </div>
                                    <p className="font-serif text-xl text-white tracking-tight leading-none mt-1 italic">
                                        {__('Sunset View')}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Refined Scroll guide */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 1.5 }}
                    className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-5"
                >
                    <div className="h-16 w-[1px] bg-gradient-to-b from-primary/50 to-transparent" />
                    <span className="text-[10px] font-black tracking-[0.6em] text-neutral-500 uppercase">{__('Scroll Down')}</span>
                </motion.div>
            </div>
        </main>
    );
}

