import { Head, Link, usePage } from '@inertiajs/react';
import { ChefHat, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { useState } from 'react';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import AIChatbot from '@/components/app/ai-chatbot';

export default function Experience() {
    const { auth, currentTeam } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Pengalaman Kami - RestoWeb" />

            <div className="min-h-screen bg-background font-['Inter',sans-serif] text-foreground selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="pt-24 md:pt-32">
                    {/* Hero Section */}
                    <div className="relative mx-4 flex h-[60vh] md:h-[70vh] items-center justify-center overflow-hidden rounded-3xl bg-background sm:mx-6 lg:mx-8 border border-border/50">
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop"
                                alt="Interior Restoran Kelas Atas"
                                className="h-full w-full object-cover opacity-20 transition-transform duration-10000 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80"></div>
                        </div>
                        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
                            <span className="mb-4 block text-sm font-medium tracking-widest text-amber-600 uppercase">
                                Filosofi Kami
                            </span>
                            <h1 className="mb-6 font-['Playfair_Display',serif] text-5xl leading-tight font-bold text-foreground md:text-7xl">
                                Menyuburkan Kejeniusan Kuliner
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg font-light text-muted-foreground md:text-xl">
                                Kami percaya bahwa makan malam bukan sekadar tentang kebutuhan gizi, melainkan perjalanan holistik yang memanjakan seluruh pancaindra.
                            </p>
                        </div>
                    </div>

                    {/* The Chef Section */}
                    <section className="relative py-24 md:py-32">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid items-center gap-16 lg:grid-cols-2">
                                <div className="relative order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-1000 fade-in delay-300 fill-mode-both">
                                    <div className="group aspect-[3/4] overflow-hidden rounded-3xl border border-border bg-card shadow-xl relative">
                                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"></div>
                                        <img
                                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop"
                                            alt="Executive Chef"
                                            className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 grayscale hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="absolute -right-4 -bottom-8 md:-right-8 md:-bottom-8 flex items-center gap-6 rounded-3xl border border-border bg-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl z-20">
                                        <ChefHat size={48} className="text-amber-600" />
                                        <div>
                                            <p className="font-['Playfair_Display',serif] text-2xl font-bold text-foreground">
                                                Chef Antonio
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Alumni Bintang 3 Michelin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
                                    <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-foreground md:text-5xl">
                                        Temui Sang Jenius
                                    </h2>
                                    <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                                        Dengan lebih dari dua dekade pengalaman menjelajahi Paris, Roma, dan Tokyo, Chef Antonio membawa kekayaan pengaruh global ke dapur kami. Pendekatannya memadukan teknik klasik Prancis dengan bahan-bahan lokal musiman secara sempurna.
                                    </p>
                                    <blockquote className="mb-10 border-l-2 border-amber-400 pl-6 italic">
                                        <p className="text-xl leading-relaxed text-foreground/90">
                                            "Setiap piring adalah kanvas, dan setiap bahan adalah warna. Tujuannya adalah melukis kenangan yang bertahan lama bahkan setelah gigitan terakhir."
                                        </p>
                                    </blockquote>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm backdrop-blur-sm">
                                            <Award size={24} className="text-amber-500" />
                                            <span className="text-sm font-medium text-foreground">
                                                Pemenang Penghargaan Global
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm backdrop-blur-sm">
                                            <Sparkles size={24} className="text-amber-500" />
                                            <span className="text-sm font-medium text-foreground">
                                                Inovator Kuliner
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="relative px-4 py-24 text-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-amber-500/10 to-background"></div>
                        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
                            <h2 className="mb-6 font-['Playfair_Display',serif] text-4xl font-bold text-foreground md:text-5xl">
                                Rasakan Sendiri Pengalamannya
                            </h2>
                            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
                                Amankan meja Anda untuk pengalaman bersantap malam ini. Reservasi sangat disarankan untuk kepastian layanan terbaik kami.
                            </p>
                            <Link href="/reservations/create">
                                <Button
                                    size="lg"
                                    className="h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-10 text-lg font-medium text-white shadow-xl shadow-amber-900/20 transition-all hover:scale-105 hover:from-amber-400 hover:to-amber-600"
                                >
                                    Pesan Meja Anda
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>

                <Footer />
                
                <AIChatbot />
            </div>
        </>
    );
}
