import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
    return (
        <section className="relative overflow-hidden bg-amber-50 py-24">
            <div className="absolute inset-0 opacity-5">
                <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
                    alt="Background"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
                <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 md:text-5xl">
                    Your Perfect Evening Awaits
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-slate-600">
                    Reserve your table today and let us craft an unforgettable dining memory for you and your loved ones.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="/reservations/create">
                        <Button
                            size="lg"
                            className="h-14 w-full rounded-full bg-slate-900 px-10 text-base font-semibold text-white shadow-2xl hover:bg-slate-800 sm:w-auto"
                        >
                            Reserve Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/catalog">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 w-full rounded-full border-slate-300 bg-transparent px-10 text-base text-slate-900 hover:bg-white sm:w-auto"
                        >
                            Browse the Menu
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
