import { Head } from '@inertiajs/react';
import {
    Utensils,
    CreditCard,
    TrendingUp,
    Clock,
    MoreHorizontal,
    BellRing,
    Users,
    ChefHat,
    CircleDot,
    CheckCircle2,
    Timer,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard as dashboardRoute } from '@/routes';

// Mock Data for the UI
const TABLE_STATUSES = [
    { id: 'T01', capacity: 4, status: 'occupied', time: '45m', wait: false },
    { id: 'T02', capacity: 2, status: 'available', time: '-', wait: false },
    { id: 'T03', capacity: 6, status: 'waiting-food', time: '15m', wait: true },
    { id: 'T04', capacity: 4, status: 'occupied', time: '1h 10m', wait: false },
    { id: 'T05', capacity: 2, status: 'cleaning', time: '5m', wait: false },
    { id: 'T06', capacity: 8, status: 'available', time: '-', wait: false },
    { id: 'T07', capacity: 2, status: 'waiting-food', time: '22m', wait: true },
    { id: 'T08', capacity: 4, status: 'available', time: '-', wait: false },
];

const RECENT_ORDERS = [
    { id: '#ORD-001', table: 'T03', items: 4, total: 'Rp 450.000', status: 'preparing' },
    { id: '#ORD-002', table: 'T07', items: 2, total: 'Rp 185.000', status: 'preparing' },
    { id: '#ORD-003', table: 'T01', items: 5, total: 'Rp 890.000', status: 'served' },
    { id: '#ORD-004', table: 'T04', items: 3, total: 'Rp 320.000', status: 'served' },
];

const METRICS = [
    {
        label: 'Pendapatan Kotor',
        value: 'Rp 12.45M',
        sub: '+15.2% dari kemarin',
        subPositive: true,
        icon: CreditCard,
        gradient: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        label: 'Pesanan Aktif',
        value: '24',
        sub: '8 disiapkan di dapur',
        subPositive: null,
        icon: Utensils,
        gradient: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        label: 'Waktu Persiapan Rata-rata',
        value: '18 mnt',
        sub: 'Target: di bawah 20 mnt',
        subPositive: true,
        icon: Clock,
        gradient: 'from-amber-500 to-orange-600',
        bgLight: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        label: 'Tindakan Tertunda',
        value: '3',
        sub: 'Meja butuh perhatian',
        subPositive: false,
        icon: BellRing,
        gradient: 'from-rose-500 to-pink-600',
        bgLight: 'bg-rose-50',
        iconColor: 'text-rose-600',
    },
];

function getTableConfig(status: string) {
    switch (status) {
        case 'available':
            return {
                bg: 'bg-emerald-50',
                border: 'border-emerald-200 hover:border-emerald-400',
                text: 'text-emerald-700',
                badge: 'bg-emerald-100 text-emerald-700',
                dot: 'bg-emerald-500',
                label: 'Tersedia',
            };
        case 'occupied':
            return {
                bg: 'bg-slate-50',
                border: 'border-slate-200 hover:border-slate-400',
                text: 'text-slate-700',
                badge: 'bg-slate-100 text-slate-700',
                dot: 'bg-slate-500',
                label: 'Terisi',
            };
        case 'waiting-food':
            return {
                bg: 'bg-amber-50',
                border: 'border-amber-300 hover:border-amber-500',
                text: 'text-amber-700',
                badge: 'bg-amber-100 text-amber-700',
                dot: 'bg-amber-500',
                label: 'Menunggu',
            };
        case 'cleaning':
            return {
                bg: 'bg-sky-50',
                border: 'border-sky-200 hover:border-sky-400',
                text: 'text-sky-700',
                badge: 'bg-sky-100 text-sky-700',
                dot: 'bg-sky-500',
                label: 'Membersihkan',
            };
        default:
            return {
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                text: 'text-slate-700',
                badge: 'bg-slate-100 text-slate-600',
                dot: 'bg-slate-400',
                label: status,
            };
    }
}

export default function Dashboard() {
    return (
        <>
            <Head title="Dasbor Staf — Pusat Komando" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-slate-50/80 p-6 font-['Inter',sans-serif]">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/20">
                                <Sparkles size={15} />
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Ringkasan Hari Ini
                            </h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Kelola pesanan, meja, dan lacak kinerja restoran.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50">
                            <Clock className="mr-2 h-4 w-4" />
                            Riwayat Shift
                        </Button>
                        <Button className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md shadow-amber-900/20 hover:from-amber-500 hover:to-amber-700">
                            + Pesanan Baru
                        </Button>
                    </div>
                </div>

                {/* Metric Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {METRICS.map((metric) => {
                        const Icon = metric.icon;
                        return (
                            <Card key={metric.label} className="overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-900/5">
                                {/* Top accent bar */}
                                <div className={`h-1 w-full bg-gradient-to-r ${metric.gradient}`} />
                                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                                    <CardTitle className="text-sm font-medium text-slate-500">
                                        {metric.label}
                                    </CardTitle>
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${metric.bgLight}`}>
                                        <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                                    <p className={`mt-1 flex items-center gap-1 text-xs ${
                                        metric.subPositive === true
                                            ? 'text-emerald-600'
                                            : metric.subPositive === false
                                              ? 'text-rose-600'
                                              : 'text-slate-500'
                                    }`}>
                                        {metric.subPositive === true && <TrendingUp className="h-3 w-3" />}
                                        {metric.sub}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid flex-1 gap-6 lg:grid-cols-3">
                    {/* Table Status */}
                    <Card className="col-span-full overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-900/5 lg:col-span-2">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                                        <Users size={16} className="text-amber-600" />
                                        Status Ruang Makan
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Ringkasan ketersediaan meja waktu nyata.
                                    </CardDescription>
                                </div>
                                {/* Legend */}
                                <div className="hidden flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 sm:flex">
                                    {[
                                        { color: 'bg-emerald-500', label: 'Tersedia' },
                                        { color: 'bg-slate-400', label: 'Terisi' },
                                        { color: 'bg-amber-500', label: 'Menunggu' },
                                        { color: 'bg-sky-400', label: 'Membersihkan' },
                                    ].map((l) => (
                                        <span key={l.label} className="flex items-center gap-1.5">
                                            <span className={`h-2 w-2 rounded-full ${l.color}`} />
                                            {l.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-5">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {TABLE_STATUSES.map((table) => {
                                    const config = getTableConfig(table.status);
                                    return (
                                        <div
                                            key={table.id}
                                            className={`group relative flex cursor-pointer flex-col rounded-2xl border-2 p-4 transition-all duration-200 hover:shadow-md ${config.bg} ${config.border}`}
                                        >
                                            {/* Ping indicator for waiting tables */}
                                            {table.wait && (
                                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-amber-500" />
                                                </span>
                                            )}

                                            {/* Table ID + capacity */}
                                            <div className="mb-3 flex items-start justify-between">
                                                <span className={`text-xl font-bold ${config.text}`}>
                                                    {table.id}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}>
                                                    {table.capacity}p
                                                </span>
                                            </div>

                                            {/* Status + time */}
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                                                    <span className={`text-xs font-semibold capitalize ${config.text}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <span className={`text-xs font-medium opacity-60 ${config.text}`}>
                                                    {table.time}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="col-span-full flex flex-col overflow-hidden border-0 bg-white shadow-sm ring-1 ring-slate-900/5 lg:col-span-1">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                                <ChefHat size={16} className="text-amber-600" />
                                Tiket Terbaru
                            </CardTitle>
                            <CardDescription>Pesanan masuk langsung dari semua zona.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pt-4">
                            <div className="space-y-3">
                                {RECENT_ORDERS.map((order) => {
                                    const isPreparing = order.status === 'preparing';
                                    return (
                                        <div
                                            key={order.id}
                                            className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Status icon */}
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                    isPreparing ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                    {isPreparing ? <Timer size={15} /> : <CheckCircle2 size={15} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {order.table}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{order.id}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">{order.items} item</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-right">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{order.total}</p>
                                                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        isPreparing
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {order.status === 'preparing' ? 'disiapkan' : order.status === 'served' ? 'disajikan' : order.status}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 rounded-lg text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-slate-900"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Button className="mt-5 w-full rounded-xl bg-slate-100 text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700" variant="secondary">
                                Lihat Semua Pesanan
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboardRoute(props.currentTeam.slug) : '/',
        },
    ],
});
