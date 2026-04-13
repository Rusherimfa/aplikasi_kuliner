import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown, Trophy, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const magneticBadgeRef = useMagnetic();
    const orbsRef = useRef<HTMLDivElement[]>([]);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        // Character reveal for title
        if (titleRef.current) {
            const text = titleRef.current.innerText;
            titleRef.current.innerHTML = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
            
            gsap.from(titleRef.current.querySelectorAll('.char'), {
                y: 100,
                opacity: 0,
                rotateX: -90,
                stagger: 0.02,
                duration: 1.5,
                ease: "expo.out",
                delay: 0.5
            });
        }

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
            className="premium-noise relative min-h-[115vh] overflow-hidden bg-background transition-colors duration-700"
        >
            {/* Cinematic Background */}
            <div ref={bgRef} className="absolute inset-0 z-0 origin-top">
                <img
                    src="https://images.unsplash.com/photo-1550966841-3ee5ad40bf3c?q=80&w=2670&auto=format&fit=crop"
                    alt="Fine dining table setup"
                    className="h-full w-full object-cover opacity-[0.4] dark:opacity-[0.12] transition-transform duration-1000"
                />
                
                {/* Animated Mesh Gradients */}
                <div className="absolute inset-x-0 top-0 h-[80vh] bg-gradient-to-b from-primary/10 via-background/80 to-background" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-primary-0.05)_0%,transparent_50%)]" />
                
                {/* Textures */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.03] dark:opacity-[0.05]" />
            </div>

            {/* Atmospheric Orbs */}
            <div 
                ref={(el) => { if (el) orbsRef.current[0] = el; }}
                className="pointer-events-none absolute -top-48 -right-48 h-[800px] w-[800px] rounded-full bg-primary/10 blur-[160px]" 
            />
            <div 
                ref={(el) => { if (el) orbsRef.current[1] = el; }}
                className="pointer-events-none absolute bottom-1/4 -left-48 h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-[120px]" 
            />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-32 pb-24 lg:px-8">
                <div className="grid items-center gap-24 lg:grid-cols-2">
                    {/* Left column - Content */}
                    <div className="max-w-2xl">
                        {/* Award badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-12 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-[10px] font-black tracking-[0.4em] text-primary uppercase shadow-[0_0_40px_rgba(var(--color-primary),0.1)] glow-primary"
                        >
                            <Trophy size={14} className="text-primary" />
                            <span>Distingsi Michelin 2024</span>
                        </motion.div>

                        {/* Headline */}
                        <h1 
                            ref={titleRef}
                            className="mb-10 font-serif text-7xl font-light leading-[0.85] text-slate-950 dark:text-white sm:text-8xl lg:text-9xl tracking-tightest"
                        >
                            Mahakarya Gastronomi
                        </h1>

                        {/* Subtext */}
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="mb-14 max-w-lg text-lg leading-relaxed font-medium text-slate-600 dark:text-neutral-400 sm:text-xl"
                        >
                            Sebuah narasi rasa yang dikurasi melampaui batas ekspektasi. Selamat datang di pusat keunggulan kuliner modern.
                        </motion.p>

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-6 sm:flex-row">
                            <Link 
                                href="/reservations/create"
                            >
                                <Button
                                    size="lg"
                                    className="group h-18 w-full rounded-full bg-primary px-12 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-2xl transition-all hover:scale-105 sm:w-auto"
                                >
                                    Pesan Meja
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link 
                                href="/catalog"
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-18 w-full rounded-full border-border bg-transparent px-12 text-sm font-bold tracking-wide text-foreground shadow-sm transition-all hover:bg-white/5 hover:scale-105 sm:w-auto"
                                >
                                    Eksplorasi Menu
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right column — Visual Card */}
                    <div className="relative hidden lg:block">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="relative"
                        >
                            {/* Main frame with glass-highlight */}
                            <div className="glass-highlight relative aspect-[4/5] overflow-hidden rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                                <img
                                    src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
                                    alt="Culinary art preparation"
                                    className="h-full w-full scale-105 object-cover transition-transform duration-1000 hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-80" />
                                
                                {/* Inner Overlay Label */}
                                <div className="absolute bottom-12 left-12 z-20">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-4 block font-sans">Filosofi Kami</span>
                                    <h3 className="font-serif text-5xl font-light text-white leading-tight italic">
                                        Sensory <br /> Perfection.
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
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-orange" />
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase font-sans">Ketersediaan</span>
                                    </div>
                                    <p className="font-serif text-xl text-white tracking-tight leading-none mt-1 italic">
                                        Tersedia Malam Ini
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
                    <span className="text-[10px] font-black tracking-[0.6em] text-neutral-500 uppercase">Telusuri</span>
                </motion.div>
            </div>
        </main>
    );
}
