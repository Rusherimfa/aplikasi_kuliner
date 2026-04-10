import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Users, BookOpen, Clock, CalendarCheck, TrendingUp, HandPlatter, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Dashboard({ stats, recent_activity }: any) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        if (status === 'pending') return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20">Menunggu</Badge>;
        if (status === 'confirmed') return <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">Dikonfirmasi</Badge>;
        if (status === 'completed') return <Badge className="bg-white/10 text-white/70 hover:bg-white/10">Selesai</Badge>;
        return <Badge className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/20">Dibatalkan</Badge>;
    };

    return (
        <>
            <Head title="Overview - RestoWeb Admin" />

            <div className="mx-auto max-w-7xl font-sans text-white">
                <div className="mb-8">
                    <h1 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-tight text-white/90">
                        Overview Operasional
                    </h1>
                    <p className="mt-1 text-sm text-white/50">
                        Ringkasan aktivitas restoran dan performa reservasi hari ini.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
                                <Clock size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm font-medium tracking-wide text-white/50 uppercase">Menunggu</p>
                                <p className="text-2xl font-bold text-white">{stats.pending_reservations}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
                                <CalendarCheck size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm font-medium tracking-wide text-white/50 uppercase">Tamu Hari Ini</p>
                                <p className="text-2xl font-bold text-white">{stats.today_reservations}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
                                <TrendingUp size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm font-medium tracking-wide text-white/50 uppercase">Est. Omset Hari Ini</p>
                                <p className="text-xl font-bold text-white">{formatRupiah(stats.estimated_revenue)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500">
                                <HandPlatter size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm font-medium tracking-wide text-white/50 uppercase">Total Menu</p>
                                <p className="text-2xl font-bold text-white">{stats.total_menus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] shadow-xl backdrop-blur-md flex flex-col">
                        <div className="border-b border-white/5 p-6 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white/90 font-['Playfair_Display',serif]">Aktivitas Terbaru</h2>
                            <Link href="/reservations" className="text-xs font-medium text-amber-500 hover:text-amber-400 flex items-center gap-1">
                                Lihat Semua <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="flex-1 p-0">
                            {recent_activity.length > 0 ? (
                                <ul className="divide-y divide-white/5">
                                    {recent_activity.map((activity: any) => (
                                        <li key={activity.id} className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors">
                                            <div>
                                                <p className="font-semibold text-white/90">{activity.customer_name}</p>
                                                <p className="text-xs text-white/50 mt-1">Meja tgl {activity.date} jam {activity.time} · <span className="opacity-70">{activity.created_at}</span></p>
                                            </div>
                                            <div>
                                                {getStatusBadge(activity.status)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-12 text-center text-white/40 text-sm">
                                    Belum ada aktivitas reservasi.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/20 border border-amber-500/20 p-6 shadow-xl flex flex-col items-center justify-center text-center">
                        <div className="h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                            <Users size={32} className="text-[#0A0A0B]" />
                        </div>
                        <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-amber-400 mb-2">{stats.total_customers} Pelanggan</h3>
                        <p className="text-sm text-amber-200/60 leading-relaxed mb-6">
                            Telah mendaftar di sistem RestoWeb. Kelola hubungan pelanggan dengan menu terbaik.
                        </p>
                        <Link href="/menus" className="inline-flex h-10 items-center justify-center rounded-full bg-amber-500 px-6 text-sm font-semibold text-[#0A0A0B] transition-transform hover:scale-105 w-full max-w-[200px]">
                            Kelola Menu <BookOpen size={16} className="ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
