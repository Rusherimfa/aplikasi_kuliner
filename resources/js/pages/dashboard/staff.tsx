import { Head, Link } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { Clock, CalendarCheck, CheckCircle2, UserCheck, ArrowRight, Table as TableIcon, Users, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { index as reservationsRoute } from '@/routes/reservations';

export default function StaffDashboard({ stats, todays_schedule, recent_activity }: any) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string }> = {
            'pending': { label: 'Menunggu', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
            'confirmed': { label: 'Dikonfirmasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            'completed': { label: 'Selesai', color: 'bg-white/5 text-white/50 border-white/10' },
            'cancelled': { label: 'Dibatalkan', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                    {[
                        { title: 'Reservasi Menunggu', val: stats.pending_reservations, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { title: 'Tamu Hari Ini', val: stats.today_reservations, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                        { title: 'Sudah Dikonfirmasi', val: stats.confirmed_today, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    ].map((card, idx) => (
                        <div 
                            key={idx} 
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both group relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl ring-1 ring-white/5 transition-all hover:bg-white/[0.04]"
                        >
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg} ${card.color} shadow-lg mb-6`}>
                                <card.icon size={26} strokeWidth={2} />
                            </div>
                            <p className="text-[10px] font-black tracking-[.2em] text-white/20 uppercase mb-2">{card.title}</p>
                            <p className="text-4xl font-black text-white tracking-tighter">{card.val}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] mb-12">
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
                                                    {getStatusBadge(res.status)}
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

                    {/* Quick Access / Recent Log */}
                    <div className="flex flex-col gap-8">
                        {/* Quick Actions */}
                        <div className="rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 shadow-3xl flex flex-col items-center text-center group transition-all hover:scale-[1.02]">
                            <div className="h-20 w-20 rounded-[1.75rem] bg-black shadow-2xl flex items-center justify-center mb-8 transform -rotate-6 transition-transform group-hover:rotate-6">
                                <UserPlus className="text-emerald-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3 italic font-serif">Tambah Reservasi</h3>
                            <p className="text-xs text-black/50 font-bold leading-relaxed mb-10 max-w-[200px]">Pelanggan tanpa janji temu? Daftarkan langsung disini.</p>
                            <Link href="/reservations/create" className="w-full h-14 bg-black text-emerald-500 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black">
                                Inisiasi Sekarang
                            </Link>
                        </div>

                        {/* Recent activity Feed */}
                        <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 shadow-3xl ring-1 ring-white/5 flex-1">
                            <h3 className="text-sm font-black text-white/30 uppercase tracking-[0.3em] mb-8 text-left">Aktivitas Terbaru</h3>
                            <div className="space-y-6">
                                {recent_activity.map((act: any) => (
                                    <div key={act.id} className="flex items-center gap-4 text-left group">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 text-xs font-black shrink-0 border border-white/10">
                                            {act.customer_name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-bold text-white truncate">{act.customer_name}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{act.created_at}</p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500/40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 20px; }
            `}} />
        </>
    );
}

StaffDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
