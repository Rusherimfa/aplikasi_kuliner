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
            title: __("Catch of the Day"),
            subtitle: __("Ocean's Best Selection"),
            description: __("The best seafood selection caught directly by local fishermen every day, ensuring maximum freshness in every dish."),
            icon: Trophy,
            className: "md:col-span-2 md:row-span-2",
            iconClass: resolvedAppearance === 'dark' ? "bg-sky-500/20 text-sky-400 border border-sky-400/30" : "bg-sky-500 text-white shadow-lg shadow-sky-500/30",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: __("Beachfront"),
            subtitle: __("Beachfront Dining"),
            description: __("Enjoy dishes with a stunning sunset view right on the shoreline."),
            icon: Sprout,
            className: "md:col-span-1 md:row-span-1",
            iconClass: resolvedAppearance === 'dark' ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30" : "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: __("Fresh Drinks"),
            subtitle: __("Tropical Refreshments"),
            description: __("A curation of refreshing tropical drinks to complement your seafood dining."),
            icon: Wine,
            className: "md:col-span-1 md:row-span-1",
            iconClass: resolvedAppearance === 'dark' ? "bg-teal-500/20 text-teal-400 border border-teal-400/30" : "bg-teal-500 text-white shadow-lg shadow-teal-500/30",
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: __("Chef's Touch"),
            subtitle: __("Master of Seafood"),
            description: __("Behind every dish is a deep philosophy and perfect seafood processing techniques."),
            icon: ChefHat,
            className: "md:col-span-1 md:row-span-1",
            iconClass: resolvedAppearance === 'dark' ? "bg-blue-500/20 text-blue-400 border border-blue-400/30" : "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
            image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: __("Mastery"),
            subtitle: __("Taste Philosophy"),
            description: __("Every serving is a blend of local wisdom and high-level culinary techniques."),
            icon: Sparkles,
            className: "md:col-span-2 md:row-span-1",
            iconClass: resolvedAppearance === 'dark' ? "bg-indigo-500/20 text-indigo-400 border border-indigo-400/30" : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30",
            image: "https://images.unsplash.com/photo-1534422298391-e4f8c170db06?q=80&w=2670&auto=format&fit=crop"
        }
    ];

    return (
        <section className={cn(
            "relative py-24 md:py-32 px-6 lg:px-8 overflow-hidden transition-colors duration-700 bg-section-features",
            !mounted ? "bg-white" : (resolvedAppearance === 'dark' ? "bg-background" : "bg-white")
        )}>
            {/* Ambient Background Glow */}
            <div className={cn(
                "absolute top-1/4 left-1/4 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none transition-all duration-700 opacity-50",
                resolvedAppearance === 'dark' ? "bg-sky-500/20" : "bg-sky-500/10"
            )} />
            <div className={cn(
                "absolute bottom-1/4 right-1/4 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none transition-all duration-700 opacity-50",
                resolvedAppearance === 'dark' ? "bg-cyan-500/20" : "bg-cyan-500/10"
            )} />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black tracking-[0.6em] text-sky-500 uppercase block mb-4"
                        >
                            {__('Our Distinction')}
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className={cn(
                                "font-serif text-5xl md:text-7xl font-light leading-[1.1] text-wrap-balance transition-colors duration-500",
                                resolvedAppearance === 'dark' ? "text-white" : "text-slate-900"
                            )}
                        >
                            {__('Details That Define Us')}
                        </motion.h2>
                    </div>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className={cn(
                            "max-w-sm text-sm leading-relaxed transition-colors duration-500",
                            resolvedAppearance === 'dark' ? "text-slate-400" : "text-slate-600"
                        )}
                    >
                        {__('More than just taste, we bring a symphony between nature, culinary art, and sincere hospitality.')}
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[300px]">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.subtitle}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative overflow-hidden rounded-[3rem] border p-8 md:p-12 flex flex-col justify-end transition-all duration-700",
                                resolvedAppearance === 'dark' 
                                    ? "border-white/10 hover:border-sky-500/30 hover:shadow-[0_20px_50px_rgba(14,165,233,0.1)]" 
                                    : "border-black/5 hover:border-sky-500/20 hover:shadow-[0_20px_50px_rgba(14,165,233,0.05)]",
                                feature.className
                            )}
                        >
                            {/* Background Image Container */}
                            <div className="absolute inset-0 z-0">
                                <motion.div 
                                    className="absolute inset-0 transition-all duration-1000 ease-out"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                                </motion.div>
                                {/* Overlays */}
                                <div className={cn(
                                    "absolute inset-0 transition-colors duration-700",
                                    resolvedAppearance === 'dark' 
                                        ? "bg-gradient-to-t from-background via-background/20 to-transparent" 
                                        : "bg-gradient-to-t from-white via-white/10 to-transparent"
                                )} />
                                <div className={cn(
                                    "absolute inset-0 transition-colors duration-700",
                                    resolvedAppearance === 'dark'
                                        ? "bg-gradient-to-b from-transparent via-transparent to-background"
                                        : "bg-gradient-to-b from-transparent via-transparent to-white"
                                )} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={cn(
                                    "mb-8 h-14 w-14 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                                    feature.iconClass
                                )}>
                                    <feature.icon size={24} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black tracking-[0.4em] uppercase block mb-3 transition-all duration-700",
                                    resolvedAppearance === 'dark' ? "text-sky-400" : "text-sky-600"
                                )}>
                                    {feature.title}
                                </span>
                                <h3 className={cn(
                                    "font-serif text-3xl md:text-4xl font-light mb-6 leading-tight transition-colors duration-500",
                                    resolvedAppearance === 'dark' ? "text-white" : "text-slate-900"
                                )}>
                                    {feature.subtitle}
                                </h3>
                                <p className={cn(
                                    "text-sm leading-relaxed max-w-sm transition-all duration-700",
                                    resolvedAppearance === 'dark' ? "text-slate-400/60 group-hover:text-slate-200" : "text-slate-500/60 group-hover:text-slate-800"
                                )}>
                                    {feature.description}
                                </p>
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:rotate-90">
                                <Sparkles size={24} className={resolvedAppearance === 'dark' ? "text-sky-500/50" : "text-sky-600/50"} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
