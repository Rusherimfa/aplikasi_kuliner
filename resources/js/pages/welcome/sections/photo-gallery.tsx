import { Eye, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';
import { useState } from 'react';
import { cn } from '@/lib/utils';
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
        {
            src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2669&auto=format&fit=crop',
            alt: 'Luxury interior',
            label: __('Elite Interiors'),
        },
        {
            src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop',
            alt: 'Artisan Cocktails',
            label: __('Liquid Art'),
        },
        {
            src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2528&auto=format&fit=crop',
            alt: 'Gourmet Dessert',
            label: __('Sweet Finale'),
        },
        {
            src: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2670&auto=format&fit=crop',
            alt: 'Fresh Salmon',
            label: __('Ocean Treasure'),
        },
    ];

    return (
        <section className="relative py-32 overflow-hidden bg-mesh">
            {/* Background Atmosphere */}
            <div className="light-beam top-1/2 left-0 opacity-10" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Elite Header */}
                <div className="mb-32 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                    >
                        <Camera size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{__('Visual Odyssey')}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-6xl md:text-8xl lg:text-[10rem] font-light text-foreground leading-[0.85] tracking-tighter mb-12"
                    >
                        {__('Capturing')} <br />
                        <span className="italic font-light opacity-40 block">{__('The Ocean Soul.')}</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl opacity-70"
                    >
                        {__('A curated glimpse into our coastal sanctuary, where every wave tells a story and every dish is a masterpiece.')}
                    </motion.p>
                </div>

                {/* Dynamic Masonry-ish Grid - 10 Items, 4x4 Tight Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 auto-rows-[250px] md:auto-rows-[300px]">
                    {GALLERY_IMAGES.map((img, i) => {
                        const spans = [
                            "md:col-span-2 md:row-span-2", // 0: C1-2, R1-2 (Large Square)
                            "md:col-span-2 md:row-span-1", // 1: C3-4, R1 (Wide)
                            "md:col-span-1 md:row-span-2", // 2: C3, R2-3 (Tall)
                            "md:col-span-1 md:row-span-1", // 3: C4, R2 (Small)
                            "md:col-span-1 md:row-span-1", // 4: C4, R3 (Small)
                            "md:col-span-1 md:row-span-1", // 5: C1, R3 (Small)
                            "md:col-span-1 md:row-span-1", // 6: C2, R3 (Small)
                            "md:col-span-1 md:row-span-1", // 7: C1, R4 (Small)
                            "md:col-span-1 md:row-span-1", // 8: C2, R4 (Small)
                            "md:col-span-2 md:row-span-1", // 9: C3-4, R4 (Wide)
                        ];
                        
                        return (
                            <motion.div
                                key={i}
                                className={cn(
                                    "group relative overflow-hidden rounded-2xl glass-elite cursor-pointer border border-black/5 dark:border-white/5",
                                    spans[i] || "md:col-span-1 md:row-span-1"
                                )}
                                onClick={() => setSelectedImage(img)}
                            >
                                <motion.div 
                                    className="h-full w-full relative"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 2 }}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="h-full w-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-[2s]"
                                    />
                                    
                                    {/* Multi-layered Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-1000" />
                                </motion.div>
                                
                                {/* Hover Indicator */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 transition-all duration-1000 translate-y-10 group-hover:translate-y-0">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-3xl border border-white/20 text-white shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-700">
                                        <Eye size={32} strokeWidth={1} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80">
                                        {__('Explore Moment')}
                                    </span>
                                </div>
 
                                {/* Minimalist Label */}
                                <div className="absolute bottom-10 left-10 transition-all duration-700 group-hover:bottom-12">
                                    <div className="h-[2px] w-12 bg-primary mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary transition-colors block mb-1">
                                        {__('Memory')}
                                    </span>
                                    <h4 className="text-xl sm:text-2xl font-serif italic text-white/90 group-hover:text-white transition-colors">
                                        {img.label}
                                    </h4>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Lightbox Dialog - Enhanced */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-6xl border-none bg-transparent p-0 shadow-none outline-none overflow-hidden">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{selectedImage?.label}</DialogTitle>
                        </DialogHeader>
                        <div className="relative h-full w-full flex items-center justify-center p-6">
                            <AnimatePresence mode="wait">
                                {selectedImage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                        className="relative rounded-[4rem] overflow-hidden glass-elite p-4"
                                    >
                                        <div className="overflow-hidden rounded-[3rem]">
                                            <img
                                                src={selectedImage.src}
                                                alt={selectedImage.alt}
                                                className="max-h-[75vh] w-auto object-contain"
                                            />
                                        </div>
                                        <div className="p-10 pt-6 text-center">
                                            <h3 className="text-4xl font-serif italic text-white mb-4">{selectedImage.label}</h3>
                                            <div className="mx-auto h-px w-12 bg-primary mb-4" />
                                            <p className="text-white/40 text-sm tracking-widest uppercase font-black">{__('A Moment at Ocean\'s Resto')}</p>
                                        </div>
                                        <DialogClose className="absolute top-10 right-10 h-12 w-12 flex items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xl border border-white/10 hover:bg-primary transition-all duration-500">
                                            <X size={24} />
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

