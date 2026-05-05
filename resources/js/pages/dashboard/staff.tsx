import { Head, Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Clock, CalendarCheck, CheckCircle2, UserCheck, ArrowRight, Table as TableIcon, Users, UserPlus, TrendingUp, HandPlatter, Wallet, ShoppingBag, Info, ChefHat, Plus, X, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { index as reservationsRoute, show as showReservationRoute } from '@/routes/reservations';
import { index as menusRoute } from '@/routes/menus';
import { useTranslations } from '@/hooks/use-translations';
import BoutiqueChat from '@/components/app/boutique-chat';
import { MessageCircle } from 'lucide-react';

const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 20px; }
`;

export default function StaffDashboard({ auth, stats, todays_schedule, recent_activity, revenue_chart, best_sellers, reservation_chart, filters }: any) {
    const { __, locale } = useTranslations();
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(amount);
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-black/80 border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl ring-1 ring-slate-200 dark:ring-white/5">
                    <p className="text-slate-400 dark:text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-emerald-600 dark:text-emerald-500 text-xl font-black tracking-tight">{formatRupiah(payload[0].value)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest">{payload[0].payload.sales ?? payload[0].payload.reservations} {__('Transaksi/Reservasi')}</p>
                    </div>
                </div>
            );
        }
        return null;
    };
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'awaiting_payment': { label: __('Menunggu DP'), color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
            'pending': { label: __('Menunggu'), color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
            'confirmed': { label: __('Dikonfirmasi'), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: __('Selesai'), color: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/50 border-slate-200 dark:border-white/10' },
            'cancelled': { label: __('Dibatalkan'), color: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20' },
            'rejected': { label: __('Ditolak'), color: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20' }
        };
        const config = variants[status] || variants.pending;
        return <Badge className={`${config.color} hover:bg-transparent px-3 py-1 font-bold text-[10px] uppercase tracking-wider border transition-all`}>{config.label}</Badge>;
    };

    const updateStatus = (id: number, status: string) => {
        router.put(`/reservations/${id}`, { status }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success feedback automatically handled by flash messages
            }
        });
    };

    const deleteReservation = (id: number) => {
        if (confirm(__('Apakah Anda yakin ingin menghapus riwayat reservasi ini?'))) {
            router.delete(`/reservations/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success feedback automatically handled by flash messages
                }
            });
        }
    };

    return (
        <>
            <Head title={__('Staff Hub - Dashboard')} />

            <div className="mx-auto max-w-7xl font-sans text-slate-900 dark:text-white pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500/80 uppercase">{__('Staff Station')}</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {__('Operational')} <span className="text-slate-300 dark:text-white/40 italic font-serif">{__('Hub')}</span>
                        </h1>
                        <p className="mt-4 text-sm md:text-base text-slate-500 dark:text-white/40 max-w-lg leading-relaxed font-medium">
                            {__('Kelola alur tamu, pantau reservasi hari ini, dan pastikan setiap pengalaman kuliner berjalan sempurna.')}
                        </p>
                    </div>

                    <div className="flex flex-col items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 border border-slate-200 dark:border-white/5 relative z-20 overflow-x-auto hide-scrollbar">
                            <div className="flex min-w-max">
                                {[
                                    { id: 'day', label: __('Daily') },
                                    { id: 'week', label: __('Weekly') },
                                    { id: 'month', label: __('Monthly') },
                                    { id: 'year', label: __('Yearly') }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => router.get(dashboard.url({ query: { period: p.id } }), {}, { preserveState: true, preserveScroll: true })}
                                        className={cn(
                                            "px-4 md:px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-500",
                                            (filters?.period ?? 'week') === p.id 
                                                ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xl ring-1 ring-black/5 dark:ring-white/10" 
                                                : "text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60"
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             <Button asChild variant="outline" className="rounded-2xl border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 h-10 md:h-11 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex-1 sm:flex-none">
                                <Link href="/reservations/create">
                                    <Plus className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                    {__('Reservasi Baru')}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-2xl border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-500 hover:bg-sky-500/20 h-10 md:h-11 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex-1 sm:flex-none">
                                <Link href="/kitchen">
                                    <ChefHat className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                                    {__('Kitchen View')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Operations Stat Cards */}
                <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-8 md:mb-12">
                    {[
                        { title: __('Reservasi Menunggu'), val: stats.pending_reservations, icon: Clock, color: 'text-sky-500', bg: 'bg-sky-500/10', href: reservationsRoute.url({ query: { status: 'pending' } }) },
                        { title: __('Pesanan Aktif'), val: stats.active_orders, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: reservationsRoute.url({ query: { status: 'confirmed' } }) },
                        { title: __('Item Terjual'), val: stats.total_food_sold, icon: HandPlatter, color: 'text-purple-400', bg: 'bg-purple-400/10', href: '#' },
                        { title: __('Omset Hari Ini'), val: formatRupiah(stats.today_revenue), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '#' },
                    ].map((card, idx) => (
                        <Link 
                            key={idx} 
                            href={card.href}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 md:p-8 shadow-xl dark:shadow-2xl backdrop-blur-3xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/15 overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 block cursor-pointer"
                        >
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className={`flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                <card.icon size={20} className="md:w-7 md:h-7" strokeWidth={1.5} />
                            </div>
                            
                            <div className="mt-4 md:mt-8">
                                <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase mb-1 md:mb-2 truncate">{card.title}</p>
                                <p className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">{card.val}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-6 md:gap-8 lg:grid-cols-3 mb-8 md:mb-12">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] p-6 md:p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[350px] md:h-[500px] ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-8 md:mb-12 text-left">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-xl hidden sm:block">
                                    <TrendingUp size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Financial Analytics')}</h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5">
                                    {filters?.period === 'day' ? __('Revenue Trends (Today / Hourly)') : (filters?.period === 'year' ? __('Revenue Trends (12 Months)') : (filters?.period === 'month' ? __('Revenue Trends (30 Days)') : __('Revenue Trends (7 Days)')))}
                                </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-w-0 overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <AreaChart data={revenue_chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="currentColor" 
                                        strokeOpacity={0.1}
                                        fontSize={8} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: 'currentColor', opacity: 0.3, fontWeight: 600}}
                                        dx={-5}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#10b981" 
                                        strokeWidth={2} 
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers */}
                    <div className="rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 md:p-10 shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col h-[350px] md:h-[500px]">
                        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12 text-left">
                            <div className="p-2.5 md:p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-xl hidden sm:block">
                                <ShoppingBag size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Menu Terlaris')}</h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5">{__('Top Performance Dishes')}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6 md:space-y-8">
                                {best_sellers.map((menu: any, idx: number) => (
                                    <div key={menu.id} className="group relative text-left">
                                        <div className="flex justify-between items-center mb-2 md:mb-3 px-1">
                                            <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{menu.name}</span>
                                            <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-500 italic">{menu.sold} <span className="text-[9px] md:text-[10px] not-italic opacity-40">{__('SOLD')}</span></span>
                                        </div>
                                        <div className="h-1.5 md:h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
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

                <div className="grid gap-6 md:gap-8 lg:grid-cols-2 mb-8 md:mb-12">
                    {/* Reservation Analytics Chart */}
                    <div className="lg:col-span-2 rounded-[2rem] md:rounded-[3rem] border border-white/5 bg-white/[0.02] p-6 md:p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[350px] md:h-[500px] ring-1 ring-white/5">
                        <div className="flex items-center justify-between mb-8 md:mb-12 text-left">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 shadow-xl hidden sm:block">
                                    <CalendarCheck size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Reservation Analytics')}</h2>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5">
                                        {filters?.period === 'day' ? __('Reservasi & Pendapatan DP (Hari Ini / Per Jam)') : (filters?.period === 'year' ? __('Reservasi & Pendapatan DP (12 Bulan)') : (filters?.period === 'month' ? __('Reservasi & Pendapatan DP (30 Hari)') : __('Reservasi & Pendapatan DP (7 Hari)')))}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-w-0 overflow-hidden">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={reservation_chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevDP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff33', fontWeight: 600}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        yAxisId="left"
                                        stroke="currentColor" 
                                        strokeOpacity={0.1}
                                        fontSize={8} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: 'currentColor', opacity: 0.3, fontWeight: 600}}
                                        dx={-5}
                                    />
                                    <YAxis 
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="currentColor" 
                                        strokeOpacity={0.1}
                                        fontSize={8} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: 'currentColor', opacity: 0.3, fontWeight: 600}}
                                        dx={5}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar 
                                        yAxisId="left"
                                        dataKey="revenue" 
                                        fill="url(#colorRevDP)" 
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mb-8 md:mb-12">
                    {/* Today's Schedule - Crucial for Staff */}
                    <div className="rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col ring-1 ring-slate-100 dark:ring-white/5">
                        <div className="p-5 md:p-10 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-left">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Jadwal Hari Ini')}</h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1">{__('Timeline kedatangan tamu')}</p>
                            </div>
                            <Link href={reservationsRoute.url()} className="h-10 px-5 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-500 transition-all hover:bg-emerald-500 hover:text-black w-full sm:w-auto">
                                {__('Lihat Semua')}
                            </Link>
                        </div>
                        <div className="flex-1 p-0 overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                            {todays_schedule && todays_schedule.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-white/[0.01]">
                                            <th className="p-6 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest pl-10">{__('Waktu')}</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">{__('Nama Tamu')}</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest text-center">{__('Meja')}</th>
                                            <th className="p-6 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest text-right pr-10">{__('Status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {todays_schedule.map((res: any) => (
                                            <tr key={res.id} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="p-6 pl-10">
                                                    <span className="text-base font-black text-emerald-500 italic">{res.time}</span>
                                                </td>
                                                <td className="p-6">
                                                    <Link href={showReservationRoute.url(res.id)}>
                                                        <p className="font-bold text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors uppercase text-sm cursor-pointer">{res.customer_name}</p>
                                                    </Link>
                                                    <p className="text-[10px] text-slate-400 dark:text-white/20 font-bold mt-1 tracking-widest">{res.guests} {__('GUESTS')}</p>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                                                        <TableIcon size={12} />
                                                        {res.table}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right pr-10">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {getStatusBadge(res.status)}
                                                        <button 
                                                            onClick={() => setSelectedReservation(res)}
                                                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5"
                                                            title={__('Lihat Detail')}
                                                        >
                                                            <Info size={14} />
                                                        </button>
                                                        
                                                        {res.status === 'pending' && (
                                                            <>
                                                                <button 
                                                                    onClick={() => updateStatus(res.id, 'awaiting_payment')}
                                                                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                                                    title={__('Terima & Menunggu Pembayaran')}
                                                                >
                                                                    <CheckCircle2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => updateStatus(res.id, 'rejected')}
                                                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                                                                    title={__('Tolak Reservasi')}
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {res.status === 'awaiting_payment' && (
                                                            <button 
                                                                onClick={() => updateStatus(res.id, 'confirmed')}
                                                                className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 transition-colors border border-sky-500/20"
                                                                title={__('Tandai Sudah Bayar (Confirmed)')}
                                                            >
                                                                <Wallet size={14} />
                                                            </button>
                                                        )}

                                                        {res.status === 'confirmed' && (
                                                            <button 
                                                                onClick={() => updateStatus(res.id, 'completed')}
                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                                                title={__('Tandai Selesai')}
                                                            >
                                                                <CheckCircle2 size={14} />
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => setActiveChatId(activeChatId === res.id ? null : res.id)}
                                                            className={`p-1.5 rounded-lg border transition-colors ${
                                                                activeChatId === res.id ? 'bg-emerald-500 text-white dark:text-black border-emerald-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/5'
                                                            }`}
                                                            title={__('Buka Chat')}
                                                        >
                                                            <MessageCircle size={14} />
                                                        </button>

                                                        <button 
                                                            onClick={() => deleteReservation(res.id)}
                                                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                                            title={__('Hapus Riwayat')}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-20 text-center text-slate-300 dark:text-white/10 flex flex-col items-center gap-4">
                                    <CalendarCheck size={48} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{__('Tidak ada jadwal untuk hari ini')}</span>
                                </div>
                            )}
                        </div>
                    </div>


                </div>
                
                {/* Detail Dialog */}
                <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
                    <DialogContent className="sm:max-w-xl bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                            <DialogHeader>
                                <DialogTitle className="font-['Playfair_Display',serif] text-2xl font-bold text-slate-900 dark:text-white">
                                    {__('Detail Reservasi')} #{selectedReservation?.id?.toString().padStart(4, '0')}
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 dark:text-white/40">
                                    {__('Info lengkap tamu, pesanan pre-order, dan tagihan.')}
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        
                        {selectedReservation && (
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500">{__('Informasi Tamu')}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Nama')}</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_name}</p>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Kontak')}</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_phone}</p>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Jadwal')}</p>
                                            <p className="text-sm font-semibold">{new Date(selectedReservation.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US')} - {selectedReservation.time.substring(0,5)} {__('WITA')}</p>
                                        </div>
                                        <div className="bg-slate-100 dark:bg-white/5 rounded-xl p-3 border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Alokasi Meja')}</p>
                                            <p className="text-sm font-semibold">{__('Meja')} {selectedReservation.table_id || '?'} ({selectedReservation.guests} {__('Tamu')})</p>
                                        </div>
                                    </div>
                                    {selectedReservation.special_requests && (
                                        <div className="bg-sky-500/5 rounded-xl p-3 border border-sky-500/10">
                                            <p className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-bold tracking-wider mb-1">{__('Catatan Spesial')}</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-white/80">{selectedReservation.special_requests}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pre-order Menu */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500">{__('Pre-order Menu')}</h4>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                        {selectedReservation.menus && selectedReservation.menus.length > 0 ? (
                                            <div className="divide-y divide-white/5">
                                                {selectedReservation.menus.map((m: any) => (
                                                    <div key={m.id} className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/10 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-white/5">
                                                                <img src={m.image_path.startsWith('http') ? m.image_path : `/storage/${m.image_path}`} alt={m.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white/90">{m.name}</p>
                                                                <p className="text-xs text-slate-400 dark:text-white/40">{m.pivot.quantity}x @ Rp {Number(m.price).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                            Rp {(m.price * m.pivot.quantity).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">{__('Tidak ada pre-order makanan')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">{__('Ringkasan Tagihan (DP)')}</h4>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-white/60">{__('Estimasi Total DP (50%)')}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">Rp {Number(selectedReservation.booking_fee).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-white/60">{__('Diskon Loyalty Points')}</span>
                                            <span className="font-bold text-rose-500 dark:text-rose-400">- Rp {Number(selectedReservation.discount_amount || 0).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                                            <span className="font-bold text-slate-800 dark:text-white/90">{__('Total Harus Dibayar')}</span>
                                            <span className="text-xl font-black text-blue-600 dark:text-blue-400">Rp {Number(selectedReservation.total_after_discount || selectedReservation.booking_fee).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">{__('Status Reservasi:')}</span>
                                            {getStatusBadge(selectedReservation.status)}
                                        </div>
                                        {selectedReservation.status !== 'rejected' && selectedReservation.status !== 'cancelled' && (
                                            <Badge variant={selectedReservation.payment_status === 'paid' ? 'default' : 'destructive'} className={selectedReservation.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-500 border-0' : 'bg-rose-500/20 text-rose-500 border-0'}>
                                                {__(selectedReservation.payment_status || '').toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {activeChatId && (
                    <BoutiqueChat reservationId={activeChatId} currentUser={auth.user} />
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />
        </>
    );
}

StaffDashboard.layout = (page: any) => <RestoAdminLayout>{page}</RestoAdminLayout>;

