import { Link } from '@inertiajs/react';
import { ArrowRight, Star, CalendarDays, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
    return (
        <main className="relative overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-32">
            <div className="pointer-events-none absolute top-0 right-0 translate-x-1/3 -translate-y-12 opacity-20 blur-3xl">
                <div className="aspect-square h-[600px] rounded-full bg-gradient-to-br from-amber-200 to-orange-100" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
                    <div className="max-w-2xl">
                        <div className="mb-8 inline-flex animate-in items-center gap-2 rounded-full border border-amber-200/50 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-800 uppercase duration-700 fade-in slide-in-from-bottom-4">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>Award Winning Experience</span>
                        </div>
                        <h1 className="mb-6 animate-in font-['Playfair_Display',serif] text-5xl leading-[1.1] font-bold text-slate-900 duration-1000 fade-in slide-in-from-bottom-6 sm:text-6xl lg:text-7xl">
                            Taste the extraordinary in every <i className="text-amber-800">detail</i>.
                        </h1>
                        <p className="mb-10 max-w-lg animate-in text-lg leading-relaxed font-light text-slate-600 delay-150 duration-1000 fade-in slide-in-from-bottom-8 sm:text-xl">
                            Experience culinary excellence where premium ingredients meet masterful preparation. A dining
                            atmosphere crafted for the perfect evening.
                        </p>
                        <div className="flex animate-in flex-col gap-4 delay-300 duration-1000 slide-in-from-bottom-10 fade-in sm:flex-row">
                            <Link href="/reservations/create">
                                <Button
                                    size="lg"
                                    className="h-14 w-full rounded-full bg-slate-900 px-8 text-base shadow-xl shadow-slate-900/10 transition-all hover:scale-105 hover:bg-slate-800 sm:w-auto"
                                >
                                    Reserve Your Table <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/catalog">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 w-full rounded-full border-slate-300 bg-transparent px-8 text-base transition-all hover:scale-105 hover:bg-white sm:w-auto"
                                >
                                    Explore Menu
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-12 flex animate-in items-center gap-8 border-t border-slate-200/60 pt-8 delay-500 duration-1000 fade-in">
                            <div>
                                <p className="font-['Playfair_Display',serif] text-3xl font-bold text-slate-900">4.9</p>
                                <p className="mt-1 text-xs tracking-wider text-slate-500 uppercase">1k+ Reviews</p>
                            </div>
                            <div className="h-10 w-px bg-slate-200"></div>
                            <div>
                                <p className="font-['Playfair_Display',serif] text-3xl font-bold text-slate-900">12+</p>
                                <p className="mt-1 text-xs tracking-wider text-slate-500 uppercase">Years of Excellence</p>
                            </div>
                            <div className="h-10 w-px bg-slate-200"></div>
                            <div>
                                <p className="font-['Playfair_Display',serif] text-3xl font-bold text-slate-900">3</p>
                                <p className="mt-1 text-xs tracking-wider text-slate-500 uppercase">Locations</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-in delay-300 duration-1000 fade-in slide-in-from-right-8">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
                                alt="Chef preparing premium dish"
                                className="h-full w-full scale-105 object-cover transition-transform duration-700 hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                                    Next Available
                                </p>
                                <p className="mt-0.5 font-semibold text-slate-900">Tonight at 19:00</p>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl bg-amber-700 p-4 text-white shadow-xl">
                            <Flame size={20} />
                            <span className="text-sm font-semibold">Most Popular</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
