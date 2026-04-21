import { Head, Link, router, useHttp } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Truck, Package, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CourierDashboard({ stats, deliveries }: any) {
    const http = useHttp();
    return (
        <>
            <Head title="Courier Station - Dashboard" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-20">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-blue-500/80 uppercase">Delivery Fleet</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white">
                            Courier <span className="text-white/40 italic font-serif">Dashboard</span>
                        </h1>
                        <p className="mt-4 text-white/40 max-w-lg leading-relaxed font-medium">
                            Pantau pengiriman aktif Anda, koordinasikan dengan dapur, dan pastikan pesanan sampai tepat waktu.
                        </p>
                    </div>
                </div>

                {/* Courier Stat Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {[
                        { title: 'Pengiriman Aktif', val: stats.pending_deliveries, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { title: 'Selesai Hari Ini', val: stats.completed_today, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                        { title: 'Pesanan Selesai', val: stats.total_completed, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                    ].map((card, idx) => (
                        <div 
                            key={idx} 
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl ring-1 ring-white/5 transition-all hover:bg-white/[0.04]"
                        >
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                <card.icon size={26} strokeWidth={2} />
                            </div>
                            <p className="text-[10px] font-black tracking-[.2em] text-white/20 uppercase mb-2">{card.title}</p>
                            <p className="text-4xl font-black text-white tracking-tighter">{card.val}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-3xl backdrop-blur-3xl flex flex-col ring-1 ring-white/5">
                    <div className="p-10 border-b border-white/5 flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Tugas Pengiriman</h2>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Pesanan yang perlu diantar</p>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        {deliveries && deliveries.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {deliveries.map((delivery: any) => (
                                    <div key={delivery.id} className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.01] transition-colors">
                                        <div className="flex gap-6 items-start">
                                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                                                <Package size={24} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">{delivery.customer_name}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold">
                                                        <MapPin size={14} className="text-blue-500/60" />
                                                        {delivery.address}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold">
                                                        <Clock size={14} className="text-blue-500/60" />
                                                        {delivery.time}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 mt-4 ml-1 pl-4 border-l-2 border-white/5">
                                                    {delivery.items && delivery.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-2 items-center text-[11px] text-white/50 font-bold">
                                                            <div className="flex items-center justify-center h-4 w-4 rounded bg-white/5 text-[9px] text-white/40">{item.quantity}x</div>
                                                            <span>{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4">
                                                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                                        {delivery.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            {delivery.status === 'preparing' && (
                                                <Button 
                                                    onClick={() => router.patch(`/orders/${delivery.id}/delivery-status`, { delivery_status: 'delivering' })}
                                                    className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    <Truck className="mr-2 h-4 w-4" /> Mulai Kirim
                                                </Button>
                                            )}
                                             {delivery.status === 'delivering' && (
                                                 <div className="flex flex-col gap-2 w-full md:w-auto">
                                                     <Button 
                                                         onClick={() => {
                                                             http.post(`/orders/${delivery.id}/simulate-tracking`);
                                                             toast.success('Simulation started - Movement broadcasting...');
                                                             
                                                             // Client side simulation for demo loop
                                                             let i = 0;
                                                             const interval = setInterval(() => {
                                                                 if(i > 10) { clearInterval(interval); return; }
                                                                 const lat = -6.2088 + (i * 0.001);
                                                                 const lng = 106.8456 + (i * 0.001);
                                                                 http.post(`/orders/${delivery.id}/simulate-tracking`, { latitude: lat, longitude: lng });
                                                                 i++;
                                                             }, 2000);
                                                         }}
                                                         variant="outline"
                                                         className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                     >
                                                         <MapPin className="mr-2 h-4 w-4" /> Simulate GPS
                                                     </Button>
                                                     <Button 
                                                         onClick={() => router.patch(`/orders/${delivery.id}/delivery-status`, { delivery_status: 'delivered' })}
                                                         className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                                     >
                                                         <CheckCircle2 className="mr-2 h-4 w-4" /> Selesaikan
                                                     </Button>
                                                 </div>
                                             )}
                                            {['delivered', 'complete'].includes(delivery.status) && (
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-2">
                                                    <CheckCircle2 size={14} /> Berhasil Terkirim
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center text-white/10 flex flex-col items-center gap-4">
                                <Package size={48} strokeWidth={1} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Belum ada tugas pengiriman</span>
                                <p className="text-[9px] text-white/20 max-w-xs mx-auto">Tunggu Admin memberikan tugas kepada Anda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

CourierDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
