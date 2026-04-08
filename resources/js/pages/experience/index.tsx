import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ChefHat, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Experience() {
    return (
        <>
            <Head title="The Experience - RestoWeb" />

            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-800">
                {/* Navbar */}
                <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-sm font-medium">
                                    Back to Home
                                </span>
                            </Link>

                            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                                <span className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-slate-900">
                                    Resto
                                    <span className="text-amber-700">Web</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link href="/reservations/create">
                                    <Button className="rounded-full bg-amber-700 px-6 font-medium text-white shadow-lg shadow-amber-900/10 hover:bg-amber-800">
                                        Book a Table
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="pt-20">
                    {/* Hero Section */}
                    <div className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-slate-900">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop"
                                alt="Restaurant Interior"
                                className="h-full w-full object-cover opacity-40"
                            />
                        </div>
                        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                            <span className="mb-4 block text-sm font-medium tracking-widest text-amber-500 uppercase">
                                The Philosophy
                            </span>
                            <h1 className="mb-6 font-['Playfair_Display',serif] text-5xl leading-tight font-bold text-white md:text-7xl">
                                Cultivating Culinary Brilliance
                            </h1>
                            <p className="mx-auto max-w-2xl text-xl font-light text-slate-300">
                                We believe that dining is not just about
                                sustenance, but a holistic journey that engages
                                all senses.
                            </p>
                        </div>
                    </div>

                    {/* The Chef Section */}
                    <section className="relative bg-white py-24">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid items-center gap-16 lg:grid-cols-2">
                                <div className="relative order-2 lg:order-1">
                                    <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop"
                                            alt="Executive Chef"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -right-8 -bottom-8 hidden rounded-2xl bg-white p-8 shadow-xl md:block">
                                        <ChefHat
                                            size={40}
                                            className="mb-4 text-amber-700"
                                        />
                                        <p className="font-['Playfair_Display',serif] text-2xl font-bold text-slate-900">
                                            Chef Antonio
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            3 Michelin Stars Alumni
                                        </p>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 md:text-5xl">
                                        Meet the Mastermind
                                    </h2>
                                    <p className="mb-6 text-lg leading-relaxed text-slate-600">
                                        With over two decades of experience
                                        spanning Paris, Rome, and Tokyo, Chef
                                        Antonio brings a wealth of global
                                        influence to our kitchen. His approach
                                        marries classic French techniques with
                                        local, seasonal ingredients.
                                    </p>
                                    <p className="mb-10 text-lg leading-relaxed text-slate-600">
                                        "Every plate is a canvas, and every
                                        ingredient is a color. The goal is to
                                        paint a memory that lasts long after the
                                        final bite."
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
                                            <Award
                                                size={20}
                                                className="text-amber-600"
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                Global Award Winner
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
                                            <Sparkles
                                                size={20}
                                                className="text-amber-600"
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                Culinary Innovator
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="bg-slate-900 px-4 py-24 text-center">
                        <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-white md:text-5xl">
                            Experience It Yourself
                        </h2>
                        <p className="mx-auto mb-10 max-w-xl text-lg text-slate-300">
                            Secure your table for the ultimate dining experience
                            tonight. Reservations are highly recommended.
                        </p>
                        <Link href="/reservations/create">
                            <Button
                                size="lg"
                                className="h-14 rounded-full bg-white px-10 text-lg font-medium text-slate-900 shadow-xl hover:bg-slate-100"
                            >
                                Reserve Your Table
                            </Button>
                        </Link>
                    </section>
                </main>
            </div>
        </>
    );
}
