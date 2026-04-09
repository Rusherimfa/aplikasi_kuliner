import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#0A0A0B]">
            {/* Background layers */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
                    alt="Restaurant ambiance"
                    className="h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-[#0A0A0B]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/60" />
            </div>

            {/* Decorative ambient orbs */}
            <div className="pointer-events-none absolute top-1/3 right-[20%] h-[500px] w-[500px] rounded-full bg-amber-600/8 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-1/4 left-[10%] h-[300px] w-[300px] rounded-full bg-amber-800/6 blur-[80px]" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-24 pb-20 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left column */}
                    <div className="max-w-2xl">
                        {/* Award badge */}
                        <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase duration-700 fade-in slide-in-from-bottom-4 backdrop-blur-sm">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span>Pengalaman Pemenang Penghargaan</span>
                        </div>

                        {/* Headline */}
                        <h1 className="mb-6 animate-in font-['Playfair_Display',serif] text-5xl font-bold leading-[1.05] text-white duration-1000 fade-in slide-in-from-bottom-6 sm:text-6xl lg:text-7xl">
                            Rasakan yang{' '}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic">
                                    luar biasa
                                </span>
                                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-amber-400/60 to-transparent" />
                            </span>{' '}
                            dalam setiap detailnya.
                        </h1>

                        {/* Subtext */}
                        <p className="mb-10 max-w-lg animate-in text-lg leading-relaxed font-light text-white/60 delay-150 duration-1000 fade-in slide-in-from-bottom-8 sm:text-xl">
                            Nikmati keunggulan kuliner di mana bahan-bahan premium bertemu dengan persiapan ahli. Suasana bersantap yang diciptakan untuk malam yang sempurna.
                        </p>

                        {/* CTA buttons */}
                        <div className="flex animate-in flex-col gap-4 delay-300 duration-1000 fade-in slide-in-from-bottom-10 sm:flex-row">
                            <Link href="/reservations/create">
                                <Button
                                    size="lg"
                                    className="group h-14 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-8 text-base font-semibold text-white shadow-2xl shadow-amber-900/30 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 hover:shadow-amber-900/40 sm:w-auto"
                                >
                                    Pesan Meja
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 w-full rounded-full border-white/20 bg-white/5 px-8 text-base font-medium text-white/90 backdrop-blur-sm transition-all hover:scale-105 hover:border-white/30 hover:bg-white/10 sm:w-auto"
                                >
                                    Jelajahi Menu
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 flex animate-in items-center gap-8 border-t border-white/10 pt-8 delay-500 duration-1000 fade-in">
                            {[
                                { value: '4.9', label: '1rb+ Ulasan' },
                                { value: '12+', label: 'Tahun Keunggulan' },
                                { value: '3', label: 'Lokasi' },
                            ].map((stat, i) => (
                                <>
                                    {i > 0 && <div key={`div-${i}`} className="h-10 w-px bg-white/15" />}
                                    <div key={stat.label}>
                                        <p className="font-['Playfair_Display',serif] text-3xl font-bold text-white">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-xs tracking-widest text-white/40 uppercase">{stat.label}</p>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>

                    {/* Right column — image card */}
                    <div className="relative hidden animate-in delay-300 duration-1000 fade-in slide-in-from-right-8 lg:block">
                        {/* Main image */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
                                alt="Chef preparing premium dish"
                                className="h-full w-full scale-105 object-cover transition-transform duration-700 hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        {/* Floating card – bottom left */}
                        <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                                <CalendarDays size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-widest text-white/50 uppercase">
                                    Tersedia Berikutnya
                                </p>
                                <p className="mt-0.5 font-semibold text-white">Malam ini pukul 19:00</p>
                            </div>
                        </div>

                        {/* Floating badge – top right */}
                        <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-4 text-white shadow-2xl shadow-amber-900/40">
                            <Flame size={18} />
                            <span className="text-sm font-bold">Paling Populer</span>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce flex-col items-center gap-2 md:flex">
                    <span className="text-xs tracking-widest text-white/30 uppercase">Gulir</span>
                    <ChevronDown size={16} className="text-white/30" />
                </div>
            </div>
        </main>
    );
}
