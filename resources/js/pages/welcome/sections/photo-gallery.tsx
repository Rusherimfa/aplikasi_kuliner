import { Eye, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const GALLERY_IMAGES = [
    {
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop',
        alt: 'Fine dining presentation',
        label: 'Makan Malam Mewah',
    },
    {
        src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
        alt: 'Chef at work',
        label: 'Dapur Kami',
    },
    {
        src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2574&auto=format&fit=crop',
        alt: 'Restaurant interior',
        label: 'Suasana',
    },
    {
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
        alt: 'Signature dish',
        label: 'Hidangan Khas',
    },
    {
        src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop',
        alt: 'Cocktails',
        label: 'Minuman Khas',
    },
     {
        src: 'https://images.unsplash.com/photo-1470333738027-5654490f4e8c?q=80&w=2574&auto=format&fit=crop',
        alt: 'Bar atmosphere',
        label: 'Signature Bar',
    },
];

export default function PhotoGallery() {
    return (
        <section className="bg-[#FAFAFA] dark:bg-[#0A0A0B] py-32 transition-colors duration-500 font-['Inter',sans-serif]">
            <div className="mx-auto max-w-7xl px-8">
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-600 dark:text-amber-500 uppercase glow-amber"
                    >
                        <Camera size={12} />
                        <span>Visual Journey</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter"
                    >
                        Pesta <span className="italic font-serif opacity-30">Visual</span>
                    </motion.h2>
                    <p className="mx-auto max-w-xl text-slate-500 dark:text-neutral-400 text-lg font-medium">
                        Eksplorasi estetika gastronomi and atmosfer yang kami bangun dengan penuh dedikasi.
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
                                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-2xl"
                                >
                                    <Eye size={24} />
                                </motion.div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                                    View Details
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

