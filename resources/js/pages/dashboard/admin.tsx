import { Head, Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { useState } from 'react';
import { Users, BookOpen, Clock, CalendarCheck, TrendingUp, HandPlatter, ArrowRight, Wallet, ShoppingBag, Loader2 } from 'lucide-react';
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
import { index as reservationsRoute, show as showReservationRoute } from '@/routes/reservations';
import BoutiqueChat from '@/components/app/boutique-chat';
import { MessageCircle } from 'lucide-react';
import { index as menusRoute } from '@/routes/menus';
import { useTranslations } from '@/hooks/use-translations';

const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
`;

export default function AdminDashboard({ auth, stats, recent_activity, revenue_chart, best_sellers, reservation_chart, filters }: any) {
    const { __, locale } = useTranslations();
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'pending': { label: __('Menunggu'), color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
            'confirmed': { label: __('Dikonfirmasi'), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: __('Selesai'), color: 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/50 border-slate-200 dark:border-white/10' },
            'cancelled': { label: __('Dibatalkan'), color: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20' },
            'rejected': { label: __('Ditolak'), color: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20' }
        };
        const config = variants[status] || variants.pending;
        return <Badge className={`${config.color} hover:bg-transparent px-3 py-1 font-bold text-[10px] uppercase tracking-wider border transition-all`}>{config.label}</Badge>;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-black/80 border border-slate-200 dark:border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl ring-1 ring-slate-200 dark:ring-white/5">
                    <p className="text-slate-400 dark:text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-sky-600 dark:text-sky-500 text-xl font-black tracking-tight">{formatRupiah(payload[0].value)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-widest">{payload[0].payload.sales ?? payload[0].payload.reservations} {__('Transaksi/Reservasi')}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    return (
        <>
            <Head title={__('Owner Suite - Dashboard')} />
            <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />

            <div className="mx-auto max-w-7xl font-sans text-slate-900 dark:text-white pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-sky-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-sky-500/80 uppercase">{__('Owner Suite')}</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {__('Executive')} <span className="text-slate-300 dark:text-white/40 italic font-serif">{__('Overview')}</span>
                        </h1>
                        <p className="mt-4 text-sm md:text-base text-slate-500 dark:text-white/40 max-w-lg leading-relaxed font-medium">
                            {__('Pantau performa bisnis, tren pendapatan, dan efektivitas menu dalam satu dashboard eksklusif.')}
                        </p>
                    </div>
                    
                    <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 border border-slate-200 dark:border-white/5 relative z-20 overflow-x-auto hide-scrollbar w-full md:w-auto">
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
                                            ? "bg-sky-500 text-white dark:text-black shadow-xl scale-105" 
                                            : "text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 md:mb-12">
                    {[
                        { title: __('Reservasi Pending'), val: stats.pending_reservations, icon: Clock, color: 'text-sky-400', bg: 'bg-sky-500/10', href: reservationsRoute.url({ query: { status: 'pending' } }) },
                        { title: __('Pesanan Aktif'), val: stats.active_orders, icon: CalendarCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', href: reservationsRoute.url({ query: { status: 'confirmed' } }) },
                        { title: __('Omset Hari Ini'), val: formatRupiah(stats.today_revenue), icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-500/10', href: '#' },
                        { title: __('Total Menu'), val: stats.total_menus, icon: HandPlatter, color: 'text-purple-400', bg: 'bg-purple-500/10', href: menusRoute.url() }
                    ].map((card, idx) => (
                        <Link 
                            key={idx} 
                            href={card.href}
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative rounded-3xl md:rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] p-5 md:p-7 shadow-xl dark:shadow-2xl backdrop-blur-3xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/15 overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 cursor-pointer block"
                        >
                            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <card.icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-slate-400 dark:text-white/30 uppercase mb-1 truncate">{card.title}</p>
                                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter truncate">{card.val}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-6 md:gap-8 lg:grid-cols-3 mb-8 md:mb-12">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 p-6 md:p-10 shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col h-[350px] md:h-[500px] ring-1 ring-slate-100 dark:ring-white/5 overflow-hidden">
                        <div className="flex items-center justify-between mb-8 md:mb-12 text-left">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 hidden sm:block">
                                    <TrendingUp size={22} strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">{__('Financial Analytics')}</h2>
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
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff08" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: 'currentColor', opacity: 0.2}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#ffffff08" 
                                        fontSize={8} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: 'currentColor', opacity: 0.2}}
                                        dx={-5}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{stroke: 'currentColor', strokeOpacity: 0.1, strokeWidth: 2}} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#0ea5e9" 
                                        strokeWidth={2} 
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers */}
                    <div className="rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 p-6 md:p-10 shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col h-[350px] md:h-[500px] ring-1 ring-slate-100 dark:ring-white/5">
                        <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12 text-left">
                            <div className="p-2.5 md:p-3 bg-sky-500/10 rounded-2xl text-sky-400 border border-sky-500/20 hidden sm:block">
                                <ShoppingBag size={22} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight">{__('Menu Terlaris')}</h2>
                                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-0.5">{__('Top Performing Dishes')}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-6 md:space-y-7">
                                {best_sellers.map((menu: any, idx: number) => (
                                    <div key={menu.id} className="group relative text-left">
                                        <div className="flex justify-between items-center mb-2 px-1">
                                            <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors uppercase tracking-tight">{menu.name}</span>
                                            <span className="text-xs md:text-sm font-black text-sky-600 dark:text-sky-400 italic">{menu.sold} <span className="text-[9px] md:text-[10px] not-italic opacity-40">{__('SOLD')}</span></span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
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
                                <div className="p-2.5 md:p-3 bg-sky-500/10 rounded-2xl text-sky-400 border border-sky-500/20 shadow-xl hidden sm:block">
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
                                        <linearGradient id="colorAdminRevDP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff11" 
                                        fontSize={9} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: 'currentColor', opacity: 0.3, fontWeight: 600}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        yAxisId="left"
                                        stroke="#ffffff11" 
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
                                        stroke="#ffffff11" 
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
                                        fill="url(#colorAdminRevDP)" 
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mb-8 md:mb-12">
                        {/* Recent Activity */}
                        <div className="rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] shadow-xl dark:shadow-3xl backdrop-blur-3xl flex flex-col overflow-hidden ring-1 ring-slate-100 dark:ring-white/5">
                            <div className="border-b border-slate-100 dark:border-white/5 p-5 md:p-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50 dark:bg-white/[0.01]">
                                <div className="text-left">
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('Log Reservasi')}</h2>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1">{__('Live Activity Stream')}</p>
                                </div>
                                <Link href={reservationsRoute.url()} className="h-10 px-5 flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-500 transition-all hover:bg-sky-500 hover:text-white dark:hover:text-black group w-full sm:w-auto">
                                    {__('Full List')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="flex-1 overflow-x-auto">
                                <ul className="divide-y divide-slate-100 dark:divide-white/5 min-w-[500px]">
                                    {recent_activity.map((activity: any, i: number) => (
                                        <li key={activity.id} className="flex items-center justify-between p-5 md:p-8 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group">
                                            <div className="flex items-center gap-4 md:gap-6">
                                                <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-white/10 dark:to-white/5 flex items-center justify-center text-sky-600 dark:text-sky-500 text-lg font-black ring-1 ring-slate-200 dark:ring-white/10 shadow-sm">
                                                    {activity.customer_name?.charAt(0)}
                                                </div>
                                                <div className="text-left">
                                                    <Link href={showReservationRoute.url(activity.id)}>
                                                        <p className="font-black text-slate-900 dark:text-white text-base md:text-lg tracking-tight hover:text-sky-600 dark:hover:text-sky-500 transition-colors cursor-pointer line-clamp-1">{activity.customer_name}</p>
                                                    </Link>
                                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest mt-1 md:mt-1.5 whitespace-nowrap">{activity.date} • {activity.time} • <span className="text-sky-600 dark:text-sky-500/60 lowercase italic font-serif hidden sm:inline">{activity.created_at}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                                                <Link 
                                                    href={showReservationRoute.url(activity.id)}
                                                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-sky-500 hover:text-white dark:hover:text-black border border-slate-200 dark:border-white/5 hover:border-sky-500 transition-all"
                                                    title={__('Lihat Detail')}
                                                >
                                                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => setActiveChatId(activeChatId === activity.id ? null : activity.id)}
                                                    className={`p-2 rounded-xl border transition-all ${activeChatId === activity.id ? 'bg-sky-500 text-white dark:text-black border-sky-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/5'}`}
                                                    title={__('Buka Chat')}
                                                >
                                                    <MessageCircle size={14} className="md:w-4 md:h-4" />
                                                </button>
                                                <div className="hidden sm:block">
                                                    {getStatusBadge(activity.status)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                {activeChatId && (
                    <BoutiqueChat reservationId={activeChatId} currentUser={auth.user} />
                )}
            </div>
        </>
    );
}

AdminDashboard.layout = (page: any) => <RestoAdminLayout>{page}</RestoAdminLayout>;
