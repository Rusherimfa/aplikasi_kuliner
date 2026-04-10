import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, Lock, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';

import Navbar from '../welcome/sections/navbar';

export default function SimulatePayment() {
    const { auth, reservation } = usePage().props as any;
    const { clearCart } = useCart();
    
    const [isSimulating, setIsSimulating] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank' | 'ewallet'>('qris');

    const { post } = useForm();

    const handleSimulatePayment = () => {
        setIsSimulating(true);
        // Simulate waiting for bank confirmation randomly between 2-3 seconds
        setTimeout(() => {
            clearCart(); // Clear local storage cart once paid
            post(`/reservations/payment/${reservation.id}`);
        }, 2500);
    };

    return (
        <>
            <Head title={`Pembayaran #${reservation.id} - RestoWeb`} />

            <div className="flex min-h-screen flex-col bg-slate-50 font-['Inter',sans-serif] selection:bg-amber-100 selection:text-amber-900">
                <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

                <main className="flex-1 px-4 py-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        
                        <div className="mb-8">
                            <Link href="/reservations/history" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-amber-600 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Batal dan Kembali
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:grid sm:grid-cols-2">
                            {/* Left Side: Invoice Summary */}
                            <div className="bg-slate-900 p-8 text-white sm:p-12 relative overflow-hidden">
                                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-500 to-rose-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <ShieldCheck className="mb-6 h-12 w-12 text-amber-500" />
                                    <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl font-bold">Ringkasan Tagihan</h2>
                                    <p className="text-sm font-medium text-slate-400">Order ID: #{reservation.id}-RW-{new Date().getFullYear()}</p>
                                    
                                    <div className="mt-10 space-y-6">
                                        <div className="border-b border-white/10 pb-6">
                                            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Info Layanan</div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-300">Reservasi Meja ({reservation.resto_table?.name || 'Reguler'})</span>
                                                <span className="font-medium text-white">{reservation.date}</span>
                                            </div>
                                            <div className="mt-2 flex justify-between">
                                                <span className="text-slate-300">Atas Nama</span>
                                                <span className="font-medium text-white">{reservation.customer_name}</span>
                                            </div>
                                        </div>

                                        <div className="border-b border-white/10 pb-6">
                                            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Makanan dipesan ({reservation.menus?.length} Item)</div>
                                            {reservation.menus?.map((m: any) => (
                                                <div key={m.id} className="mt-2 flex justify-between text-sm">
                                                    <span className="text-slate-400">{m.pivot.quantity}x {m.name}</span>
                                                </div>
                                            ))}
                                            {(!reservation.menus || reservation.menus.length === 0) && (
                                                <div className="text-sm italic text-slate-500">Hanya memesan meja (Tanpa Pre-order makanan)</div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/10">
                                                <span className="text-lg font-medium text-white">Wajib DP Sekarang</span>
                                                <span className="text-2xl font-bold tracking-tight text-amber-400">
                                                    Rp {Number(reservation.booking_fee).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-center text-xs text-slate-500">Sisa pembayaran makanan akan ditagih di kasir restoran sesudah Anda selesai makan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Virtual Payment Gateway */}
                            <div className="p-8 sm:p-12">
                                <h3 className="mb-6 text-xl font-bold text-slate-900">Pilih Metode Pembayaran</h3>
                                
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => setPaymentMethod('ewallet')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'ewallet' ? 'border-amber-500 bg-amber-50 shadow-md ring-1 ring-amber-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'ewallet' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">E-Wallet</p>
                                                <p className="text-xs text-slate-500">GoPay, OVO, Dana, ShopeePay</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'ewallet' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                            {paymentMethod === 'ewallet' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'qris' ? 'border-amber-500 bg-amber-50 shadow-md ring-1 ring-amber-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'qris' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <QrCode size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">QRIS PanduPay</p>
                                                <p className="text-xs text-slate-500">Scan QR Code Otomatis</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'qris' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                            {paymentMethod === 'qris' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'bank' ? 'border-amber-500 bg-amber-50 shadow-md ring-1 ring-amber-500' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'bank' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900">Transfer Bank Virtual Account</p>
                                                <p className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                                            {paymentMethod === 'bank' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>
                                </div>

                                <div className="my-8 rounded-2xl bg-slate-50 p-6 text-center border border-slate-100">
                                    <Lock className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                                    <p className="text-sm font-medium text-slate-900">Ini adalah Simulasi Payment Gateway.</p>
                                    <p className="text-xs text-slate-500 mt-1">Uang Anda aman. Tidak ada saldo asli yang dipotong.</p>
                                </div>

                                <Button
                                    onClick={handleSimulatePayment}
                                    disabled={isSimulating}
                                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-900 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-800 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isSimulating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                            <span>Mengecek Saldo...</span>
                                        </div>
                                    ) : (
                                        <>
                                            Bayar MuraPay Rp {Number(reservation.booking_fee).toLocaleString('id-ID')}
                                            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
