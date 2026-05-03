import { Link, usePage } from '@inertiajs/react';
import { UtensilsCrossed, ArrowRight, Flame, ShoppingCart, ShoppingBag, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { login } from '@/routes';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { 
    Clock, 
    Users, 
    Share2, 
    Heart, 
    X
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SignatureDishesProps {
    bestSellers: any[];
    auth: any;
}

export default function SignatureDishes({ bestSellers, auth }: SignatureDishesProps) {
    const { __ } = useTranslations();
    const { addItem, setCartOpen } = useCart();
    const { locale } = usePage().props as any;
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const containerRef = useRef(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).replace('IDR', 'Rp');
    };

    const DEFAULT_DISHES = [
        {
            id: 'd-1',
            name: __('Grilled Rock Lobster'),
            price: 450000,
            description: __('Freshly caught lobster grilled with artisan garlic butter and local herbs.'),
            image_path: 'https://images.unsplash.com/photo-1559740038-191f4505adc2?q=80&w=2570&auto=format&fit=crop',
            category: __('SIGNATURE')
        },
        {
            id: 'd-2',
            name: __('Tuna Tataki Elite'),
            price: 285000,
            description: __('Seared premium tuna with citrus ponzu and organic microgreens.'),
            image_path: 'https://images.unsplash.com/photo-1501595091296-3a970afb3ff9?q=80&w=2670&auto=format&fit=crop',
            category: __('CHEF CHOICE')
        },
        {
            id: 'd-3',
            name: __('Oceanic Risotto'),
            price: 320000,
            description: __('Creamy saffron risotto with scallops, prawns, and squid ink essence.'),
            image_path: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=2588&auto=format&fit=crop',
            category: __('GOURMET')
        },
        {
            id: 'd-4',
            name: __('Grilled Red Snapper'),
            price: 215000,
            description: __('Whole snapper marinated in Balikpapan spices, grilled over coconut husks.'),
            image_path: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            category: __('LOCAL PRIDE')
        }
    ];

    const displayDishes = (!bestSellers || bestSellers.length === 0) ? DEFAULT_DISHES : bestSellers;

    useGSAP(() => {
        const validCards = cardsRef.current.filter(Boolean);
        if (!validCards.length) return;

        // Ensure triggers are calculated correctly after a short delay to account for layout shifts
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        gsap.from(validCards, {
            y: 80,
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "all", // This fixes elements getting stuck if animation is interrupted
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
    }, { scope: containerRef, dependencies: [displayDishes] });

    // CRITICAL FIX: Reset refs array on each render to prevent animating detached DOM nodes!
    cardsRef.current = [];

    return (
        <section 
            ref={containerRef} 
            className="premium-noise bg-section-signature py-16 md:py-24 transition-colors duration-1000 relative overflow-hidden"
        >
            {/* Atmospheric Background Layers */}
            <div className="god-rays" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent opacity-40 dark:opacity-20" />
            
            {/* Multi-Wave Transition from Hero */}
            <div className="wave-container top-0 rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-anim-1">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background"></path>
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-anim-2 absolute inset-0">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background/40"></path>
                </svg>
            </div>

            {/* Floating particles orbs */}
            <div className="absolute top-1/2 left-1/4 h-96 w-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:opacity-30" />
            <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none dark:opacity-20" />
            
            {/* Decorative background elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/5 to-transparent hidden md:block" />
            
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 relative z-10">
                {/* Elite Header */}
                <div className="mb-32 flex flex-col items-center text-center max-w-4xl mx-auto relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-8 py-3 backdrop-blur-xl shadow-2xl"
                    >
                        <Sparkles size={14} className="text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{__("Chef's Selection")}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-6xl md:text-8xl lg:text-[10rem] font-light text-foreground leading-[0.85] tracking-tighter mb-12"
                    >
                        {__('Signature')} <br />
                        <span className="italic font-light opacity-30">{__('Masterpieces.')}</span>
                    </motion.h2>
                    
                    {/* Carousel Nav Controls (Mobile only) */}
                    <div className="flex md:hidden gap-4 mt-8">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-14 w-14 rounded-full glass-elite border-primary/20 text-primary shadow-2xl transition-all active:scale-95"
                            onClick={() => {
                                const container = document.getElementById('signature-carousel');
                                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                            }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-14 w-14 rounded-full glass-elite border-primary/20 text-primary shadow-2xl transition-all active:scale-95"
                            onClick={() => {
                                const container = document.getElementById('signature-carousel');
                                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                            }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div className="relative group/carousel px-4 sm:px-0 mt-8 md:mt-16">
                    <div 
                        id="signature-carousel"
                        className={cn(
                            "flex overflow-x-auto pb-12 pt-4 gap-8 no-scrollbar snap-x snap-mandatory md:grid md:pb-0 md:pt-0 md:overflow-visible scroll-smooth snap-always",
                            !bestSellers || bestSellers.length === 0 ? 'md:grid-cols-4' : bestSellers.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : bestSellers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : bestSellers.length === 3 ? 'md:grid-cols-3 max-w-5xl mx-auto' : 'md:grid-cols-4'
                        )}
                    >
                        {!displayDishes || displayDishes.length === 0 ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-2xl min-w-[85vw] md:min-w-0 border border-black/5 dark:border-white/5">
                                    <Skeleton className="h-64 w-full bg-foreground/5" />
                                    <div className="p-8 space-y-4">
                                        <Skeleton className="h-8 w-3/4 bg-foreground/5" />
                                        <Skeleton className="h-4 w-full bg-foreground/5" />
                                        <Skeleton className="h-12 w-1/2 rounded-xl bg-foreground/5" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            displayDishes.map((item: any, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
                                ref={(el) => { if (el) cardsRef.current[index] = el; }}
                                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700 min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center border border-black/5 dark:border-white/5 hover:translate-y-[-10px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                            >
                                {/* Top Image Section */}
                                <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden">
                                    {item.image_path ? (
                                        <img 
                                            src={item.image_path.startsWith('http') ? item.image_path : `/storage/${item.image_path}`} 
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-white/5">
                                            <UtensilsCrossed size={40} className="text-slate-200" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="flex items-center gap-1.5 rounded-full bg-sky-500 px-4 py-1.5 text-[8px] font-black text-white uppercase tracking-wider shadow-lg transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                            <Flame size={12} />
                                            {__('BEST SELLER')}
                                        </div>
                                    </div>
                                </div>
 
                                {/* Bottom Content Section */}
                                <div className="flex flex-col p-8 sm:p-10 flex-1 relative">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                                {item.name}
                                            </h3>
                                            <div className="flex shrink-0 items-center gap-1 text-amber-500">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-xs font-black">5.0</span>
                                            </div>
                                        </div>
                                        <div className="text-xl sm:text-2xl font-bold text-sky-500 italic mb-4">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-medium line-clamp-2 leading-relaxed opacity-80">
                                            {item.description || __('A culinary masterpiece crafted with precision.')}
                                        </p>
                                    </div>
 
                                    <div className="mt-auto flex flex-col gap-4">
                                        <Button 
                                            onClick={() => {
                                                addItem(item);
                                                setCartOpen(true);
                                                toast.success(`${item.name} ${__('added to cart')}`);
                                            }}
                                            className="w-full h-14 sm:h-16 rounded-[1.25rem] bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-neutral-100 text-white dark:text-slate-900 flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 group overflow-hidden"
                                        >
                                            <ShoppingBag size={18} className="transition-transform group-hover:rotate-12" />
                                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em]">
                                                {__('ADD TO ORDER')}
                                            </span>
                                        </Button>
                                        
                                        <button 
                                            onClick={() => setSelectedItem(item)}
                                            className="text-center group/btn"
                                        >
                                            <span className="relative text-[9px] font-black text-slate-400 group-hover/btn:text-primary uppercase tracking-[0.3em] transition-colors cursor-pointer inline-block">
                                                {__('VIEW DETAILS')}
                                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover/btn:w-full" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                        )}
                </div>
            </div>

                {/* Master Link */}
                <div className="mt-20 md:mt-32 text-center">
                    <Link 
                        href="/catalog"
                    >
                        <Button
                            variant="outline"
                            className="h-16 md:h-20 px-12 md:px-20 rounded-full border-primary/20 bg-transparent text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 group shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                        >
                            {__('Explore Full Menu')}
                            <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-3" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick View Modal */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-none bg-white dark:bg-neutral-950 shadow-2xl">
                    {/* Accessibility Labels - Visually Hidden */}
                    <div className="sr-only">
                        <DialogTitle>{selectedItem?.name || __('Menu Detail')}</DialogTitle>
                        <DialogDescription>
                            {selectedItem?.description || __('Detailed information about our signature dish.')}
                        </DialogDescription>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Side */}
                        <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] overflow-hidden bg-slate-100 dark:bg-white/5">
                            {selectedItem?.image_path ? (
                                <img 
                                    src={selectedItem.image_path.startsWith('http') ? selectedItem.image_path : `/storage/${selectedItem.image_path}`} 
                                    alt={selectedItem.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UtensilsCrossed size={64} className="text-slate-200" />
                                </div>
                            )}
                            
                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {selectedItem?.is_best_seller && (
                                    <div className="flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1 text-[8px] font-black text-white uppercase tracking-wider shadow-lg">
                                        <Flame size={10} />
                                        {__('BEST SELLER')}
                                    </div>
                                )}
                                <div className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[8px] font-black text-white/90 border border-white/10 uppercase tracking-wider">
                                    {selectedItem?.category || __('SIGNATURE')}
                                </div>
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="p-8 md:p-12 flex flex-col">
                            <div className="flex-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                                    {selectedItem?.category || __('SIGNATURE')}
                                </span>
                                <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                                    {selectedItem?.name}
                                </h2>
                                <div className="text-2xl font-bold text-sky-500 italic mb-6">
                                    {selectedItem && new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedItem.price)}
                                </div>
                                
                                <p className="text-slate-500 dark:text-neutral-400 leading-relaxed mb-8 text-sm md:text-base">
                                    {selectedItem?.description || __('A culinary masterpiece crafted with precision and passion.')}
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                            <Clock size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{__('Preparation')}</div>
                                            <div className="text-xs font-bold">15-20 Min</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                            <Users size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{__('Serves')}</div>
                                            <div className="text-xs font-bold">1-2 People</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button 
                                    onClick={() => {
                                        addItem(selectedItem);
                                        setCartOpen(true);
                                        toast.success(`${selectedItem.name} ${__('added to cart')}`);
                                        setSelectedItem(null);
                                    }}
                                    className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-neutral-200 text-white dark:text-slate-900 flex items-center justify-center gap-3 shadow-xl transition-all"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                                        {__('ADD TO ORDER')}
                                    </span>
                                </Button>
                                
                                <div className="flex justify-center gap-8">
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">
                                        <Heart size={14} /> {__('WISHLIST')}
                                    </button>
                                    <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors">
                                        <Share2 size={14} /> {__('SHARE')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}



