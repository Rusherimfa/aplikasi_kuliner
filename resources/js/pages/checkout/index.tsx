import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, CreditCard, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';

// Shared Components
import Footer from '../welcome/sections/footer';
import Navbar from '../welcome/sections/navbar';

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
            <div className="min-h-screen flex items-center justify-center bg-background font-['Inter',sans-serif] px-4">
                <div className="max-w-md w-full bg-card p-8 rounded-[2rem] shadow-2xl text-center border border-border">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h1 className="font-['Playfair_Display',serif] text-3xl font-bold text-foreground mb-2">Pesanan Berhasil!</h1>
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

            <div className="min-h-screen bg-background font-['Inter',sans-serif] text-muted-foreground selection:bg-amber-100 selection:text-amber-900">
                <Navbar auth={{ user: null }} dashboardUrl="/dashboard" mobileMenuOpen={false} setMobileMenuOpen={() => {}} />

                <main className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground/60">
                        <Link href="/catalog" className="hover:text-foreground transition-colors">Menu</Link>
                        <ChevronRight size={14} />
                        <span className="font-medium text-foreground">Pembayaran</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-7 xl:col-span-8">
                            <h1 className="mb-2 font-['Playfair_Display',serif] text-4xl font-bold text-foreground">
                                Selesaikan Pesanan
                            </h1>
                            <p className="text-muted-foreground mb-10">
                                Harap lengkapi detail informasi Anda di bawah ini agar kami dapat memproses pesanan dengan cepat.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                {/* Contact Info */}
                                <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-bold text-sm">1</div>
                                        Informasi Kontak
                                    </h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Nama Lengkap</label>
                                            <Input required placeholder="Masukkan nama Anda" className="h-12 bg-muted/30 border-border focus:bg-background focus:border-amber-500" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
                                                <Input required type="email" placeholder="contoh@email.com" className="h-12 bg-muted/30 border-border focus:bg-background focus:border-amber-500" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">No. WhatsApp</label>
                                                <Input required type="tel" placeholder="+62 8..." className="h-12 bg-muted/30 border-border focus:bg-background focus:border-amber-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Type */}
                                <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-bold text-sm">2</div>
                                        Tipe Pesanan
                                    </h2>
                                     <div className="grid grid-cols-2 gap-4">
                                        <label className="cursor-pointer relative rounded-2xl border-2 border-amber-500 bg-amber-500/5 p-4 transition-all">
                                            <input type="radio" name="orderType" className="sr-only" defaultChecked />
                                            <div className="font-semibold text-amber-600">Makan di Tempat</div>
                                            <div className="text-sm text-amber-600/70 mt-1">Kami siapkan meja untuk Anda.</div>
                                        </label>
                                        <label className="cursor-pointer relative rounded-2xl border-2 border-border bg-muted/30 p-4 transition-all hover:border-amber-500/50">
                                            <input type="radio" name="orderType" className="sr-only" />
                                            <div className="font-semibold text-muted-foreground group-hover:text-foreground">Bawa Pulang (Takeaway)</div>
                                            <div className="text-sm text-muted-foreground/60 mt-1">Ambil sendiri secara langsung.</div>
                                        </label>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="p-8 rounded-[2rem] bg-card border border-border shadow-sm">
                                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-bold text-sm">3</div>
                                        Metode Pembayaran
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="text-muted-foreground/40" />
                                                <span className="font-medium text-foreground">Kartu Kredit / Debit</span>
                                            </div>
                                            <input type="radio" name="payment" className="h-4 w-4 text-amber-600 focus:ring-amber-600" />
                                        </label>
                                         <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded text-xs">QRIS</div>
                                                <span className="font-medium text-foreground">Gopay / OVO / Dana / LinkAja</span>
                                            </div>
                                            <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-amber-600 focus:ring-amber-600" />
                                        </label>
                                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <UtensilsCrossed className="text-muted-foreground/40" />
                                                <span className="font-medium text-foreground">Bayar di Kasir</span>
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
                            <div className="rounded-[2.5rem] bg-card border border-border p-8 shadow-2xl">
                                <h3 className="text-xl font-bold font-['Playfair_Display',serif] mb-6 flex items-center justify-between text-foreground">
                                    Ringkasan Pesanan
                                    <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-sm font-sans">{items.length} item</span>
                                </h3>
                                                                {items.length > 0 ? (
                                    <ul className="space-y-4 mb-8">
                                        {items.map(item => (
                                            <li key={item.id} className="flex justify-between items-start">
                                                <div className="flex gap-3 text-foreground">
                                                    <span className="font-bold text-amber-500">{item.quantity}x</span>
                                                    <span className="text-muted-foreground line-clamp-2 pr-2">{item.name}</span>
                                                </div>
                                                <span className="font-medium text-foreground whitespace-nowrap">
                                                    Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                 ) : (
                                    <div className="py-8 text-center text-muted-foreground/40 border-y border-border mb-8">
                                        <p>Keranjang Anda kosong</p>
                                        <Link href="/catalog" className="text-amber-500 mt-2 block underline">Kembali ke Menu</Link>
                                    </div>
                                )}
                                
                                <div className="space-y-3 pt-6 border-t border-border">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Pajak Restoran (10%)</span>
                                        <span>Rp {(cartTotal * 0.1).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Layanan (5%)</span>
                                        <span>Rp {(cartTotal * 0.05).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-bold mt-6 pt-6 border-t border-border">
                                        <span className="text-foreground">Total</span>
                                        <span className="text-amber-500">Rp {(cartTotal * 1.15).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting || items.length === 0} 
                                    className="hidden lg:flex w-full mt-8 h-14 rounded-full bg-amber-500 text-zinc-950 font-bold text-lg hover:bg-amber-400 transition-all hover:scale-[1.02]"
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
