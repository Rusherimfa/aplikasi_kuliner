import { Head, router, usePage, useHttp } from '@inertiajs/react';
import { Calendar, Clock, Users, Check, X, Filter, MessageCircle, Map as MapIcon, List, Save, Info, Truck } from 'lucide-react';
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
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BoutiqueChat from '@/components/app/boutique-chat';
import { useEffect } from 'react';
import { Bell, Sparkles, Receipt, Droplets } from 'lucide-react';

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
    table_id: number | null;
    courier_id?: number | null;
    courier_name?: string | null;
    delivery_status?: string;
    delivery_address?: string | null;
}

interface RestoTable {
    id: number;
    name: string;
    capacity: number;
    category: string;
    pos_x: number;
    pos_y: number;
    is_active: boolean;
}

interface ServiceRequest {
    id: number;
    reservation_id: number;
    type: 'waiter' | 'bill' | 'refill' | 'napkins' | 'other';
    status: 'pending' | 'ongoing' | 'resolved';
    notes?: string;
    created_at: string;
    reservation?: {
        customer_name: string;
        resto_table?: {
            name: string;
        };
    };
}

interface PageProps {
    reservations: Reservation[];
    tables: RestoTable[];
    couriers: { id: number; name: string }[];
    serviceRequests: ServiceRequest[];
}

export default function ReservationsDashboard({ reservations, tables, couriers, serviceRequests }: PageProps) {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [draggingTableId, setDraggingTableId] = useState<number | null>(null);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>(serviceRequests);
    const { auth } = usePage().props as any;
    const http = useHttp();

    const updateStatus = (id: number, status: string) => {
        router.put(
            `/reservations/${id}`,
            { status },
            { 
                preserveScroll: true,
                onSuccess: () => toast.success(`Reservation status updated to ${status.toUpperCase()}`)
            },
        );
    };

    const updateTablePosition = (id: number, x: number, y: number) => {
        router.patch(route('tables.update_position', id), {
            pos_x: Math.round(x),
            pos_y: Math.round(y)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setDraggingTableId(null);
                toast.success('Table layout saved successfully');
            }
        });
    };

    const assignCourier = (reservationId: number, courierId: number) => {
        router.patch(
            `/reservations/${reservationId}/assign-courier`,
            { courier_id: courierId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAssigningId(null);
                    toast.success('Kurir berhasil ditugaskan!');
                }
            }
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, string> = {
            awaiting_payment: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            pending: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            completed: 'bg-white/10 text-white/60 border-white/20',
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

    // Helper to find reservation for a table today
    const getTableStatus = (tableId: number) => {
        const today = new Date().toISOString().split('T')[0];
        const res = reservations.find(r => r.table_id === tableId && r.date === today && (r.status === 'confirmed' || r.status === 'pending'));
        if (!res) return 'available';
        return res.status;
    };

    useEffect(() => {
        const channel = (window as any).Echo.channel('staff-notifications')
            .listen('.service.request.created', (e: any) => {
                const request = e.serviceRequest;
                
                // If it's a new or updated request
                setActiveRequests(prev => {
                    const exists = prev.find(r => r.id === request.id);
                    if (exists) {
                        return prev.map(r => r.id === request.id ? request : r).filter(r => r.status !== 'resolved');
                    }
                    return [request, ...prev];
                });

                if (request.status === 'pending') {
                    toast.info(`Concierge Alert: #RES-${request.reservation_id}`, {
                        description: `Tamu di Meja ${request.reservation?.resto_table?.name || '?'} butuh ${request.type.toUpperCase()}`
                    });
                }
            });

        return () => channel.stopListening('.service.request.created');
    }, []);

    const updateRequestStatus = (id: number, status: string) => {
        http.patch(`/service-requests/${id}`, { status }, {
            onSuccess: () => {
                setActiveRequests(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r).filter(r => status !== 'resolved' ? true : r.id !== id));
                toast.success(`Permintaan #${id} diperbarui menjadi ${status.toUpperCase()}`);
            },
            onError: () => {
                toast.error('Gagal memperbarui status permintaan.');
            }
        });
    };

    return (
        <>
            <Head title="Manajemen Reservasi - RestoWeb" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-white/95">
                            Reservasi & Layout
                        </h1>
                        <p className="mt-1 text-sm text-white/40">
                            Kelola pemesanan masuk dan atur tata letak meja restoran secara visual.
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    {/* List Section */}
                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md shadow-2xl transition-all">
                        {reservations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-white/5 bg-white/5">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="font-semibold text-white/70">Pelanggan</TableHead>
                                            <TableHead className="font-semibold text-white/70">Tanggal & Waktu</TableHead>
                                            <TableHead className="font-semibold text-white/70">Meja & Tamu</TableHead>
                                            <TableHead className="font-semibold text-white/70">Status</TableHead>
                                            <TableHead className="text-right font-semibold text-white/70">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.map((reservation) => (
                                            <TableRow key={reservation.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">
                                                            <Users size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-bold text-white/95 text-base">{reservation.customer_name}</h3>
                                                            <div className="text-xs text-white/40 flex flex-col gap-0.5 mt-0.5">
                                                                <a 
                                                                    href={`https://wa.me/${reservation.customer_phone?.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(reservation.customer_name)},%0A%0AMengenai%20reservasi%20di%20RestoWeb...`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-emerald-500/80 hover:text-emerald-400 transition-colors"
                                                                >
                                                                    <MessageCircle size={12} /> {reservation.customer_phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="mb-1 flex items-center text-sm font-medium text-white/80">
                                                        {new Date(reservation.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center text-xs text-white/40">
                                                        <Clock className="mr-1.5 h-3.5 w-3.5 text-orange-500/70" />
                                                        {reservation.time.substring(0, 5)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center text-sm font-semibold text-white/90">
                                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                                                                Meja {reservation.table_id || '?'}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-white/40 ml-1">{reservation.guest_count} Orang</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={reservation.status} />
                                                    {reservation.courier_name && (
                                                        <div className="mt-2 text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
                                                            <Truck size={10} /> {reservation.courier_name}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {(reservation.status === 'pending' || reservation.status === 'awaiting_payment') && (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                                                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                                    onClick={() => updateStatus(reservation.id, 'rejected')}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {reservation.status === 'confirmed' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 px-3 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                                                                onClick={() => updateStatus(reservation.id, 'completed')}
                                                            >
                                                                Reservasi Selesai
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                                    <Calendar size={32} className="text-orange-500/40" />
                                </div>
                                <h3 className="text-lg font-bold text-white/90 italic font-['Playfair_Display',serif]">Hening di Sini...</h3>
                                <p className="mt-2 text-sm text-white/40 max-w-xs">Saat ini tidak ada permintaan reservasi yang masuk dalam antrean Anda.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Concierge Hub Sidebar Overlay */}
                <div className="fixed top-24 right-4 sm:top-32 sm:right-8 z-40 flex flex-col gap-4 w-[calc(100vw-2rem)] sm:w-80 pointer-events-none">
                    <AnimatePresence>
                        {activeRequests.map((request) => (
                            <motion.div
                                key={request.id}
                                layout
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                className="pointer-events-auto bg-black/80 backdrop-blur-2xl border border-orange-500/30 rounded-3xl p-6 shadow-3xl ring-1 ring-orange-500/10 overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                    {request.type === 'waiter' && <Bell size={60} />}
                                    {request.type === 'bill' && <Receipt size={60} />}
                                    {request.type === 'refill' && <Droplets size={60} />}
                                    {request.type === 'napkins' && <Sparkles size={60} />}
                                </div>

                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-0 ${
                                            request.status === 'pending' ? 'bg-orange-500 text-black' : 'bg-blue-500 text-white'
                                        }`}>
                                            {request.status}
                                        </Badge>
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                            #{request.reservation_id}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                            {request.type === 'waiter' && <Bell size={18} />}
                                            {request.type === 'bill' && <Receipt size={18} />}
                                            {request.type === 'refill' && <Droplets size={18} />}
                                            {request.type === 'napkins' && <Sparkles size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Meja {request.reservation?.resto_table?.name || '?'}</p>
                                            <p className="text-[10px] font-bold text-orange-500/60 uppercase">{request.type}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        {request.status === 'pending' && (
                                            <Button 
                                                onClick={() => updateRequestStatus(request.id, 'ongoing')}
                                                className="flex-1 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest border border-white/5"
                                            >
                                                Layani
                                            </Button>
                                        )}
                                        <Button 
                                            onClick={() => updateRequestStatus(request.id, 'resolved')}
                                            className="flex-1 h-9 rounded-xl bg-orange-500 text-black hover:bg-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                                        >
                                            Selesai
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {activeRequests.length === 0 && (
                        <div className="p-6 text-center rounded-[2rem] border border-dashed border-white/5 text-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Requests</p>
                        </div>
                    )}
                </div>

                {/* Active Chat Component */}
                {activeChatId && (
                    <BoutiqueChat reservationId={activeChatId} currentUser={auth.user} />
                )}
            </div>
        </>
    );
}

ReservationsDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
