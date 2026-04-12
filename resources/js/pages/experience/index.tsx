import { Head, Link, usePage } from '@inertiajs/react';
import { ChefHat, Sparkles, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { useState } from 'react';
import { motion } from 'framer-motion';

// Layout Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import AIChatbot from '@/components/app/ai-chatbot';

export default function Experience() {
    const { auth } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Strategic Gastronomy - RestoWeb Premium" />

            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-slate-900 dark:text-neutral-400 selection:bg-amber-500 selection:text-black transition-colors duration-500 overflow-hidden">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                <main className="pt-32 pb-24">
                    {/* Hero Section - Executive Reveal */}
                    <section className="relative mx-8 mb-32 overflow-hidden rounded-[3rem] bg-slate-900 dark:bg-white/[0.02] border border-white/5 h-[75vh] flex items-center shadow-3xl">
                        <div className="absolute inset-0">
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.2 }}
                                transition={{ duration: 1.5 }}
                                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2670&auto=format&fit=crop"
                                alt="Culinary Sanctum"
                                className="h-full w-full object-cover grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                        </div>
                        
                        <div className="relative z-10 mx-auto max-w-5xl px-12 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-2 text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase glow-amber"
                            >
                                <Sparkles size={12} />
                                <span>The Philosophy</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="font-['Playfair_Display',serif] text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter"
                            >
                                Seni Presisi <br />
                                <span className="italic font-serif opacity-30">Gastronomi</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                className="max-w-2xl text-xl font-medium text-slate-400"
                            >
                                Setiap piring adalah manifesto kejujuran bahan and dedikasi tanpa kompromi terhadap kualitas.
                            </motion.p>
                        </div>

                        {/* Ambient Orbs */}
                        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[100px]" />
                    </section>

                    {/* Masterclass Section */}
                    <section className="relative mx-auto max-w-7xl px-8 mb-32">
                        <div className="grid items-center gap-24 lg:grid-cols-2">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-amber-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative overflow-hidden rounded-[3rem] aspect-[4/5] bg-slate-100 dark:bg-white/5 border border-border dark:border-white/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2568&auto=format&fit=crop"
                                        alt="Strategic Architect"
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="glass-card flex items-center gap-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-3xl">
                                            <ChefHat size={48} className="text-amber-500" />
                                            <div>
                                                <p className="font-['Playfair_Display',serif] text-2xl font-black text-white tracking-tight">
                                                    Executive Chef Antonio
                                                </p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
                                                    Tri-Michelin Pedigree
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <h2 className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                        Visi Sang <br />
                                        <span className="italic font-serif opacity-30 text-amber-500">Maestro Strategis</span>
                                    </h2>
                                    <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-neutral-500">
                                        Chef Antonio mengintegrasikan tradisi kontinental dengan eksplorasi botanik lokal. Setiap inovasi berakar pada fondasi rasa yang autentik, dieksekusi dengan presisi laboratoris.
                                    </p>
                                </div>

                                <blockquote className="relative p-10 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-border dark:border-white/5">
                                    <span className="absolute top-4 left-6 text-6xl font-serif text-amber-500/20 italic">"</span>
                                    <p className="relative z-10 text-2xl font-['Playfair_Display',serif] italic leading-relaxed text-slate-800 dark:text-neutral-300">
                                        Masakan adalah bahasa universal. Melalui tekstur and temperatur, kami menceritakan kisah tentang tanah, musim, and dedikasi manusia.
                                    </p>
                                </blockquote>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="glass-card flex items-center gap-4 rounded-2xl bg-white dark:bg-white/5 p-6 border border-border dark:border-white/5">
                                        <Award className="text-amber-500" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Global Laureate</span>
                                    </div>
                                    <div className="glass-card flex items-center gap-4 rounded-2xl bg-white dark:bg-white/5 p-6 border border-border dark:border-white/5">
                                        <Sparkles className="text-amber-500" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Culinary Innovator</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Final Invitation */}
                    <section className="relative mx-8 overflow-hidden rounded-[3rem] bg-slate-900 p-24 text-center shadow-3xl">
                        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <div className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 opacity-50 blur-[120px]" />
                        
                        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-['Playfair_Display',serif] text-5xl md:text-7xl font-black text-white tracking-tighter"
                            >
                                Initiate Your <br />
                                <span className="italic font-serif opacity-30">Private Encounter</span>
                            </motion.h2>
                            <p className="text-xl font-medium text-slate-400">
                                Kami mengundang Anda untuk mengamankan momen gastronomi eksklusif malam ini.
                            </p>
                            <Link href="/reservations/create">
                                <Button
                                    className="group h-20 rounded-[1.5rem] bg-amber-500 px-16 text-[12px] font-black uppercase tracking-[0.3em] text-black shadow-2xl transition-all hover:scale-105 hover:bg-white active:scale-95"
                                >
                                    Reserver Now
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

