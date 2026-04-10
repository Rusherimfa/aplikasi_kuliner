import { Link } from '@inertiajs/react';
import { UtensilsCrossed, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { login } from '@/routes';

interface SignatureDishesProps {
    bestSellers: any[];
    auth: any;
}

export default function SignatureDishes({ bestSellers, auth }: SignatureDishesProps) {
    return (
        <section className="bg-[#F8F5F0] dark:bg-neutral-900 py-28 transition-colors duration-500">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <span className="mb-4 inline-block rounded-full border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-500/10 px-4 py-1 text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-500 uppercase">
                        Pilihan Teratas
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                        Hidangan Khas Kami
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-500 dark:text-neutral-400 text-lg">
                        Hidangan yang membuat tamu kami selalu kembali — dibuat dengan sepenuh hati dan bahan-bahan lokal terbaik.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {!bestSellers || bestSellers.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-slate-900/5 dark:ring-neutral-700 p-4 space-y-4">
                                <Skeleton className="h-48 w-full rounded-2xl dark:bg-neutral-700" />
                                <div className="space-y-3 px-2">
                                    <Skeleton className="h-5 w-3/4 dark:bg-neutral-700" />
                                    <Skeleton className="h-4 w-full dark:bg-neutral-700" />
                                    <Skeleton className="h-4 w-w-5/6 dark:bg-neutral-700" />
                                </div>
                                <div className="px-2 pt-4">
                                    <Skeleton className="h-10 w-full rounded-2xl dark:bg-neutral-700" />
                                </div>
                            </div>
                        ))
                    ) : (
                        bestSellers.map((item: any, index: number) => (
                        <div
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-slate-900/5 dark:ring-neutral-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/10 hover:ring-amber-200 dark:hover:ring-amber-500/50"
                        >
                            {/* Image area */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 dark:from-neutral-700 to-slate-100 dark:to-neutral-800">
                                {/* Placeholder visual */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 text-amber-400 dark:text-amber-500 transition-transform duration-700 group-hover:scale-110">
                                        <UtensilsCrossed size={36} />
                                    </div>
                                </div>

                                {/* Category badge */}
                                <div className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                    {item.category}
                                </div>

                                {/* Price badge */}
                                <div className="absolute top-4 right-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md ring-1 ring-slate-900/5">
                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                </div>

                                {/* Popular badge for first item */}
                                {index === 0 && (
                                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                        <Flame size={11} />
                                        Sangat Laris
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6">
                                <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">{item.name}</h3>
                                <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
                                    {item.description || 'Kelezatan khas dari dapur kami.'}
                                </p>
                                <Link href={auth.user ? '/dashboard' : login().url}>
                                    <Button className="w-full rounded-2xl bg-slate-900 dark:bg-white text-sm font-semibold text-white dark:text-slate-900 transition-all hover:bg-amber-700 dark:hover:bg-amber-500">
                                        Pesan Sekarang
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                    )}
                </div>

                {/* CTA */}
                <div className="mt-14 text-center">
                    <Link href="/catalog">
                        <Button
                            variant="outline"
                            className="inline-flex h-13 items-center gap-2 rounded-full border-slate-300 px-10 text-sm font-semibold transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                        >
                            Lihat Menu Lengkap <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
