import { Head, Link, router, useHttp } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Bike, Package, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BoutiqueChat from '@/components/app/boutique-chat';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import { usePage } from '@inertiajs/react';

export default function CourierDashboard({ stats, deliveries }: any) {
    const { __ } = useTranslations();
    const http = useHttp();
    const { auth } = usePage().props as any;
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    return (
        <>
            <Head title={`${__('Courier Station - Dashboard')} - Ocean's Resto`} />

            <div className="mx-auto max-w-7xl font-sans text-slate-900 dark:text-white pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-blue-500/80 uppercase">{__('Delivery Fleet')}</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {__('Courier')} <span className="text-slate-400 dark:text-white/40 italic font-serif">{__('Dashboard')}</span>
                        </h1>
                        <p className="mt-4 text-sm md:text-base text-slate-400 dark:text-white/40 max-w-lg leading-relaxed font-medium">
                            {__('Pantau pengiriman aktif Anda, koordinasikan dengan dapur, dan pastikan pesanan sampai tepat waktu.')}
                        </p>
                    </div>
                </div>

                {/* Courier Stat Cards */}
                <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 mb-8 md:mb-12">
                    {[
                        { title: __('Pengiriman Aktif'), val: stats.pending_deliveries, icon: Bike, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { title: __('Selesai Hari Ini'), val: stats.completed_today, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                        { title: __('Pesanan Selesai'), val: stats.total_completed, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    ].map((card, idx) => (
                        <div 
                            key={idx} 
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 md:p-8 shadow-xl dark:shadow-2xl backdrop-blur-3xl ring-1 ring-slate-100 dark:ring-white/5 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                        >
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-slate-100 dark:bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className={`flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                                <card.icon size={20} className="md:w-[26px] md:h-[26px]" strokeWidth={2} />
                            </div>
                            <p className="text-[9px] md:text-[10px] font-black tracking-[.2em] text-slate-400 dark:text-white/30 uppercase mb-1 md:mb-2 truncate">{card.title}</p>
                            <p className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{card.val}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col ring-1 ring-slate-100 dark:ring-white/5">
                    <div className="p-5 md:p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Tugas Pengiriman')}</h2>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1">{__('Pesanan yang perlu diantar')}</p>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        {deliveries && deliveries.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {deliveries.map((delivery: any) => (
                                    <div key={delivery.id} className="p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                        <div className="flex gap-4 md:gap-6 items-start">
                                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0 border border-blue-500/20">
                                                <Package size={20} className="md:w-6 md:h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{delivery.customer_name}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/40 font-bold">
                                                        <MapPin size={14} className="text-blue-600 dark:text-blue-500/60" />
                                                        {delivery.address}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-white/40 font-bold">
                                                        <Clock size={14} className="text-blue-600 dark:text-blue-500/60" />
                                                        {delivery.time}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-4 ml-1 pl-4 border-l-2 border-slate-100 dark:border-white/5">
                                                    {delivery.items && delivery.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-2 items-center text-[11px] text-slate-500 dark:text-white/50 font-bold">
                                                            <div className="flex items-center justify-center h-4 w-4 rounded bg-slate-100 dark:bg-white/5 text-[9px] text-slate-400 dark:text-white/40">{item.quantity}x</div>
                                                            <span>{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4">
                                                    <Badge variant="outline" className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                                        {__(delivery.status)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <Button 
                                                onClick={() => setActiveChatId(activeChatId === delivery.id ? null : delivery.id)}
                                                variant="outline"
                                                className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                                                    activeChatId === delivery.id ? 'bg-sky-500 text-white dark:text-black border-sky-500' : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-white/40'
                                                }`}
                                            >
                                                <MessageCircle size={18} />
                                            </Button>

                                            {delivery.status === 'preparing' && (
                                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                                    <Button 
                                                        onClick={() => toast.success(__('Berhasil mengirim status: Menunggu di Restoran'))}
                                                        variant="outline"
                                                        className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <MapPin className="mr-2 h-4 w-4" /> {__('Saya di Resto')}
                                                    </Button>
                                                    
                                                    <Button 
                                                        onClick={() => router.patch(`/orders/${delivery.id}/delivery-status`, { delivery_status: 'delivering' })}
                                                        className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <Bike className="mr-2 h-4 w-4" /> {__('Ambil & Kirim')}
                                                    </Button>
                                                </div>
                                            )}

                                            {delivery.status === 'delivering' && (
                                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                                    <Button 
                                                        onClick={() => {
                                                            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                                                                toast.error(__('GPS Asli memerlukan koneksi HTTPS (SSL) untuk berfungsi.'));
                                                                return;
                                                            }

                                                            if ((window as any).simInterval) {
                                                                clearInterval((window as any).simInterval);
                                                                (window as any).simInterval = null;
                                                            }

                                                            if ((window as any).watchId) {
                                                                navigator.geolocation.clearWatch((window as any).watchId);
                                                                (window as any).watchId = null;
                                                                toast.error(__('GPS Pelacakan Dimatikan'));
                                                                return;
                                                            }

                                                            if (!navigator.geolocation) {
                                                                toast.error(__('Browser Anda tidak mendukung GPS'));
                                                                return;
                                                            }

                                                            const watchId = navigator.geolocation.watchPosition(
                                                                (position) => {
                                                                    const { latitude, longitude, accuracy } = position.coords;
                                                                    
                                                                    // Visual feedback that data is being sent
                                                                    toast.loading(`${__('Mengirim Sinyal GPS')} (Akurasi: ${accuracy.toFixed(0)}m)...`, { id: 'gps-sync' });

                                                                    fetch(`/orders/${delivery.id}/simulate-tracking`, {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                                                        },
                                                                        body: JSON.stringify({ latitude, longitude })
                                                                    }).then(() => {
                                                                        toast.success(`${__('Lokasi Terkirim')}! (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`, { 
                                                                            id: 'gps-sync',
                                                                            duration: 2000
                                                                        });
                                                                    });
                                                                },
                                                                (error) => {
                                                                    toast.error(`GPS Bermasalah: ${error.message}`, { id: 'gps-sync' });
                                                                },
                                                                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
                                                            );

                                                            (window as any).watchId = watchId;
                                                            toast.success(__('GPS Asli Aktif! Melacak posisi real-time Anda.'));
                                                        }}
                                                        variant="outline"
                                                        className={`border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${ (window as any).watchId ? 'bg-emerald-500 text-white' : ''}`}
                                                    >
                                                        <MapPin className="mr-2 h-4 w-4" /> {(window as any).watchId ? __('Stop Pelacakan GPS') : __('Aktifkan GPS Asli')}
                                                    </Button>

                                                    <Button 
                                                        onClick={() => {
                                                            if ((window as any).watchId) {
                                                                navigator.geolocation.clearWatch((window as any).watchId);
                                                                (window as any).watchId = null;
                                                            }

                                                            if ((window as any).simInterval) {
                                                                clearInterval((window as any).simInterval);
                                                                (window as any).simInterval = null;
                                                                toast.error(__('Simulasi Dimatikan'));
                                                                return;
                                                            }

                                                            toast.info(__('Memulai Simulasi Perjalanan...'));
                                                            let i = 0;
                                                            const interval = setInterval(() => {
                                                                if(i > 40) {
                                                                    clearInterval(interval); 
                                                                    (window as any).simInterval = null;
                                                                    return; 
                                                                }
                                                                const startLat = Number(delivery.courier_lat) || -1.2654;
                                                                const startLng = Number(delivery.courier_lng) || 116.8312;
                                                                const lat = startLat + (i * 0.0003);
                                                                const lng = startLng + (i * 0.0003);
                                                                
                                                                fetch(`/orders/${delivery.id}/simulate-tracking`, {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                                                                    },
                                                                    body: JSON.stringify({ latitude: lat, longitude: lng })
                                                                });
                                                                i++;
                                                            }, 1500);

                                                            (window as any).simInterval = interval;
                                                        }}
                                                        variant="outline"
                                                        className={`border-sky-500/50 text-sky-500 hover:bg-sky-500/10 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${ (window as any).simInterval ? 'bg-sky-500 text-white' : ''}`}
                                                    >
                                                        <Bike className="mr-2 h-4 w-4" /> {(window as any).simInterval ? __('Stop Simulasi') : __('Jalankan Simulasi')}
                                                    </Button>

                                                    <Button 
                                                        onClick={() => {
                                                            if ((window as any).watchId) navigator.geolocation.clearWatch((window as any).watchId);
                                                            if ((window as any).simInterval) clearInterval((window as any).simInterval);
                                                            router.patch(`/orders/${delivery.id}/delivery-status`, { delivery_status: 'delivered' });
                                                        }}
                                                        className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <CheckCircle2 className="mr-2 h-4 w-4" /> {__('Selesaikan Pengiriman')}
                                                    </Button>
                                                </div>
                                            )}

                                            {['delivered', 'complete'].includes(delivery.status) && (
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2">
                                                    <CheckCircle2 size={14} /> {__('Berhasil Terkirim')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center text-slate-200 dark:text-white/10 flex flex-col items-center gap-4">
                                <Package size={48} strokeWidth={1} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">{__('Belum ada tugas pengiriman')}</span>
                                <p className="text-[9px] text-slate-300 dark:text-white/20 max-w-xs mx-auto">{__('Tunggu Admin memberikan tugas kepada Anda.')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {activeChatId && (
                    <BoutiqueChat orderId={activeChatId} currentUser={auth.user} />
                )}
            </div>
        </>
    );
}

CourierDashboard.layout = (page: any) => <RestoAdminLayout>{page}</RestoAdminLayout>;
