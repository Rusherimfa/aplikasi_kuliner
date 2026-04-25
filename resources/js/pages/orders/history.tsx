import { Head, Link } from '@inertiajs/react';
import Navbar from '@/pages/welcome/sections/navbar';
import Footer from '@/pages/welcome/sections/footer';
import { Button } from '@/components/ui/button';
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
    X,
    Truck,
    Store
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BoutiqueChat from '@/components/app/boutique-chat';
import { MessageCircle } from 'lucide-react';

export default function OrderHistory({ auth, orders }: any) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [activeChatOrderId, setActiveChatOrderId] = useState<number | null>(null);

    const handleCancel = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
            router.patch(`/orders/${id}/cancel`);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus riwayat pesanan yang dibatalkan ini?')) {
            router.delete(`/orders/${id}`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string, icon: any }> = {
            'pending': { label: 'Menunggu Konfirmasi', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: Clock3 },
            'confirmed': { label: 'Dikonfirmasi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
            'cancelled': { label: 'Dibatalkan', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: XCircle },
            'waiting_for_payment': { label: 'Menunggu Pembayaran', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]', icon: CreditCard },
            'preparing': { label: 'Sedang Disiapkan', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: ChefHat },
            'delivering': { label: 'Dalam Pengiriman', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: ShoppingBag },
            'delivered': { label: 'Telah Sampai', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
            'complete': { label: 'Selesai', color: 'bg-white/5 text-white/40 border-white/10', icon: CheckCircle2 },
        };
        const config = variants[status] || variants.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} px-3 py-1 text-[10px] font-black uppercase tracking-wider`}>
                <Icon size={10} /> {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 selection:bg-sky-500/30 overflow-hidden">
            <Head title="Check Your Order â€” Ocean's Resto" />
            
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-600/5 blur-[120px]" />

            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-1 w-8 rounded-full bg-sky-500" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">Food Tracker</span>
                            </div>
                            <h1 className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter">
                                My <span className="italic font-serif opacity-40 text-sky-500">Orders</span>
                            </h1>
                            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-neutral-500 max-w-lg">
                                Pantau riwayat pemesanan makanan Anda dan cek status pesanan terkini.
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
                                <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-2">
                                    <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-10 text-slate-300 dark:text-neutral-800">
                                        <ShoppingBag size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 italic font-serif">
                                        Belum Ada Pesanan
                                    </h3>
                                    <p className="text-slate-500 dark:text-neutral-500 font-medium mb-12 max-w-sm text-center">
                                        Menu-menu estetik kami sudah menanti. Yuk eksplorasi Ocean's Resto!
                                    </p>
                                    <Link href="/catalog">
                                        <Button className="h-14 rounded-2xl px-10 bg-sky-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-sky-500/10">
                                            Kembali ke Galeri <ArrowRight size={18} className="ml-3" />
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
                                        <div className="glass-card flex flex-col md:flex-row gap-8 p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-3xl shadow-3xl hover:border-sky-500/30 transition-all duration-700">
                                            {/* Left Info */}
                                            <div className="flex-1 space-y-8">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    {getStatusBadge(o.order_status)}
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.3em]">#{o.order_number}</span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-100 dark:bg-white/5 ${o.payment_status === 'paid' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                        {o.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <h3 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-500 transition-colors">
                                                        Rp {Number(o.total_price).toLocaleString('id-ID')}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 dark:text-neutral-400">
                                                        <span className="flex items-center gap-2.5"><Receipt size={16} className="text-sky-500" /> {o.order_type === 'delivery' ? 'Delivery' : 'Ambil di Tempat'}</span>
                                                        <span className="flex items-center gap-2.5"><Clock size={16} className="text-sky-500" /> {new Date(o.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                    </div>
                                                </div>

                                                {/* Menus List */}
                                                {o.items && o.items.length > 0 && (
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">Order Details</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {o.items.map((item: any) => (
                                                                <div key={item.id} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-sky-500/5 dark:bg-white/5 border border-sky-500/10 dark:border-white/10">
                                                                    <div className="flex items-center gap-3">
                                                                        <Utensils size={14} className="text-sky-500" /> 
                                                                        <span className="text-xs font-bold text-slate-700 dark:text-white/80">{item.menu?.name || 'Menu Terhapus'}</span>
                                                                    </div>
                                                                    <div className="text-xs font-black text-slate-400 dark:text-white/40">
                                                                        x{item.quantity}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Actions */}
                                            <div className="md:w-72 flex flex-col justify-center gap-4 md:pl-12 md:border-l border-slate-200 dark:border-white/5">
                                                
                                                <Button 
                                                    onClick={() => setSelectedOrder(o)}
                                                    className={`w-full h-14 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all ${
                                                        ['waiting_for_payment', 'delivering'].includes(o.order_status) 
                                                            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/10'
                                                            : 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl'
                                                    }`}
                                                >
                                                    Order Details
                                                </Button>

                                                {o.order_status === 'waiting_for_payment' && (
                                                    <Link href={`/orders/payment/${o.id}`} className="w-full">
                                                        <Button className="w-full h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                                                            Panduan Pembayaran <ArrowRight size={16} className="ml-2" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                
                                                {o.order_status === 'delivering' && (
                                                    <Link href={`/orders/${o.id}/track`} className="w-full">
                                                        <Button className="w-full h-14 bg-cyan-500 text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                                                            Track Delivery <ArrowRight size={16} className="ml-2" />
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Pembatalan Pesanan / Cancel */}
                                                {['pending', 'waiting_for_payment'].includes(o.order_status) && o.payment_status === 'unpaid' && (
                                                    <button onClick={() => handleCancel(o.id)} className="w-full mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors text-center">
                                                        Batalkan Pesanan
                                                    </button>
                                                )}

                                                {o.order_status === 'preparing' && (
                                                    <div className="w-full h-14 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest">
                                                        <ChefHat size={16} className="mr-2" /> Chef is Cooking...
                                                    </div>
                                                )}

                                                {o.order_status === 'cancelled' && (
                                                    <Button onClick={() => handleDelete(o.id)} className="w-full h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-[1.02] transition-all">
                                                        Hapus Riwayat <Trash2 size={16} className="ml-2" />
                                                    </Button>
                                                )}
                                                <Button 
                                                    onClick={() => setActiveChatOrderId(activeChatOrderId === o.id ? null : o.id)}
                                                    variant="outline"
                                                    className={`w-full h-14 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all mt-2 shadow-sm ${
                                                        activeChatOrderId === o.id 
                                                            ? 'bg-sky-500 text-white border-sky-500' 
                                                            : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-sky-50 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-white'
                                                    }`}
                                                >
                                                    <MessageCircle size={16} className="mr-2" /> 
                                                    {o.courier_id ? 'Chat with Courier' : 'Chat with Staff'}
                                                </Button>
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
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-md md:max-w-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-[2rem] md:rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    {selectedOrder && (
                        <div className="flex flex-col h-[80vh] md:h-auto">
                            <div className="p-8 md:p-10 !pb-6 border-b border-slate-100 dark:border-white/5 relative bg-slate-50/50 dark:bg-zinc-950/50">
                                <DialogTitle className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    Detail <span className="italic font-serif opacity-40 text-sky-500">Pesanan</span>
                                </DialogTitle>
                                <DialogDescription className="mt-2 text-sm font-medium text-slate-500 dark:text-neutral-500">
                                    Order ID: #{selectedOrder.order_number}
                                </DialogDescription>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8">
                                <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-1">Customer</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-1">Contact</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedOrder.customer_phone || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-1">Order Type</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {selectedOrder.order_type === 'delivery' ? <><Truck size={14} className="text-sky-500" /> Delivery</> : <><Store size={14} className="text-sky-500"/> Ambil di Tempat</>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-1">Time</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
                                            {new Date(selectedOrder.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-4">Items</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl">
                                                <div className="flex gap-4 items-center">
                                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                                                        <Utensils size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.menu?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900 dark:text-white">x{item.quantity}</p>
                                                    <p className="text-xs font-medium text-slate-500">Rp {Number(item.total_price).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="border-t border-slate-200 dark:border-white/10 pt-6">
                                    <div className="flex items-end justify-between bg-sky-500/5 px-6 py-5 rounded-3xl border border-sky-500/20">
                                        <div>
                                            <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.3em] mb-1">Payment Total</p>
                                            <p className={`text-xs font-black uppercase tracking-widest ${selectedOrder.payment_status === 'paid' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                {selectedOrder.payment_status}
                                            </p>
                                        </div>
                                        <p className="text-2xl font-black tracking-tighter text-sky-500">
                                            Rp {Number(selectedOrder.total_price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Live Chat for Orders */}
            {activeChatOrderId && (
                <BoutiqueChat orderId={activeChatOrderId} currentUser={auth.user} />
            )}

            <Footer />
        </div>
    );
}

