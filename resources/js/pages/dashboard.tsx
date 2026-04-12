import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Users, BookOpen, Clock, CalendarCheck, TrendingUp, HandPlatter, ArrowRight, Wallet, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
    AreaChart, 
    Area, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function Dashboard({ stats, recent_activity, revenue_chart, best_sellers }: any) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending') return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20 px-3 py-1">Menunggu</Badge>;
        if (status === 'confirmed') return <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1">Dikonfirmasi</Badge>;
        if (status === 'completed') return <Badge className="bg-white/10 text-white/70 hover:bg-white/10 px-3 py-1">Selesai</Badge>;
        return <Badge className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/20 px-3 py-1">Dibatalkan</Badge>;
    };

    // Custom Chart Components
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0A0A0B] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-amber-500 text-lg font-bold">{formatRupiah(payload[0].value)}</p>
                    <p className="text-white/30 text-[10px] mt-1 italic">{payload[0].payload.reservations} reservasi</p>
                </div>
            );
        }
        return null;
    };

    const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#B45309', '#92400E'];

    return (
        <>
            <Head title="Overview - RestoWeb Admin" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-white/95">
                            Overview Operasional
                        </h1>
                        <p className="mt-2 text-sm text-white/40 max-w-md">
                            Monitor aktivitas harian, performa finansial, dan tren menu favorit pelanggan Anda secara real-time.
                        </p>
                    </div>
                </div>

                {/* Stat Cards - Refined */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {[
                        { title: 'Menunggu', val: stats.pending_reservations, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/20' },
                        { title: 'Tamu Hari Ini', val: stats.today_reservations, icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
                        { title: 'Omset Hari Ini', val: formatRupiah(stats.estimated_revenue), icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/20' },
                        { title: 'Total Menu', val: stats.total_menus, icon: HandPlatter, color: 'text-purple-500', bg: 'bg-purple-500/20' }
                    ].map((card, idx) => (
                        <div key={idx} className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                                    <card.icon size={24} strokeWidth={1.5} />
                                </div>
                                <div className="h-2 w-10 rounded-full bg-white/5 overflow-hidden">
                                    <div className={`h-full ${card.bg.replace('/20', '')} w-2/3 opacity-50`}></div>
                                </div>
                            </div>
                            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mt-4 mb-1">{card.title}</p>
                            <p className="text-2xl font-bold text-white tracking-tight">{card.val}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-8 lg:grid-cols-3 mb-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <TrendingUp size={18} />
                                </div>
                                <h2 className="text-lg font-semibold text-white/90 font-['Playfair_Display',serif]">Tren Omset Mingguan</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-xs text-white/40">
                                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> Omset
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 w-full -ml-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenue_chart}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#ffffff33" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{fill: '#ffffff66'}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        stroke="#ffffff33" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(val) => `Rp${val/1000}k`}
                                        tick={{fill: '#ffffff66'}}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{stroke: '#ffffff11', strokeWidth: 1}} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#D97706" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Best Sellers */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md flex flex-col h-[400px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <ShoppingBag size={18} />
                            </div>
                            <h2 className="text-lg font-semibold text-white/90 font-['Playfair_Display',serif]">Menu Terlaris</h2>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {best_sellers.length > 0 ? (
                                <div className="space-y-6">
                                    {best_sellers.map((menu: any, idx: number) => (
                                        <div key={menu.id} className="relative">
                                            <div className="flex justify-between items-center mb-2 px-1">
                                                <span className="text-sm font-medium text-white/80 max-w-[150px] truncate">{menu.name}</span>
                                                <span className="text-xs font-bold text-amber-400">{menu.sold} Porsi</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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
                            ) : (
                                <div className="h-full flex items-center justify-center text-white/30 text-sm">
                                    Belum ada data penjualan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    {/* Recent Activity */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] shadow-xl backdrop-blur-md flex flex-col overflow-hidden">
                        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-white/[0.01]">
                            <h2 className="text-lg font-semibold text-white/90 font-['Playfair_Display',serif]">Aktivitas Reservasi</h2>
                            <Link href="/reservations" className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 group">
                                Monitoring <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="flex-1 p-0">
                            {recent_activity.length > 0 ? (
                                <ul className="divide-y divide-white/5">
                                    {recent_activity.map((activity: any) => (
                                        <li key={activity.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 text-xs font-bold ring-1 ring-white/10">
                                                    {activity.customer_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white/95">{activity.customer_name}</p>
                                                    <p className="text-xs text-white/40 mt-1">Meja tgl {activity.date} jam {activity.time} · <span className="text-amber-500/60">{activity.created_at}</span></p>
                                                </div>
                                            </div>
                                            <div>
                                                {getStatusBadge(activity.status)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-20 text-center text-white/30 text-sm italic">
                                    Hening... belum ada aktivitas reservasi yang tercatat.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Growth Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-amber-600/10 via-amber-900/10 to-[#0A0A0B] border border-amber-500/15 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                        <div className="absolute top-0 right-0 -m-8 h-40 w-40 bg-amber-500/10 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -m-8 h-40 w-40 bg-blue-500/5 blur-[100px] rounded-full"></div>
                        
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/40 transform -rotate-6">
                            <Users size={40} className="text-[#0A0A0B]" />
                        </div>
                        
                        <h3 className="font-['Playfair_Display',serif] text-5xl font-black text-amber-500 mb-2 tracking-tighter">{stats.total_customers}</h3>
                        <p className="text-sm font-semibold text-amber-200/40 uppercase tracking-[4px] mb-8">Pelanggan Setia</p>
                        
                        <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-[200px]">
                            Terus berikan layanan terbaik untuk meningkatkan loyalitas tamu Anda.
                        </p>
                        
                        <Link href="/menus" className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 px-8 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 w-full group">
                            Optimasi Menu <BookOpen size={16} className="ml-2 group-hover:rotate-12 transition-transform opacity-70" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

