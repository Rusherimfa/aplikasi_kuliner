import { Head, router } from '@inertiajs/react';
import RestoAdminLayout from '@/layouts/resto-admin-layout';
import { ChefHat, Clock, CheckCircle2, PlayCircle, Loader2, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function KitchenIndex({ orders }: any) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const updateStatus = (pivotId: number, status: string, itemName: string) => {
        setLoadingId(pivotId);
        router.patch(route('kitchen.item.update', pivotId), { status }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Dish "${itemName}" is now ${status.toUpperCase()}`);
            },
            onFinish: () => setLoadingId(null),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
            case 'ready': return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
            case 'served': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'preparing': return <Loader2 size={14} className="animate-spin" />;
            case 'ready': return <CheckCircle2 size={14} />;
            case 'served': return <UtensilsCrossed size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <>
            <Head title="Kitchen Display System - RestoWeb" />

            <div className="mx-auto max-w-7xl font-sans text-white pb-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-white/95 flex items-center gap-3">
                            <ChefHat className="text-amber-500" size={36} />
                            Kitchen Display System
                        </h1>
                        <p className="mt-2 text-sm text-white/40 max-w-md">
                            Kelola antrean masakan dan koordinasi dapur secara efisien.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 rounded-full px-4 py-2 border border-white/10 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-white/60">Live Updates Active</span>
                        </div>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order: any) => (
                            <div key={order.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col shadow-2xl backdrop-blur-md">
                                {/* Order Header */}
                                <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-xl text-white/95 leading-none mb-1">{order.table}</h3>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{order.customer_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="bg-white/5 text-amber-500 border-amber-500/20 px-2 py-0.5">
                                            {order.time}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="flex-1 p-5 space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.pivot_id} className="group border border-white/5 bg-white/[0.01] rounded-xl p-4 transition-all hover:bg-white/[0.03]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex gap-3">
                                                    <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-sm">
                                                        {item.quantity}x
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white/90 leading-none mb-1">{item.name}</p>
                                                        {item.notes && (
                                                            <p className="text-[10px] text-rose-400 font-medium italic mt-1 flex items-center gap-1">
                                                                <AlertCircle size={10} /> {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge className={`text-[10px] uppercase tracking-tighter ${getStatusColor(item.status)}`}>
                                                    <span className="flex items-center gap-1">
                                                        {getStatusIcon(item.status)}
                                                        {item.status}
                                                    </span>
                                                </Badge>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {item.status === 'pending' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="col-span-3 h-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/10 text-[10px] font-bold uppercase tracking-wider"
                                                        onClick={() => updateStatus(item.pivot_id, 'preparing', item.name)}
                                                        disabled={loadingId === item.pivot_id}
                                                    >
                                                        {loadingId === item.pivot_id ? <Loader2 className="animate-spin mr-2" size={12}/> : <PlayCircle className="mr-2" size={12} />}
                                                        Mulai Masak
                                                    </Button>
                                                )}
                                                
                                                {item.status === 'preparing' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="col-span-3 h-8 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/10 text-[10px] font-bold uppercase tracking-wider"
                                                        onClick={() => updateStatus(item.pivot_id, 'ready', item.name)}
                                                        disabled={loadingId === item.pivot_id}
                                                    >
                                                        {loadingId === item.pivot_id ? <Loader2 className="animate-spin mr-2" size={12}/> : <CheckCircle2 className="mr-2" size={12} />}
                                                        Siap Saji
                                                    </Button>
                                                )}

                                                {item.status === 'ready' && (
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="col-span-3 h-8 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/10 text-[10px] font-bold uppercase tracking-wider"
                                                        onClick={() => updateStatus(item.pivot_id, 'served', item.name)}
                                                        disabled={loadingId === item.pivot_id}
                                                    >
                                                        {loadingId === item.pivot_id ? <Loader2 className="animate-spin mr-2" size={12}/> : <UtensilsCrossed className="mr-2" size={12} />}
                                                        Sudah Disajikan
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <UtensilsCrossed size={40} className="text-white/20" />
                        </div>
                        <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-white/40 italic">Dapur Hening...</h3>
                        <p className="text-sm text-white/20 mt-2 tracking-wide">Semua pesanan telah disajikan dengan sempurna.</p>
                    </div>
                )}
            </div>
        </>
    );
}

KitchenIndex.layout = (page: React.ReactNode) => <RestoAdminLayout>{page}</RestoAdminLayout>;
