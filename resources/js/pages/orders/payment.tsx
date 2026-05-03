import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, Lock, QrCode, ShieldCheck, Wallet, Landmark, Smartphone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';

import Navbar from '../welcome/sections/navbar';

export default function OrderPayment() {
    const { auth, order } = usePage().props as any;
    const { clearCart } = useCart();
    
    const [isSimulating, setIsSimulating] = useState(false);

    const { post } = useForm();

    const handlePayment = async () => {
        setIsSimulating(true);

        try {
            const response = await fetch(`/orders/payment/${order.id}/refresh`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content || '',
                    'Accept': 'application/json',
                }
            });
            
            const data = await response.json();
            
            if (!data.snap_token) {
                alert('Gagal memperbarui token pembayaran. Silakan coba lagi.');
                setIsSimulating(false);
                return;
            }

            (window as any).snap.pay(data.snap_token, {
                onSuccess: function(result: any) {
                    clearCart();
                    post(`/orders/payment/${order.id}`);
                },
                onPending: function(result: any) {
                    setIsSimulating(false);
                },
                onError: function(result: any) {
                    alert("Pembayaran gagal!");
                    setIsSimulating(false);
                },
                onClose: function() {
                    setIsSimulating(false);
                }
            });
        } catch (error) {
            console.error('Payment Refresh Error:', error);
            setIsSimulating(false);
            alert('Terjadi kesalahan saat memproses pembayaran.');
        }
    };

    const handleBypassPayment = () => {
        setIsSimulating(true);
        setTimeout(() => {
            clearCart();
            post(`/orders/payment/${order.id}`);
        }, 1000);
    };

    return (
        <>
            <Head title={`Secure Payment — Ocean's Resto`} />

            <div className="flex min-h-screen flex-col bg-[#050506] font-sans selection:bg-sky-500/30 selection:text-sky-200 transition-colors duration-500 overflow-hidden relative">
                {/* Dynamic Background Elements */}
                <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px] animate-pulse" />
                <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                
                <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

                <main className="flex-1 px-4 py-24 sm:px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-5xl">
                        
                        <div className="mb-10 flex items-center justify-between">
                            <Link 
                                href="/orders/history" 
                                className="group flex items-center text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
                            >
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 transition-all group-hover:bg-white/10 group-hover:border-white/20">
                                    <ArrowLeft size={14} />
                                </div>
                                {('Batal & Kembali')}
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Secure Checkout Active</span>
                            </div>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-12">
                            {/* Left: Invoice Detailed View */}
                            <div className="lg:col-span-7">
                                <div className="relative h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-8 sm:p-10 shadow-2xl">
                                    <div className="relative z-10">
                                        <div className="mb-12 flex items-center justify-between">
                                            <div>
                                                <h1 className="font-['Playfair_Display',serif] text-4xl font-bold tracking-tight text-white mb-2">Checkout</h1>
                                                <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">Invoice #{order.order_number}</p>
                                            </div>
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-[1px]">
                                                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#050506]">
                                                    <Zap className="text-sky-500" size={24} fill="currentColor" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Items Section */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">Menu Items</h3>
                                                <div className="max-h-[300px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                                                    {order.items?.map((item: any) => (
                                                        <div key={item.id} className="flex items-center justify-between group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-sky-500/30 transition-all">
                                                                    <span className="text-sm font-black text-sky-500">{item.quantity}x</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{item.menu?.name}</p>
                                                                    <p className="text-[10px] text-white/30 font-medium">Rp {Number(item.unit_price).toLocaleString('id-ID')}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm font-black text-white/80">Rp {Number(item.unit_price * item.quantity).toLocaleString('id-ID')}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Customer</p>
                                                    <p className="text-sm font-bold text-white/90">{order.customer_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Service Type</p>
                                                    <p className="text-sm font-bold text-white/90">{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                                                </div>
                                            </div>

                                            {/* Summary Section */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-white/40">Subtotal</span>
                                                    <span className="text-white/80 font-black">Rp {Number(order.subtotal).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-white/40">Tax (PB1 10%)</span>
                                                    <span className="text-white/80 font-black">Rp {Number(order.tax_amount).toLocaleString('id-ID')}</span>
                                                </div>
                                                {order.delivery_fee > 0 && (
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className="text-white/40">Delivery Fee</span>
                                                        <span className="text-white/80 font-black">Rp {Number(order.delivery_fee).toLocaleString('id-ID')}</span>
                                                    </div>
                                                )}
                                                <div className="mt-6 flex items-center justify-between rounded-3xl bg-sky-500/10 border border-sky-500/20 p-6 shadow-xl shadow-sky-500/5">
                                                    <span className="text-sm font-black uppercase tracking-widest text-sky-500/80">Total Payable</span>
                                                    <span className="text-3xl font-black tracking-tight text-white">
                                                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Payment Action Card */}
                            <div className="lg:col-span-5">
                                <div className="sticky top-32 space-y-6">
                                    <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-1 shadow-2xl">
                                        <div className="rounded-[2.4rem] bg-gradient-to-b from-white/[0.08] to-transparent p-8 sm:p-10">
                                            <div className="mb-10 text-center">
                                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 text-sky-500 shadow-inner ring-1 ring-sky-500/20">
                                                    <ShieldCheck size={40} className="animate-pulse" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white mb-2">Final Step</h2>
                                                <p className="text-xs font-medium text-white/40 leading-relaxed max-w-[240px] mx-auto">
                                                    Proceed to Midtrans secure gateway to complete your transaction.
                                                </p>
                                            </div>

                                            <Button
                                                onClick={handlePayment}
                                                disabled={isSimulating}
                                                className="group relative flex h-20 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-sky-500 px-8 py-0 text-lg font-black text-black shadow-2xl shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                                
                                                {isSimulating ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-black/20 border-t-black"></div>
                                                        <span className="uppercase tracking-widest">Processing</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="uppercase tracking-widest">Pay Now</span>
                                                        <ChevronRight size={24} className="transition-transform group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </Button>

                                            <Button
                                                onClick={handleBypassPayment}
                                                disabled={isSimulating}
                                                variant="outline"
                                                className="mt-4 w-full h-14 rounded-2xl border-white/10 bg-transparent text-white/40 font-bold tracking-widest hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                BYPASS (UJI COBA)
                                            </Button>

                                            <div className="mt-12 space-y-6">
                                                <div className="flex items-center justify-center gap-4">
                                                    <div className="h-[1px] flex-1 bg-white/5" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Certified Secure</span>
                                                    <div className="h-[1px] flex-1 bg-white/5" />
                                                </div>

                                                <div className="grid grid-cols-4 gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <QrCode size={20} className="text-sky-400" />
                                                        <span className="text-[7px] font-black uppercase tracking-tighter">QRIS</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Wallet size={20} className="text-emerald-400" />
                                                        <span className="text-[7px] font-black uppercase tracking-tighter">E-Wallet</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Landmark size={20} className="text-indigo-400" />
                                                        <span className="text-[7px] font-black uppercase tracking-tighter">Bank</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Smartphone size={20} className="text-rose-400" />
                                                        <span className="text-[7px] font-black uppercase tracking-tighter">OVO/GOPAY</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Security Note */}
                                    <div className="flex items-start gap-4 p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02]">
                                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                                            <CheckCircle2 size={12} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-emerald-500/80 mb-1">Encrypted Gateway</p>
                                            <p className="text-[10px] leading-relaxed text-white/30">Your financial data is protected by industry-standard encryption protocols (PCI-DSS).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </>
    );
}


