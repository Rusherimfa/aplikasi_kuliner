import { Eye, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';

export default function PhotoGallery() {
    const { __ } = useTranslations();
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const GALLERY_IMAGES = [
        {
            src: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt: 'Seafood Sensation',
            label: __('Seafood Sensation'),
        },
        {
            src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
            alt: 'Ocean view sunset',
            label: __('Sunset View'),
        },
        {
            src: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt: 'Fresh catch',
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
            src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2670&auto=format&fit=crop',
            alt: 'Beachfront dining',
            label: __('Coastal Atmosphere'),
        },
    ];

    return (
        <section className="bg-section-gallery py-32 transition-colors duration-1000 font-['Inter',sans-serif] relative overflow-hidden">
            {/* Multi-Wave Transition from Features */}
            <div className="wave-container top-0 rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-anim-1">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-[var(--bg-features)]"></path>
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="wave-anim-2 absolute inset-0">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-[var(--bg-features)]/40"></path>
                </svg>
            </div>
            
            {/* Atmospheric accents */}
            <div className="absolute top-1/4 right-0 h-[600px] w-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
            
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
                        className="font-serif text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter"
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
                            className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-slate-100 dark:bg-white/5 cursor-pointer"
                            onClick={() => setSelectedImage(img)}
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

                {/* Lightbox Dialog */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none outline-none overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{selectedImage?.label}</DialogTitle>
                        </DialogHeader>
                        <div className="relative h-full w-full flex items-center justify-center p-4">
                            <AnimatePresence mode="wait">
                                {selectedImage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="relative rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                    >
                                        <img
                                            src={selectedImage.src}
                                            alt={selectedImage.alt}
                                            className="max-h-[80vh] w-auto object-contain"
                                        />
                                        <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                                            <h3 className="text-2xl font-serif text-white mb-2">{selectedImage.label}</h3>
                                            <p className="text-white/60 text-sm">{__('Capture your best moments with Ocean\'s Resto.')}</p>
                                        </div>
                                        <DialogClose className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors">
                                            <X size={20} />
                                        </DialogClose>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}

