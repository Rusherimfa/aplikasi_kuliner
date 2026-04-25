import { Eye, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';

export default function PhotoGallery() {
    const { __ } = useTranslations();

    const GALLERY_IMAGES = [
        {
            src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop',
            alt: 'Fresh seafood dining',
            label: __('Seafood Sensation'),
        },
        {
            src: 'https://images.unsplash.com/photo-1534604973900-c430904a43fc?q=80&w=2670&auto=format&fit=crop',
            alt: 'Ocean view sunset',
            label: __('Sunset View'),
        },
        {
            src: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=2574&auto=format&fit=crop',
            alt: 'Signature dish',
            label: __('Special Catch'),
        },
        {
            src: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=2670&auto=format&fit=crop',
            alt: 'Lobster platter',
            label: __('Premium Lobster'),
        },
        {
            src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2670&auto=format&fit=crop',
            alt: 'Tropical drinks',
            label: __('Tropical Drinks'),
        },
         {
            src: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=2670&auto=format&fit=crop',
            alt: 'Beachfront atmosphere',
            label: __('Coastal Atmosphere'),
        },
    ];

    return (
        <section className="bg-[#FAFAFA] dark:bg-[#0A0A0B] py-32 transition-colors duration-500 font-['Inter',sans-serif]">
            <div className="mx-auto max-w-7xl px-8">
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-sky-600 dark:text-sky-500 uppercase glow-primary"
                    >
                        <Camera size={12} />
                        <span>{__('Visual Journey')}</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter"
                    >
                        {__('Visual Feast')}
                    </motion.h2>
                    <p className="mx-auto max-w-xl text-slate-500 dark:text-neutral-400 text-lg font-medium">
                        {__('Explore the freshness of seafood and the coastal atmosphere we\'ve built for you.')}
                    </p>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
                    {GALLERY_IMAGES.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.1 }}
                            className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-slate-100 dark:bg-white/5"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-0 group-hover:grayscale-[0.3]"
                            />
                            
                            {/* Overlay effects */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-90" />
                            
                            {/* Content reveal */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 transition-all duration-700 group-hover:opacity-100">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-white shadow-2xl"
                                >
                                    <Eye size={24} />
                                </motion.div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                    {__('View Details')}
                                </span>
                            </div>

                            {/* Permanent Label */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="glass-card flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-6 py-4">
                                    <span className="text-xs font-black uppercase tracking-widest text-white">
                                        {img.label}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

