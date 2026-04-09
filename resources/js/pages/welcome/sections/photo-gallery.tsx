import { Eye } from 'lucide-react';

const GALLERY_IMAGES = [
    {
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop',
        alt: 'Fine dining presentation',
        label: 'Makan Malam Mewah',
        large: true,
    },
    {
        src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
        alt: 'Chef at work',
        label: 'Dapur Kami',
        large: false,
    },
    {
        src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2574&auto=format&fit=crop',
        alt: 'Restaurant interior',
        label: 'Suasana',
        large: false,
    },
    {
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
        alt: 'Signature dish',
        label: 'Hidangan Khas',
        large: false,
    },
    {
        src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop',
        alt: 'Cocktails',
        label: 'Minuman Khas',
        large: false,
    },
];

export default function PhotoGallery() {
    return (
        <section className="bg-white py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold tracking-widest text-amber-700 uppercase">
                        Suasana & Karya
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 md:text-5xl">
                        Pesta untuk Mata
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500 text-lg">
                        Setiap sudut restoran kami dirancang untuk menyenangkan — dari penyajian hingga suasananya.
                    </p>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                    {GALLERY_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-3xl ${
                                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                            }`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                                    i === 0 ? 'h-[300px] md:h-[500px]' : 'h-[180px] md:h-[238px]'
                                }`}
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                            {/* Label & view icon */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                                    <Eye size={18} />
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                    {img.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
