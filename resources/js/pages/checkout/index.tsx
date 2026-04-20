import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    ArrowLeft, 
    CheckCircle2, 
    ChevronRight, 
    CreditCard, 
    UtensilsCrossed, 
    ShoppingBag, 
    Truck, 
    Store, 
    Wallet, 
    Sparkles, 
    ArrowRight,
    Utensils,
    Clock,
    MapPin,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';

export default function CheckoutIndex() {
    const { items, cartTotal, clearCart } = useCart();
    const { auth, flash } = usePage().props as any;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
    const [formData, setFormData] = useState({
        customer_name: auth?.user?.name || '',
        customer_email: auth?.user?.email || '',
        customer_phone: auth?.user?.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post('/orders/checkout', {
            ...formData,
            order_type: orderType,
            items: items,
            cart_total: cartTotal,
        }, {
            onSuccess: () => {
                clearCart();
            },
            onFinish: () => setIsSubmitting(false),
        });
    };



    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 overflow-hidden relative">
            <Head title="Checkout — Gastronomy Suite" />
            
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-orange-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-[120px]" />

            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Link href="/catalog" className="hover:text-orange-500 transition-colors">The Gallery</Link>
                        <ChevronRight size={14} className="opacity-20" />
                        <span className="text-orange-500">Secure Order</span>
                    </div>

                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1 w-8 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Secure Transaction</span>
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter">
                            Order <span className="italic font-serif opacity-40 text-orange-500">Suite</span>
                        </h1>
                        <p className="mt-4 text-lg font-medium text-slate-500 dark:text-neutral-500 max-w-lg">
                            Lengkapi detail di bawah ini untuk mengunci pesanan kuliner Anda malam ini.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-12">
                            <form onSubmit={handleSubmit} className="space-y-12">
                                {/* Identity */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-10 md:p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-3xl backdrop-blur-3xl"
                                >
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight mb-10 flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-sm">01</div>
                                        Identity
                                    </h2>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] ml-2">Full Name</label>
                                            <Input required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} placeholder="Masukkan nama Anda" className="h-16 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-lg font-bold px-6 focus:ring-orange-500/20" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] ml-2">Email Address</label>
                                                <Input required value={formData.customer_email} onChange={(e) => setFormData({...formData, customer_email: e.target.value})} type="email" placeholder="contoh@email.com" className="h-16 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-lg font-bold px-6 focus:ring-orange-500/20" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] ml-2">WhatsApp Contact</label>
                                                <Input required value={formData.customer_phone} onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} type="tel" placeholder="+62 8..." className="h-16 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-lg font-bold px-6 focus:ring-orange-500/20" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Experience Mode */}
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="p-10 md:p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-3xl backdrop-blur-3xl"
                                >
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight mb-10 flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-sm">02</div>
                                        Experience Mode
                                    </h2>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label 
                                            onClick={() => setOrderType('delivery')}
                                            className={`cursor-pointer relative rounded-[2.5rem] border-2 p-8 transition-all duration-500 ${orderType === 'delivery' ? 'border-orange-500 bg-orange-500/5 shadow-2xl shadow-orange-500/10' : 'border-slate-200 dark:border-white/10 hover:border-orange-500/30'}`}
                                        >
                                            <input type="radio" name="orderType" className="sr-only" defaultChecked />
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${orderType === 'delivery' ? 'bg-orange-500 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                                                    <Truck size={24} />
                                                </div>
                                                {orderType === 'delivery' && <CheckCircle2 size={24} className="text-orange-500" />}
                                            </div>
                                            <div className={`font-black uppercase tracking-widest text-xs ${orderType === 'delivery' ? 'text-orange-500' : 'text-slate-400'}`}>Delivery</div>
                                            <div className="text-sm font-medium text-slate-500 dark:text-neutral-500 mt-2">Pesanan akan diantarkan langsung ke lokasi Anda.</div>
                                        </label>

                                        <label 
                                            onClick={() => setOrderType('pickup')}
                                            className={`cursor-pointer relative rounded-[2.5rem] border-2 p-8 transition-all duration-500 ${orderType === 'pickup' ? 'border-orange-500 bg-orange-500/5 shadow-2xl shadow-orange-500/10' : 'border-slate-200 dark:border-white/10 hover:border-orange-500/30'}`}
                                        >
                                            <input type="radio" name="orderType" className="sr-only" />
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${orderType === 'pickup' ? 'bg-orange-500 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                                                    <Store size={24} />
                                                </div>
                                                {orderType === 'pickup' && <CheckCircle2 size={24} className="text-orange-500" />}
                                            </div>
                                            <div className={`font-black uppercase tracking-widest text-xs ${orderType === 'pickup' ? 'text-orange-500' : 'text-slate-400'}`}>Ambil Di Tempat</div>
                                            <div className="text-sm font-medium text-slate-500 dark:text-neutral-500 mt-2">Ambil pesanan Anda langsung dari cabang kami tanpa antri.</div>
                                        </label>
                                    </div>
                                </motion.div>



                                <div className="lg:hidden">
                                    <Button disabled={isSubmitting || items.length === 0} type="submit" className="w-full h-18 rounded-[2rem] bg-orange-500 text-black font-black uppercase tracking-widest shadow-2xl shadow-orange-500/20 hover:bg-white hover:scale-[1.02] transition-all">
                                        {isSubmitting ? 'Memproses...' : `Confirm Order Rp ${cartTotal.toLocaleString('id-ID')}`}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5 xl:col-span-4 sticky top-32">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl ring-1 ring-white/5"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black font-['Playfair_Display',serif] text-slate-900 dark:text-white tracking-tight">
                                        Gastronomy <span className="italic opacity-40 text-orange-500 text-3xl block">Log</span>
                                    </h3>
                                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 font-black text-xs">
                                        {items.length}
                                    </div>
                                </div>

                                {items.length > 0 ? (
                                    <ul className="space-y-6 mb-10">
                                        {items.map(item => (
                                            <li key={item.id} className="flex justify-between items-start group">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight leading-tight group-hover:text-orange-500 transition-colors">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[.2em] italic">Quantity: {item.quantity}</p>
                                                </div>
                                                <span className="font-black text-white italic text-sm whitespace-nowrap">
                                                    {Number(item.price * item.quantity).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                 ) : (
                                    <div className="py-20 text-center rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.01] mb-10">
                                        <ShoppingBag size={48} className="mx-auto text-white/10 mb-6" />
                                        <p className="text-sm font-medium text-white/20 italic">Keranjang Anda sedang hampa.</p>
                                        <Link href="/catalog" className="inline-flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest mt-6 hover:text-white transition-colors">
                                            Return to Menu <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                )}
                                
                                <div className="space-y-4 pt-10 border-t border-white/5">
                                    <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white/60">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                        <span>Tax & Service (15%)</span>
                                        <span className="text-white/60">Rp {(cartTotal * 0.15).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-8 mt-4 border-t border-white/10">
                                        <div className="text-left space-y-1">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Total Experience</span>
                                            <p className="text-orange-500 font-serif italic text-sm">Fine Dining Value</p>
                                        </div>
                                        <span className="text-4xl font-black text-white tracking-tighter">
                                            Rp {(cartTotal * 1.15).toLocaleString('id-ID', { minimumFractionDigits: 0, useGrouping: true }).split(',')[0]}
                                        </span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting || items.length === 0} 
                                    className="hidden lg:flex w-full mt-12 h-18 rounded-[2rem] bg-orange-500 text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-orange-500/20 hover:bg-white hover:scale-[1.02] transition-all disabled:opacity-20 flex items-center justify-center gap-3 py-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={20} />
                                            Confirm Order
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
