import { motion } from 'framer-motion';
import { Trophy, Sprout, Wine, Users, ChefHat, Sparkles } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

export default function BentoFeatures() {
    const { __ } = useTranslations();

    const features = [
        {
            title: __("Catch of the Day"),
            subtitle: __("Ocean's Best Selection"),
            description: __("The best seafood selection caught directly by local fishermen every day."),
            icon: Trophy,
            className: "md:col-span-2 md:row-span-2 bg-sky-500/5 border-sky-500/20",
            iconClass: "bg-sky-600 text-white",
            image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: __("Beachfront"),
            subtitle: __("Beachfront Dining"),
            description: __("Enjoy dishes with a stunning sunset view by the sea."),
            icon: Sprout,
            className: "md:col-span-1 md:row-span-1 bg-cyan-500/5 border-cyan-500/20",
            iconClass: "bg-cyan-500 text-white",
        },
        {
            title: __("Fresh Drinks"),
            subtitle: __("Tropical Refreshments"),
            description: __("A curation of refreshing tropical drinks to complement your seafood dishes."),
            icon: Wine,
            className: "md:col-span-1 md:row-span-1 bg-teal-500/5 border-teal-500/20",
            iconClass: "bg-teal-500 text-white",
        },
        {
            title: __("Chef's Touch"),
            subtitle: __("Master of Seafood"),
            description: __("Behind every dish is a deep philosophy and perfect seafood processing techniques."),
            icon: ChefHat,
            className: "md:col-span-2 md:row-span-1 bg-blue-500/5 border-blue-500/20",
            iconClass: "bg-blue-500 text-white",
        }
    ];

    return (
        <section className="premium-noise relative py-16 md:py-24 px-6 lg:px-8 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black tracking-[0.6em] text-primary uppercase block mb-4"
                    >
                        {__('Our Distinction')}
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-6xl font-light text-foreground text-wrap-balance"
                    >
                        {__('Details That Define Us')}
                    </motion.h2>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[240px]">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.subtitle}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className={`group relative overflow-hidden rounded-[2.5rem] border p-8 md:p-10 min-h-[320px] md:min-h-0 flex flex-col justify-end transition-all hover:shadow-2xl hover:shadow-primary/5 ${feature.className}`}
                        >
                            {/* Background Image (for the large card) */}
                            {feature.image && (
                                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000">
                                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={`mb-6 h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg ${feature.iconClass}`}>
                                    <feature.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary/60 uppercase block mb-2">
                                    {feature.title}
                                </span>
                                <h3 className="font-serif text-3xl font-light text-foreground mb-4">
                                    {feature.subtitle}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-4 group-hover:translate-y-0">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Decorative Sparkle */}
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <Sparkles size={24} className="text-primary animate-pulse" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
