import { Head, router, usePage } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { ChefHat, Clock, CheckCircle2, PlayCircle, Loader2, UtensilsCrossed, AlertCircle, MessageCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import kitchen from '@/routes/kitchen';
import BoutiqueChat from '@/components/app/boutique-chat';
import { useTranslations } from '@/hooks/use-translations';

export default function KitchenIndex({ auth, online_active = [], online_completed = [], online_cancelled = [], couriers = [] }: any) {
    const { __ } = useTranslations();
    const [loadingId, setLoadingId] = useState<string | number | null>(null);
    const [selectedCourier, setSelectedCourier] = useState<Record<number, string>>({});
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    // Use Wayfinder action/route functions instead of Ziggy's route()
    const updateItemStatus = (itemId: number, type: string, status: string, itemName: string) => {
        setLoadingId(itemId);
        const endpoint = type === 'order' ? kitchen.order_item.update.url(itemId) : kitchen.item.update.url(itemId);
        router.patch(endpoint, { status }, {
            onFinish: () => setLoadingId(null),
            preserveScroll: true
        });
    };

    const handleAcceptOrder = (orderId: number) => {
        setLoadingId(`accept-${orderId}`);
        router.post(kitchen.orders.accept.url(orderId), {}, {
            onFinish: () => setLoadingId(null),
        });
    };

    const handleRejectOrder = (orderId: number) => {
        if (!confirm(__('Tolak pesanan ini?'))) return;
        setLoadingId(`reject-${orderId}`);
        router.post(kitchen.orders.reject.url(orderId), {}, {
            onFinish: () => setLoadingId(null),
        });
    };

    const updateOrderStatus = (orderId: number, status: string, type: string = 'order') => {
        setLoadingId(`status-${orderId}`);
        const data: any = { status };
        if (selectedCourier[orderId]) {
            data.courier_id = selectedCourier[orderId];
        }

        const endpoint = type === 'order' ? kitchen.orders.update_status.url(orderId) : `/reservations/${orderId}`;
        
        router.patch(endpoint, data, {
            onFinish: () => setLoadingId(null),
            preserveScroll: true,
            onSuccess: () => toast.success(__('Status pesanan diperbarui ke :status', { status }))
        });
    };

    const updateAllItems = (orderId: number, type: string, status: string) => {
        setLoadingId(`all-${orderId}`);
        updateOrderStatus(orderId, status === 'preparing' ? 'preparing' : (type === 'order' ? 'preparing' : 'active'), type);
    };

    useEffect(() => {
        const kitchenChannel = window.Echo.channel('kitchen')
            .listen('.DishStatusUpdated', (e: any) => {
                router.reload();
                toast.info(`${__('Update Hidangan')}: ${e.itemName} - ${e.status.toUpperCase()}`);
            });

        const reservationChannel = window.Echo.channel('reservations')
            .listen('.ReservationStatusUpdated', (e: any) => {
                router.reload();
                toast.warning(__('Pembaruan Reservasi/Pesanan Baru!'));
            });

        return () => {
            kitchenChannel.stopListening('.DishStatusUpdated');
            reservationChannel.stopListening('.ReservationStatusUpdated');
        };
    }, []);

    const handleDelete = (id: number, type: 'order' | 'reservation') => {
        if (confirm(__('Hapus riwayat pesanan ini?'))) {
            const url = type === 'order' ? `/orders/${id}` : `/reservations/${id}`;
            router.delete(url, {
                preserveScroll: true,
                onSuccess: () => toast.success(__('Riwayat berhasil dihapus'))
            });
        }
    };

    const OrderCard = ({ order, statusType = 'active' }: { order: any, statusType?: 'active' | 'history' | 'cancelled' | 'completed' }) => {
        const readyItemsCount = order.items.filter((item: any) => item.status === 'ready' || item.status === 'served').length;
        const totalItemsCount = order.items.length;
        const progress = totalItemsCount > 0 ? (readyItemsCount / totalItemsCount) * 100 : 0;
        const isUrgent = order.elapsed_minutes > 20 && statusType === 'active';
        const isDelayed = order.elapsed_minutes > 40 && statusType === 'active';

        const getOrderTypeStyles = () => {
            switch(order.order_type) {
                case 'delivery': return 'bg-sky-500 text-white';
                case 'pickup': return 'bg-blue-600 text-white';
                case 'dine-in': return 'bg-indigo-600 text-white';
                default: return 'bg-slate-500 text-white';
            }
        };

        const getOrderTypeLabel = () => {
            switch(order.order_type) {
                case 'delivery': return __('Delivery');
                case 'pickup': return __('Takeaway');
                case 'dine-in': return __('Dine-in');
                default: return order.order_type;
            }
        };

        return (
            <div key={order.id} className={`group relative rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl transition-all ${statusType === 'active' ? (isDelayed ? 'border-rose-500/50 shadow-rose-500/10' : (isUrgent ? 'border-amber-500/50 shadow-amber-500/10' : 'hover:border-sky-500/20')) : 'opacity-70 scanline'}`}>
                {/* Order Type Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${getOrderTypeStyles()} shadow-lg`}>
                    {getOrderTypeLabel()}
                </div>

                {/* Progress Bar */}
                {statusType === 'active' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-white/5">
                        <div 
                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                                {order.order_number}
                            </p>
                            {order.table_number && (
                                <Badge variant="outline" className="text-[9px] font-black border-sky-500/30 text-sky-500 bg-sky-500/5">
                                    {__('MEJA')} {order.table_number}
                                </Badge>
                            )}
                        </div>
                        <div className={`flex items-center gap-1.5 font-bold text-[10px] ${isDelayed ? 'text-rose-500 animate-pulse' : (isUrgent ? 'text-amber-500' : 'text-sky-500/60')}`}>
                            <Clock size={10} /> 
                            {order.time} ({order.elapsed_minutes}m)
                        </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none truncate max-w-[200px]">{order.customer_name}</h3>
                        <button 
                            onClick={() => setActiveChatId(activeChatId === order.id ? null : order.id)}
                            className={`p-1.5 rounded-xl border transition-all ${activeChatId === order.id ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-white/5'}`}
                            title={__('Buka Chat')}
                        >
                            <MessageCircle size={16} />
                        </button>
                        {(statusType === 'completed' || statusType === 'cancelled') && (
                            <button 
                                onClick={() => handleDelete(order.id, order.type)}
                                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                title={__('Hapus Riwayat')}
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                            <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-slate-200 dark:border-white/5 ${order.order_status === 'pending' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-50' : (statusType === 'active' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40')}`}>
                                {order.order_status === 'pending' ? __('Menunggu') : (order.order_status === 'preparing' ? __('Memasak') : __(order.order_status.replace(/_/g, ' ')))}
                            </Badge>
                            <span className="text-[9px] font-black text-slate-400 dark:text-white/20">{readyItemsCount}/{totalItemsCount} {__('SIAP')}</span>
                        <div className="text-[10px] font-black text-slate-500 dark:text-white/60">
                            Rp {Number(order.total_price).toLocaleString(usePage().props.locale === 'id' ? 'id-ID' : 'en-US')}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4 flex-1">
                    <ul className="space-y-4">
                        {order.items.map((item: any) => (
                            <li key={item.id} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className={`flex-1 ${item.status === 'ready' || item.status === 'served' ? 'line-through text-slate-300 dark:text-white/20' : 'text-slate-600 dark:text-white/60'}`}>
                                        <span className={`${statusType === 'active' && (item.status === 'preparing' || item.status === 'pending') ? 'text-sky-600 dark:text-sky-500' : 'text-slate-400 dark:text-white/20'} font-black mr-2`}>{item.quantity}x</span>
                                        {item.name}
                                    </span>
                                    {statusType === 'active' && item.status !== 'served' && (
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => updateItemStatus(item.id, item.type, 'preparing', item.name)}
                                                className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all shadow-sm ${item.status === 'preparing' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                                                disabled={loadingId === item.id || item.status === 'ready'}
                                            >
                                                {loadingId === item.id && item.status !== 'preparing' ? '...' : __('Masak')}
                                            </button>
                                            <button 
                                                onClick={() => updateItemStatus(item.id, item.type, 'ready', item.name)}
                                                className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all shadow-sm ${item.status === 'ready' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-white/40 hover:bg-emerald-500/20 hover:text-emerald-500'}`}
                                                disabled={loadingId === item.id}
                                            >
                                                {loadingId === item.id && item.status === 'ready' ? '...' : __('Siap')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {item.notes && (
                                    <div className="ml-7 text-[10px] text-amber-600 dark:text-amber-500 italic bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
                                        {__('Catatan')}: {item.notes}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {order.special_requests && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <p className="text-[8px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest mb-1">{__('Permintaan Khusus')}</p>
                            <p className="text-[11px] text-slate-600 dark:text-white/70 italic font-medium">{order.special_requests}</p>
                        </div>
                    )}
                </div>

                {/* Workflow Actions (Only for Active and not admin) */}
                {statusType === 'active' && auth?.user?.role !== 'admin' && (
                    <div className="p-6 pt-0 mt-auto border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                        <div className="pt-6">
                            {/* Actions for Online Order */}
                            {order.type === 'order' && (
                                <>
                                    {order.order_status === 'pending' && (
                                        <div className="flex flex-col gap-3">
                                            <Button 
                                                onClick={() => handleAcceptOrder(order.id)}
                                                className="bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-12 shadow-lg shadow-emerald-500/20 w-full"
                                                disabled={loadingId === `accept-${order.id}`}
                                            >
                                                {loadingId === `accept-${order.id}` ? <Loader2 className="animate-spin" size={16}/> : __('Terima & Mulai Masak')}
                                            </Button>
                                            <Button 
                                                onClick={() => handleRejectOrder(order.id)}
                                                variant="outline"
                                                className="border-rose-500/20 text-rose-600 font-black uppercase tracking-widest text-[9px] rounded-xl h-10 hover:bg-rose-500/10 w-full"
                                                disabled={loadingId === `reject-${order.id}`}
                                            >
                                                {loadingId === `reject-${order.id}` ? <Loader2 className="animate-spin" size={14}/> : __('Tolak Pesanan')}
                                            </Button>
                                        </div>
                                    )}

                                    {order.order_status === 'waiting_for_payment' && (
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">{__('Menunggu Pembayaran')}</p>
                                            </div>
                                            <Button 
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="w-full bg-sky-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-12"
                                            >
                                                {__('Tetap Masak (Bypass)')}
                                            </Button>
                                        </div>
                                    )}

                                    {order.order_status === 'preparing' && (
                                        <div className="space-y-4">
                                            {order.order_type === 'delivery' ? (
                                                <div className="space-y-3">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[8px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest ml-1">{__('Pilih Kurir')}</label>
                                                        <select 
                                                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white/60 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                                                            value={selectedCourier[order.id] || ''}
                                                            onChange={(e) => setSelectedCourier({...selectedCourier, [order.id]: e.target.value})}
                                                        >
                                                            <option value="">{order.courier || __('Pilih Kurir...')}</option>
                                                            {couriers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                    </div>
                                                    <Button 
                                                        onClick={() => updateOrderStatus(order.id, 'delivering')}
                                                        className={`w-full font-black uppercase tracking-widest text-[10px] rounded-xl h-12 shadow-lg ${progress === 100 ? 'bg-sky-500 text-black' : 'bg-slate-200 text-slate-400'}`}
                                                        disabled={loadingId === `status-${order.id}`}
                                                    >
                                                        {progress === 100 ? __('Kirim Pesanan') : __('Belum Semua Siap')}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button 
                                                    onClick={() => updateOrderStatus(order.id, 'complete')}
                                                    className="w-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-12 shadow-lg shadow-emerald-500/20"
                                                    disabled={loadingId === `status-${order.id}`}
                                                >
                                                    {progress === 100 ? __('Pesanan Selesai') : __('Siapkan & Selesaikan')}
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {order.order_status === 'delivering' && (
                                        <Button 
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="w-full bg-sky-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10"
                                            disabled={loadingId === `status-${order.id}`}
                                        >
                                            {__('Konfirmasi Terkirim')}
                                        </Button>
                                    )}

                                    {order.order_status === 'delivered' && (
                                        <Button 
                                            onClick={() => updateOrderStatus(order.id, 'complete')}
                                            className="w-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10"
                                            disabled={loadingId === `status-${order.id}`}
                                        >
                                            {__('Selesaikan Pesanan')}
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Actions for Reservation */}
                            {order.type === 'reservation' && (
                                <div className="space-y-3">
                                    {order.order_status === 'active' || order.order_status === 'confirmed' ? (
                                        <div className="flex flex-col gap-3">
                                            {progress < 100 && (
                                                <Button 
                                                    onClick={() => updateOrderStatus(order.id, 'active', 'reservation')}
                                                    variant="outline"
                                                    className="w-full border-amber-500/30 text-amber-600 font-black uppercase text-[10px] h-10 hover:bg-amber-500/10"
                                                >
                                                    {__('Masak Semua Menu')}
                                                </Button>
                                            )}
                                            <Button 
                                                onClick={() => router.patch(`/reservations/${order.id}`, { status: 'completed' }, { preserveScroll: true })}
                                                className="w-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-12 shadow-lg shadow-emerald-500/20"
                                                disabled={loadingId === `status-${order.id}`}
                                            >
                                                {progress === 100 ? __('Selesaikan Pesanan') : __('Selesaikan (Siap Semua)')}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                                                {order.order_status === 'pending' ? __('Menunggu Konfirmasi Admin') : __('Status') + ': ' + order.order_status}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title={`${__('Kitchen Display System')} - Ocean's Resto`} />

            <div className="mx-auto max-w-7xl font-sans text-slate-900 dark:text-white pb-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-8">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-slate-900 dark:text-white/95 flex items-center gap-3">
                            <ChefHat className="text-sky-500" size={36} />
                            {__('Kitchen Display System')}
                        </h1>
                        <p className="mt-2 text-sm text-slate-400 dark:text-white/40 max-w-md uppercase tracking-widest font-black text-[9px]">
                            {__('Real-time Kitchen & Online Order Management')}
                        </p>
                    </div>
                </div>

                {/* Section: ACTIVE ORDERS QUEUE */}
                <div className="mb-16">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-8 rounded-full bg-sky-500"></div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">{__('Antrean Pesanan Aktif')}</h2>
                        </div>
                        <Badge className="bg-sky-500/10 text-sky-500 border-sky-500/20">{online_active.length} {__('AKTIF')}</Badge>
                    </div>

                    {online_active.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {online_active.map((order: any) => (
                                <OrderCard key={order.id} order={order} statusType="active" />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 border border-dashed border-slate-200 dark:border-white/5 rounded-3xl bg-slate-50 dark:bg-white/[0.01] text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-white/10 italic">{__('Tidak Ada Pesanan Aktif')}</p>
                        </div>
                    )}
                </div>

                {/* MULTIPLE HISTORY SECTIONS */}
                <div className="space-y-12">
                    <div className="border-b border-slate-100 dark:border-white/5 pb-6">
                        <h2 className="font-['Playfair_Display',serif] text-2xl font-bold tracking-tight text-slate-900 dark:text-white/95">
                            {__('Riwayat Pesanan')}
                        </h2>
                    </div>

                    {/* Section: COMPLETED */}
                    <div>
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-8 rounded-full bg-emerald-500"></div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">{__('Riwayat Layanan (Selesai)')}</h2>
                            </div>
                        </div>

                        {online_completed.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {online_completed.map((order: any) => (
                                    <OrderCard key={order.id} order={order} statusType="history" />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border border-slate-100 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] text-center">
                                <p className="text-[8px] font-black text-slate-300 dark:text-white/10 uppercase tracking-widest">{__('Riwayat Kosong')}</p>
                            </div>
                        )}
                    </div>

                    {/* Section: CANCELLED / REJECTED */}
                    <div>
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-8 rounded-full bg-rose-500"></div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/80">{__('Dibatalkan & Ditolak')}</h2>
                            </div>
                        </div>

                        {online_cancelled.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {online_cancelled.map((order: any) => (
                                    <OrderCard key={order.id} order={order} statusType="cancelled" />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border border-slate-100 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/[0.01] text-center">
                                <p className="text-[8px] font-black text-slate-300 dark:text-white/10 uppercase tracking-widest">{__('Tidak Ada Pesanan Dibatalkan')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeChatId && (
                <BoutiqueChat orderId={activeChatId} currentUser={auth.user} />
            )}
        </>
    );
}

KitchenIndex.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;

