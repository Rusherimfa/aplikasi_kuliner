import { motion } from 'framer-motion';
import { Trophy, Sprout, Wine, Users, ChefHat, Sparkles } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function BentoFeatures() {
    const { __ } = useTranslations();
    const { resolvedAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            title: __("Pure Connection"),
            subtitle: __("Ocean-to-Table Freshness"),
            description: __("The direct connection with local fishermen ensures that the ocean's bounty reaches your plate with its purity and freshness intact."),
            icon: Trophy,
            className: "md:col-span-2 md:row-span-2",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: __("Beachfront"),
            subtitle: __("Beachfront Dining"),
            description: __("Enjoy dishes with a stunning sunset view right on the shoreline."),
            icon: Sprout,
            className: "md:col-span-1 md:row-span-1",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: __("Fresh Drinks"),
            subtitle: __("Tropical Refreshments"),
            description: __("A curation of refreshing tropical drinks to complement your seafood dining."),
            icon: Wine,
            className: "md:col-span-1 md:row-span-1",
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: __("Chef's Touch"),
            subtitle: __("Master of Seafood"),
            description: __("Behind every dish is a deep philosophy and perfect seafood processing techniques."),
            icon: ChefHat,
            className: "md:col-span-1 md:row-span-1",
            image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: __("Mastery"),
            subtitle: __("Taste Philosophy"),
            description: __("Every serving is a blend of local wisdom and high-level culinary techniques."),
            icon: Sparkles,
            className: "md:col-span-2 md:row-span-1",
            image: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    return (
        <section className="relative py-32 md:py-48 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-1000 bg-background">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-1/4 -right-48 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent)_0%,transparent_70%)] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -left-48 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent)_0%,transparent_70%)] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Elite Header */}
                <div className="mb-32 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                    >
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                            {__('The Distinction')}
                        </span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-6xl md:text-8xl font-light leading-none tracking-tighter text-foreground mb-12"
                    >
                        {__('The Philosophy')} <br />
                        <span className="italic font-light opacity-40">{__('of Connection.')}</span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl opacity-70"
                    >
                        {__('Beyond culinary mastery, we orchestrate a symphony between the ocean’s bounty, artisanal craftsmanship, and the soul of the shore.')}
                    </motion.p>
                </div>

                {/* Bento Grid - Enhanced for Luxury */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 md:auto-rows-[280px]">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        
                        return (
                            <motion.div
                                key={feature.subtitle}
                                className={cn(
                                    "group relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-10 flex flex-col justify-end transition-all duration-700 min-h-[200px] sm:min-h-[240px] md:min-h-0 glass-elite",
                                    feature.className,
                                    idx === 4 && "col-span-2 md:col-span-2"
                                )}
                            >
                                {/* Dynamic Glass Reflection */}
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-[-50%] bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.15)_0%,transparent_50%)]" />
                                </div>
                                {/* Immersive Background */}
                                <div className="absolute inset-0 z-0">
                                    <motion.div 
                                        className="absolute inset-0 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2000ms]"
                                    >
                                        <img src={feature.image} alt="" className="w-full h-full object-cover" />
                                    </motion.div>
                                    
                                    {/* Multi-layered Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 dark:via-background/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700" />
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-10">
                                    <div className="mb-3 md:mb-6 flex items-center justify-between">
                                        <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center text-primary shadow-2xl transition-transform duration-700 group-hover:rotate-[360deg]">
                                            <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-x-4 group-hover:translate-x-0">
                                            <Sparkles size={20} className="text-primary/40" />
                                        </div>
                                    </div>
                                    
                                    <span className="text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase block mb-2 md:mb-4 text-primary">
                                        {feature.title}
                                    </span>
                                    <h3 className="font-serif text-lg sm:text-xl md:text-4xl font-light mb-2 md:mb-6 leading-tight text-foreground italic transition-colors">
                                        {feature.subtitle}
                                    </h3>
                                    <p className="text-xs md:text-base leading-relaxed max-w-sm text-muted-foreground group-hover:text-foreground transition-colors duration-500 line-clamp-2 md:line-clamp-none">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
