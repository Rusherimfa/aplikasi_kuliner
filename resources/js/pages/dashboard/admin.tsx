import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
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
import { index as reservationsRoute } from '@/routes/reservations';
import { index as menusRoute } from '@/routes/menus';

export default function AdminDashboard({ stats, recent_activity, revenue_chart, best_sellers, reservation_chart }: any) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'pending': { label: 'Menunggu', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
            'confirmed': { label: 'Dikonfirmasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: 'Selesai', color: 'bg-white/5 text-white/50 border-white/10' },
            'cancelled': { label: 'Dibatalkan', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
            'rejected': { label: 'Ditolak', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
        };
        const config = variants[status] || variants.pending;
        return <Badge className={`${config.color} hover:bg-transparent px-3 py-1 font-bold text-[10px] uppercase tracking-wider border transition-all`}>{config.label}</Badge>;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 border border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-orange-500 text-xl font-black tracking-tight">{formatRupiah(payload[0].value)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{payload[0].payload.sales ?? payload[0].payload.reservations} Transaksi/Reservasi</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    return (
        <>
            <Head title="Owner Suite - Dashboard" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-20">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500/80 uppercase">Owner Suite</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white">
                            Executive <span className="text-white/40 italic font-serif">Overview</span>
                        </h1>
                        <p className="mt-4 text-white/40 max-w-lg leading-relaxed font-medium">
                            Pantau performa bisnis, tren pendapatan, dan efektivitas menu dalam satu dashboard eksklusif.
                        </p>
                    </div>
                    
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                        <div className="px-6 py-2.5 text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-500 rounded-xl shadow-lg border border-orange-500/20">Today</div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {[
                        { title: 'Pending Res.', val: stats.pending_reservations, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { title: 'Pesanan Aktif', val: stats.active_orders, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { title: 'Omset Hari Ini', val: formatRupiah(stats.today_revenue), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { title: 'Menu Items', val: stats.total_menus, icon: HandPlatter, color: 'text-purple-500', bg: 'bg-purple-500/10' }
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
                                            <stop offset="5%" stopColor="#D97706" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
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
                                        stroke="#D97706" 
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
                            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20 shadow-xl">
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
                                            <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">{menu.name}</span>
                                            <span className="text-sm font-black text-orange-500 italic">{menu.sold} <span className="text-[10px] not-italic opacity-40">SOLD</span></span>
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
                                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400 border border-orange-500/20 shadow-xl">
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
                                        <linearGradient id="colorAdminRevDP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
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
                                        fill="url(#colorAdminRevDP)" 
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    {/* Recent Activity */}
                    <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-3xl backdrop-blur-3xl flex flex-col overflow-hidden ring-1 ring-white/5">
                        <div className="border-b border-white/5 p-8 flex justify-between items-center bg-white/[0.01]">
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Log Reservasi</h2>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Live Activity Stream</p>
                            </div>
                            <Link href={reservationsRoute.url()} className="h-10 px-5 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-wider text-orange-500 transition-all hover:bg-orange-500 hover:text-black group">
                                Full List <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            <ul className="divide-y divide-white/5">
                                {recent_activity.map((activity: any, i: number) => (
                                    <li key={activity.id} className="flex items-center justify-between p-8 hover:bg-white/[0.03] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-orange-500 text-lg font-black ring-1 ring-white/10">
                                                {activity.customer_name?.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-white text-lg tracking-tight group-hover:text-orange-500 transition-colors">{activity.customer_name}</p>
                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1.5">{activity.date} • {activity.time} • <span className="text-orange-500/60 lowercase italic font-serif">{activity.created_at}</span></p>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(activity.status)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
            `}} />
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
