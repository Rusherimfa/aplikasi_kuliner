import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, Lock, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useTranslations } from '@/hooks/use-translations';

import Navbar from '../welcome/sections/navbar';

export default function SimulatePayment() {
    const { __, locale } = useTranslations();
    const { auth, reservation } = usePage().props as any;
    const { clearCart } = useCart();
    
    const [isSimulating, setIsSimulating] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank' | 'ewallet'>('qris');

    const { post } = useForm();

    const handlePayment = () => {
        if (!reservation.midtrans_snap_token) {
            alert(__('Token pembayaran tidak ditemukan. Silakan hubungi admin.'));
            return;
        }

        setIsSimulating(true);

        (window as any).snap.pay(reservation.midtrans_snap_token, {
            onSuccess: function(result: any) {
                clearCart();
                post(`/reservations/payment/${reservation.id}`);
            },
            onPending: function(result: any) {
                alert(__("Menunggu pembayaran Anda!"));
                setIsSimulating(false);
            },
            onError: function(result: any) {
                alert(__("Pembayaran gagal!"));
                setIsSimulating(false);
            },
            onClose: function() {
                setIsSimulating(false);
            }
        });
    };

    return (
        <>
            <Head title={`${__('Pembayaran')} #${reservation.id} - Ocean's Resto`} />

            <div className="flex min-h-screen flex-col bg-background font-['Inter',sans-serif] selection:bg-sky-100 selection:text-sky-900 transition-colors duration-500">
                <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

                <main className="flex-1 px-4 py-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        
                        <div className="mb-8">
                            <Link href="/reservations/history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-sky-600 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> {__('Batal dan Kembali')}
                            </Link>
                        </div>

                        <div className="overflow-hidden rounded-3xl bg-white dark:bg-card shadow-2xl ring-1 ring-slate-200 dark:ring-border/5 sm:grid sm:grid-cols-2">
                            {/* Left Side: Invoice Summary */}
                            <div className="bg-zinc-950 p-8 text-white sm:p-12 relative overflow-hidden">
                                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-sky-500 to-rose-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <ShieldCheck className="mb-6 h-12 w-12 text-sky-500" />
                                    <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl font-bold">{__('Ringkasan Tagihan')}</h2>
                                    <p className="text-sm font-medium text-zinc-400">Order ID: #{reservation.id}-RW-{new Date().getFullYear()}</p>
                                    
                                    <div className="mt-10 space-y-6">
                                        <div className="border-b border-white/10 pb-6">
                                            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">{__('Info Layanan')}</div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-300">{__('Reservasi Meja')} ({reservation.resto_table?.name || __('Reguler')})</span>
                                                <span className="font-medium text-white">{reservation.date}</span>
                                            </div>
                                            <div className="mt-2 flex justify-between">
                                                <span className="text-zinc-300">{__('Atas Nama')}</span>
                                                <span className="font-medium text-white">{reservation.customer_name}</span>
                                            </div>
                                        </div>

                                        <div className="border-b border-white/10 pb-6">
                                            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">{__('Makanan dipesan')} ({reservation.menus?.length} {__('Item')})</div>
                                            {reservation.menus?.map((m: any) => (
                                                <div key={m.id} className="mt-2 flex justify-between text-sm">
                                                    <span className="text-zinc-400">{m.pivot.quantity}x {m.name}</span>
                                                </div>
                                            ))}
                                            {(!reservation.menus || reservation.menus.length === 0) && (
                                                <div className="text-sm italic text-zinc-500">{__('Hanya memesan meja (Tanpa Pre-order makanan)')}</div>
                                            )}
                                        </div>

                                        <div className="pt-2 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400">{__('Subtotal (Komitmen Meja)')}</span>
                                                <span className="text-white font-medium">Rp {Number(reservation.subtotal).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400">{__('Pajak (PB1 10%)')}</span>
                                                <span className="text-white font-medium">Rp {Number(reservation.tax_amount).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
                                                <span className="text-lg font-medium text-white">{__('Wajib DP Sekarang')}</span>
                                                <span className="text-2xl font-bold tracking-tight text-sky-400">
                                                    Rp {Number(reservation.total_after_discount).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-center text-xs text-zinc-500">{__('Sisa pembayaran makanan akan ditagih di kasir restoran sesudah Anda selesai makan.')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Virtual Payment Gateway */}
                            <div className="p-8 sm:p-12">

                                
                                <div className="space-y-4 text-center py-8">
                                    <div className="mx-auto w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-500 mb-4">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <h4 className="text-xl font-bold dark:text-white">{__('Pembayaran Aman')}</h4>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                        {__('Klik tombol di bawah untuk melanjutkan ke gerbang pembayaran aman Midtrans. Anda dapat memilih QRIS, GoPay, OVO, atau Transfer Bank di sana.')}
                                    </p>
                                </div>
                                <div className="hidden">                                        onClick={() => setPaymentMethod('ewallet')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'ewallet' ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500' : 'border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-accent/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'ewallet' ? 'bg-sky-500/20 text-sky-500' : 'bg-slate-100 dark:bg-muted text-slate-400 dark:text-muted-foreground'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900 dark:text-foreground">{__('E-Wallet')}</p>
                                                <p className="text-xs text-slate-500 dark:text-muted-foreground">GoPay, OVO, Dana, ShopeePay</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'ewallet' ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-border'}`}>
                                            {paymentMethod === 'ewallet' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>

                                     <button 
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'qris' ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500' : 'border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-accent/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'qris' ? 'bg-sky-500/20 text-sky-500' : 'bg-slate-100 dark:bg-muted text-slate-400 dark:text-muted-foreground'}`}>
                                                <QrCode size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900 dark:text-foreground">{__('QRIS PanduPay')}</p>
                                                <p className="text-xs text-slate-500 dark:text-muted-foreground">{__('Scan QR Code Otomatis')}</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'qris' ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-border'}`}>
                                            {paymentMethod === 'qris' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>

                                     <button 
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`w-full flex items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === 'bank' ? 'border-sky-500 bg-sky-500/10 shadow-md ring-1 ring-sky-500' : 'border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 dark:hover:bg-accent/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === 'bank' ? 'bg-sky-500/20 text-sky-500' : 'bg-slate-100 dark:bg-muted text-slate-400 dark:text-muted-foreground'}`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-900 dark:text-foreground">{__('Transfer Bank Virtual Account')}</p>
                                                <p className="text-xs text-slate-500 dark:text-muted-foreground">BCA, Mandiri, BNI, BRI</p>
                                            </div>
                                        </div>
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${paymentMethod === 'bank' ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-border'}`}>
                                            {paymentMethod === 'bank' && <div className="h-2 w-2 rounded-full bg-white"></div>}
                                        </div>
                                    </button>
                                </div>
                                </div>



                                <Button
                                    onClick={handlePayment}
                                    disabled={isSimulating}
                                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-foreground text-base font-semibold text-white dark:text-background shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-black dark:hover:bg-foreground/90 disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {isSimulating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                            <span>{__('Memproses Pembayaran...')}</span>
                                        </div>
                                    ) : (
                                        <>
                                            {__('Bayar Sekarang')} Rp {Number(reservation.total_after_discount).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
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

