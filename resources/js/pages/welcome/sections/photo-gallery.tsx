const GALLERY_IMAGES = [
    {
        src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop',
        alt: 'Fine dining presentation',
        span: 'col-span-2 row-span-2',
    },
    {
        src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop',
        alt: 'Chef at work',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2574&auto=format&fit=crop',
        alt: 'Restaurant interior',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
        alt: 'Signature dish',
        span: '',
    },
    {
        src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop',
        alt: 'Cocktails',
        span: '',
    },
];

export default function PhotoGallery() {
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="mb-3 block text-xs font-medium tracking-widest text-amber-700 uppercase">
                        Ambiance & Craft
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900">
                        A Feast for the Eyes
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500">
                        Every corner of our restaurant is designed to delight — from the plating to the atmosphere.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {GALLERY_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? 'h-[400px] md:h-full' : 'h-[180px] md:h-[190px]'}`}
                            />
                            <div className="absolute inset-0 bg-slate-900/20 transition-colors duration-500 group-hover:bg-slate-900/0" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
