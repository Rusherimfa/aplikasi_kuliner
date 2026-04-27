import { motion } from 'framer-motion';
import { Clock, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useAppearance } from '@/hooks/use-appearance';

export default function LocationHours() {
    const { __ } = useTranslations();
    const { resolvedAppearance } = useAppearance();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 is Sunday, 1-6 is Mon-Sat
            const hour = now.getHours();
            const minute = now.getMinutes();
            const currentTime = hour + (minute / 60);
            
            // Open Daily: 10:00 AM – 11:00 PM
            setIsOpen(currentTime >= 10 && currentTime < 23);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    // ... (Map Initialization logic remains the same)

    // Leaflet Map Initialization
    useEffect(() => {
        // We use a small timeout to ensure the container has its final dimensions
        const timer = setTimeout(() => {
            if (!mapContainerRef.current) return;

            const L = (window as any).L;
            if (!L) return;

            const lat = -1.2721869;
            const lng = 116.8091722;

            if (!mapRef.current) {
                // Initialize map if not already done
                mapRef.current = L.map(mapContainerRef.current, {
                    center: [lat, lng],
                    zoom: 16,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false
                });

                // Resto Icon
                const restoIcon = L.divIcon({
                    className: 'resto-marker-container',
                    html: `
                        <div class="relative flex items-center justify-center">
                            <div class="absolute h-16 w-16 bg-sky-500/20 rounded-full animate-ping"></div>
                            <div class="absolute h-12 w-12 bg-sky-500/40 rounded-full animate-pulse"></div>
                            <div class="relative h-12 w-12 flex items-center justify-center bg-sky-600 rounded-full shadow-[0_0_25px_rgba(14,165,233,0.7)] border-2 border-white ring-4 ring-sky-500/20">
                                <img src="/logo.png" class="h-7 w-7 object-contain" alt="Ocean's Resto" />
                            </div>
                            <div class="absolute -bottom-12 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-lg shadow-2xl border border-sky-500/20 whitespace-nowrap">
                                <span class="text-[11px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">${__("Ocean's Resto")}</span>
                            </div>
                        </div>
                    `,
                    iconSize: [48, 48],
                    iconAnchor: [24, 24]
                });

                L.marker([lat, lng], { icon: restoIcon }).addTo(mapRef.current);
            }

            // Update Tiles based on appearance
            const tiles = resolvedAppearance === 'dark' 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

            // Remove old tile layers
            mapRef.current.eachLayer((layer: any) => {
                if (layer instanceof L.TileLayer) {
                    mapRef.current.removeLayer(layer);
                }
            });

            L.tileLayer(tiles, {
                maxZoom: 20,
            }).addTo(mapRef.current);

            // Crucial: Fix map size issues common in flex/hidden containers
            mapRef.current.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [resolvedAppearance]);

    return (
        <section 
            id="location-hours"
            ref={containerRef}
            className="relative py-12 md:py-20 bg-[#FFF9F2] dark:bg-background transition-colors duration-700 overflow-hidden"
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-container {
                    background: transparent !important;
                    height: 100%;
                    width: 100%;
                }
                .resto-marker-container {
                    background: transparent !important;
                    border: none !important;
                }
            `}} />

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
                            <div className="flex items-center gap-6 mb-12">
                                <div className="h-14 w-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                                     <Clock size={28} strokeWidth={1.5} />
                                 </div>
                                 <h2 className="font-serif text-4xl md:text-5xl text-slate-900 dark:text-white tracking-tight">{__('Operational Hours')}</h2>
                            </div>

                            <div className="space-y-12">
                                <div className="group">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500/80 mb-5 font-sans">{__('Opening Daily')}</p>
                                    <p className="font-serif text-4xl md:text-5xl text-slate-800 dark:text-neutral-100 leading-none">{__('10:00 AM — 11:00 PM')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${
                                    isOpen 
                                    ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10' 
                                    : 'bg-rose-500/10 text-rose-700 border border-rose-500/10'
                                }`}
                            >
                                <div className={`h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'} `} />
                                <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
                                    {isOpen ? __('We Are Open Now') : __('We Are Closed Now')}
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
                            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 dark:text-white">{__('Our Location')}</h2>
                        </div>

                        <p className="font-serif text-lg md:text-xl text-slate-600 dark:text-neutral-400 leading-relaxed mb-12 italic">
                            {__('Kompleks Ruko Bandar, Jl. Jenderal Sudirman No.26 Blok N1, Klandasan Ulu, Balikpapan')}
                        </p>

                        <div className="relative flex-1 min-h-[350px] rounded-[2.5rem] overflow-hidden group ring-1 ring-slate-200 dark:ring-white/10 bg-slate-100 dark:bg-neutral-900 shadow-inner">
                            <div 
                                ref={mapContainerRef} 
                                className="absolute inset-0 z-0 h-full w-full"
                            />
                            
                            <div className="absolute top-6 right-6 z-10">
                                <a 
                                    href="https://maps.app.goo.gl/g5LkqGHRnbGva1sV8" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    {__('Open in Maps')}
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
