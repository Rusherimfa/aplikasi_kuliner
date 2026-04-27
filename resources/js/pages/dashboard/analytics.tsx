import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { 
    TrendingUp, 
    Users, 
    Utensils, 
    CreditCard, 
    Star, 
    ArrowUpRight,
    Trophy,
    ShoppingBag,
    Clock,
    PieChart,
    Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';

export default function AnalyticsDashboard({ stats }: any) {
    const { __, locale } = useTranslations();

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(amount);
    };

    const breadcrumbs = [
        { title: __('Dashboard'), href: '/dashboard' },
        { title: __('Analytics'), href: '/dashboard/analytics' },
    ];

    // Find the max count for scaling the peak hours chart
    const maxPeakCount = Math.max(...stats.peakHours.map((h: any) => h.count), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${__('Business Intelligence')} - Ocean's Resto`} />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground font-['Playfair_Display',serif]">{__('Boutique')} <span className="italic opacity-40">{__('Intelligence')}</span></h1>
                    <p className="text-sm text-muted-foreground font-medium">{__('Metrik performa real-time dan wawasan gastronomi.')}</p>
                </div>

                {/* Hero Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title={__('Total Pendapatan')} 
                        value={formatRupiah(stats.revenue)} 
                        subtitle={__('Bruto dari pemesanan yang dikonfirmasi')}
                        icon={CreditCard}
                        color="sky"
                        __={__}
                    />
                    <StatCard 
                        title={__('Total Pelanggan')} 
                        value={stats.userStats.total} 
                        subtitle={`${stats.userStats.customers} ${__('pelanggan setia')}`}
                        icon={Users}
                        color="blue"
                        __={__}
                    />
                    <StatCard 
                        title={__('Ekonomi Loyalitas')} 
                        value={formatRupiah(stats.loyaltyStats.total_discounts_given)} 
                        subtitle={`${stats.loyaltyStats.total_points_redeemed} ${__('poin ditukarkan')}`}
                        icon={Coins}
                        color="emerald"
                        __={__}
                    />
                    <StatCard 
                        title={__('Rating Pengalaman')} 
                        value="4.9" 
                        subtitle={__('Berdasarkan ulasan terbaru')}
                        icon={Star}
                        color="amber"
                        __={__}
                    />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Peak Hours Chart */}
                    <div className="lg:col-span-2 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Clock className="text-sky-500" size={20} /> {__('Jam Makan Puncak')}
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto pb-4 scrollbar-hide">
                            <div className="flex items-end justify-between h-48 gap-1.5 pt-4 min-w-[600px] sm:min-w-0">
                            {Array.from({ length: 15 }, (_, i) => {
                                const hour = i + 8; // From 08:00 to 22:00
                                const data = stats.peakHours.find((h: any) => h.hour === hour);
                                const height = data ? (data.count / maxPeakCount) * 100 : 2;
                                
                                return (
                                    <div key={hour} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full relative flex items-end justify-center h-full">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                className={`w-full rounded-t-lg transition-all duration-500 ${height > 70 ? 'bg-sky-500' : 'bg-sky-500/20 group-hover:bg-sky-500/40'}`}
                                            />
                                            {data && (
                                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] font-black px-2 py-1 rounded-full whitespace-nowrap">
                                                    {data.count} {__('RES')}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[8px] font-black text-muted-foreground opacity-40">{hour}:00</span>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                    </div>

                    {/* Service Distribution */}
                    <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            <PieChart className="text-sky-500" size={20} /> {__('Bauran Layanan')}
                        </h3>
                        <div className="space-y-6">
                            {stats.serviceDistribution.map((item: any) => (
                                <div key={item.type} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className={item.type === 'dine_in' ? 'text-sky-500' : 'text-blue-400'}>{__(item.type)}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.count / stats.monthlyReservations.reduce((acc: any, curr: any) => acc + curr.count, 0) || 1) * 100}%` }}
                                            className={`h-full rounded-full ${item.type === 'dine_in' ? 'bg-sky-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-blue-400'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                    {/* Top Menus Table */}
                    <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Trophy className="text-sky-500" size={20} /> {__('Hidangan Paling Dicari')}
                            </h3>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            {stats.topMenus.map((menu: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 font-black text-xs">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight truncate max-w-[120px]">{menu.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{__('Pesanan')}: {menu.total_sold}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={14} className="text-sky-500/20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                            <Star className="text-sky-500" size={20} /> {__('Ulasan Terbaru')}
                        </h3>
                        <div className="space-y-6">
                            {stats.recentReviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic text-center py-10">{__('Menunggu testimoni tamu...')}</p>
                            ) : (
                                stats.recentReviews.map((review: any) => (
                                    <div key={review.id} className="space-y-2 pb-6 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-black uppercase tracking-widest text-sky-500">{review.user?.name}</p>
                                            <div className="flex gap-0.5">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={10} className="fill-sky-500 text-sky-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.message}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color, __ }: any) {
    const colors: any = {
        sky: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    };

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 shadow-sm group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
                    <Icon size={24} />
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
                <h4 className="text-2xl font-black tracking-tighter mb-1">{value}</h4>
                <p className="text-[10px] font-bold text-muted-foreground/60">{subtitle}</p>
            </div>
        </motion.div>
    );
}

