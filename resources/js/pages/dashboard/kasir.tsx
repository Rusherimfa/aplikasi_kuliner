import { Head, Link, router, usePage } from '@inertiajs/react';
import { BadgeDollarSign, ReceiptText, WalletCards, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logout } from '@/routes';
import { invoice as createInvoiceRoute } from '@/routes/cashier/payments';

type Props = {
    roleLabel?: string;
    paymentQueue?: Array<{
        id: number;
        booking_number: string | null;
        customer_name: string | null;
        status: string | null;
        payment: {
            invoice_number: string;
            amount: number;
            status: string | null;
            deadline_at: string | null;
            payment_link: string | null;
        } | null;
    }>;
};

const cashierStats = [
    { label: 'Transaksi Hari Ini', value: '126', icon: ReceiptText },
    { label: 'Pendapatan Shift', value: 'Rp 8.750.000', icon: BadgeDollarSign },
    { label: 'Metode Non-Tunai', value: '72%', icon: WalletCards },
];

const buildDeadlineAt = () => new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString();

export default function KasirDashboard({ roleLabel = 'Kasir', paymentQueue = [] }: Props) {
    const { currentTeam } = usePage().props as { currentTeam?: { slug: string } | null };

    const createInvoice = (reservationId: number) => {
        if (!currentTeam) {
            return;
        }

        const deadlineAt = buildDeadlineAt();

        router.post(
            createInvoiceRoute({ current_team: currentTeam.slug, reservation: reservationId }).url,
            {
                amount: 100000,
                method: 'qris',
                gateway: 'manual',
                payment_link: 'https://example.com/pay',
                deadline_at: deadlineAt,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Dashboard Kasir" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Dashboard {roleLabel}
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            Ringkasan pembayaran dan aktivitas kasir dalam satu layar.
                        </p>
                    </div>
                    <Link href={logout()} as="button">
                        <Button
                            variant="outline"
                            className="rounded-xl border-rose-200 bg-white text-rose-600 shadow-sm hover:bg-rose-50 hover:text-rose-700"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cashierStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Card key={stat.label} className="border-slate-200/70 bg-white shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600">
                                        {stat.label}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-amber-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="border-slate-200/70 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base text-slate-900">Antrian Waiting Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {paymentQueue.length === 0 && (
                            <p className="text-sm text-slate-500">Belum ada booking yang menunggu pembayaran.</p>
                        )}

                        {paymentQueue.map((booking) => (
                            <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{booking.booking_number ?? `Booking #${booking.id}`}</p>
                                        <p className="text-xs text-slate-500">{booking.customer_name ?? 'Customer'}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Status: <span className="font-medium text-slate-700">{booking.status ?? '-'}</span>
                                        </p>
                                    </div>
                                    <Button size="sm" onClick={() => createInvoice(booking.id)}>
                                        Buat Invoice
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
