import { Link } from '@inertiajs/react';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';

interface SignatureDishesProps {
    bestSellers: any[];
    auth: any;
}

export default function SignatureDishes({ bestSellers, auth }: SignatureDishesProps) {
    if (!bestSellers || bestSellers.length === 0) {
return null;
}

    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="mb-3 block text-xs font-medium tracking-widest text-amber-700 uppercase">
                        Curated Selection
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900">
                        Our Signature Dishes
                    </h2>
                    <p className="mx-auto max-w-2xl text-slate-500">
                        Dishes our guests keep coming back for — crafted with passion and the finest locally-sourced
                        ingredients.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {bestSellers.map((item: any) => (
                        <div
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/5"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 transition-transform duration-700 group-hover:scale-110">
                                    <UtensilsCrossed size={40} className="opacity-20" />
                                </div>
                                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                                    Rp {Number(item.price).toLocaleString('id-ID')}
                                </div>
                                <div className="absolute bottom-3 left-3 rounded-full bg-amber-700/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                    {item.category}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="mb-1.5 text-base font-semibold text-slate-900">{item.name}</h3>
                                <p className="mb-5 line-clamp-2 flex-1 text-sm text-slate-500">
                                    {item.description || 'A signature delight from our kitchen.'}
                                </p>
                                <Link href={auth.user ? '/dashboard' : login().url}>
                                    <Button className="w-full rounded-xl bg-slate-900 text-sm text-white hover:bg-slate-800">
                                        Order Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/catalog">
                        <Button
                            variant="outline"
                            className="inline-flex h-12 items-center gap-2 rounded-full border-slate-300 px-8 text-sm hover:bg-slate-50"
                        >
                            View Full Menu <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
