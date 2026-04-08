import { Head, router, usePage } from '@inertiajs/react';
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
import { dashboard as dashboardRoute } from '@/routes';

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
    const { currentTeam } = usePage().props;

    const updateStatus = (id: number, status: string) => {
        if (!currentTeam) {
return;
}

        router.put(
            `/${currentTeam.slug}/reservations/${id}`,
            { status },
            {
                preserveScroll: true,
            },
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, string> = {
            pending: 'bg-amber-100 text-amber-800 border-amber-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
            completed: 'bg-slate-100 text-slate-800 border-slate-200',
        };

        return (
            <Badge
                variant="outline"
                className={`${variants[status]} px-2.5 py-0.5 font-medium capitalize`}
            >
                {status}
            </Badge>
        );
    };

    return (
        <>
            <Head title="Reservations Management" />

            <div className="mx-auto max-w-7xl px-4 py-8 font-['Inter',sans-serif] sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-slate-900">
                            Table Reservations
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage incoming booking requests from customers.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-slate-200 bg-white"
                        >
                            <Filter className="mr-2 h-4 w-4 text-slate-500" />
                            Filter by Date
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {reservations.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-slate-700">
                                            Customer
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700">
                                            Date & Time
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700">
                                            Details
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700">
                                            Notes
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-slate-700">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservations.map((reservation) => (
                                        <TableRow
                                            key={reservation.id}
                                            className="hover:bg-slate-50/50"
                                        >
                                            <TableCell>
                                                <div className="font-medium text-slate-900">
                                                    {reservation.user_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {reservation.user_email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="mb-1 flex items-center text-sm text-slate-700">
                                                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                                                    {new Date(
                                                        reservation.date,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                                                    {reservation.time.substring(
                                                        0,
                                                        5,
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-slate-700">
                                                    <Users className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                                                    <span className="font-medium">
                                                        {
                                                            reservation.guest_count
                                                        }
                                                    </span>
                                                    <span className="ml-1 text-slate-500">
                                                        Guests
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[200px]">
                                                {reservation.special_requests ? (
                                                    <p
                                                        className="truncate text-xs text-slate-600"
                                                        title={
                                                            reservation.special_requests
                                                        }
                                                    >
                                                        {
                                                            reservation.special_requests
                                                        }
                                                    </p>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        None
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={reservation.status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {reservation.status ===
                                                    'pending' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    reservation.id,
                                                                    'confirmed',
                                                                )
                                                            }
                                                            title="Confirm Booking"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                                            onClick={() =>
                                                                updateStatus(
                                                                    reservation.id,
                                                                    'rejected',
                                                                )
                                                            }
                                                            title="Reject Booking"
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
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                <Calendar className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900">
                                No reservations
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                There are currently no reservations pending or
                                booked.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ReservationsDashboard.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam
                ? dashboardRoute(props.currentTeam.slug)
                : '/',
        },
        {
            title: 'Reservations',
        },
    ],
});
