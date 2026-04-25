import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

interface TrackingMapProps {
    reservationId: number;
    initialLat?: number;
    initialLng?: number;
    destinationAddress?: string;
}

export default function GourmetTrackingMap({ reservationId, initialLat = -6.2088, initialLng = 106.8456, destinationAddress }: TrackingMapProps) {
    const { __ } = useTranslations();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [currentPos, setCurrentPos] = useState({ lat: initialLat, lng: initialLng });

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize Leaflet Map
        // We use window.L because we loaded it via CDN
        const L = (window as any).L;
        if (!L) return;

        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [currentPos.lat, currentPos.lng],
                zoom: 15,
                zoomControl: false,
                attributionControl: false
            });

            // Dark Mode stylized tiles (using Alidade Smooth Dark)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(mapRef.current);

            // Custom Iconic Marker
            const courierIcon = L.divIcon({
                className: 'custom-courier-icon',
                html: `<div class="relative h-10 w-10 flex items-center justify-center bg-sky-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] border-2 border-white ring-4 ring-sky-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            markerRef.current = L.marker([currentPos.lat, currentPos.lng], { icon: courierIcon }).addTo(mapRef.current);
        }

        // Listen for real-time location updates
        const channel = (window as any).Echo.channel(`reservations.${reservationId}`)
            .listen('.courier.location.updated', (data: { latitude: number, longitude: number }) => {
                const newLatLng = [data.latitude, data.longitude];
                setCurrentPos({ lat: data.latitude, lng: data.longitude });
                
                if (markerRef.current) {
                    markerRef.current.setLatLng(newLatLng);
                }
                
                if (mapRef.current) {
                    mapRef.current.panTo(newLatLng, { animate: true });
                }
            });

        return () => {
            channel.stopListening('.courier.location.updated');
        };
    }, [reservationId]);

    return (
        <div className="relative w-full h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl bg-black">
            <div ref={mapContainerRef} className="h-full w-full z-0" />
            
            {/* Overlay UI */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{__('Live Tracking')}</span>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                            <Navigation size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{__('Destination')}</p>
                            <p className="text-xs font-bold text-white truncate max-w-[200px]">{destinationAddress || __('Chef\'s Delivery Address')}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{__('Arriving in')}</p>
                        <p className="text-lg font-black text-white tracking-tighter">~12 {__('Min')}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

