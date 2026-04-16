import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function LocationHours() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            
            // Typical hours: 8 AM - 10 PM (Mon-Fri), 9 AM - 11 PM (Sat-Sun)
            if (day >= 1 && day <= 5) {
                setIsOpen(hour >= 8 && hour < 22);
            } else {
                setIsOpen(hour >= 9 && hour < 23);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section 
            id="location-hours"
            ref={containerRef}
            className="relative py-12 md:py-20 bg-[#FFF9F2] dark:bg-neutral-900/50 transition-colors duration-700 overflow-hidden"
        >
            {/* Artistic background grain/textures */}
            <div className="absolute inset-0 premium-noise opacity-[0.03] pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                    
                    {/* JAM OPERASIONAL CARD */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-white dark:bg-neutral-900/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 lg:p-12 shadow-[0_30px_60px_-15px_rgba(180,140,100,0.1)] border border-white/40 dark:border-white/5 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Clock size={24} strokeWidth={1.5} />
                                </div>
                                <h2 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white">Jam Operasional</h2>
                            </div>

                            <div className="space-y-10">
                                <div className="group">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-3 font-sans">Senin — Jumat</p>
                                    <p className="font-serif text-2xl md:text-3xl text-slate-800 dark:text-neutral-200 group-hover:text-primary transition-colors duration-500">08:00 AM — 10:00 PM</p>
                                </div>
                                
                                <div className="group">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-3 font-sans">Sabtu — Minggu</p>
                                    <p className="font-serif text-2xl md:text-3xl text-slate-800 dark:text-neutral-200 group-hover:text-primary transition-colors duration-500">09:00 AM — 11:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <motion.div 
                                initial={{ scale: 0.95 }}
                                animate={{ scale: [0.95, 1, 0.95] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                                    isOpen 
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                }`}
                            >
                                <div className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'} `} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                    {isOpen ? 'Kami Buka Sekarang' : 'Kami Tutup Sekarang'}
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* LOKASI CARD */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-white dark:bg-neutral-900/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 lg:p-12 shadow-[0_30px_60px_-15px_rgba(180,140,100,0.1)] border border-white/40 dark:border-white/5 flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <MapPin size={24} strokeWidth={1.5} />
                            </div>
                            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white">Lokasi Kami</h2>
                        </div>

                        <p className="font-serif text-xl md:text-2xl text-slate-600 dark:text-neutral-400 leading-relaxed mb-12 italic">
                            11, Jalan Telawi 3, Bangsar, <br />
                            59100 Kuala Lumpur
                        </p>

                        <div className="relative flex-1 min-h-[300px] rounded-[2.5rem] overflow-hidden group ring-1 ring-slate-200 dark:ring-white/10">
                            {/* Map Placeholder with high-end look */}
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.340942082269!2d101.661706!3d3.127814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc498ef0253725%3A0xe543e597c4146a78!2sBangsar%2C%20Kuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur!5e0!3m2!1sen!2smy!4v1713022500000!5m2!1sen!2smy" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, filter: 'grayscale(1) contrast(1.1) opacity(0.8)' }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                            />
                            
                            <div className="absolute top-6 right-6">
                                <a 
                                    href="https://maps.app.goo.gl/YourMapLink" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    Buka di Maps
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
