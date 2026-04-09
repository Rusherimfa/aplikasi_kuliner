import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronRight, CreditCard, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

// Shared Components
import Navbar from '../welcome/sections/navbar';
import Footer from '../welcome/sections/footer';

export default function CheckoutIndex() {
    const { items, cartTotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulating API request to create order
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            clearCart();
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] font-['Inter',sans-serif] px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl text-center border border-slate-200">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-600" />
                    </div>
                    <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-slate-900 mb-2">Pesanan Berhasil!</h1>
                    <p className="text-slate-500 mb-8">
                        Terima kasih atas pesanan Anda. Kami sedang menyiapkan hidangan spesial Anda dengan penuh cinta.
                    </p>
                    <Link href="/">
                        <Button className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold shadow-xl shadow-amber-900/20 hover:scale-105 transition-all">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Pembayaran - RestoWeb" />

            <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-600 selection:bg-amber-100 selection:text-amber-900">
                <Navbar auth={{ user: null }} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

                <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/catalog" className="hover:text-slate-900 transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        <span className="font-medium text-slate-900">Pembayaran</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <h1 className="mb-2 font-['Playfair_Display',serif] text-4xl font-bold text-slate-900">
                                Selesaikan Pesanan
                            </h1>
                            <p className="text-slate-500 mb-10">
                                Harap lengkapi detail informasi Anda di bawah ini agar kami dapat memproses pesanan dengan cepat.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Contact Info */}
                                <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
                                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">1</div>
                                        Informasi Kontak
                                    </h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nama Lengkap</label>
                                            <Input required placeholder="Masukkan nama Anda" className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-amber-500" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                                                <Input required type="email" placeholder="contoh@email.com" className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-amber-500" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">No. WhatsApp</label>
                                                <Input required type="tel" placeholder="+62 8..." className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-amber-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Type */}
                                <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
                                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">2</div>
                                        Tipe Pesanan
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="cursor-pointer relative rounded-2xl border-2 border-amber-500 bg-amber-50 p-4 transition-all">
                                            <input type="radio" name="orderType" className="sr-only" defaultChecked />
                                            <div className="font-semibold text-amber-900">Makan di Tempat</div>
                                            <div className="text-sm text-amber-700 mt-1">Kami siapkan meja untuk Anda.</div>
                                        </label>
                                        <label className="cursor-pointer relative rounded-2xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-slate-300">
                                            <input type="radio" name="orderType" className="sr-only" />
                                            <div className="font-semibold text-slate-700">Bawa Pulang (Takeaway)</div>
                                            <div className="text-sm text-slate-500 mt-1">Ambil sendiri secara langsung.</div>
                                        </label>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-sm">
                                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">3</div>
                                        Metode Pembayaran
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="text-slate-400" />
                                                <span className="font-medium text-slate-900">Kartu Kredit / Debit</span>
                                            </div>
                                            <input type="radio" name="payment" className="h-4 w-4 text-amber-600 focus:ring-amber-600" />
                                        </label>
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-xs">QRIS</div>
                                                <span className="font-medium text-slate-900">Gopay / OVO / Dana / LinkAja</span>
                                            </div>
                                            <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-amber-600 focus:ring-amber-600" />
                                        </label>
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <UtensilsCrossed className="text-slate-400" />
                                                <span className="font-medium text-slate-900">Bayar di Kasir</span>
                                            </div>
                                            <input type="radio" name="payment" className="h-4 w-4 text-amber-600 focus:ring-amber-600" />
                                        </label>
                                    </div>
                                </div>

                                <div className="lg:hidden">
                                    <Button disabled={isSubmitting || items.length === 0} type="submit" className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-lg shadow-xl shadow-amber-900/20">
                                        {isSubmitting ? 'Memproses...' : `Bayar Rp ${cartTotal.toLocaleString('id-ID')}`}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5 xl:col-span-4 sticky top-32">
                            <div className="rounded-[2.5rem] bg-slate-900 text-white p-8 shadow-2xl">
                                <h3 className="text-xl font-bold font-['Playfair_Display',serif] mb-6 flex items-center justify-between">
                                    Ringkasan Pesanan
                                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-sans">{items.length} item</span>
                                </h3>
                                
                                {items.length > 0 ? (
                                    <ul className="space-y-4 mb-8">
                                        {items.map(item => (
                                            <li key={item.id} className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <span className="font-bold text-amber-500">{item.quantity}x</span>
                                                    <span className="text-white/80 line-clamp-2 pr-2">{item.name}</span>
                                                </div>
                                                <span className="font-medium text-white/90 whitespace-nowrap">
                                                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-8 text-center text-white/40 border-y border-white/10 mb-8">
                                        <p>Keranjang Anda kosong</p>
                                        <Link href="/catalog" className="text-amber-500 mt-2 block underline">Kembali ke Menu</Link>
                                    </div>
                                )}
                                
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60">
                                        <span>Pajak Restoran (10%)</span>
                                        <span>Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60">
                                        <span>Layanan (5%)</span>
                                        <span>Rp {(cartTotal * 0.05).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold mt-6 pt-6 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="text-amber-400">Rp {(cartTotal * 1.15).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting || items.length === 0} 
                                    className="hidden lg:flex w-full mt-8 h-14 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-slate-100 transition-all hover:scale-[1.02]"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Proses Pesanan Sekarang'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
