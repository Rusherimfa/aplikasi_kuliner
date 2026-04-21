import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Clock, CalendarCheck, CheckCircle2, UserCheck, ArrowRight, Table as TableIcon, Users, UserPlus, TrendingUp, HandPlatter, Wallet, ShoppingBag, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
    AreaChart, 
    Area, 
    BarChart,
    Bar,
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
} from 'recharts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { index as reservationsRoute } from '@/routes/reservations';

export default function StaffDashboard({ stats, todays_schedule, recent_activity, revenue_chart, best_sellers, reservation_chart }: any) {
    const [selectedReservation, setSelectedReservation] = useState<any>(null);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 border border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-emerald-500 text-xl font-black tracking-tight">{formatRupiah(payload[0].value)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{payload[0].payload.sales ?? payload[0].payload.reservations} Transaksi/Reservasi</p>
                    </div>
                </div>
            );
        }
        return null;
    };
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'awaiting_payment': { label: 'Menunggu DP', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
            'pending': { label: 'Menunggu', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
            'confirmed': { label: 'Dikonfirmasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: 'Selesai', color: 'bg-white/5 text-white/50 border-white/10' },
            'cancelled': { label: 'Dibatalkan', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
            'rejected': { label: 'Ditolak', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
        };
        const config = variants[status] || variants.pending;
        return <Badge className={`${config.color} hover:bg-transparent px-3 py-1 font-bold text-[10px] uppercase tracking-wider border transition-all`}>{config.label}</Badge>;
    };

    return (
        <>
            <Head title="Staff Hub - Dashboard" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-20">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500/80 uppercase">Staff Station</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white">
                            Operational <span className="text-white/40 italic font-serif">Hub</span>
                        </h1>
                        <p className="mt-4 text-white/40 max-w-lg leading-relaxed font-medium">
                            Kelola alur tamu, pantau reservasi hari ini, dan pastikan setiap pengalaman kuliner berjalan sempurna.
                        </p>
                    </div>
                </div>

                {/* Operations Stat Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {[
                        { title: 'Reservasi Menunggu', val: stats.pending_reservations, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { title: 'Pesanan Aktif', val: stats.active_orders, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { title: 'Item Terjual', val: stats.total_food_sold, icon: HandPlatter, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        { title: 'Omset Hari Ini', val: formatRupiah(stats.today_revenue), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    ].map((card, idx) => (
                        <div 
                            key={idx} 
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative aspect-[4/3] rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl transition-all hover:bg-white/[0.04] hover:border-white/15 overflow-hidden ring-1 ring-white/5"
                        >
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                <card.icon size={28} strokeWidth={1.5} />
                            </div>
                            
                            <div className="mt-8">
                                <p className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-2">{card.title}</p>
                                <p className="text-3xl font-black text-white tracking-tighter">{card.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-3 mb-12">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[500px] ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-12 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-xl">
                                    <TrendingUp size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Finansial Analytics</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Revenue Trend over 7 days</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full -ml-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenue_chart}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff11" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dy={15}
                                    />
                                    <YAxis 
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dx={-10}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#10b981" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers */}
                    <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[500px]">
                        <div className="flex items-center gap-4 mb-12 text-left">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-xl">
                                <ShoppingBag size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Menu Terlaris</h2>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Top Performance Dishes</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-8">
                                {best_sellers.map((menu: any, idx: number) => (
                                    <div key={menu.id} className="group relative text-left">
                                        <div className="flex justify-between items-center mb-3 px-1">
                                            <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{menu.name}</span>
                                            <span className="text-sm font-black text-emerald-500 italic">{menu.sold} <span className="text-[10px] not-italic opacity-40">SOLD</span></span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ 
                                                    width: `${Math.min((menu.sold / Math.max(...best_sellers.map((s:any) => s.sold))) * 100, 100)}%`,
                                                    backgroundColor: COLORS[idx % COLORS.length]
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 mb-12">
                    {/* Reservation Analytics Chart */}
                    <div className="lg:col-span-2 rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[500px] ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-12 text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-xl">
                                    <CalendarCheck size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Reservation Analytics</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Reservasi & Pendapatan DP 7 Hari Terakhir</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full -ml-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reservation_chart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="colorRevDP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff11" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dy={15}
                                    />
                                    <YAxis 
                                        yAxisId="left"
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dx={-10}
                                    />
                                    <YAxis 
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dx={10}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        yAxisId="left"
                                        dataKey="revenue" 
                                        fill="url(#colorRevDP)" 
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    {/* Today's Schedule - Crucial for Staff */}
                    <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-3xl backdrop-blur-3xl flex flex-col ring-1 ring-white/5">
                        <div className="p-10 border-b border-white/5 flex justify-between items-center text-left">
                            <div>
                                <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Jadwal Hari Ini</h2>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Timeline kedatangan tamu</p>
                            </div>
                            <Link href={reservationsRoute.url()} className="h-10 px-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black uppercase tracking-wider text-emerald-500 transition-all hover:bg-emerald-500 hover:text-black">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="flex-1 p-0 overflow-y-auto max-h-[600px] custom-scrollbar">
                            {todays_schedule && todays_schedule.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.01]">
                                            <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest pl-10">Waktu</th>
                                            <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Nama Tamu</th>
                                            <th className="p-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Meja</th>
                                            <th className="p-6 text-[10px) font-black text-white/20 uppercase tracking-widest text-right pr-10">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {todays_schedule.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="p-6 pl-10">
                                                    <span className="text-base font-black text-emerald-500 italic">{res.time}</span>
                                                </td>
                                                <td className="p-6">
                                                    <p className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase text-sm">{res.customer_name}</p>
                                                    <p className="text-[10px] text-white/20 font-bold mt-1 tracking-widest">{res.guests} GUESTS</p>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                                        <TableIcon size={12} />
                                                        {res.table}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right pr-10">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {getStatusBadge(res.status)}
                                                        <button 
                                                            onClick={() => setSelectedReservation(res)}
                                                            className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                                                            title="Lihat Detail"
                                                        >
                                                            <Info size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-20 text-center text-white/10 flex flex-col items-center gap-4">
                                    <CalendarCheck size={48} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Tidak ada jadwal untuk hari ini</span>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
                
                {/* Detail Dialog */}
                <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
                    <DialogContent className="sm:max-w-xl bg-[#0A0A0B] border-white/5 text-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                            <DialogHeader>
                                <DialogTitle className="font-['Playfair_Display',serif] text-2xl font-bold">
                                    Detail Reservasi #{selectedReservation?.id?.toString().padStart(4, '0')}
                                </DialogTitle>
                                <DialogDescription className="text-white/40">
                                    Info lengkap tamu, pesanan pre-order, dan tagihan.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        
                        {selectedReservation && (
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500">Informasi Tamu</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Nama</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_name}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Kontak</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_phone}</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Jadwal</p>
                                            <p className="text-sm font-semibold">{new Date(selectedReservation.date).toLocaleDateString('id-ID')} - {selectedReservation.time.substring(0,5)} WIB</p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Alokasi Meja</p>
                                            <p className="text-sm font-semibold">Meja {selectedReservation.table_id || '?'} ({selectedReservation.guests} Tamu)</p>
                                        </div>
                                    </div>
                                    {selectedReservation.special_requests && (
                                        <div className="bg-orange-500/5 rounded-xl p-3 border border-orange-500/10">
                                            <p className="text-[10px] text-orange-400 uppercase font-bold tracking-wider mb-1">Catatan Spesial</p>
                                            <p className="text-sm font-medium text-white/80">{selectedReservation.special_requests}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pre-order Menu */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pre-order Menu</h4>
                                    <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                        {selectedReservation.menus && selectedReservation.menus.length > 0 ? (
                                            <div className="divide-y divide-white/5">
                                                {selectedReservation.menus.map((m: any) => (
                                                    <div key={m.id} className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-white/10 flex-shrink-0 overflow-hidden">
                                                                <img src={`/storage/${m.image_url}`} alt={m.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white/90">{m.name}</p>
                                                                <p className="text-xs text-white/40">{m.pivot.quantity}x @ Rp {Number(m.price).toLocaleString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-400">
                                                            Rp {(m.price * m.pivot.quantity).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Tidak ada pre-order makanan</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Ringkasan Tagihan (DP)</h4>
                                    <div className="bg-white/5 rounded-2xl border border-white/5 p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/60">Estimasi Total DP (50%)</span>
                                            <span className="font-bold">Rp {Number(selectedReservation.booking_fee).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/60">Diskon Loyalty Points</span>
                                            <span className="font-bold text-rose-400">- Rp {Number(selectedReservation.discount_amount || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                            <span className="font-bold text-white/90">Total Harus Dibayar</span>
                                            <span className="text-xl font-black text-blue-400">Rp {Number(selectedReservation.total_after_discount || selectedReservation.booking_fee).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Status Reservasi:</span>
                                            {getStatusBadge(selectedReservation.status)}
                                        </div>
                                        {selectedReservation.status !== 'rejected' && selectedReservation.status !== 'cancelled' && (
                                            <Badge variant={selectedReservation.payment_status === 'paid' ? 'default' : 'destructive'} className={selectedReservation.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-500 border-0' : 'bg-rose-500/20 text-rose-500 border-0'}>
                                                {selectedReservation.payment_status?.toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 20px; }
            `}} />
        </>
    );
}

StaffDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
