import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Users, Check, X, Filter, MessageCircle, Map as MapIcon, List, Save, Info } from 'lucide-react';
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
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

interface PageProps {
    reservations: Reservation[];
    tables: RestoTable[];
}

export default function ReservationsDashboard({ reservations, tables }: PageProps) {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [draggingTableId, setDraggingTableId] = useState<number | null>(null);

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

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, string> = {
            awaiting_payment: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
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
                    
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-lg px-4 ${view === 'list' ? 'bg-amber-500 text-[#0A0A0B] hover:bg-amber-600 hover:text-[#0A0A0B]' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setView('list')}
                        >
                            <List className="mr-2 h-4 w-4" />
                            Daftar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-lg px-4 ${view === 'map' ? 'bg-amber-500 text-[#0A0A0B] hover:bg-amber-600 hover:text-[#0A0A0B]' : 'text-white/60 hover:text-white'}`}
                            onClick={() => setView('map')}
                        >
                            <MapIcon className="mr-2 h-4 w-4" />
                            Peta Meja
                        </Button>
                    </div>
                </div>

                {view === 'list' ? (
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
                                                        <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-500/70" />
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
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {(reservation.status === 'pending' || reservation.status === 'awaiting_payment') && (
                                                        <div className="flex items-center justify-end gap-2">
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
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                                    <Calendar size={32} className="text-amber-500/40" />
                                </div>
                                <h3 className="text-lg font-bold text-white/90 italic font-['Playfair_Display',serif]">Hening di Sini...</h3>
                                <p className="mt-2 text-sm text-white/40 max-w-xs">Saat ini tidak ada permintaan reservasi yang masuk dalam antrean Anda.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative h-[600px] w-full bg-[#0A0A0B] rounded-3xl border border-white/10 overflow-hidden shadow-2xl group/map">
                        {/* Map Background/Grid */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                        
                        {/* Map Controls Info */}
                        <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl max-w-[200px] shadow-2xl">
                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2 mb-3">
                                <Info size={14} /> Legend
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-white/60">
                                    <span className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></span> Tersedia
                                </div>
                                <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-white/60">
                                    <span className="h-3 w-3 rounded-full bg-amber-500"></span> Dipesan
                                </div>
                            </div>
                            <p className="mt-4 text-[9px] text-white/30 italic leading-relaxed font-medium">
                                Drag meja untuk mengatur tata letak. Klik Simpan untuk memperbarui database.
                            </p>
                        </div>

                        {/* Visual Tables Container */}
                        <div className="absolute inset-0 p-12">
                            {tables.map((table) => {
                                const status = getTableStatus(table.id);
                                return (
                                    <motion.div
                                        key={table.id}
                                        drag
                                        dragMomentum={false}
                                        onDragStart={() => setDraggingTableId(table.id)}
                                        onDragEnd={(_, info) => {
                                            // Simulated saving logic (in a real app we'd handle scale/offset)
                                            // For this demo, we assume the absolute movement is saved
                                            const newX = table.pos_x + info.offset.x;
                                            const newY = table.pos_y + info.offset.y;
                                            updateTablePosition(table.id, newX, newY);
                                        }}
                                        initial={false}
                                        animate={{ x: table.pos_x, y: table.pos_y }}
                                        className={`absolute cursor-grab active:cursor-grabbing w-24 h-24 rounded-2xl flex flex-col items-center justify-center border-2 shadow-2xl transition-all ${
                                            status === 'confirmed' || status === 'pending'
                                                ? 'bg-amber-500 border-amber-600 text-[#0A0A0B]' 
                                                : 'bg-white/5 border-white/10 hover:border-emerald-500/50 text-white group'
                                        }`}
                                        style={{ touchAction: 'none' }}
                                    >
                                        <Users size={20} className={status === 'available' ? 'text-white/20 group-hover:text-emerald-500 transition-colors' : 'text-[#0A0A0B]/60'} />
                                        <span className="text-xs font-black mt-1 uppercase tracking-tighter">{table.name}</span>
                                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{table.capacity}p</span>
                                        
                                        {draggingTableId === table.id && (
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-[#0A0A0B] text-[8px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                                                DRAGGING...
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {tables.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-white/20 font-medium italic">Belum ada meja yang dikonfigurasi.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

ReservationsDashboard.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

