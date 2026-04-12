import { Quote, Star, MessageSquarePlus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const DEFAULT_TESTIMONIALS = [
    {
        id: 't-1',
        name: 'Budi Santoso',
        role: 'Pecinta Kuliner',
        quote: 'Pelayanan yang sangat ramah dan rasa makanan yang autentik. Wagyu Steak-nya bener-bener juara!',
        rating: 5,
        avatarColor: 'from-amber-500 to-orange-700'
    },
    {
        id: 't-2',
        name: 'Sari Wijaya',
        role: 'Food Blogger',
        quote: 'Suasana restorannya sangat cozy, cocok untuk makan malam romantis. Dessert-nya juga variatif.',
        rating: 4,
        avatarColor: 'from-blue-500 to-indigo-700'
    },
    {
        id: 't-3',
        name: 'Andi Pratama',
        role: 'Pengusaha',
        quote: 'Sistem reservasi online-nya sangat memudahkan. Tidak perlu antre lama saat sampai di lokasi.',
        rating: 5,
        avatarColor: 'from-emerald-500 to-teal-700'
    }
];

export default function Testimonials({ testimonials = [], reviews = [], auth }: { testimonials?: any[], reviews?: any[], auth?: any }) {
    // Combine both sources
    const allQuotes = [
        ...reviews.map(r => ({
            id: r.id,
            name: r.user?.name || r.name,
            role: r.user ? 'Tamu Terverifikasi' : 'Pengguna Umum',
            quote: r.message,
            rating: r.rating,
            isReview: true
        })),
        ...testimonials.map(t => ({
            ...t,
            quote: t.quote || t.message,
            isReview: false
        }))
    ];

    const displayData = allQuotes.length > 0 ? allQuotes : DEFAULT_TESTIMONIALS;

    return (
        <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-28 transition-colors duration-500">
            {/* Decorative ambient */}
            <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-amber-600/5 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-amber-800/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block rounded-full border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 px-4 py-1 text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                        Cerita Tamu
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                        Apa Kata Tamu Kami
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500 dark:text-white/50">
                        Jangan hanya percaya kata-kata kami — dengarlah dari orang-orang yang telah merasakan langsung RestoWeb.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {displayData.slice(0, 6).map((t: any) => {
                        const avatar = t.name ? t.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'RT';
                        const avatarColor = t.avatarColor || 'from-amber-500 to-orange-700';

                        return (
                            <div
                                key={t.id}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-amber-300 dark:hover:border-amber-500/20 hover:shadow-xl dark:hover:bg-white/8"
                            >
                                {/* Top glow line */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                {/* Quote icon */}
                                <Quote size={36} className="mb-6 shrink-0 text-amber-500/30" />

                                {/* Quote text */}
                                <p className="mb-8 flex-1 text-base leading-relaxed text-slate-600 dark:text-white/70 italic line-clamp-4">
                                    "{t.quote}"
                                </p>

                                {/* Stars */}
                                <div className="mb-5 flex gap-1">
                                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-4 border-t border-slate-100 dark:border-white/8 pt-5">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColor} text-sm font-bold text-white shadow-lg`}
                                    >
                                        {avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-500 dark:text-white/40">
                                            {t.role} {t.isReview && <span className="ml-1 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/10">Baru</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 flex flex-col items-center gap-4">
                    <Link href={auth?.user ? "/testimonials" : "/login"}>
                        <Button 
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 py-6 h-auto text-base shadow-lg shadow-amber-600/20 transition-all hover:scale-105"
                        >
                            <MessageSquarePlus className="mr-2" size={20} />
                            Berikan Cerita Anda
                        </Button>
                    </Link>
                    {!auth?.user && <p className="text-xs text-slate-400 italic">Login untuk membagikan pengalaman Anda</p>}
                </div>
            </div>
        </section>
    );
}
