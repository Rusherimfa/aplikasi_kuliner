import { Head } from '@inertiajs/react';
import {
    Utensils,
    CreditCard,
    TrendingUp,
    Clock,
    MoreHorizontal,
    BellRing,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    {
        id: '#ORD-001',
        table: 'T03',
        items: 4,
        total: 'Rp 450.000',
        status: 'preparing',
    },
    {
        id: '#ORD-002',
        table: 'T07',
        items: 2,
        total: 'Rp 185.000',
        status: 'preparing',
    },
    {
        id: '#ORD-003',
        table: 'T01',
        items: 5,
        total: 'Rp 890.000',
        status: 'served',
    },
    {
        id: '#ORD-004',
        table: 'T04',
        items: 3,
        total: 'Rp 320.000',
        status: 'served',
    },
];

function getStatusColor(status: string) {
    switch (status) {
        case 'available':
            return 'bg-emerald-50 border-emerald-200 text-emerald-700';
        case 'occupied':
            return 'bg-slate-50 border-slate-200 text-slate-700';
        case 'waiting-food':
            return 'bg-amber-50 border-amber-200 text-amber-700';
        case 'cleaning':
            return 'bg-blue-50 border-blue-200 text-blue-700';
        default:
            return 'bg-slate-50 border-slate-200 text-slate-700';
    }
}

export default function Dashboard() {git
    return (
        <>
            <Head title="Staff Dashboard - Command Center" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto bg-slate-50/50 p-6 font-['Inter',sans-serif]">
                {/* Header Actions */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Today's Overview
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage orders, tables, and track restaurant
                            performance.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="bg-white">
                            <Clock className="mr-2 h-4 w-4" />
                            Shift History
                        </Button>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            + New Order
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-slate-200/60 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Gross Revenue
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                Rp 12.450.000
                            </div>
                            <p className="mt-1 flex items-center text-xs text-emerald-600">
                                <TrendingUp className="mr-1 h-3 w-3" /> +15.2%
                                from yesterday
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Active Orders
                            </CardTitle>
                            <Utensils className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">
                                24
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                8 preparing in kitchen
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="items-center border-slate-200/60 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Avg. preparation time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">
                                18 min
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Target: under 20 min
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="items-center border-slate-200/60 bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                Pending Actions
                            </CardTitle>
                            <BellRing className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-rose-600">
                                3
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Tables require attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid flex-1 gap-6 md:grid-cols-7 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Live Table Status Map */}
                    <Card className="col-span-full border-slate-200/60 bg-white shadow-sm md:col-span-4 lg:col-span-2 xl:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-900">
                                Dining Room Status
                            </CardTitle>
                            <CardDescription>
                                Real-time overview of your table availability.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {TABLE_STATUSES.map((table) => (
                                    <div
                                        key={table.id}
                                        className={`group relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all hover:shadow-md ${getStatusColor(table.status)}`}
                                    >
                                        {table.wait && (
                                            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-500"></span>
                                            </span>
                                        )}
                                        <div className="mb-4 flex items-start justify-between">
                                            <span className="text-xl font-bold">
                                                {table.id}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="border-current bg-white/50 opacity-70"
                                            >
                                                {table.capacity} pax
                                            </Badge>
                                        </div>
                                        <div className="mt-auto flex items-end justify-between">
                                            <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                                                {table.status.replace('-', ' ')}
                                            </span>
                                            <span className="text-xs font-medium opacity-70">
                                                {table.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders List */}
                    <Card className="col-span-full flex flex-col border-slate-200/60 bg-white shadow-sm md:col-span-3 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-900">
                                Recent Tickets
                            </CardTitle>
                            <CardDescription>
                                Live incoming orders from all zones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-4">
                                {RECENT_ORDERS.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                                    >
                                        <div>
                                            <div className="mb-1 flex items-center gap-2">
                                                <Badge
                                                    className={
                                                        order.status ===
                                                        'preparing'
                                                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                                                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                                    }
                                                >
                                                    {order.table}
                                                </Badge>
                                                <span className="text-xs font-medium text-slate-500">
                                                    {order.id}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {order.items} Items
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="mb-1 text-sm font-bold text-slate-900">
                                                {order.total}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-400 hover:text-slate-900"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className="mt-6 w-full bg-slate-100 text-slate-900 hover:bg-slate-200"
                                variant="secondary"
                            >
                                View All Orders
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
            href: props.currentTeam
                ? dashboardRoute(props.currentTeam.slug)
                : '/',
        },
    ],
});
