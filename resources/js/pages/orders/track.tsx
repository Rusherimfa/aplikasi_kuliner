import { Head, Link, usePage, router } from '@inertiajs/react';
import L from 'leaflet';
import {
    ArrowLeft,
    Phone,
    MessageSquare,
    Clock,
    MapPin,
    Bike,
    Utensils,
    Store,
    CheckCircle2,
    CircleDollarSign,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BoutiqueChat from '@/components/app/boutique-chat';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import Footer from '../welcome/sections/footer';
import Navbar from '../welcome/sections/navbar';

export default function OrderTrack({ order: initialOrder }: any) {
    const { auth } = usePage().props as any;
    const [order] = useState(initialOrder || {});
    const [activeChat, setActiveChat] = useState(false);
    const [chatContext, setChatContext] = useState<'support' | 'courier'>(
        'support',
    );
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const routingRef = useRef<any>(null);
    const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(
        null,
    );
    const [remainingDistance, setRemainingDistance] = useState<string | null>(
        null,
    );

    // Safe formatting helpers
    const formatStatus = (status: string) => {
        if (!status) {
            return 'Processing';
        }

        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getOrderId = () => {
        const idStr = String(order?.id || '0000');

        return idStr.slice(-4);
    };

    // Locations
    const restoPos: [number, number] = [-1.2654, 116.8312];
    const customerPos: [number, number] = [
        Number(order?.customer_lat) || -1.265,
        Number(order?.customer_lng) || 116.832,
    ];

    const courierPos: [number, number] = [
        Number(order?.courier_lat) || restoPos[0],
        Number(order?.courier_lng) || restoPos[1],
    ];

    const calculateAngle = (
        oldPos: [number, number],
        newPos: [number, number],
    ) => {
        if (!oldPos || !newPos) {
            return 0;
        }

        const dy = newPos[0] - oldPos[0];
        const dx = newPos[1] - oldPos[1];
        let theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI;

        return 90 - theta;
    };

    useEffect(() => {
        // Auto trigger payment if unpaid
        const triggerPayment = async () => {
            if (order?.payment_status === 'unpaid') {
                const snap = (window as any).snap;
                if (!snap) return;

                try {
                    // Fetch a fresh token to ensure it's not expired or locked to a previous method
                    const response = await fetch(`/orders/payment/${order.id}/refresh`, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                            'Accept': 'application/json',
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.snap_token) {
                        snap.pay(data.snap_token, {
                            onSuccess: () => router.reload(),
                            onPending: () => router.reload(),
                            onClose: () => console.log('Payment modal closed'),
                            onError: () => console.error('Payment failed'),
                        });
                    }
                } catch (error) {
                    console.error('Auto Payment Refresh Error:', error);
                }
            }
        };

        if (order?.payment_status === 'unpaid') {
            triggerPayment();
        }
    }, [order?.id]);

    useEffect(() => {

        if (typeof window !== 'undefined' && !mapRef.current) {
            const map = L.map('track-map', {
                zoomControl: false,
                attributionControl: false,
            }).setView(courierPos, 15);

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                {
                    maxZoom: 20,
                },
            ).addTo(map);

            L.circleMarker(restoPos, {
                radius: 6,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
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
                iconAnchor: [20, 20],
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
                iconAnchor: [28, 28],
            });
            markerRef.current = L.marker(courierPos, { icon: bikeIcon }).addTo(
                map,
            );

            const routingControl = (L as any).Routing.control({
                waypoints: [L.latLng(courierPos), L.latLng(customerPos)],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                lineOptions: {
                    styles: [
                        { color: '#0ea5e9', opacity: 0.3, weight: 12 },
                        { color: '#0ea5e9', opacity: 0.8, weight: 6 },
                    ],
                },
                createMarker: () => null,
                show: false,
            }).addTo(map);

            routingRef.current = routingControl;
            routingControl.on('routesfound', (e: any) => {
                const summary = e.routes[0].summary;
                setEstimatedMinutes(Math.round(summary.totalTime / 60) + 5);
                setRemainingDistance(
                    `${(summary.totalDistance / 1000).toFixed(1)} KM`,
                );
            });

            mapRef.current = map;
            const bounds = L.latLngBounds([courierPos, customerPos]);
            map.fitBounds(bounds.pad(0.5));
        }

        if (order?.id) {
            window.Echo.channel(`orders.${order.id}`).listen(
                '.CourierLocationUpdated',
                (e: any) => {
                    const lat = Number(e.latitude);
                    const lng = Number(e.longitude);

                    if (isNaN(lat) || isNaN(lng)) {
                        return;
                    }

                    const newPos: [number, number] = [lat, lng];

                    if (markerRef.current && mapRef.current) {
                        const iconElement = document.getElementById(
                            'courier-marker-icon',
                        );
                        const currentPos = markerRef.current.getLatLng();
                        const oldPos: [number, number] = [
                            currentPos.lat,
                            currentPos.lng,
                        ];

                        const angle = calculateAngle(oldPos, newPos);

                        if (iconElement) {
                            iconElement.style.transform = `rotate(${angle}deg)`;
                        }

                        if (routingRef.current) {
                            routingRef.current.setWaypoints([
                                L.latLng(newPos),
                                L.latLng(customerPos),
                            ]);
                        }

                        markerRef.current.setLatLng(newPos);

                        const bounds = L.latLngBounds([customerPos, newPos]);
                        mapRef.current.fitBounds(bounds.pad(0.3), {
                            animate: true,
                            duration: 1.5,
                        });
                    }
                },
            );

            return () => {
                window.Echo.leave(`orders.${order.id}`);
            };
        }
    }, [calculateAngle, courierPos, customerPos, order?.id, restoPos]);

    return (
        <div className="min-h-screen overflow-hidden bg-[#0A0A0B] font-sans text-foreground">
            <Head title={`Track Order #${getOrderId()} — Ocean's Resto`} />
            <Navbar
                auth={auth}
                dashboardUrl="/dashboard"
                mobileMenuOpen={false}
                setMobileMenuOpen={() => {}}
            />

            <main className="relative pt-32 pb-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 rounded-full bg-sky-500" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">
                                    Live Intercept
                                </span>
                                <div className="ml-4 flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5">
                                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black tracking-widest text-emerald-500 uppercase">
                                        Signal Active
                                    </span>
                                </div>
                            </div>
                            <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white md:text-6xl">
                                Track{' '}
                                <span className="font-serif text-sky-500 italic opacity-40">
                                    Voyage
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-2 pr-6 backdrop-blur-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                                <Bike size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">
                                    Courier Name
                                </p>
                                <p className="text-sm font-bold text-white uppercase">
                                    {order?.courier?.name ||
                                        'Agus (Kurir Express)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid h-[650px] grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="relative overflow-hidden rounded-[3.5rem] border border-white/5 bg-neutral-900 shadow-3xl lg:col-span-8">
                            <div
                                id="track-map"
                                className="absolute inset-0 z-10"
                            />
                            <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
                                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-2xl">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black tracking-widest text-sky-500 uppercase">
                                            Time Estimate
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {estimatedMinutes || '--'} MIN
                                        </span>
                                    </div>
                                    <div className="mx-2 h-8 w-px bg-white/10" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black tracking-widest text-sky-500 uppercase">
                                            Distance
                                        </span>
                                        <span className="text-xl font-black text-white">
                                            {remainingDistance || '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:col-span-4">
                            <div className="rounded-[3rem] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-3xl">
                                <h3 className="mb-8 font-['Playfair_Display',serif] text-xl font-black text-white">
                                    Voyage Progress
                                </h3>
                                <div className="relative space-y-8">
                                    <div className="absolute top-2 bottom-2 left-4 w-px bg-white/5" />
                                    {[
                                        {
                                            id: 'preparing',
                                            label: 'Chef Preparing',
                                            desc: 'Dapur sedang mengolah menu pilihan Anda.',
                                            icon: Utensils,
                                            status: [
                                                'preparing',
                                                'delivering',
                                                'delivered',
                                            ].includes(order?.status || ''),
                                        },
                                        {
                                            id: 'picked_up',
                                            label: 'Courier at Resto',
                                            desc: "Kurir sedang mengambil pesanan di Ocean's Resto.",
                                            icon: Store,
                                            status: [
                                                'delivering',
                                                'delivered',
                                            ].includes(order?.status || ''),
                                        },
                                        {
                                            id: 'delivering',
                                            label: 'On The Way',
                                            desc: 'Kurir sedang memacu kendaraan menuju lokasi Anda.',
                                            icon: Bike,
                                            status:
                                                order?.status === 'delivering',
                                        },
                                        {
                                            id: 'delivered',
                                            label: 'Safe Landing',
                                            desc: 'Pesanan telah mendarat dengan aman di tujuan.',
                                            icon: CheckCircle2,
                                            status:
                                                order?.status === 'delivered',
                                        },
                                    ].map((step, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative flex gap-6"
                                        >
                                            <div
                                                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${step.status ? 'bg-sky-500 text-black shadow-[0_0_20px_rgba(14,165,233,0.4)]' : 'bg-white/5 text-white/20'}`}
                                            >
                                                <step.icon size={16} />
                                            </div>
                                            <div className="pt-0.5">
                                                <p
                                                    className={`text-[10px] font-black tracking-widest uppercase ${step.status ? 'text-sky-500' : 'text-white/20'}`}
                                                >
                                                    {step.label}
                                                </p>
                                                <p className="mt-1 text-[9px] leading-relaxed font-medium text-white/40">
                                                    {step.desc}
                                                </p>
                                            </div>
                                            {step.status && idx < 3 && (
                                                <div className="absolute top-8 left-4 h-8 w-px bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col justify-between rounded-[3rem] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-3xl">
                                <div>
                                    <div className="mb-8 flex items-center justify-between">
                                        <h3 className="font-['Playfair_Display',serif] text-xl font-black text-white">
                                            Destination
                                        </h3>
                                        <Badge className="border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[9px] font-black text-sky-500 uppercase">
                                            {formatStatus(order?.status)}
                                        </Badge>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="mb-1 text-[10px] font-black tracking-widest text-white/20 uppercase">
                                                    Destinasi
                                                </p>
                                                <p className="line-clamp-2 text-sm font-medium text-white/80">
                                                    {order?.delivery_address ||
                                                        'Alamat tujuan...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="mb-1 text-[10px] font-black tracking-widest text-white/20 uppercase">
                                                    Dipesan Pada
                                                </p>
                                                <p className="text-sm font-medium text-white/80">
                                                    {order?.created_at
                                                        ? new Date(
                                                              order.created_at,
                                                          ).toLocaleTimeString()
                                                        : '--:--'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <div className="flex gap-3">
                                        {order?.payment_status === 'unpaid' ? (
                                            <Button
                                                className="h-14 flex-1 rounded-2xl bg-emerald-500 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                                onClick={() => {
                                                    const snap = (window as any).snap;
                                                    if (snap && order.midtrans_snap_token) {
                                                        snap.pay(order.midtrans_snap_token, {
                                                            onSuccess: () => router.reload(),
                                                            onPending: () => router.reload(),
                                                        });
                                                    }
                                                }}
                                            >
                                                <CircleDollarSign className="mr-2 h-4 w-4" />{' '}
                                                Bayar Sekarang
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="h-14 flex-1 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black"
                                                    onClick={() => {
                                                        setChatContext('support');
                                                        setActiveChat(!activeChat);
                                                    }}
                                                >
                                                    <MessageSquare className="mr-2 h-4 w-4" />{' '}
                                                    Live Chat
                                                </Button>
                                                {order?.order_type === 'delivery' &&
                                                    order?.courier?.name && (
                                                        <Button
                                                            className="h-14 flex-1 rounded-2xl bg-cyan-500 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-cyan-600"
                                                            onClick={() => {
                                                                setChatContext(
                                                                    'courier',
                                                                );
                                                                setActiveChat(
                                                                    !activeChat,
                                                                );
                                                            }}
                                                        >
                                                            <Bike className="mr-2 h-4 w-4" />{' '}
                                                            Chat Kurir
                                                        </Button>
                                                    )}
                                            </>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 text-white transition-all hover:bg-sky-500"
                                        >
                                            <Phone size={20} />
                                        </Button>
                                    </div>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="h-12 w-full text-[9px] font-black tracking-[0.2em] text-white/40 uppercase hover:text-white"
                                    >
                                        <Link href="/orders/history">
                                            <ArrowLeft className="mr-2 h-3 w-3" />{' '}
                                            Kembali ke Riwayat
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {activeChat && (
                <BoutiqueChat
                    orderId={order?.id || 0}
                    currentUser={auth?.user}
                    title={
                        chatContext === 'courier'
                            ? 'Chat Kurir Delivery'
                            : 'Live Chat Pesanan'
                    }
                    subtitle={
                        chatContext === 'courier'
                            ? `Customer & Kurir${order?.courier?.name ? `, ${order.courier.name}` : ''}`
                            : 'Customer, Staff & Kurir'
                    }
                />
            )}
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
    <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
        {children}
    </span>
);
