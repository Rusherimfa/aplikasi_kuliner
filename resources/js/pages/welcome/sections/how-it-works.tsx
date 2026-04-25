import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, ClipboardCheck, MailCheck, Rocket } from 'lucide-react';
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
        <section ref={containerRef} className="relative overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0B] py-20 md:py-32 transition-colors duration-500 font-['Inter',sans-serif]">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="relative z-10 mx-auto max-w-7xl px-8">
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-sky-600 dark:text-sky-500 uppercase glow-primary"
                    >
                        {__('Reservation Process')}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter"
                    >
                        {__('Secure')} <span className="italic font-serif opacity-30 text-sky-500">{__('Your Table')}</span>
                    </motion.h2>
                    <p className="mx-auto max-w-2xl text-slate-500 dark:text-neutral-400 text-lg font-medium">
                        {__('Four easy steps to plan a dining experience with beautiful sea views.')}
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map((step, idx) => (
                        <div 
                            key={step.step}
                            ref={(el) => { if (el) stepsRef.current[idx] = el; }}
                            className="group relative"
                        >
                            <div className="glass-card flex h-full flex-col items-center text-center p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-border dark:border-white/5 transition-all duration-700 md:hover:-translate-y-4 hover:border-sky-500/30 hover:shadow-sky-500/10">
                                {/* Icon & Step Number */}
                                <div className="relative mb-10">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-50 dark:bg-white/5 transition-all duration-700 group-hover:bg-sky-500 group-hover:rotate-[15deg]">
                                        <step.icon className="h-8 w-8 text-sky-600 dark:text-sky-500 transition-colors duration-700 group-hover:text-white" />
                                    </div>
                                    <span className="absolute -bottom-4 -right-4 font-['Playfair_Display',serif] text-4xl font-black text-slate-200 dark:text-neutral-800 transition-colors duration-700 group-hover:text-sky-500/40">
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
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                <div 
                    ref={magneticButtonRef as any}
                    className="mt-20 text-center"
                >
                    <Link href="/reservations/create">
                        <Button
                            className="group h-16 rounded-[1.25rem] bg-slate-900 dark:bg-white px-12 text-[11px] font-black uppercase tracking-[0.2em] text-white dark:text-black shadow-2xl transition-all hover:scale-105 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500"
                        >
                            {__('Reserve Now')}
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}


