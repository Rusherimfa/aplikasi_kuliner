import { Quote, Star } from 'lucide-react';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Siti Rahmanida',
        role: 'Food Critic, Jakarta Post',
        avatar: 'SR',
        rating: 5,
        quote: "An unforgettable dining experience. The Chef's tasting menu is a symphony of flavors that left me speechless. RestoWeb has redefined fine dining in Jakarta.",
    },
    {
        id: 2,
        name: 'Budi Santoso',
        role: 'Regular Guest',
        avatar: 'BS',
        rating: 5,
        quote: 'Every anniversary we celebrate here. The ambiance is impeccable, service is flawless, and the food — absolutely divine. Nowhere else compares.',
    },
    {
        id: 3,
        name: 'Amara Putri',
        role: 'Lifestyle Blogger',
        avatar: 'AP',
        rating: 5,
        quote: "I've dined at Michelin-starred restaurants across Asia, and RestoWeb holds its own beautifully. The attention to detail in every dish is extraordinary.",
    },
];

export default function Testimonials() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="mb-3 block text-xs font-medium tracking-widest text-amber-700 uppercase">
                        Guest Stories
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900">
                        What Our Guests Say
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500">
                        Don't just take our word for it — hear from the people who've experienced RestoWeb firsthand.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.id}
                            className="flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <Quote size={28} className="mb-4 shrink-0 text-amber-200" />
                            <p className="mb-6 flex-1 leading-relaxed text-slate-600 italic">"{t.quote}"</p>
                            <div className="mt-auto flex items-center gap-4 border-t border-slate-100 pt-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm font-bold text-amber-800">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                                    <p className="mt-0.5 text-xs text-slate-400">{t.role}</p>
                                </div>
                                <div className="ml-auto flex gap-0.5">
                                    {Array.from({
                                        length: t.rating,
                                    }).map((_, i) => (
                                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
