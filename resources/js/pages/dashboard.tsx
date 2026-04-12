import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Users, BookOpen, Clock, CalendarCheck, TrendingUp, HandPlatter, ArrowRight, Wallet, ShoppingBag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer,
} from 'recharts';
import { index as reservationsRoute } from '@/routes/reservations';
import { index as menusRoute } from '@/routes/menus';

export default function Dashboard({ stats, recent_activity, revenue_chart, best_sellers }: any) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'pending': { label: 'Menunggu', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
            'confirmed': { label: 'Dikonfirmasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: 'Selesai', color: 'bg-white/5 text-white/50 border-white/10' },
            'cancelled': { label: 'Dibatalkan', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
        };
        const config = variants[status] || variants.pending;
        return <Badge className={`${config.color} hover:bg-transparent px-3 py-1 font-bold text-[10px] uppercase tracking-wider border transition-all`}>{config.label}</Badge>;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 border border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{label}</p>
                    <p className="text-amber-500 text-xl font-black tracking-tight">{formatRupiah(payload[0].value)}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{payload[0].payload.reservations} Reservasi</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    return (
        <>
            <Head title="Overview - Executive Suite" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-20">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-1 w-8 rounded-full bg-amber-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-amber-500/80 uppercase">Control Center</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-white">
                            Overview <span className="text-white/40 italic font-serif">Operasional</span>
                        </h1>
                        <p className="mt-4 text-white/40 max-w-lg leading-relaxed font-medium">
                            Monitor aktivitas harian, performa finansial, dan tren menu favorit pelanggan Anda melalui antarmuka eksekutif RestoWeb.
                        </p>
                    </div>
                    
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                        <button className="px-5 py-2 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black rounded-xl shadow-lg shadow-amber-500/20 transition-all">Today</button>
                        <button className="px-5 py-2 text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-all">Weekly</button>
                        <button className="px-5 py-2 text-[10px] font-black uppercase tracking-wider text-white/40 hover:text-white transition-all">Monthly</button>
                    </div>
                </div>

                {/* Stat Cards - Higher Impact */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {[
                        { title: 'Menunggu', val: stats.pending_reservations, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { title: 'Tamu Hari Ini', val: stats.today_reservations, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { title: 'Omset Hari Ini', val: formatRupiah(stats.estimated_revenue), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { title: 'Total Menu', val: stats.total_menus, icon: HandPlatter, color: 'text-purple-500', bg: 'bg-purple-500/10' }
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
                            
                            <div className="absolute bottom-6 left-8 flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">+12.5% vs Prev</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-8 lg:grid-cols-3 mb-12">
                    {/* Revenue Chart - Immersive */}
                    <div className="lg:col-span-2 rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[500px] ring-1 ring-white/5 animate-in fade-in slide-in-from-left-8 duration-1000 fill-mode-both">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 shadow-xl">
                                    <TrendingUp size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Finansial Analytics</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5 text-left">Revenue Trend over 7 days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Revenue Flow</span>
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
                                    <Tooltip 
                                        content={<CustomTooltip />} 
                                        cursor={{stroke: '#ffffff11', strokeWidth: 1.5, strokeDasharray: '5 5'}} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#D97706" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        animationDuration={2500}
                                        animationEasing="ease-in-out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers - List Polish */}
                    <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl backdrop-blur-3xl flex flex-col h-[500px] ring-1 ring-white/5 animate-in fade-in slide-in-from-right-8 duration-1000 fill-mode-both">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20 shadow-xl">
                                <ShoppingBag size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight text-left">Menu Terlaris</h2>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5 text-left">Top Performance Dishes</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {best_sellers && best_sellers.length > 0 ? (
                                <div className="space-y-8">
                                    {best_sellers.map((menu: any, idx: number) => (
                                        <div key={menu.id} className="group relative">
                                            <div className="flex justify-between items-center mb-3 px-1">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors truncate max-w-[140px] leading-tight">{menu.name}</span>
                                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Category ID: {menu.id}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-black text-amber-500 italic">{menu.sold} <span className="text-[10px] not-italic opacity-40">SOLD</span></span>
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-1500 ease-out shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                                                    style={{ 
                                                        width: `${Math.min((menu.sold / Math.max(...best_sellers.map((s:any) => s.sold))) * 100, 100)}%`,
                                                        backgroundColor: COLORS[idx % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-white/10 gap-4">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Syncing Data...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    {/* Recent Activity - Table Refined */}
                    <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] shadow-3xl backdrop-blur-3xl flex flex-col overflow-hidden ring-1 ring-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                        <div className="border-b border-white/5 p-8 flex justify-between items-center bg-white/[0.01]">
                            <div>
                                <h2 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight">Log Reservasi</h2>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 text-left">Live Activity Stream</p>
                            </div>
                            <Link href={reservationsRoute.url()} className="h-10 px-5 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-wider text-amber-500 transition-all hover:bg-amber-500 hover:text-black group">
                                Full List <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            {recent_activity && recent_activity.length > 0 ? (
                                <ul className="divide-y divide-white/5">
                                    {recent_activity.map((activity: any, i: number) => (
                                        <li key={activity.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both flex items-center justify-between p-8 hover:bg-white/[0.03] transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-amber-500 text-lg font-black ring-1 ring-white/10 shadow-xl group-hover:scale-110 transition-transform">
                                                        {activity.customer_name?.charAt(0)}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                                                        <Clock size={10} className="text-white/40" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-lg tracking-tight group-hover:text-amber-500 transition-colors text-left">{activity.customer_name}</p>
                                                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                                                        <span>{activity.date}</span>
                                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                                        <span>{activity.time}</span>
                                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                                        <span className="text-amber-500/60 lowercase italic font-serif normal-case">{activity.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(activity.status)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-32 text-center flex flex-col items-center gap-6">
                                    <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/5 border border-white/5 border-dashed">
                                        <CalendarCheck size={40} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white/20 font-['Playfair_Display',serif]">Hening...</p>
                                        <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.3em] mt-2">No recent registration activity</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Marketing Card - High Contrast */}
                    <div className="rounded-[3rem] bg-[#0A0A0B] border border-amber-500/20 p-10 shadow-3xl relative overflow-hidden flex flex-col items-center justify-center text-center ring-1 ring-amber-500/5 transition-all hover:border-amber-500/40 group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                        <div className="absolute inset-0 bg-grid-white opacity-20" />
                        <div className="absolute top-0 right-0 -m-16 h-64 w-64 bg-amber-500/10 blur-[120px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 -m-16 h-64 w-64 bg-blue-500/5 blur-[120px] rounded-full" />
                        
                        <div className="relative h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-10 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.5)] transform -rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110">
                            <Users size={56} className="text-black" />
                            <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-[#0A0A0B]">
                                <ArrowRight size={20} className="text-black" />
                            </div>
                        </div>
                        
                        <h3 className="relative font-['Playfair_Display',serif] text-7xl font-black text-white mb-3 tracking-tighter tabular-nums drop-shadow-2xl">
                            {stats.total_customers}
                        </h3>
                        <p className="relative text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-10">Loyal Clientele</p>
                        
                        <p className="relative text-sm text-white/40 leading-relaxed mb-12 max-w-[240px] font-medium italic">
                            "Berikan sentuhan keajaiban kuliner for setiap perjalanan rasa pelanggan Anda."
                        </p>
                        
                        <Link href={menusRoute.url()} className="relative inline-flex h-16 items-center justify-center rounded-[1.5rem] bg-amber-500 px-10 text-[10px] font-black uppercase tracking-[2px] text-black shadow-[0_15px_35px_-10px_rgba(245,158,11,0.3)] transition-all hover:bg-white hover:shadow-white/10 hover:-translate-y-1 active:translate-y-0 w-full">
                            Optimasi Sajian <BookOpen size={18} className="ml-3 opacity-60" />
                        </Link>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.3); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

