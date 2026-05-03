import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, ClipboardCheck, MailCheck, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
    const { __ } = useTranslations();
    const containerRef = useRef(null);
    const stepsRef = useRef<HTMLDivElement[]>([]);
    const magneticButtonRef = useMagnetic();

    const HOW_IT_WORKS = [
        {
            step: '01',
            title: __('Pick a Schedule'),
            desc: __('Determine the date and time you desire for an unforgettable experience.'),
            icon: Calendar,
        },
        {
            step: '02',
            title: __('Configuration'),
            desc: __('Complete your reservation criteria and special preferences through our system.'),
            icon: ClipboardCheck,
        },
        {
            step: '03',
            title: __('Validation'),
            desc: __("Our system will process and validate availability instantly."),
            icon: MailCheck,
        },
        {
            step: '04',
            title: __('Experience'),
            desc: __('Arrive and let our curated team provide the best gastronomic service.'),
            icon: Rocket,
        },
    ];

    useGSAP(() => {
        if (!stepsRef.current.length) return;

        // Ensure triggers are calculated correctly
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        gsap.from(stepsRef.current, {
            y: 60,
            opacity: 0,
            scale: 0.9,
            stagger: 0.15,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
                fastScrollEnd: true
            }
        });

        return () => clearTimeout(timeout);
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="premium-noise relative overflow-hidden bg-background py-24 md:py-32 transition-colors duration-1000">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white opacity-[0.02] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
                {/* Header */}
                <div className="mb-32 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                    >
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{__('The Gastronomic Journey')}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-foreground leading-[0.9] tracking-tighter"
                    >
                        {__('How to')} <br />
                        <span className="italic font-light opacity-40">{__('Experience.')}</span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-12 text-muted-foreground text-lg md:text-2xl font-medium leading-relaxed max-w-2xl opacity-70"
                    >
                        {__('A seamless transition from digital curiosity to coastal excellence. Secure your sanctuary in four elegant movements.')}
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map((step, idx) => (
                        <div 
                            key={step.step}
                            ref={(el) => { if (el) stepsRef.current[idx] = el; }}
                            className="group relative"
                        >
                            {/* Connector Line (Desktop) */}
                            {idx < 3 && (
                                <div className="absolute top-1/2 left-[calc(100%-1.5rem)] w-12 h-px bg-gradient-to-r from-primary/30 to-transparent hidden lg:block z-0" />
                            )}
                            
                            <div className="glass-elite flex h-full flex-col p-10 rounded-[3rem] transition-all duration-700 hover:translate-y-[-12px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/5 relative z-10">
                                {/* Step Number & Icon */}
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-6 shadow-xl">
                                        <step.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <span className="font-serif text-5xl font-black text-black/5 dark:text-white/5 transition-colors duration-700 group-hover:text-primary/20">
                                        {step.step}
                                    </span>
                                </div>

                                <h3 className="mb-4 font-serif text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-500 dark:text-neutral-400 opacity-80">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                <div 
                    ref={magneticButtonRef as any}
                    className="mt-24 text-center"
                >
                    <Link href="/reservations/create">
                        <Button
                            className="group relative h-16 w-full sm:w-auto rounded-2xl bg-primary px-12 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_20px_40px_-10px_oklch(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {__('Secure Your Table')}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}


