import { Quote, Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TESTIMONIALS = [
    {
        id: 't-1',
        name: 'Budi Santoso',
        role: 'Pecinta Kuliner',
        quote: 'Pelayanan yang sangat ramah and rasa makanan yang autentik. Wagyu Steak-nya bener-bener juara!',
        rating: 5,
        avatarColor: 'bg-orange-500'
    },
    {
        id: 't-2',
        name: 'Sari Wijaya',
        role: 'Food Blogger',
        quote: 'Suasana restorannya sangat cozy, cocok for makan malam romantis. Dessert-nya juga variatif.',
        rating: 4,
        avatarColor: 'bg-indigo-500'
    },
    {
        id: 't-3',
        name: 'Andi Pratama',
        role: 'Pengusaha',
        quote: 'Sistem reservasi online-nya sangat memudahkan. Tidak perlu antre lama saat sampai di lokasi.',
        rating: 5,
        avatarColor: 'bg-emerald-500'
    }
];

export default function Testimonials({ testimonials = [], reviews = [], auth }: { testimonials?: any[], reviews?: any[], auth?: any }) {
    const containerRef = useRef(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const magneticButtonRef = useMagnetic();

    // Combine both sources
    const allQuotes = [
        ...reviews.map(r => ({
            id: r.id,
            name: r.user?.name || r.name,
            role: r.user ? 'Verified Guest' : 'Regular Guest',
            quote: r.message,
            rating: r.rating,
            isReview: true
        })),
        ...testimonials.map(t => ({
            ...t,
            quote: t.quote || t.message,
            role: t.role || 'Gourmet Enthusiast',
            isReview: false
        }))
    ];

    const displayData = allQuotes.length > 0 ? allQuotes : DEFAULT_TESTIMONIALS;
    const cardsArray = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        if (!cardsArray.current.length) return;

        // Reset state awal untuk menghindari bug 'kadang tidak muncul'
        gsap.set(cardsArray.current, { opacity: 1, y: 0, scale: 1 });

        const animation = gsap.from(cardsArray.current, {
            y: 60,
            opacity: 0,
            scale: 0.95,
            stagger: 0.1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
                onEnter: () => {
                    ScrollTrigger.refresh();
                }
            }
        });

        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 1000);

        return () => {
            clearTimeout(timeout);
            animation.kill();
        };
    }, { scope: containerRef, dependencies: [displayData] });

    return (
        <section ref={containerRef} className="relative overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0B] py-16 md:py-24 transition-colors duration-500">
            {/* Premium Decorative Ambient */}
            <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="pointer-events-none absolute left-[-10%] top-[-5%] h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute right-[-5%] bottom-[-5%] h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6 inline-block rounded-2xl border border-orange-500/20 bg-orange-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-orange-600 dark:text-orange-500 uppercase glow-primary"
                    >
                        Guest Experiences
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white md:text-5xl lg:text-6xl tracking-tight leading-tight"
                    >
                        Simfoni <span className="italic font-serif opacity-40">Kepuasan</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mx-auto text-lg font-medium text-slate-500 dark:text-neutral-400"
                    >
                        Kesaksian otentik dari tamu kami yang telah merasakan kehangatan keramahan and kelezatan hidangan kami.
                    </motion.p>
                </div>

                {/* Cards Masonry-like Grid */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {displayData.slice(0, 6).map((t: any, index: number) => {
                        const avatarLetters = t.name ? t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'RT';
                        const avatarBg = t.avatarColor || 'bg-orange-500/10';

                        return (
                            <div
                                key={t.id}
                                ref={(el) => { if (el) cardsArray.current[index] = el; }}
                                className="group glass-card flex flex-col p-6 md:p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:border-orange-500/30 hover:shadow-orange-500/10"
                            >
                                {/* Subtle Quote Icon Overlay */}
                                <Quote size={120} className="absolute -top-6 -right-6 text-orange-500/5 group-hover:text-orange-500/10 transition-colors" strokeWidth={1} />

                                {/* Header with Stars */}
                                <div className="mb-8 flex justify-between items-start relative z-10">
                                    <div className="flex gap-1.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                className={`transition-all duration-500 ${i < (t.rating || 5) ? 'fill-orange-500 text-orange-500 scale-110' : 'text-slate-300 dark:text-white/10'}`} 
                                            />
                                        ))}
                                    </div>
                                    {t.isReview && (
                                        <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest border border-orange-500/20">
                                            <CheckCircle2 size={10} />
                                            Authentic
                                        </div>
                                    )}
                                </div>

                                {/* Quote text */}
                                <p className="mb-6 flex-1 text-base md:text-lg font-medium leading-relaxed text-slate-600 dark:text-neutral-400 italic relative z-10">
                                    "{t.quote}"
                                </p>

                                {/* Author Profile */}
                                <div className="flex items-center gap-5 pt-8 border-t border-border dark:border-white/5 relative z-10">
                                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${avatarBg} text-base font-black text-white dark:text-black shadow-inner`}>
                                        {avatarLetters}
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{t.name}</p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-widest mt-0.5">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Action */}
                <div 
                    ref={magneticButtonRef as any}
                    className="mt-12 md:mt-16 flex flex-col items-center gap-6"
                >
                    <Link href={auth?.user ? "/testimonials" : "/login"}>
                        <Button 
                            className="bg-orange-500 hover:bg-white text-black h-16 rounded-2xl px-12 text-sm font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <MessageSquarePlus className="mr-3 transition-transform group-hover:scale-110" size={18} />
                            Bagikan Pengalaman Anda
                        </Button>
                    </Link>
                    {!auth?.user && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-neutral-500 uppercase"
                        >
                            Login required to post a review
                        </motion.p>
                    )}
                </div>
            </div>
        </section>
    );
}

