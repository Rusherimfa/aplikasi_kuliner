import { Head, Link, usePage } from '@inertiajs/react';
import { ChefHat, Sparkles, Award, Utensils, GlassWater, Truck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useMagnetic } from '@/hooks/use-magnetic';
import { useTranslations } from '@/hooks/use-translations';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import AIChatbot from '@/components/app/ai-chatbot';
import GlobalCustomerChat from '@/components/app/global-customer-chat';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const containerRef = useRef(null);
    const [activeChapter, setActiveChapter] = useState('ocean');
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const chapters = {
        ocean: {
            title: __("The Source"),
            subtitle: __("The Deep Blue Connection"),
            color: "from-blue-600/20 to-cyan-500/20",
            icon: Sparkles,
            slides: [
                {
                    title: __("Kejujuran Laut"),
                    text: __("Kami menjalin koneksi langsung dengan nelayan lokal. Setiap ikan yang kami sajikan ditangkap secara berkelanjutan di perairan Nusantara."),
                    image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2670&auto=format&fit=crop"
                },
                {
                    title: __("Kesegaran Mutlak"),
                    text: __("Dari jaring nelayan ke meja Anda dalam hitungan jam. Kami percaya bahwa rasa terbaik berasal dari kesegaran yang tidak berkompromi."),
                    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2670&auto=format&fit=crop"
                },
                {
                    title: __("Ekosistem Lestari"),
                    text: __("Mendukung metode penangkapan ikan tradisional yang menjaga kelestarian terumbu karang and populasi biota laut."),
                    image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=2574&auto=format&fit=crop"
                }
            ]
        },
        culinary: {
            title: __("The Craft"),
            subtitle: __("The Art of Seafood"),
            color: "from-sky-500/20 to-indigo-500/20",
            icon: Utensils,
            slides: [
                {
                    title: __("Presisi Fillet"),
                    text: __("Setiap jenis ikan memerlukan teknik pemotongan yang berbeda untuk menjaga tekstur and karakter rasa uniknya."),
                    image: "https://images.unsplash.com/photo-1534604973900-c41ab4c5d4b0?q=80&w=2574&auto=format&fit=crop"
                },
                {
                    title: __("Rempah Pesisir"),
                    text: __("Bumbu rahasia kami diracik dari rempah-rempah pesisir yang telah digunakan secara turun-temurun oleh komunitas nelayan."),
                    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=2574&auto=format&fit=crop"
                }
            ]
        },
        vibe: {
            title: __("The Depth"),
            subtitle: __("Immersive Sanctuary"),
            color: "from-blue-900/20 to-slate-900/20",
            icon: GlassWater,
            slides: [
                {
                    title: __("Interior Akuatik"),
                    text: __("Desain interior yang terinspirasi dari ketenangan bawah laut, memberikan pengalaman bersantap yang meditatif."),
                    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop"
                },
                {
                    title: __("Simfoni Ombak"),
                    text: __("Sistem audio kami mereplikasi frekuensi suara laut yang menenangkan, melengkapi cita rasa hidangan kami."),
                    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2670&auto=format&fit=crop"
                }
            ]
        }
    };

    const chapterKeys = Object.keys(chapters);
    const activeData = (chapters as any)[activeChapter];
    const reserveButtonRef = useMagnetic();

    useEffect(() => {
        setCurrentSlide(0);
    }, [activeChapter]);

    return (
        <div ref={containerRef}>
            <Head title={`${__("Strategic Gastronomi")} - Ocean's Resto Premium`} />

            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-slate-900 dark:text-neutral-400 selection:bg-sky-500 selection:text-black transition-colors duration-500 overflow-hidden">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="pt-32 pb-24">
                    {/* Chapter Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex p-2 bg-white/5 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                            {chapterKeys.map((key) => {
                                const chapter = (chapters as any)[key];
                                const isActive = activeChapter === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveChapter(key)}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all duration-500 ${
                                            isActive 
                                                ? 'bg-sky-500 text-black shadow-[0_10px_30px_rgba(14,165,233,0.4)]' 
                                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                        }`}
                                    >
                                        <chapter.icon size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{chapter.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Story Content Wrapper */}
                    <div className="relative mx-8 mb-32 overflow-hidden rounded-[4rem] bg-slate-900 dark:bg-white/[0.01] border border-white/5 min-h-[85vh] flex items-center shadow-4xl">
                        {/* Dynamic Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${activeData.color} transition-all duration-1000`} />
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                        
                        {/* Slide Content */}
                        <div className="relative z-10 w-full px-12 sm:px-24">
                            <div className="grid lg:grid-cols-2 gap-24 items-center">
                                {/* Text Content */}
                                <div className="space-y-10 order-2 lg:order-1">
                                    <div className="space-y-4">
                                        <motion.div
                                            key={`sub-${activeChapter}-${currentSlide}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="inline-flex items-center gap-3 text-sky-500"
                                        >
                                            <Sparkles size={14} className="animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{activeData.subtitle}</span>
                                        </motion.div>
                                        <motion.h2
                                            key={`title-${activeChapter}-${currentSlide}`}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.1 }}
                                            className="text-6xl sm:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase"
                                        >
                                            {activeData.slides[currentSlide].title}
                                        </motion.h2>
                                    </div>
                                    <motion.p
                                        key={`text-${activeChapter}-${currentSlide}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-xl sm:text-2xl font-medium text-slate-400 leading-relaxed max-w-xl"
                                    >
                                        {activeData.slides[currentSlide].text}
                                    </motion.p>
 
                                    {/* Pagination Controls */}
                                    <div className="flex items-center gap-8 pt-8">
                                        <div className="flex gap-2">
                                            {activeData.slides.map((_: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentSlide(idx)}
                                                    className={`h-2 transition-all duration-500 rounded-full ${
                                                        currentSlide === idx ? 'w-12 bg-sky-500' : 'w-2 bg-white/10 hover:bg-white/20'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                                                disabled={currentSlide === 0}
                                                className="p-4 rounded-full border border-white/10 text-white hover:bg-white/5 disabled:opacity-20 transition-all"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button 
                                                onClick={() => setCurrentSlide(prev => Math.min(activeData.slides.length - 1, prev + 1))}
                                                disabled={currentSlide === activeData.slides.length - 1}
                                                className="p-4 rounded-full border border-white/10 text-white hover:bg-white/5 disabled:opacity-20 transition-all"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
 
                                {/* Image Content */}
                                <div className="order-1 lg:order-2">
                                    <motion.div
                                        key={`img-${activeChapter}-${currentSlide}`}
                                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-sky-500/20 blur-[120px] rounded-full" />
                                        <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-4xl ring-1 ring-white/5">
                                            <img
                                                src={activeData.slides[currentSlide].image}
                                                className="h-full w-full object-cover grayscale-0 group-hover:grayscale transition-all duration-1000"
                                                alt={__("Story Slide")}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
 
                        {/* Slide Indicator (Physical Magazine Vibe) */}
                        <div className="absolute bottom-12 right-12">
                            <span className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase italic">
                                {__("Page")} {currentSlide + 1} / {activeData.slides.length}
                            </span>
                        </div>
                    </div>
 
                    {/* Final Invitation - Physical Card Vibe */}
                    <section className="relative mx-8 overflow-hidden rounded-[4rem] bg-slate-50 dark:bg-white/[0.01] border border-border dark:border-white/5 p-24 text-center shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-flex px-6 py-2 rounded-full bg-sky-500/10 text-sky-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4"
                            >
                                {__("Your Presence is Requested")}
                            </motion.div>
                            <h2 className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic">
                                {__("Initiate")} <br />
                                <span className="text-sky-500 opacity-20">{__("Encounter")}</span>
                            </h2>
                            <div ref={reserveButtonRef as any} className="inline-block mt-8">
                                <Link href="/reservations/create">
                                    <Button
                                        className="h-24 px-20 rounded-[2rem] bg-black dark:bg-sky-500 text-white dark:text-black text-[12px] font-black uppercase tracking-[0.4em] shadow-4xl hover:scale-105 transition-all duration-500"
                                    >
                                        {__("Reserve My Passage")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>
 
                <Footer />
                <GlobalCustomerChat />
                <AIChatbot />
            </div>
        </div>
    );
}



