import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Pilih Tanggal Anda',
        desc: 'Pilih tanggal dan waktu yang Anda inginkan untuk malam yang tak terlupakan.',
    },
    {
        step: '02',
        title: 'Buat Reservasi',
        desc: 'Isi detail Anda dan permintaan khusus melalui formulir sederhana kami.',
    },
    {
        step: '03',
        title: 'Dapatkan Konfirmasi',
        desc: "Kami akan mengonfirmasi pemesanan Anda dalam 2 jam melalui email atau WhatsApp.",
    },
    {
        step: '04',
        title: 'Nikmati Pengalaman',
        desc: 'Datanglah dan biarkan kami mengatur semuanya. Duduk santai dan nikmati.',
    },
];

export default function HowItWorks() {
    return (
        <section className="relative overflow-hidden bg-[#F8F5F0] dark:bg-neutral-900 py-28 transition-colors duration-500">
            {/* Decorative top divider */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block rounded-full border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-500/10 px-4 py-1 text-xs font-semibold tracking-widest text-amber-700 dark:text-amber-500 uppercase">
                        Sederhana & Mudah
                    </span>
                    <h2 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                        Cara Memesan Meja
                    </h2>
                    <p className="mx-auto max-w-xl text-slate-500 dark:text-neutral-400 text-lg">
                        Hanya dalam empat langkah mudah, amankan tempat Anda di salah satu meja makan paling dicari di
                        kota ini.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {HOW_IT_WORKS.map((step, idx) => (
                        <div key={step.step} className="group relative">
                            {/* Connecting line (desktop only) */}
                            {idx < HOW_IT_WORKS.length - 1 && (
                                <div className="absolute top-10 left-[calc(50%+2.5rem)] z-0 hidden h-px w-[calc(100%-5rem)] bg-gradient-to-r from-amber-300/60 to-transparent lg:block" />
                            )}

                            {/* Step card */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Step circle */}
                                <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-amber-100 dark:bg-neutral-800 transition-all duration-500 group-hover:bg-amber-600" />
                                    <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-300 dark:border-amber-900/50 transition-all duration-500 group-hover:border-amber-400/50" />
                                    <span className="relative font-['Playfair_Display',serif] text-2xl font-bold text-amber-800 dark:text-amber-500 transition-colors duration-500 group-hover:text-white">
                                        {step.step}
                                    </span>
                                </div>

                                <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-white transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-500">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-neutral-400">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Link href="/reservations/create">
                        <Button
                            size="lg"
                            className="group h-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 px-12 text-base font-semibold text-white shadow-xl shadow-amber-900/20 transition-all hover:scale-105 hover:shadow-amber-900/30"
                        >
                            Pesan Meja Anda Sekarang{' '}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
