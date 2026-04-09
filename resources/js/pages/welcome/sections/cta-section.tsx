import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-[#0A0A0B] py-32">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
                    alt="Background"
                    className="h-full w-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/60 to-[#0A0A0B]" />
            </div>

            {/* Decorative elements */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/8 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
                {/* Eyebrow */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-400 uppercase">
                    <Sparkles size={12} />
                    Pesan Malam Ini
                </div>

                <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-white md:text-6xl">
                    Malam Sempurnamu{' '}
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic">
                        Menanti
                    </span>
                </h2>
                <p className="mb-12 text-lg leading-relaxed text-white/50">
                    Pesan meja Anda hari ini dan biarkan kami membuat kenangan bersantap yang tak terlupakan untuk Anda dan orang-orang terkasih.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/reservations/create">
                        <Button
                            size="lg"
                            className="group h-14 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-10 text-base font-semibold text-white shadow-2xl shadow-amber-900/30 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600 sm:w-auto"
                        >
                            Pesan Sekarang{' '}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                    <Link href="/catalog">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 w-full rounded-full border-white/15 bg-white/5 px-10 text-base font-medium text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10 sm:w-auto"
                        >
                            Jelajahi Menu
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
