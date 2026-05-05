import { Quote, Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials({ testimonials = [], reviews = [], auth }: { testimonials?: any[], reviews?: any[], auth?: any }) {
    const { __ } = useTranslations();
    const containerRef = useRef(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const magneticButtonRef = useMagnetic();

    const DEFAULT_TESTIMONIALS = [
        {
            id: 't-1',
            name: 'Budi Santoso',
            role: __('Food Lover'),
            quote: __('Very friendly service and very fresh seafood. The sea view is the winner!'),
            rating: 5,
            avatarColor: 'bg-sky-500'
        },
        {
            id: 't-2',
            name: 'Sari Wijaya',
            role: __('Food Blogger'),
            quote: __('The restaurant atmosphere is very cozy, suitable for a romantic dinner. The desserts are also varied.'),
            rating: 4,
            avatarColor: 'bg-indigo-500'
        },
        {
            id: 't-3',
            name: 'Andi Pratama',
            role: __('Entrepreneur'),
            quote: __('The online reservation system is very helpful. No need to queue for a long time when arriving at the location.'),
            rating: 5,
            avatarColor: 'bg-emerald-500'
        },
        {
            id: 't-4',
            name: 'Elena Rodriguez',
            role: __('Wine Specialist'),
            quote: __('An impeccable curation of spirits and seafood. The pairing suggestions from the staff were enlightened and elevated the entire experience.'),
            rating: 5,
            avatarColor: 'bg-rose-500'
        },
        {
            id: 't-5',
            name: 'Thomas Mueller',
            role: __('Family Traveler'),
            quote: __('Finding a place that balances high-end atmosphere with genuine warmth is rare. Ocean’s Resto made our family evening truly unforgettable.'),
            rating: 5,
            avatarColor: 'bg-amber-500'
        },
        {
            id: 't-6',
            name: 'Marcus Chen',
            role: __('Celebrity Chef'),
            quote: __('The technical precision in their seafood preparation is world-class. A masterclass in respecting ingredients and coastal tradition.'),
            rating: 5,
            avatarColor: 'bg-neutral-800'
        }
    ];

    // Combine both sources
    const allQuotes = [
        ...reviews.map(r => ({
            id: r.id,
            name: r.user?.name || r.name,
            role: r.user ? __('Verified Guest') : __('Regular Guest'),
            quote: r.message,
            rating: r.rating,
            image: r.image_path,
            isReview: true
        })),
        ...testimonials.map(t => ({
            ...t,
            quote: t.quote || t.message,
            role: t.role ? __(t.role) : __('Gourmet Enthusiast'),
            userAvatar: t.user?.avatar,
            image: t.image_path,
            isReview: false
        }))
    ];

    const displayData = allQuotes.length > 0 ? allQuotes : DEFAULT_TESTIMONIALS;
    const cardsArray = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        // Disabled GSAP scroll animation to fix opacity bugs and improve scroll performance
    }, { scope: containerRef, dependencies: [displayData] });

    return (
        <section ref={containerRef} className="relative overflow-hidden bg-background py-32 md:py-48 transition-colors duration-1000">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {/* Animated Ambient Background */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent)_0%,transparent_70%)] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent)_0%,transparent_70%)] rounded-full pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-8 md:px-12">
                {/* Header Section */}
                <div className="mb-24 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-8 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                    >
                        <Quote size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{__('Guest Legacies')}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-tight tracking-tighter"
                    >
                        {__('Symphony of')} <span className="italic">{__('Satisfaction.')}</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-8 text-muted-foreground text-sm md:text-lg font-medium leading-relaxed max-w-2xl opacity-70"
                    >
                        {__('The true essence of Oceanresto lies within the stories of our guests. A curated collection of moments shared by the shore.')}
                    </motion.p>
                </div>

                {/* Testimonials Masonry-Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {displayData.slice(0, 6).map((t: any, index: number) => {
                        const avatarLetters = t.name ? t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'RT';
                        const avatarBg = t.avatarColor || 'bg-primary/20';

                        return (
                            <div
                                key={t.id}
                                ref={(el) => { if (el) cardsArray.current[index] = el; }}
                                className="group glass-elite flex flex-col p-10 sm:p-12 rounded-2xl border border-black/5 dark:border-white/5 transition-all duration-700 hover:translate-y-[-16px] hover:shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_60px_120px_rgba(0,0,0,0.5)] relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <Quote size={160} className="absolute -top-10 -right-10 text-primary/5 group-hover:text-primary/10 transition-all duration-700 rotate-12" strokeWidth={1} />
                                
                                <div className="mb-10 flex justify-between items-center relative z-10">
                                    <div className="flex gap-1.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                fill={i < (t.rating || 5) ? "currentColor" : "none"}
                                                className={cn(
                                                    "transition-all duration-500",
                                                    i < (t.rating || 5) ? "text-primary scale-110" : "text-muted-foreground/20"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {t.isReview && (
                                        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[9px] font-black text-primary uppercase tracking-widest border border-primary/20">
                                            <CheckCircle2 size={12} />
                                            {__('Verified')}
                                        </div>
                                    )}
                                </div>

                                <p className="mb-12 flex-1 font-serif text-lg md:text-xl font-light italic leading-relaxed text-foreground opacity-90 group-hover:opacity-100 transition-opacity">
                                    "{t.quote}"
                                </p>

                                <div className="flex items-center gap-6 pt-10 border-t border-black/5 dark:border-white/5 relative z-10">
                                    {t.userAvatar ? (
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 shadow-xl group-hover:rotate-6 transition-all duration-700">
                                            <img src={t.userAvatar.startsWith('http') || t.userAvatar.startsWith('/') ? t.userAvatar : `/storage/${t.userAvatar}`} alt={t.name} className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-white shadow-xl group-hover:rotate-6 transition-all duration-700",
                                            avatarBg
                                        )}>
                                            {avatarLetters}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <h4 className="text-sm md:text-base font-bold text-foreground tracking-tight">{t.name}</h4>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 opacity-60">
                                            {t.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Action Footer */}
                <div 
                    ref={magneticButtonRef as any}
                    className="mt-24 md:mt-32 flex flex-col items-center gap-10"
                >
                    <Link href={auth?.user ? "/testimonials" : "/login"}>
                        <Button 
                            className="group relative h-20 px-16 rounded-[2rem] bg-primary text-[12px] font-black uppercase tracking-[0.4em] text-white shadow-[0_30px_60px_-15px_oklch(var(--primary)/0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-4">
                                <MessageSquarePlus className="transition-transform group-hover:scale-110" size={18} />
                                {__('Share Your Moment')}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>
                    </Link>
                    
                    {!auth?.user && (
                        <p className="text-[9px] font-black tracking-[0.5em] text-muted-foreground uppercase opacity-40">
                            {__('Account Verification Required to Post')}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

