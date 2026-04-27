import { Head, router, usePage, useHttp, Link } from '@inertiajs/react';
import { Calendar, Clock, Users, Check, X, Filter, MessageCircle, Map as MapIcon, List, Save, Info, Truck, CheckCircle2, DollarSign, Trash2 } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BoutiqueChat from '@/components/app/boutique-chat';
import { useEffect } from 'react';
import { Bell, Sparkles, Receipt, Droplets } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';
import tablesHelper from '@/routes/tables';

interface Reservation {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    date: string;
    time: string;
    guest_count: number;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'awaiting_payment' | 'cancelled';
    payment_status?: string;
    booking_fee?: string | number;
    total_after_discount?: string | number;
    discount_amount?: string | number;
    type?: string;
    menus?: any[];
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
    const { __, locale } = useTranslations();
    const [view, setView] = useState<'list' | 'map'>('list');
    const [draggingTableId, setDraggingTableId] = useState<number | null>(null);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>(serviceRequests);
    const { auth } = usePage().props as any;
    const http = useHttp();

    const updateStatus = (id: number, status: string) => {
        router.put(
            `/reservations/${id}`,
            { status },
            { 
                preserveScroll: true,
                onSuccess: () => toast.success(`${__('Reservation status updated to')} ${status.toUpperCase()}`)
            },
        );
    };

    const updateTablePosition = (id: number, x: number, y: number) => {
        router.patch(tablesHelper.update_position.url(id), {
            pos_x: Math.round(x),
            pos_y: Math.round(y)
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setDraggingTableId(null);
                toast.success(__('Table layout saved successfully'));
            }
        });
    };

    const deleteReservation = (id: number) => {
        if (confirm(__('Apakah Anda yakin ingin menghapus riwayat reservasi ini?'))) {
            router.delete(`/reservations/${id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success(__('Reservasi berhasil dihapus'))
            });
        }
    };

    const assignCourier = (reservationId: number, courierId: number) => {
        router.patch(
            `/reservations/${reservationId}/assign-courier`,
            { courier_id: courierId },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setAssigningId(null);
                    toast.success(__('Kurir berhasil ditugaskan!'));
                }
            }
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, string> = {
            awaiting_payment: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
            pending: 'bg-sky-500/10 text-sky-600 dark:text-sky-500 border-sky-500/20',
            confirmed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-500 border-rose-500/20',
            completed: 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-white/60 border-slate-200 dark:border-white/20',
        };

        const labels: Record<string, string> = {
            awaiting_payment: __('Menunggu DP'),
            pending: __('Menunggu'),
            confirmed: __('Dikonfirmasi'),
            rejected: __('Ditolak'),
            completed: __('Selesai')
        };

        return (
            <Badge
                variant="outline"
                className={`${variants[status]} px-2.5 py-0.5 font-medium`}
            >
                {__(labels[status] || status)}
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
                setActiveRequests((prev: ServiceRequest[]) => {
                    const exists = prev.find((r: ServiceRequest) => r.id === request.id);
                    if (exists) {
                        return prev.map((r: ServiceRequest) => r.id === request.id ? request : r).filter((r: ServiceRequest) => r.status !== 'resolved');
                    }
                    return [request, ...prev];
                });

                if (request.status === 'pending') {
                    toast.info(`${__('Concierge Alert')}: #RES-${request.reservation_id}`, {
                        description: `${__('Tamu di Meja')} ${request.reservation?.resto_table?.name || '?'} ${__('butuh')} ${__(request.type).toUpperCase()}`
                    });
                }
            });

        return () => channel.stopListening('.service.request.created');
    }, []);

    const updateRequestStatus = (id: number, status: string) => {
        http.setData({ status });
        http.patch(`/service-requests/${id}`, {
            onSuccess: () => {
                setActiveRequests((prev: ServiceRequest[]) => prev.map((r: ServiceRequest) => r.id === id ? { ...r, status: status as any } : r).filter((r: ServiceRequest) => status !== 'resolved' ? true : r.id !== id));
                toast.success(`${__('Permintaan')} #${id} ${__('diperbarui menjadi')} ${status.toUpperCase()}`);
            },
            onError: () => {
                toast.error(__('Gagal memperbarui status permintaan.'));
            }
        });
    };

    return (
        <>
            <Head title={`${__('Manajemen Reservasi')} - Ocean's Resto`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white font-['Inter',sans-serif]">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-slate-900 dark:text-white/95">
                            {__('Reservasi & Layout')}
                        </h1>
                        <p className="mt-1 text-sm text-slate-400 dark:text-white/40">
                            {__('Kelola pemesanan masuk dan atur tata letak meja restoran secara visual.')}
                        </p>
                    </div>
                </div>

                <div className="w-full">
                    {/* List Section */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-md shadow-xl dark:shadow-2xl transition-all">
                        {reservations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="font-semibold text-slate-500 dark:text-white/70">{__('Pelanggan')}</TableHead>
                                            <TableHead className="font-semibold text-slate-500 dark:text-white/70">{__('Tanggal & Waktu')}</TableHead>
                                            <TableHead className="font-semibold text-slate-500 dark:text-white/70">{__('Meja & Tamu')}</TableHead>
                                            <TableHead className="font-semibold text-slate-500 dark:text-white/70">{__('Menu')}</TableHead>
                                            <TableHead className="font-semibold text-slate-500 dark:text-white/70">{__('Status')}</TableHead>
                                            <TableHead className="text-right font-black tracking-widest uppercase text-[10px] text-slate-400 dark:text-white/50 w-[150px]">
                                                {__('Aksi')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.map((reservation) => (
                                            <TableRow key={reservation.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-slate-100 dark:border-white/5 transition-colors group">
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 ring-1 ring-sky-500/20">
                                                            <Users size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="truncate font-bold text-slate-900 dark:text-white/95 text-base">{reservation.customer_name}</h3>
                                                            <div className="text-xs text-slate-400 dark:text-white/40 flex flex-col gap-0.5 mt-0.5">
                                                                <a 
                                                                    href={`https://wa.me/${reservation.customer_phone?.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(reservation.customer_name)},%0A%0AMengenai%20reservasi%20di%20Ocean's Resto...`}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-500/80 hover:text-emerald-500 transition-colors"
                                                                >
                                                                    <MessageCircle size={12} /> {reservation.customer_phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="mb-1 flex items-center text-sm font-medium text-slate-600 dark:text-white/80">
                                                        {new Date(reservation.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center text-xs text-slate-400 dark:text-white/40">
                                                        <Clock className="mr-1.5 h-3.5 w-3.5 text-sky-600 dark:text-sky-500/70" />
                                                        {reservation.time.substring(0, 5)}
                                                    </div>
                                                </TableCell>
                                                 <TableCell>
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white/90">
                                                            <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60">
                                                                {__('Meja')} {reservation.table_id || '?'}
                                                            </Badge>
                                                            <span className="text-xs text-slate-400 dark:text-white/40">{reservation.guest_count} {__('Orang')}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {reservation.menus && reservation.menus.length > 0 ? (
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                                                                {__('Pesan Menu')} ({reservation.menus.length})
                                                            </Badge>
                                                            <div className="flex flex-col gap-0.5">
                                                                {reservation.menus.slice(0, 1).map((m: any) => (
                                                                    <div key={m.id} className="text-[10px] text-slate-500 dark:text-white/50 truncate max-w-[120px]">
                                                                        {m.pivot.quantity}x {m.name}
                                                                    </div>
                                                                ))}
                                                                {reservation.menus.length > 1 && (
                                                                    <span className="text-[9px] text-slate-400 dark:text-white/30 italic">
                                                                        + {reservation.menus.length - 1} {__('lainnya')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40 text-[10px]">
                                                            {__('Meja Saja')}
                                                        </Badge>
                                                    )}
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
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10"
                                                            onClick={() => setSelectedReservation(reservation)}
                                                            title={__('Lihat Detail')}
                                                        >
                                                            <Info className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className={`h-8 w-8 border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-500 hover:bg-sky-500/20 ${activeChatId === reservation.id ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-white dark:ring-offset-black' : ''}`}
                                                            onClick={() => setActiveChatId(activeChatId === reservation.id ? null : reservation.id)}
                                                            title={__('Buka Chat')}
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                        {auth.user?.role !== 'admin' && (
                                                            <>
                                                                {reservation.status === 'pending' && (
                                                                    <>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            className="h-8 w-8 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                                                            onClick={() => updateStatus(reservation.id, 'awaiting_payment')}
                                                                            title={__('Terima & Menunggu Pembayaran')}
                                                                        >
                                                                            <CheckCircle2 className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            className="h-8 w-8 border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                                            onClick={() => updateStatus(reservation.id, 'rejected')}
                                                                            title={__('Tolak Reservasi')}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {reservation.status === 'awaiting_payment' && (
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        className="h-8 w-8 border-sky-500/20 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20"
                                                                        onClick={() => updateStatus(reservation.id, 'confirmed')}
                                                                        title={__('Tandai Sudah Bayar (Confirmed)')}
                                                                    >
                                                                        <DollarSign className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                 {reservation.status === 'confirmed' && (
                                                                    <Button
                                                                        size="icon"
                                                                        variant="outline"
                                                                        className="h-8 w-8 border-blue-500/20 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                                        onClick={() => updateStatus(reservation.id, 'completed')}
                                                                        title={__('Tandai Selesai')}
                                                                    >
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-8 w-8 border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                                    onClick={() => deleteReservation(reservation.id)}
                                                                    title={__('Hapus Riwayat')}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </>
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
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                                    <Calendar size={32} className="text-sky-600/40 dark:text-sky-500/40" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white/90 italic font-['Playfair_Display',serif]">{__('Hening di Sini...')}</h3>
                                <p className="mt-2 text-sm text-slate-400 dark:text-white/40 max-w-xs">{__('Saat ini tidak ada permintaan reservasi yang masuk dalam antrean Anda.')}</p>
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
                                className="pointer-events-auto bg-black/80 backdrop-blur-2xl border border-sky-500/30 rounded-3xl p-6 shadow-3xl ring-1 ring-sky-500/10 overflow-hidden group"
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
                                            request.status === 'pending' ? 'bg-sky-500 text-black' : 'bg-blue-500 text-white'
                                        }`}>
                                            {__(request.status)}
                                        </Badge>
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                            #{request.reservation_id}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-500 border border-sky-500/20">
                                            {request.type === 'waiter' && <Bell size={18} />}
                                            {request.type === 'bill' && <Receipt size={18} />}
                                            {request.type === 'refill' && <Droplets size={18} />}
                                            {request.type === 'napkins' && <Sparkles size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">{__('Meja')} {request.reservation?.resto_table?.name || '?'}</p>
                                            <p className="text-[10px] font-bold text-sky-400 uppercase">{__(request.type)}</p>
                                        </div>
                                    </div>

                                    {auth.user?.role !== 'admin' && (
                                        <div className="flex gap-2 pt-2">
                                            {request.status === 'pending' && (
                                                <Button 
                                                    onClick={() => updateRequestStatus(request.id, 'ongoing')}
                                                    className="flex-1 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest border border-white/5"
                                                >
                                                    {__('Layani')}
                                                </Button>
                                            )}
                                            <Button 
                                                onClick={() => updateRequestStatus(request.id, 'resolved')}
                                                className="flex-1 h-9 rounded-xl bg-sky-500 text-black hover:bg-white text-[9px] font-black uppercase tracking-widest shadow-lg"
                                            >
                                                {__('Selesai')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {activeRequests.length === 0 && (
                        <div className="p-6 text-center rounded-[2rem] border border-dashed border-white/5 text-white/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">{__('No Active Requests')}</p>
                        </div>
                    )}
                </div>

                {/* Active Chat Component */}
                {activeChatId && (
                    <BoutiqueChat reservationId={activeChatId} currentUser={auth.user} />
                )}

                {/* Detail Dialog */}
                <Dialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
                    <DialogContent className="sm:max-w-xl bg-white dark:bg-[#0A0A0B] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                            <DialogHeader>
                                <DialogTitle className="font-['Playfair_Display',serif] text-2xl font-bold">
                                    {__('Detail Reservasi')} #{selectedReservation?.id.toString().padStart(4, '0')}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 dark:text-white/40">
                                    {__('Info lengkap tamu, pesanan pre-order, dan tagihan.')}
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        
                        {selectedReservation && (
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                                {/* Customer Info */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500">{__('Informasi Tamu')}</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Nama')}</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_name}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Kontak')}</p>
                                            <p className="text-sm font-semibold">{selectedReservation.customer_phone}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Jadwal')}</p>
                                            <p className="text-sm font-semibold">{new Date(selectedReservation.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US')} - {selectedReservation.time.substring(0,5)} WITA</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                                            <p className="text-[10px] text-slate-400 dark:text-white/40 uppercase font-bold tracking-wider mb-1">{__('Alokasi Meja')}</p>
                                            <p className="text-sm font-semibold">{__('Meja')} {selectedReservation.table_id || '?'} ({selectedReservation.guest_count} {__('Tamu')})</p>
                                        </div>
                                    </div>
                                    {selectedReservation.special_requests && (
                                        <div className="bg-sky-500/5 rounded-xl p-3 border border-sky-500/10">
                                            <p className="text-[10px] text-sky-600 dark:text-sky-400 uppercase font-bold tracking-wider mb-1">{__('Catatan Spesial')}</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-white/80">{selectedReservation.special_requests}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pre-order Menu */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500">{__('Pre-order Menu')}</h4>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                        {selectedReservation.menus && selectedReservation.menus.length > 0 ? (
                                            <div className="divide-y divide-white/5">
                                                {selectedReservation.menus.map((m: any) => (
                                                    <div key={m.id} className="p-4 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-white/10 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-white/5">
                                                                <img src={`/storage/${m.image_url}`} alt={m.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-900 dark:text-white/90">{m.name}</p>
                                                                <p className="text-xs text-slate-400 dark:text-white/40">{m.pivot.quantity}x @ Rp {Number(m.price).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                            Rp {(m.price * m.pivot.quantity).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{__('Tidak ada pre-order makanan')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">{__('Ringkasan Tagihan (DP)')}</h4>
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 p-4 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-white/60">{__('Estimasi Total DP (50%)')}</span>
                                            <span className="font-bold">Rp {Number(selectedReservation.booking_fee).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-white/60">{__('Diskon Loyalty Points')}</span>
                                            <span className="font-bold text-rose-500 dark:text-rose-400">- Rp {Number(selectedReservation.discount_amount || 0).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                                            <span className="font-bold text-slate-900 dark:text-white/90">{__('Total Harus Dibayar')}</span>
                                            <span className="text-xl font-black text-blue-600 dark:text-blue-400">Rp {Number(selectedReservation.total_after_discount || selectedReservation.booking_fee).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">{__('Status Reservasi:')}</span>
                                            <StatusBadge status={selectedReservation.status} />
                                        </div>
                                        {selectedReservation.status !== 'rejected' && selectedReservation.status !== 'cancelled' && (
                                            <Badge variant={selectedReservation.payment_status === 'paid' ? 'default' : 'destructive'} className={selectedReservation.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-500 border-0' : 'bg-rose-500/20 text-rose-500 border-0'}>
                                                {__(selectedReservation.payment_status || '').toUpperCase()}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ReservationsDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

