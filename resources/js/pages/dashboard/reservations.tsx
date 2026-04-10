import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Users, Check, X, Filter, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import RestoAdminLayout from '@/layouts/resto-admin-layout';

interface Reservation {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    date: string;
    time: string;
    guest_count: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'awaiting_payment';
    payment_status?: string;
    booking_fee?: string | number;
    menus_count?: number;
    special_requests: string | null;
}

interface PageProps {
    reservations: Reservation[];
}

export default function ReservationsDashboard({ reservations }: PageProps) {
    const updateStatus = (id: number, status: string) => {
        router.put(
            `/reservations/${id}`,
            { status },
            { preserveScroll: true },
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, string> = {
            awaiting_payment: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            completed: 'bg-white/10 text-white/70 border-white/20',
        };

        const labels: Record<string, string> = {
            awaiting_payment: 'Menunggu DP',
            pending: 'Menunggu',
            confirmed: 'Dikonfirmasi',
            rejected: 'Ditolak',
            completed: 'Selesai'
        };

        return (
            <Badge
                variant="outline"
                className={`${variants[status]} px-2.5 py-0.5 font-medium`}
            >
                {labels[status] || status}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Manajemen Reservasi - RestoWeb" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-3xl font-bold tracking-tight text-white/90">
                            Reservasi Meja
                        </h1>
                        <p className="mt-1 text-sm text-white/50">
                            Kelola permintaan pemesanan yang masuk dari pelanggan.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                        >
                            <Filter className="mr-2 h-4 w-4 text-amber-500" />
                            Filter Tanggal
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl">
                    {reservations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="border-b border-white/5 bg-white/5">
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableHead className="font-semibold text-white/70">
                                            Pelanggan
                                        </TableHead>
                                        <TableHead className="font-semibold text-white/70">
                                            Tanggal & Waktu
                                        </TableHead>
                                        <TableHead className="font-semibold text-white/70">
                                            Detail
                                        </TableHead>
                                        <TableHead className="font-semibold text-white/70">
                                            Catatan Khusus
                                        </TableHead>
                                        <TableHead className="font-semibold text-white/70">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-white/70">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.map((reservation) => (
                                        <TableRow
                                            key={reservation.id}
                                            className="hover:bg-white/5 border-white/5"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                                                        <Users size={18} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="truncate font-semibold text-white/90">
                                                                {reservation.customer_name}
                                                            </h3>
                                                            {reservation.table_name && (
                                                                <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60">
                                                                    M: {reservation.table_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-white/50 flex flex-col gap-0.5 mt-0.5">
                                                            <span>{reservation.customer_email}</span>
                                                            <a 
                                                                href={`https://wa.me/${reservation.customer_phone?.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(reservation.customer_name)},%0A%0AMengenai%20reservasi%20Anda%20di%20RestoWeb%20untuk%20tanggal%20${reservation.date}...`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 mt-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                                            >
                                                                <MessageCircle size={12} /> Hubungi Pelanggan
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="mb-1 flex items-center text-sm text-white/80">
                                                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                                                    {new Date(
                                                        reservation.date,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-white/50">
                                                    <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                                                    {reservation.time.substring(
                                                        0,
                                                        5,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-white/80">
                                                    <Users className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                                                    <span className="font-medium text-white/90">
                                                        {reservation.guest_count}
                                                    </span>
                                                    <span className="ml-1 text-white/50">
                                                        Orang
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                {reservation.special_requests ? (
                                                    <p
                                                        className="truncate text-xs text-white/60 mb-2"
                                                        title={
                                                            reservation.special_requests
                                                        }
                                                    >
                                                        {reservation.special_requests}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-white/30 italic block mb-2">
                                                        Tidak ada catatan
                                                    </span>
                                                )}
                                                
                                                {reservation.payment_status === 'paid' && (
                                                    <Badge variant="outline" className="bg-orange-500/20 text-orange-500 border-orange-500/30 text-[10px] px-1.5 py-0 mt-1">
                                                        🔥 DP Lunas (Rp {Number(reservation.booking_fee).toLocaleString('id-ID')})
                                                        {reservation.menus_count ? ` + ${reservation.menus_count} Makanan` : ''}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={reservation.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {reservation.status ===
                                                    'pending' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
                                                            onClick={() => updateStatus(reservation.id, 'confirmed')}
                                                            title="Konfirmasi Pesanan"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400"
                                                            onClick={() => updateStatus(reservation.id, 'rejected')}
                                                            title="Tolak Pesanan"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                <Calendar className="h-6 w-6 text-amber-500/50" />
                            </div>
                            <h3 className="text-sm font-medium text-white/90">
                                Tidak ada reservasi
                            </h3>
                            <p className="mt-1 text-sm text-white/50">
                                Saat ini tidak ada permintaan reservasi yang masuk.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ReservationsDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
