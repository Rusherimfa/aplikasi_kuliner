import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Choose Your Date',
        desc: 'Pick your preferred date and time for an evening to remember.',
    },
    {
        step: '02',
        title: 'Make a Reservation',
        desc: 'Fill in your details and any special requests through our simple form.',
    },
    {
        step: '03',
        title: 'Get Confirmed',
        desc: "We'll confirm your booking within 2 hours via email or WhatsApp.",
    },
    {
        step: '04',
        title: 'Enjoy the Experience',
        desc: 'Arrive and let us take care of everything else. Sit back and indulge.',
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="mb-3 block text-xs font-medium tracking-widest text-amber-700 uppercase">
                        Simple & Easy
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900">
                        How to Reserve a Table
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500">
                        In just four simple steps, secure your place at one of the most sought-after dining tables in the
                        city.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map((step, idx) => (
                        <div key={step.step} className="group relative text-center">
                            {idx < HOW_IT_WORKS.length - 1 && (
                                <div className="absolute top-8 left-[60%] z-0 hidden h-px w-full bg-gradient-to-r from-slate-200 to-transparent lg:block" />
                            )}
                            <div className="relative z-10 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 font-['Playfair_Display',serif] text-2xl font-bold text-amber-800 transition-all duration-300 group-hover:border-amber-700 group-hover:bg-amber-700 group-hover:text-white">
                                {step.step}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/reservations/create">
                        <Button
                            size="lg"
                            className="h-14 rounded-full bg-amber-700 px-10 text-base text-white shadow-xl shadow-amber-900/15 hover:bg-amber-800"
                        >
                            Book Your Table Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
