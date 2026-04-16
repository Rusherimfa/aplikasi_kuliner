import { motion } from 'framer-motion';
import { Trophy, Sprout, Wine, Users, ChefHat, Sparkles } from 'lucide-react';

export default function BentoFeatures() {

    const features = [
        {
            title: "Simbol Keunggulan",
            subtitle: "MICHELIN Star Experience",
            description: "Pengakuan internasional atas komitmen kami terhadap kesempurnaan rasa dan layanan presisi.",
            icon: Trophy,
            className: "md:col-span-2 md:row-span-2 bg-primary/5 border-primary/20",
            iconClass: "bg-primary text-primary-foreground",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: "Segar & Alami",
            subtitle: "Farm-to-Table",
            description: "Bahan organik langsung dari petani lokal untuk menjaga keaslian rasa setiap gigitan.",
            icon: Sprout,
            className: "md:col-span-1 md:row-span-1 bg-green-500/5 border-green-500/20",
            iconClass: "bg-green-500 text-white",
        },
        {
            title: "Koleksi Langka",
            subtitle: "Exclusive Wine Cellar",
            description: "Kurasi wine dunia yang dipilih khusus oleh sommelier kami.",
            icon: Wine,
            className: "md:col-span-1 md:row-span-1 bg-purple-500/5 border-purple-500/20",
            iconClass: "bg-purple-500 text-white",
        },
        {
            title: "Kisah Sang Maestro",
            subtitle: "The Chef's Narrative",
            description: "Dibalik setiap hidangan ada filosofi mendalam dan teknik yang diasah selama puluhan tahun oleh Chef kami.",
            icon: ChefHat,
            className: "md:col-span-2 md:row-span-1 bg-orange-500/5 border-orange-500/20",
            iconClass: "bg-orange-500 text-white",
        }
    ];

    return (
        <section className="premium-noise relative py-32 px-6 lg:px-8 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center md:text-left">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-[10px] font-black tracking-[0.6em] text-primary uppercase block mb-4"
                    >
                        Our Distinction
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl font-light text-foreground text-wrap-balance"
                    >
                        Detail yang <span className="italic">Mendefinisikan</span> Kami
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
