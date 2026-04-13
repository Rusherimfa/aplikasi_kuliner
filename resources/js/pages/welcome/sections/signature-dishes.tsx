import { Link } from '@inertiajs/react';
import { UtensilsCrossed, ArrowRight, Flame, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { login } from '@/routes';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SignatureDishesProps {
    bestSellers: any[];
    auth: any;
}

export default function SignatureDishes({ bestSellers, auth }: SignatureDishesProps) {
    const containerRef = useRef(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        if (!cardsRef.current.length) return;

        // Ensure triggers are calculated correctly after a short delay to account for layout shifts
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        gsap.from(cardsRef.current, {
            y: 80,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
                invalidateOnRefresh: true,
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        return () => clearTimeout(timeout);
    }, { scope: containerRef, dependencies: [bestSellers] });

    return (
        <section 
            ref={containerRef} 
            className="premium-noise bg-background py-40 transition-colors duration-700 relative overflow-hidden"
        >
            {/* Decorative background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/5 to-transparent hidden md:block" />
            
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 relative z-10">
                {/* Section header */}
                <div className="mb-24 flex flex-col items-center text-center max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-8 flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 text-[10px] font-black tracking-[0.5em] text-primary uppercase glow-primary"
                    >
                        <Sparkles size={12} />
                        Chef's Selection
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-8 font-serif text-6xl md:text-8xl font-light text-foreground leading-[0.9]"
                    >
                        Hidangan <span className="italic">Ikonis</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mx-auto text-muted-foreground text-lg md:text-xl font-medium leading-relaxed"
                    >
                        Eksplorasi mahakarya kuliner yang melampaui tradisi. Sebuah harmoni antara inovasi modern dan keaslian rasa.
                    </motion.p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {!bestSellers || bestSellers.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="glass-card flex flex-col overflow-hidden rounded-[3rem] p-6 space-y-6">
                                <Skeleton className="h-72 w-full rounded-[2.5rem] bg-foreground/5" />
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-3/4 bg-foreground/5" />
                                    <Skeleton className="h-4 w-full bg-foreground/5" />
                                    <Skeleton className="h-14 w-full rounded-2xl bg-foreground/5" />
                                </div>
                            </div>
                        ))
                    ) : (
                        bestSellers.map((item: any, index: number) => (
                        <motion.div
                            key={item.id}
                            ref={(el) => { if (el) cardsRef.current[index] = el; }}
                            className="glass-card glass-highlight group flex flex-col overflow-hidden rounded-[3rem] transition-all duration-700 hover:-translate-y-4 hover:shadow-orange-500/10"
                        >
                            {/* Image area with parallax potential */}
                            <div className="relative aspect-[3/4] overflow-hidden m-4 rounded-[2.2rem]">
                                {item.image_path ? (
                                    <img 
                                        src={item.image_path} 
                                        alt={item.name}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-neutral-900 group-hover:scale-110 transition-transform duration-1000 ease-out">
                                        {/* Placeholder with Artistic Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-background/50">
                                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-primary transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[15deg] group-hover:shadow-[0_0_50px_rgba(var(--color-primary),0.2)]">
                                                <UtensilsCrossed size={48} strokeWidth={1} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-6 left-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2 text-[10px] font-black text-white uppercase tracking-[0.3em]">
                                    {item.category}
                                </div>

                                {item.is_best_seller && (
                                    <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-[10px] font-black text-primary-foreground uppercase tracking-widest shadow-xl">
                                        <Flame size={14} />
                                        Signature
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-10 pt-4">
                                <div className="flex flex-col mb-4">
                                    <h3 className="text-2xl font-serif font-light text-foreground mb-1">{item.name}</h3>
                                    <span className="text-sm font-black text-primary tracking-widest">
                                        Rp {Number(item.price).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <p className="mb-10 line-clamp-3 text-sm font-medium leading-relaxed text-muted-foreground/80">
                                    {item.description || 'Petualangan rasa yang dikurasi dengan presisi for menciptakan kenangan kuliner yang tak terlupakan.'}
                                </p>
                                <div className="mt-auto">
                                    <Link 
                                        href={auth.user ? '/dashboard' : login().url}
                                        className="block"
                                    >
                                        <Button className="w-full h-16 rounded-[1.5rem] bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-all hover:scale-105 active:scale-95 group relative z-10">
                                            Order Experience
                                            <ShoppingCart size={14} className="ml-3 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                    )}
                </div>

                {/* Master Link */}
                <div className="mt-32 text-center">
                    <Link 
                        href="/catalog"
                    >
                        <Button
                            variant="outline"
                            className="h-20 px-16 rounded-full border-primary/20 bg-transparent text-xs font-black uppercase tracking-[0.4em] text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 group shadow-2xl"
                        >
                            Jelajahi Menu Lengkap
                            <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}


