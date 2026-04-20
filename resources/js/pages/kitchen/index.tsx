import { Head, router } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { ChefHat, Clock, CheckCircle2, PlayCircle, Loader2, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import kitchen from '@/routes/kitchen';

export default function KitchenIndex({ online_active = [], online_completed = [], online_cancelled = [], couriers = [] }: any) {
    const [loadingId, setLoadingId] = useState<string | number | null>(null);
    const [selectedCourier, setSelectedCourier] = useState<Record<number, string>>({});

    // Use Wayfinder action/route functions instead of Ziggy's route()
    const updateItemStatus = (pivotId: number, status: string, itemName: string) => {
        setLoadingId(pivotId);
        router.patch(kitchen.item.update.url(pivotId), { status }, {
            preserveScroll: true,
            onFinish: () => setLoadingId(null),
        });
    };

    const handleAcceptOrder = (orderId: number) => {
        setLoadingId(`accept-${orderId}`);
        router.post(kitchen.orders.accept.url(orderId), {}, {
            preserveScroll: true,
            onFinish: () => setLoadingId(null),
        });
    };

    const handleRejectOrder = (orderId: number) => {
        if (!confirm('Tolak pesanan ini?')) return;
        setLoadingId(`reject-${orderId}`);
        router.post(kitchen.orders.reject.url(orderId), {}, {
            preserveScroll: true,
            onFinish: () => setLoadingId(null),
        });
    };

    const updateOrderStatus = (orderId: number, status: string) => {
        setLoadingId(`status-${orderId}`);
        const data: any = { status };
        if (selectedCourier[orderId]) {
            data.courier_id = selectedCourier[orderId];
        }

        router.patch(kitchen.orders.update_status.url(orderId), data, {
            preserveScroll: true,
            onFinish: () => setLoadingId(null),
        });
    };

    useEffect(() => {
        const kitchenChannel = window.Echo.channel('kitchen')
            .listen('.DishStatusUpdated', (e: any) => {
                router.reload({ preserveScroll: true });
                toast.info(`Dish Update: ${e.itemName} is ${e.status.toUpperCase()}`);
            });

        const reservationChannel = window.Echo.channel('reservations')
            .listen('.ReservationStatusUpdated', (e: any) => {
                router.reload({ preserveScroll: true });
                toast.warning('New Reservation/Order Updated!');
            });

        return () => {
            kitchenChannel.stopListening('.DishStatusUpdated');
            reservationChannel.stopListening('.ReservationStatusUpdated');
        };
    }, []);

    const OrderCard = ({ order, statusType = 'active' }: { order: any, statusType?: 'active' | 'history' | 'cancelled' }) => (
        <div key={order.id} className={`group relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl transition-all ${statusType === 'active' ? 'hover:border-orange-500/20' : 'opacity-70 scanline'}`}>
            {/* Order Type Ribbon */}
            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[8px] font-black uppercase tracking-widest ${order.order_type === 'delivery' ? 'bg-orange-500 text-black' : 'bg-blue-500 text-white'}`}>
                {order.order_type === 'pickup' ? 'Takeaway' : 'Delivery'}
            </div>

            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{order.order_number}</p>
                    <div className="flex items-center gap-1.5 text-orange-500/60 font-bold text-[10px]">
                        <Clock size={10} /> {order.time}
                    </div>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight leading-none">{order.customer_name}</h3>
                
                <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border-white/5 ${order.order_status === 'pending' ? 'bg-amber-500/20 text-amber-500' : (statusType === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40')}`}>
                        {order.order_status.replace(/_/g, ' ')}
                    </Badge>
                </div>
            </div>

            <div className="p-6 space-y-4 flex-1">
                <ul className="space-y-3">
                    {order.items.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-center text-sm font-medium">
                            <span className="text-white/60">
                                <span className={`${statusType === 'active' ? 'text-orange-500' : 'text-white/20'} font-black mr-2`}>{item.quantity}x</span>
                                {item.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Workflow Actions (Only for Active) */}
            {statusType === 'active' && (
                <div className="p-6 pt-0 mt-auto border-t border-white/5 bg-white/[0.01]">
                    <div className="pt-6">
                        {order.order_status === 'pending' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    onClick={() => handleAcceptOrder(order.id)}
                                    className="bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10 shadow-lg shadow-emerald-500/10"
                                    disabled={loadingId === `accept-${order.id}`}
                                >
                                    {loadingId === `accept-${order.id}` ? <Loader2 className="animate-spin" size={14}/> : 'Accept'}
                                </Button>
                                <Button 
                                    onClick={() => handleRejectOrder(order.id)}
                                    variant="outline"
                                    className="border-white/10 text-rose-500 font-black uppercase tracking-widest text-[9px] rounded-xl h-10 hover:bg-rose-500/10"
                                    disabled={loadingId === `reject-${order.id}`}
                                >
                                    {loadingId === `reject-${order.id}` ? <Loader2 className="animate-spin" size={14}/> : 'Reject'}
                                </Button>
                            </div>
                        )}

                        {order.order_status === 'waiting_for_payment' && (
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Waiting for Customer Payment</p>
                            </div>
                        )}

                        {order.order_status === 'preparing' && (
                            <div className="space-y-4">
                                {order.order_type === 'delivery' ? (
                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Assign Courier</label>
                                            <select 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white/60 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                                                value={selectedCourier[order.id] || ''}
                                                onChange={(e) => setSelectedCourier({...selectedCourier, [order.id]: e.target.value})}
                                            >
                                                <option value="">{order.courier || 'Pilih Kurir...'}</option>
                                                {couriers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <Button 
                                            onClick={() => updateOrderStatus(order.id, 'delivering')}
                                            className="w-full bg-orange-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10 shadow-lg shadow-orange-500/10"
                                            disabled={loadingId === `status-${order.id}`}
                                        >
                                            Send for Delivery
                                        </Button>
                                    </div>
                                ) : (
                                    <Button 
                                        onClick={() => updateOrderStatus(order.id, 'complete')}
                                        className="w-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10 shadow-lg shadow-emerald-500/10"
                                        disabled={loadingId === `status-${order.id}`}
                                    >
                                        Ready for Pickup
                                    </Button>
                                )}
                            </div>
                        )}

                        {order.order_status === 'delivering' && (
                            <Button 
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="w-full bg-orange-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10"
                                disabled={loadingId === `status-${order.id}`}
                            >
                                Confirm Delivered
                            </Button>
                        )}

                        {order.order_status === 'delivered' && (
                            <Button 
                                onClick={() => updateOrderStatus(order.id, 'complete')}
                                className="w-full bg-emerald-500 text-black font-black uppercase tracking-widest text-[9px] rounded-xl h-10"
                                disabled={loadingId === `status-${order.id}`}
                            >
                                Finalize Order
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Head title="Kitchen Display System - RestoWeb" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-white/95 flex items-center gap-3">
                            <ChefHat className="text-orange-500" size={36} />
                            Kitchen Display System
                        </h1>
                        <p className="mt-2 text-sm text-white/40 max-w-md uppercase tracking-widest font-black text-[9px]">
                            Real-time Kitchen & Online Order Management
                        </p>
                    </div>
                </div>

                {/* Section: ACTIVE ORDERS QUEUE */}
                <div className="mb-16">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-8 rounded-full bg-orange-500"></div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Active Orders Queue</h2>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">{online_active.length} ACTIVE</Badge>
                    </div>

                    {online_active.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {online_active.map((order: any) => (
                                <OrderCard key={order.id} order={order} statusType="active" />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 border border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-white/10 italic">No Active Online Orders</p>
                        </div>
                    )}
                </div>

                {/* MULTIPLE HISTORY SECTIONS */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Section: COMPLETED */}
                    <div>
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-6 rounded-full bg-emerald-500"></div>
                                <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Service History (Completed)</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {online_completed.length > 0 ? (
                                online_completed.map((order: any) => (
                                    <OrderCard key={order.id} order={order} statusType="history" />
                                ))
                            ) : (
                                <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] text-center">
                                    <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">History is Empty</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section: CANCELLED / REJECTED */}
                    <div>
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-1 w-6 rounded-full bg-rose-500"></div>
                                <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500/60">Cancelled & Rejected</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {online_cancelled.length > 0 ? (
                                online_cancelled.map((order: any) => (
                                    <OrderCard key={order.id} order={order} statusType="cancelled" />
                                ))
                            ) : (
                                <div className="p-8 border border-white/5 rounded-2xl bg-white/[0.01] text-center">
                                    <p className="text-[8px] font-black text-white/10 uppercase tracking-widest">No Cancelled Orders</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

KitchenIndex.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
