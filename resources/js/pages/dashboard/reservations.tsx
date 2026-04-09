import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Users, Check, X, Filter } from 'lucide-react';
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
    user_name: string;
    user_email: string;
    date: string;
    time: string;
    guest_count: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
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
            pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            confirmed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            completed: 'bg-white/10 text-white/70 border-white/20',
        };

        const labels: Record<string, string> = {
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
                                                <div className="font-semibold text-white/90">
                                                    {reservation.user_name}
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {reservation.user_email}
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
                                                        className="truncate text-xs text-white/60"
                                                        title={
                                                            reservation.special_requests
                                                        }
                                                    >
                                                        {reservation.special_requests}
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-white/30 italic">
                                                        Tidak ada
                                                    </span>
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
