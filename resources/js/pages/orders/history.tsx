import { router } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    ArrowRight,
    CheckCircle2,
    Clock3,
    XCircle,
    Utensils,
    ShoppingBag,
    ChefHat,
    Receipt,
    CreditCard,
    Trash2,
    Truck,
    Store,
    MessageCircle,
    CircleDollarSign,
} from 'lucide-react';
import { useState } from 'react';
import BoutiqueChat from '@/components/app/boutique-chat';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import Footer from '@/pages/welcome/sections/footer';
import Navbar from '@/pages/welcome/sections/navbar';

export default function OrderHistory({ auth, orders }: any) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [activeChatOrderId, setActiveChatOrderId] = useState<number | undefined>(
        undefined,
    );
    const [chatContext, setChatContext] = useState<'support' | 'courier'>(
        'support',
    );

    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
            router.patch(`/orders/${id}/cancel`);
        }
    };

    const handleDelete = (id: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus riwayat pesanan yang dibatalkan ini?',
            )
        ) {
            router.delete(`/orders/${id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<
            string,
            { label: string; color: string; icon: any }
        > = {
            pending: {
                label: 'Menunggu Konfirmasi',
                color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                icon: Clock3,
            },
            confirmed: {
                label: 'Dikonfirmasi',
                color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                icon: CheckCircle2,
            },
            cancelled: {
                label: 'Dibatalkan',
                color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                icon: XCircle,
            },
            waiting_for_payment: {
                label: 'Menunggu Pembayaran',
                color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
                icon: CreditCard,
            },
            preparing: {
                label: 'Sedang Disiapkan',
                color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                icon: ChefHat,
            },
            delivering: {
                label: 'Dalam Pengiriman',
                color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                icon: ShoppingBag,
            },
            delivered: {
                label: 'Telah Sampai',
                color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                icon: CheckCircle2,
            },
            complete: {
                label: 'Selesai',
                color: 'bg-white/5 text-white/40 border-white/10',
                icon: CheckCircle2,
            },
        };
        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} px-3 py-1 text-[10px] font-black tracking-wider uppercase`}
            >
                <Icon size={10} /> {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-foreground transition-colors duration-500 selection:bg-sky-500/30 dark:bg-[#0A0A0B]">
            <Head title="Check Your Order â€” Ocean's Resto" />

            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-600/5 blur-[120px]" />

            <Navbar
                auth={auth}
                dashboardUrl="/dashboard"
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            <main className="relative z-10 pt-32 pb-32">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 rounded-full bg-sky-500" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">
                                    Food Tracker
                                </span>
                            </div>
                            <h1 className="font-['Playfair_Display',serif] text-5xl font-black tracking-tighter text-slate-900 md:text-6xl dark:text-white">
                                My{' '}
                                <span className="font-serif text-sky-500 italic opacity-40">
                                    Orders
                                </span>
                            </h1>
                            <p className="mt-4 max-w-lg text-lg font-medium text-slate-500 dark:text-neutral-500">
                                Pantau riwayat pemesanan makanan Anda dan cek
                                status pesanan terkini.
                            </p>
                        </div>
                    </div>

                    {/* Timeline / List Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {orders.length === 0 ? (
                                <div className="glass-card flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed py-32">
                                    <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-neutral-800">
                                        <ShoppingBag size={48} />
                                    </div>
                                    <h3 className="mb-3 font-serif text-2xl font-black tracking-tight text-slate-900 italic dark:text-white">
                                        Belum Ada Pesanan
                                    </h3>
                                    <p className="mb-12 max-w-sm text-center font-medium text-slate-500 dark:text-neutral-500">
                                        Menu-menu estetik kami sudah menanti.
                                        Yuk eksplorasi Ocean's Resto!
                                    </p>
                                    <Link href="/catalog">
                                        <Button className="h-14 rounded-2xl bg-sky-500 px-10 font-black tracking-widest text-black uppercase shadow-xl shadow-sky-500/10 transition-all hover:bg-white">
                                            Kembali ke Galeri{' '}
                                            <ArrowRight
                                                size={18}
                                                className="ml-3"
                                            />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                orders.map((o: any, idx: number) => (
                                    <motion.div
                                        key={o.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative"
                                    >
                                        <div className="glass-card flex flex-col gap-8 rounded-[3.5rem] border border-slate-200 bg-white p-8 shadow-3xl backdrop-blur-3xl transition-all duration-700 hover:border-sky-500/30 md:flex-row md:p-12 dark:border-white/5 dark:bg-white/[0.02]">
                                            {/* Left Info */}
                                            <div className="flex-1 space-y-8">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    {getStatusBadge(
                                                        o.order_status,
                                                    )}
                                                    <span className="text-[10px] font-black tracking-[.3em] text-slate-300 uppercase dark:text-white/20">
                                                        #{o.order_number}
                                                    </span>
                                                    <span
                                                        className={`rounded bg-slate-100 px-2 py-1 text-[10px] font-black tracking-widest uppercase dark:bg-white/5 ${o.payment_status === 'paid' ? 'text-emerald-500' : 'text-slate-500'}`}
                                                    >
                                                        {o.payment_status ===
                                                        'paid'
                                                            ? 'Paid'
                                                            : 'Unpaid'}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <h3 className="font-['Playfair_Display',serif] text-4xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-sky-500 dark:text-white">
                                                        Rp{' '}
                                                        {Number(
                                                            o.total_price,
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 dark:text-neutral-400">
                                                        <span className="flex items-center gap-2.5">
                                                            <Receipt
                                                                size={16}
                                                                className="text-sky-500"
                                                            />{' '}
                                                            {o.order_type ===
                                                            'delivery'
                                                                ? 'Delivery'
                                                                : 'Ambil di Tempat'}
                                                        </span>
                                                        <span className="flex items-center gap-2.5">
                                                            <Clock
                                                                size={16}
                                                                className="text-sky-500"
                                                            />{' '}
                                                            {new Date(
                                                                o.created_at,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                                {
                                                                    dateStyle:
                                                                        'medium',
                                                                    timeStyle:
                                                                        'short',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Menus List */}
                                                {o.items &&
                                                    o.items.length > 0 && (
                                                        <div className="space-y-4">
                                                            <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                                                Order Details
                                                            </p>
                                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                {o.items.map(
                                                                    (
                                                                        item: any,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="flex items-center justify-between rounded-2xl border border-sky-500/10 bg-sky-500/5 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <Utensils
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                    className="text-sky-500"
                                                                                />
                                                                                <span className="text-xs font-bold text-slate-700 dark:text-white/80">
                                                                                    {item
                                                                                        .menu
                                                                                        ?.name ||
                                                                                        'Menu Terhapus'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-xs font-black text-slate-400 dark:text-white/40">
                                                                                x
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>

                                            {/* Right Actions */}
                                            <div className="flex flex-col justify-center gap-4 border-slate-200 md:w-72 md:border-l md:pl-12 dark:border-white/5">
                                                <Button
                                                    onClick={() =>
                                                        setSelectedOrder(o)
                                                    }
                                                    className={`flex h-14 w-full items-center justify-center rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all hover:scale-[1.02] ${
                                                        [
                                                            'waiting_for_payment',
                                                            'delivering',
                                                        ].includes(
                                                            o.order_status,
                                                        )
                                                            ? 'border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10'
                                                            : 'bg-slate-900 text-white shadow-xl dark:bg-white dark:text-black'
                                                    }`}
                                                >
                                                    Order Details
                                                </Button>

                                                {o.payment_status === 'unpaid' && o.order_status === 'waiting_for_payment' && (
                                                    <Button 
                                                        onClick={async () => {
                                                            const snap = (window as any).snap;
                                                            if (!snap) {
                                                                router.visit(`/orders/payment/${o.id}`);
                                                                return;
                                                            }

                                                            try {
                                                                // Always fetch a fresh token to avoid expiration/method-locking issues
                                                                const response = await fetch(`/orders/payment/${o.id}/refresh`, {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                                                                        'Accept': 'application/json',
                                                                    }
                                                                });
                                                                
                                                                const data = await response.json();
                                                                
                                                                if (data.snap_token) {
                                                                    snap.pay(data.snap_token, {
                                                                        onSuccess: () => router.reload(),
                                                                        onPending: () => router.reload(),
                                                                        onClose: () => router.reload(),
                                                                    });
                                                                } else {
                                                                    // Fallback
                                                                    router.visit(`/orders/payment/${o.id}`);
                                                                }
                                                            } catch (error) {
                                                                console.error('Payment Refresh Error:', error);
                                                                router.visit(`/orders/payment/${o.id}`);
                                                            }
                                                        }}
                                                        className="flex h-14 w-full items-center justify-center rounded-2xl bg-emerald-500 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                                    >
                                                        Bayar Sekarang{' '}
                                                        <ArrowRight
                                                            size={16}
                                                            className="ml-2"
                                                        />
                                                    </Button>
                                                )}

                                                {o.order_status ===
                                                    'delivering' && (
                                                    <Link
                                                        href={`/orders/${o.id}/track`}
                                                        className="w-full"
                                                    >
                                                        <Button className="flex h-14 w-full items-center justify-center rounded-2xl bg-cyan-500 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02]">
                                                            Track Delivery{' '}
                                                            <ArrowRight
                                                                size={16}
                                                                className="ml-2"
                                                            />
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Pembatalan Pesanan / Cancel */}
                                                {[
                                                    'pending',
                                                    'waiting_for_payment',
                                                ].includes(o.order_status) &&
                                                    o.payment_status ===
                                                        'unpaid' && (
                                                        <button
                                                            onClick={() =>
                                                                handleCancel(
                                                                    o.id,
                                                                )
                                                            }
                                                            className="mt-2 w-full text-center text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-rose-500"
                                                        >
                                                            Batalkan Pesanan
                                                        </button>
                                                    )}

                                                {o.order_status ===
                                                    'preparing' && (
                                                    <div className="flex h-14 w-full items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-[10px] font-black tracking-widest text-sky-500 uppercase">
                                                        <ChefHat
                                                            size={16}
                                                            className="mr-2"
                                                        />{' '}
                                                        Chef is Cooking...
                                                    </div>
                                                )}

                                                {o.order_status ===
                                                    'cancelled' && (
                                                    <Button
                                                        onClick={() =>
                                                            handleDelete(o.id)
                                                        }
                                                        className="flex h-14 w-full items-center justify-center rounded-2xl bg-rose-500 text-[10px] font-black tracking-widest text-white uppercase shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02]"
                                                    >
                                                        Hapus Riwayat{' '}
                                                        <Trash2
                                                            size={16}
                                                            className="ml-2"
                                                        />
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => {
                                                        setChatContext(
                                                            'support',
                                                        );
                                                        setActiveChatOrderId(
                                                            activeChatOrderId ===
                                                                o.id
                                                                ? undefined
                                                                : o.id,
                                                        );
                                                    }}
                                                    variant="outline"
                                                    className={`mt-2 flex h-14 w-full items-center justify-center rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-sm transition-all ${
                                                        activeChatOrderId ===
                                                        o.id
                                                            ? 'border-sky-500 bg-sky-500 text-white'
                                                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                                                    }`}
                                                >
                                                    <MessageCircle
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Chat Pesanan
                                                </Button>

                                                {o.order_type === 'delivery' &&
                                                    o.courier_id && (
                                                        <Button
                                                            onClick={() => {
                                                                setChatContext(
                                                                    'courier',
                                                                );
                                                                setActiveChatOrderId(
                                                                    activeChatOrderId ===
                                                                        o.id
                                                                        ? undefined
                                                                        : o.id,
                                                                );
                                                            }}
                                                            className="mt-2 h-14 w-full rounded-2xl bg-cyan-500 text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:bg-cyan-600"
                                                        >
                                                            <Truck
                                                                size={16}
                                                                className="mr-2"
                                                            />
                                                            Chat Kurir
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal Detail Order */}
            <Dialog
                open={!!selectedOrder}
                onOpenChange={(open) => !open && setSelectedOrder(null)}
            >
                <DialogContent className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-md md:max-w-2xl md:rounded-[3rem] dark:border-white/10 dark:bg-zinc-950">
                    {selectedOrder && (
                        <div className="flex h-[80vh] flex-col md:h-auto">
                            <div className="relative border-b border-slate-100 bg-slate-50/50 p-8 !pb-6 md:p-10 dark:border-white/5 dark:bg-zinc-950/50">
                                <DialogTitle className="font-['Playfair_Display',serif] text-3xl font-black tracking-tighter text-slate-900 md:text-4xl dark:text-white">
                                    Detail{' '}
                                    <span className="font-serif text-sky-500 italic opacity-40">
                                        Pesanan
                                    </span>
                                </DialogTitle>
                                <DialogDescription className="mt-2 text-sm font-medium text-slate-500 dark:text-neutral-500">
                                    Order ID: #{selectedOrder.order_number}
                                </DialogDescription>
                            </div>

                            <div className="flex-1 space-y-8 overflow-y-auto p-8 md:p-10">
                                <div className="grid grid-cols-2 gap-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 dark:border-white/5 dark:bg-white/5">
                                    <div>
                                        <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                            Customer
                                        </p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedOrder.customer_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                            Contact
                                        </p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedOrder.customer_phone ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                            Order Type
                                        </p>
                                        <p className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                            {selectedOrder.order_type ===
                                            'delivery' ? (
                                                <>
                                                    <Truck
                                                        size={14}
                                                        className="text-sky-500"
                                                    />{' '}
                                                    Delivery
                                                </>
                                            ) : (
                                                <>
                                                    <Store
                                                        size={14}
                                                        className="text-sky-500"
                                                    />{' '}
                                                    Ambil di Tempat
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                            Time
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
                                            {new Date(
                                                selectedOrder.created_at,
                                            ).toLocaleString('id-ID', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>
                                    {selectedOrder.order_type === 'delivery' && (
                                        <div className="col-span-2">
                                            <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                                Delivery Address
                                            </p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                                                {selectedOrder.delivery_address || '-'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="mb-4 text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-white/20">
                                        Items
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map(
                                            (item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 dark:border-white/5 dark:bg-white/[0.02]"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                                                            <Utensils
                                                                size={18}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                                {
                                                                    item.menu
                                                                        ?.name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900 dark:text-white">
                                                            x{item.quantity}
                                                        </p>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            Rp{' '}
                                                            {Number(
                                                                item.total_price,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 pt-6 dark:border-white/10">
                                    <div className="flex items-end justify-between rounded-3xl border border-sky-500/20 bg-sky-500/5 px-6 py-5">
                                        <div>
                                            <p className="mb-1 text-[10px] font-black tracking-[0.3em] text-sky-500/60 uppercase">
                                                Payment Total
                                            </p>
                                            <p
                                                className={`text-xs font-black tracking-widest uppercase ${selectedOrder.payment_status === 'paid' ? 'text-emerald-500' : 'text-slate-500'}`}
                                            >
                                                {selectedOrder.payment_status}
                                            </p>
                                        </div>
                                        <p className="text-2xl font-black tracking-tighter text-sky-500">
                                            Rp{' '}
                                            {Number(
                                                selectedOrder.total_price,
                                            ).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    {selectedOrder.payment_status === 'unpaid' && selectedOrder.order_status === 'waiting_for_payment' && (
                                        <Button 
                                            onClick={() => {
                                                const snap = (window as any).snap;
                                                if (snap && selectedOrder.midtrans_snap_token) {
                                                    snap.pay(selectedOrder.midtrans_snap_token, {
                                                        onSuccess: () => router.reload(),
                                                        onPending: () => router.reload(),
                                                    });
                                                }
                                            }}
                                            className="mt-6 h-16 w-full rounded-2xl bg-emerald-500 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                        >
                                            <CircleDollarSign className="mr-2 h-5 w-5" />
                                            Bayar Sekarang
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Live Chat for Orders */}
            {activeChatOrderId && (
                <BoutiqueChat
                    orderId={activeChatOrderId}
                    currentUser={auth.user}
                    title={
                        chatContext === 'courier'
                            ? 'Chat Kurir Delivery'
                            : 'Chat Pesanan'
                    }
                    subtitle={
                        chatContext === 'courier'
                            ? 'Customer & Kurir'
                            : 'Customer, Staff & Kurir'
                    }
                />
            )}

            <Footer />
        </div>
    );
}
