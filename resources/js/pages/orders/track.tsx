import { Head, Link } from '@inertiajs/react';
import { 
    ChevronRight, 
    ArrowLeft, 
    Phone, 
    MessageSquare, 
    Clock, 
    MapPin, 
    Bike,
    AlertCircle,
    Info,
    Utensils,
    Store,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';
import BoutiqueChat from '@/components/app/boutique-chat';
import { usePage } from '@inertiajs/react';

export default function OrderTrack({ order: initialOrder }: any) {
    const { auth } = usePage().props as any;
    const [order, setOrder] = useState(initialOrder || {});
    const [activeChat, setActiveChat] = useState(false);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const routingRef = useRef<any>(null);
    const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);
    const [remainingDistance, setRemainingDistance] = useState<string | null>(null);

    // Safe formatting helpers
    const formatStatus = (status: string) => {
        if (!status) return 'Processing';
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getOrderId = () => {
        const idStr = String(order?.id || '0000');
        return idStr.slice(-4);
    };

    // Locations
    const restoPos: [number, number] = [-1.2654, 116.8312]; 
    const customerPos: [number, number] = [
        Number(order?.customer_lat) || -1.2650, 
        Number(order?.customer_lng) || 116.8320
    ];
    
    const courierPos: [number, number] = [
        Number(order?.courier_lat) || restoPos[0],
        Number(order?.courier_lng) || restoPos[1]
    ];

    const calculateAngle = (oldPos: [number, number], newPos: [number, number]) => {
        if (!oldPos || !newPos) return 0;
        const dy = newPos[0] - oldPos[0];
        const dx = newPos[1] - oldPos[1];
        let theta = Math.atan2(dy, dx); 
        theta *= 180 / Math.PI; 
        return 90 - theta;
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && !mapRef.current) {
            const map = L.map('track-map', {
                zoomControl: false,
                attributionControl: false
            }).setView(courierPos, 15);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(map);

            L.circleMarker(restoPos, {
                radius: 6,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            const destIcon = L.divIcon({
                className: 'custom-destination-icon',
                html: `<div class="relative h-10 w-10 flex items-center justify-center">
                    <div class="absolute h-full w-full rounded-full bg-emerald-500 opacity-20 animate-ping"></div>
                    <div class="relative h-8 w-8 flex items-center justify-center rounded-xl bg-emerald-500 text-white shadow-2xl border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            L.marker(customerPos, { icon: destIcon }).addTo(map);

            const bikeIcon = L.divIcon({
                className: 'custom-bike-icon',
                html: `<div id="courier-marker-icon" class="relative h-14 w-14 flex items-center justify-center transition-transform duration-1000">
                    <div class="absolute h-10 w-10 rounded-full bg-sky-500 opacity-40 blur-lg"></div>
                    <div class="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-sky-500 shadow-2xl border-2 border-sky-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M4 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="m10 10-2 3a2 2 0 1 1-1.33-3.67L10 6h3l2 2"/><path d="M13 10V6"/></svg>
                    </div>
                </div>`,
                iconSize: [56, 56],
                iconAnchor: [28, 28]
            });
            markerRef.current = L.marker(courierPos, { icon: bikeIcon }).addTo(map);

            const routingControl = (L as any).Routing.control({
                waypoints: [L.latLng(courierPos), L.latLng(customerPos)],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                lineOptions: {
                    styles: [
                        { color: '#0ea5e9', opacity: 0.3, weight: 12 },
                        { color: '#0ea5e9', opacity: 0.8, weight: 6 }
                    ]
                },
                createMarker: () => null,
                show: false
            }).addTo(map);

            routingRef.current = routingControl;
            routingControl.on('routesfound', (e: any) => {
                const summary = e.routes[0].summary;
                setEstimatedMinutes(Math.round(summary.totalTime / 60) + 5);
                setRemainingDistance(`${(summary.totalDistance / 1000).toFixed(1)} KM`);
            });

            mapRef.current = map;
            const bounds = L.latLngBounds([courierPos, customerPos]);
            map.fitBounds(bounds.pad(0.5));
        }

        if (order?.id) {
            const channel = window.Echo.channel(`orders.${order.id}`)
                .listen('.CourierLocationUpdated', (e: any) => {
                    const lat = Number(e.latitude);
                    const lng = Number(e.longitude);
                    
                    if (isNaN(lat) || isNaN(lng)) return;

                    const newPos: [number, number] = [lat, lng];
                    
                    if (markerRef.current && mapRef.current) {
                        const iconElement = document.getElementById('courier-marker-icon');
                        const currentPos = markerRef.current.getLatLng();
                        const oldPos: [number, number] = [currentPos.lat, currentPos.lng];
                        
                        const angle = calculateAngle(oldPos, newPos);
                        if (iconElement) iconElement.style.transform = `rotate(${angle}deg)`;

                        if (routingRef.current) {
                            routingRef.current.setWaypoints([L.latLng(newPos), L.latLng(customerPos)]);
                        }

                        markerRef.current.setLatLng(newPos);
                        
                        const bounds = L.latLngBounds([customerPos, newPos]);
                        mapRef.current.fitBounds(bounds.pad(0.3), { animate: true, duration: 1.5 });
                    }
                });

            return () => { window.Echo.leave(`orders.${order.id}`); };
        }
    }, [order?.id]);

    return (
        <div className="min-h-screen bg-[#0A0A0B] font-sans text-foreground overflow-hidden">
            <Head title={`Track Order #${getOrderId()} — Ocean's Resto`} />
            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

            <main className="pt-32 pb-20 relative">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-1 w-8 rounded-full bg-sky-500" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">Live Intercept</span>
                                <div className="flex items-center gap-1.5 ml-4 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Signal Active</span>
                                </div>
                            </div>
                            <h1 className="font-['Playfair_Display',serif] text-5xl font-black text-white md:text-6xl tracking-tighter">
                                Track <span className="italic font-serif opacity-40 text-sky-500">Voyage</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl p-2 pr-6 backdrop-blur-xl">
                            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                                <Bike size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Courier Name</p>
                                <p className="text-sm font-bold text-white uppercase">{order?.courier?.name || 'Agus (Kurir Express)'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">
                        <div className="lg:col-span-8 relative rounded-[3.5rem] overflow-hidden border border-white/5 shadow-3xl bg-neutral-900">
                            <div id="track-map" className="absolute inset-0 z-10" />
                            <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Time Estimate</span>
                                        <span className="text-xl font-black text-white">{estimatedMinutes || '--'} MIN</span>
                                    </div>
                                    <div className="h-8 w-px bg-white/10 mx-2" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">Distance</span>
                                        <span className="text-xl font-black text-white">{remainingDistance || '--'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div className="rounded-[3rem] bg-white/[0.03] border border-white/5 p-8 backdrop-blur-3xl">
                                <h3 className="text-xl font-black font-['Playfair_Display',serif] text-white mb-8">Voyage Progress</h3>
                                <div className="space-y-8 relative">
                                    <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />
                                    {[
                                        { id: 'preparing', label: 'Chef Preparing', desc: 'Dapur sedang mengolah menu pilihan Anda.', icon: Utensils, status: ['preparing', 'delivering', 'delivered'].includes(order?.status || '') },
                                        { id: 'picked_up', label: 'Courier at Resto', desc: 'Kurir sedang mengambil pesanan di Ocean\'s Resto.', icon: Store, status: ['delivering', 'delivered'].includes(order?.status || '') },
                                        { id: 'delivering', label: 'On The Way', desc: 'Kurir sedang memacu kendaraan menuju lokasi Anda.', icon: Bike, status: order?.status === 'delivering' },
                                        { id: 'delivered', label: 'Safe Landing', desc: 'Pesanan telah mendarat dengan aman di tujuan.', icon: CheckCircle2, status: order?.status === 'delivered' }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex gap-6 relative group">
                                            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${step.status ? 'bg-sky-500 text-black shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-white/5 text-white/20'}`}>
                                                <step.icon size={16} />
                                            </div>
                                            <div className="pt-0.5">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${step.status ? 'text-sky-500' : 'text-white/20'}`}>{step.label}</p>
                                                <p className="text-[9px] font-medium text-white/40 mt-1 leading-relaxed">{step.desc}</p>
                                            </div>
                                            {step.status && idx < 3 && (
                                                <div className="absolute left-4 top-8 h-8 w-px bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 rounded-[3rem] bg-white/[0.03] border border-white/5 p-8 backdrop-blur-3xl flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black font-['Playfair_Display',serif] text-white">Destination</h3>
                                        <Badge className="bg-sky-500/10 border border-sky-500/20 text-sky-500 text-[9px] font-black px-3 py-1 uppercase">{formatStatus(order?.status)}</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0"><MapPin size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Destinasi</p>
                                                <p className="text-sm font-medium text-white/80 line-clamp-2">{order?.address || 'Alamat tujuan...'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0"><Clock size={20} /></div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Dipesan Pada</p>
                                                <p className="text-sm font-medium text-white/80">{order?.created_at ? new Date(order.created_at).toLocaleTimeString() : '--:--'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3 mt-8">
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest" onClick={() => setActiveChat(!activeChat)}>
                                            <MessageSquare className="mr-2 h-4 w-4" /> Live Chat
                                        </Button>
                                        <Button variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-sky-500 transition-all"><Phone size={20} /></Button>
                                    </div>
                                    <Button asChild variant="ghost" className="w-full h-12 text-white/40 hover:text-white text-[9px] font-black uppercase tracking-[0.2em]">
                                        <Link href="/orders/history"><ArrowLeft className="mr-2 h-3 w-3" /> Kembali ke Riwayat</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {activeChat && <BoutiqueChat orderId={order?.id || 0} currentUser={auth?.user} />}
            <Footer />
            <style>{`
                .leaflet-container { background: #0A0A0B !important; }
                .leaflet-routing-container { display: none !important; }
                .custom-bike-icon, .custom-destination-icon { border: none !important; background: none !important; }
            `}</style>
        </div>
    );
}

const Badge = ({ children, className }: any) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
        {children}
    </span>
);
