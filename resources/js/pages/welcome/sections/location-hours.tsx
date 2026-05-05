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
            className="relative py-12 md:py-20 bg-background transition-colors duration-700 overflow-hidden px-4"
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
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />
            
            <div className="mx-auto max-w-7xl px-8 relative z-10">
                {/* Elite Header */}
                <div className="mb-32 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-10 inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/5 px-6 py-2 backdrop-blur-xl"
                    >
                        <MapPin size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{__('Our Sanctuary')}</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-foreground leading-[0.9] tracking-tighter mb-12"
                    >
                        {__('Find Your')} <br />
                        <span className="italic font-light opacity-40">{__('Horizon.')}</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* JAM OPERASIONAL CARD */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="bg-card rounded-3xl p-10 sm:p-12 md:p-16 flex flex-col justify-between border border-border relative overflow-hidden group hover:translate-y-[-10px] transition-all duration-700 shadow-2xl"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--primary)_5%,transparent)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="relative z-10">
                             <div className="flex items-center gap-6 mb-16">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xl group-hover:rotate-12 transition-transform duration-700 border border-primary/20">
                                     <Clock size={32} strokeWidth={1} />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-1">{__('Availability')}</span>
                                    <h3 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight italic">{__('Operational Hours')}</h3>
                                 </div>
                             </div>
 
                            <div className="space-y-16">
                                <div className="group/time">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8 font-sans group-hover/time:text-primary transition-colors">{__('Opening Daily')}</p>
                                    <div className="flex flex-col gap-4">
                                        <p className="font-serif text-5xl sm:text-7xl md:text-8xl text-foreground leading-[0.85] tracking-tighter transition-all">
                                            {__('10:00')} <span className="italic opacity-20 font-light text-5xl sm:text-6xl">{__('AM')}</span>
                                        </p>
                                        <div className="h-px w-20 bg-primary/30" />
                                        <p className="font-serif text-5xl sm:text-7xl md:text-8xl text-foreground leading-[0.85] tracking-tighter">
                                            {__('11:00')} <span className="italic opacity-20 font-light text-5xl sm:text-6xl">{__('PM')}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        <div className="mt-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={`inline-flex items-center gap-4 px-8 py-4 rounded-xl backdrop-blur-3xl ${
                                    isOpen 
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-2xl' 
                                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20 shadow-2xl'
                                }`}
                            >
                                <div className={`h-3 w-3 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500'} `} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                    {isOpen ? __('We Are Open Now') : __('We Are Closed Now')}
                                </span>
                            </motion.div>
                        </div>
                    </motion.div>
 
                    {/* LOKASI CARD */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        className="glass-elite rounded-3xl p-10 sm:p-12 md:p-16 flex flex-col border border-black/5 dark:border-white/5 relative overflow-hidden group hover:translate-y-[-10px] transition-all duration-700 shadow-4xl"
                    >
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xl group-hover:-rotate-12 transition-transform duration-700 border border-primary/20">
                                <MapPin size={32} strokeWidth={1} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-1">{__('Location')}</span>
                                <h3 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight italic">{__('The Shoreline')}</h3>
                            </div>
                        </div>
 
                        <div className="mb-12">
                            <p className="font-serif text-xl sm:text-2xl text-muted-foreground leading-relaxed italic transition-colors group-hover:text-foreground opacity-80">
                                {__('Kompleks Ruko Bandar, Jl. Jenderal Sudirman No.26 Blok N1, Klandasan Ulu, Balikpapan')}
                            </p>
                        </div>
 
                        <div className="relative flex-1 min-h-[400px] rounded-2xl overflow-hidden group/map border border-black/5 dark:border-white/5 shadow-2xl">
                            <div 
                                ref={mapContainerRef} 
                                className="absolute inset-0 z-0 h-full w-full"
                            />
                            
                            <div className="absolute top-10 right-10 z-10">
                                <a 
                                    href="https://maps.app.goo.gl/g5LkqGHRnbGva1sV8" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-4 bg-white dark:bg-slate-900 px-10 py-5 rounded-full text-[11px] font-black text-primary uppercase tracking-[0.4em] shadow-4xl transition-all hover:scale-110 active:scale-95 border border-primary/20 backdrop-blur-xl"
                                >
                                    {__('Navigate')}
                                    <Navigation size={16} className="animate-bounce" />
                                </a>
                            </div>

                            {/* Floating Overlay for Map */}
                            <div className="absolute bottom-10 left-10 z-10 pointer-events-none">
                                <div className="glass-elite px-8 py-5 rounded-[2rem] border border-white/20 backdrop-blur-3xl shadow-4xl">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mb-2">GPS Coordinates</span>
                                    <span className="text-[11px] font-bold text-foreground opacity-60">-1.2721869, 116.8091722</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
