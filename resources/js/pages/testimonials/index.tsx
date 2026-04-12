import { Head, usePage, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Quote, Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import { dashboard } from '@/routes';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    rating: number;
}

export default function TestimonialIndex({ testimonials = [] }: { testimonials?: Testimonial[] }) {
    const { auth, flash } = usePage().props as any;
    
    // Safely generate dashboard URL
    let dashboardUrl = '/';
    try {
        dashboardUrl = dashboard().url;
    } catch (e) {
        console.error('Wayfinder dashboard route failed:', e);
    }
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        role: '',
        quote: '',
        rating: 5,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/testimonials', {
            onSuccess: () => {
                reset();
                setFormSubmitted(true);
                setTimeout(() => setFormSubmitted(false), 5000);
            },
        });
    };

    return (
        <>
            <Head title="Cerita Tamu - RestoWeb" />

            <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 transition-colors duration-500">
                <Navbar
                    auth={auth || {}}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                        <span className="mb-4 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold tracking-widest text-amber-700 uppercase dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-500">
                            Cerita Tamu
                        </span>
                        <h1 className="mb-4 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                            Pengalaman Bersantap yang Berkesan
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-neutral-400">
                            Kami berusaha menyajikan pengalaman terbaik untuk setiap tamu. Bacalah cerita mereka, dan bagikan juga pengalaman luar biasa Anda kepada kami.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Side - Testimonial Grid */}
                        <div className="w-full lg:w-7/12">
                            {(testimonials && testimonials.length > 0) ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {testimonials.map((t) => (
                                        <div key={t.id} className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl dark:hover:border-amber-500/30">
                                            <Quote size={28} className="mb-4 text-amber-500/20" />
                                            <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600 dark:text-neutral-400 italic">
                                                "{t.quote}"
                                            </p>
                                            <div className="mb-4 flex gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={12} className={i < t.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-neutral-700 dark:text-neutral-700"} />
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-neutral-700 dark:to-neutral-800 text-sm font-bold text-slate-600 dark:text-neutral-300">
                                                    {t.name ? t.name.substring(0, 1).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{t.name || 'Tamu'}</p>
                                                    {t.role && <p className="text-xs text-slate-500 dark:text-neutral-500">{t.role}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-dashed border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-16 text-center">
                                    <MessageSquarePlus size={40} className="mx-auto mb-4 text-slate-300 dark:text-neutral-600" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Belum ada cerita</h3>
                                    <p className="text-sm text-slate-500 dark:text-neutral-400">Jadilah yang pertama membagikan pengalaman Anda!</p>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Submission Form */}
                        <div className="w-full lg:w-5/12">
                            <div className="sticky top-24 rounded-3xl border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 p-6 md:p-8 shadow-lg backdrop-blur-md">
                                <h2 className="mb-2 font-['Playfair_Display',serif] text-2xl font-bold text-slate-900 dark:text-white">
                                    Berikan Cerita Anda
                                </h2>
                                <p className="mb-6 text-sm text-slate-500 dark:text-neutral-400">
                                    Punya momen manis di restoran kami? Bagikan kebahagiaan itu ke banyak orang.
                                </p>

                                {(flash?.success || formSubmitted) ? (
                                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-6 text-center border border-emerald-200 dark:border-emerald-500/20 animate-in fade-in zoom-in duration-500">
                                        <CheckCircle2 size={36} className="mx-auto mb-3 text-emerald-500" />
                                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Terima Kasih!</h3>
                                        <p className="text-sm text-emerald-600 dark:text-emerald-500/80">
                                            {flash?.success || "Komentar dan pengalaman Anda berhasil ditayangkan."}
                                        </p>
                                    </div>
                                ) : auth?.user ? (
                                    <form onSubmit={submit} className="space-y-4">
                                        <div>
                                            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                                                Penilaian Anda
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setData('rating', star)}
                                                        className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                                                    >
                                                        <Star size={28} className={star <= data.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-neutral-700 dark:text-neutral-700 transition-colors"} />
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.rating && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.rating}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                                                Pekerjaan / Titel <span className="text-slate-400 font-normal">(Opsional)</span>
                                            </label>
                                            <Input
                                                id="role"
                                                value={data.role}
                                                onChange={e => setData('role', e.target.value)}
                                                className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 focus-visible:ring-amber-500"
                                                placeholder="Cth: Food Blogger, Tamu Keluarga"
                                            />
                                            {errors.role && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.role}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="quote" className="mb-1 block text-sm font-medium text-slate-700 dark:text-neutral-300">
                                                Cerita Anda <span className="text-rose-500">*</span>
                                            </label>
                                            <Textarea
                                                id="quote"
                                                value={data.quote}
                                                onChange={e => setData('quote', e.target.value)}
                                                className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 focus-visible:ring-amber-500 min-h-[120px] resize-none"
                                                placeholder="Ceritakan tentang momen favorit Anda, hidangan yang Anda suka, dll..."
                                                required
                                            />
                                            {errors.quote && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.quote}</p>}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-6 font-semibold shadow-md shadow-amber-600/20 transition-all hover:scale-[1.01]"
                                        >
                                            {processing ? 'Mengirim Cerita...' : 'Kirim Cerita Saya'}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-neutral-700 p-8 text-center bg-white/50 dark:bg-neutral-900/50">
                                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400">
                                            <MessageSquarePlus size={24} />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-slate-900 dark:text-white uppercase tracking-tight">Anda belum masuk</h3>
                                        <p className="mb-6 text-sm text-slate-500 dark:text-neutral-400">
                                            Silakan login menggunakan akun pelanggan untuk identifikasi dan mengisi buku cerita kami.
                                        </p>
                                        <Link href="/login">
                                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 dark:bg-amber-600 dark:hover:bg-amber-700 transition-all active:scale-95 shadow-lg">
                                                Login Sekarang
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
