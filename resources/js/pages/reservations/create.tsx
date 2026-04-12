import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { dashboard } from '@/routes';
import { useCart } from '@/hooks/use-cart';

import Navbar from '../welcome/sections/navbar';
import AIChatbot from '@/components/app/ai-chatbot';

export default function CreateReservation() {
    const { auth, tables = [], bookedTableIds = [] } = usePage().props as any;
    const dashboardUrl = dashboard()?.url || '/dashboard';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth.user ? auth.user.name : '',
        customer_email: auth.user ? auth.user.email : '',
        customer_phone: '',
        date: '',
        time: '',
        guest_count: 2,
        special_requests: '',
        resto_table_id: '',
    });

    const { items, cartTotal } = useCart();
    const dpAmount = cartTotal > 0 ? cartTotal * 0.5 : 50000;

    // Generate valid minimum date based on local timezone
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDateLocal = today.toISOString().slice(0, 10);

    // Auto-fetch booked tables when date and time is selected
    useEffect(() => {
        if (data.date && data.time) {
            router.reload({
                data: { date: data.date, time: data.time },
                only: ['bookedTableIds'],
                preserveState: true,
                preserveScroll: true,
            });
            // Auto deselect if currently selected table becomes booked
            if (data.resto_table_id && bookedTableIds.includes(data.resto_table_id)) {
                setData('resto_table_id', '');
            }
        }
    }, [data.date, data.time]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Attach cart items dynamically before submitting using Inertia's router directly since useForm transform is clumsy with hooks
        router.post('/reservations', {
            ...data,
            menus: items.map(i => ({ id: i.id, quantity: i.quantity, notes: '' }))
        });
    };

    return (
        <>
            <Head title="Pesan Meja - RestoWeb" />

            <div className="flex min-h-screen flex-col bg-background font-['Inter',sans-serif] text-foreground selection:bg-amber-100 selection:text-amber-900 md:flex-row transition-colors duration-500">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* Left Side: Interactive Floor Plan Map */}
                <div className="relative flex min-h-[50vh] flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-24 shadow-2xl md:min-h-screen md:w-1/2 lg:p-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    <div className="relative z-10 w-full max-w-lg">
                        <div className="mb-8 text-center text-white">
                            <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl font-bold text-amber-500">Peta Denah Interaktif</h2>
                            <p className="text-sm text-slate-400">
                                {!data.date || !data.time 
                                    ? 'Pilih tanggal & waktu terlebih dahulu untuk melihat meja kosong.'
                                    : 'Pilih meja favorit Anda. Meja merah sudah dipesan orang lain.'}
                            </p>
                        </div>

                        {/* Visual Map Grid */}
                        <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 shadow-xl backdrop-blur-md">
                            <div className="absolute inset-x-8 top-0 flex justify-center">
                                <div className="h-2 w-1/2 rounded-b-lg bg-zinc-800"></div>
                                <span className="absolute -top-3 bg-zinc-950 px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Panggung Utama</span>
                            </div>
                            
                            <div className="absolute inset-y-8 right-0 flex items-center justify-center">
                                <div className="h-1/2 w-2 rounded-l-lg bg-zinc-800/50"></div>
                                <span className="absolute -right-6 top-1/2 origin-left -rotate-90 bg-zinc-950 px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Jendela View</span>
                            </div>

                            <div 
                                className="grid h-full w-full gap-2 lg:gap-3" 
                                style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gridTemplateRows: 'repeat(12, minmax(0, 1fr))' }}
                            >
                                {tables.map((t: any) => {
                                    const isBooked = bookedTableIds.includes(t.id);
                                    const isSelected = data.resto_table_id === t.id;
                                    const isDisabled = !data.date || !data.time || isBooked;
                                    
                                    let bgClass = 'bg-zinc-800 border-zinc-700 text-zinc-600'; // Default disabled
                                    
                                    if (!isDisabled) {
                                        bgClass = isSelected 
                                            ? 'bg-amber-500 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-110 z-10' 
                                            : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/40 cursor-pointer';
                                    } else if (isBooked) {
                                        bgClass = 'bg-rose-500/20 border-rose-500/50 text-rose-500 cursor-not-allowed';
                                    }

                                    // Category Shapes
                                    const isRound = t.category === 'window';
                                    const spanClass = t.capacity >= 6 ? 'span 3' : (t.capacity >= 4 ? 'span 2' : 'span 1');
                                    
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => !isDisabled && setData('resto_table_id', t.id)}
                                            disabled={isDisabled}
                                            className={`relative flex flex-col items-center justify-center border-2 transition-all duration-300 ${isRound ? 'rounded-full' : 'rounded-xl'} ${bgClass}`}
                                            style={{ 
                                                gridColumn: `${t.pos_x} / span ${t.capacity >= 6 ? 3 : (t.capacity >= 4 ? 2 : 1)}`, 
                                                gridRow: `${t.pos_y} / span 2` 
                                            }}
                                            title={`${t.name} - ${t.capacity} Orang`}
                                        >
                                            <span className="text-[10px] font-bold sm:text-xs">{t.name}</span>
                                            {isBooked && <Lock size={10} className="absolute -bottom-1 -right-1 rounded-full bg-black p-0.5 text-rose-500" />}
                                            {isSelected && <CheckCircle2 size={12} className="absolute -top-1 -right-1 rounded-full bg-black text-amber-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center gap-6 text-xs font-medium text-slate-400">
                            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm border border-emerald-500/50 bg-emerald-500/20"></div> Tersedia</div>
                            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm border border-rose-500/50 bg-rose-500/20"></div> Dipesan</div>
                            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm border border-amber-400 bg-amber-500"></div> Pilihanmu</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div className="relative flex w-full flex-col py-12 px-6 md:w-1/2 md:p-12 lg:p-16 lg:pt-32">
                    <div className="mx-auto w-full max-w-md">
                        <div className="mb-10 text-center md:text-left">
                            <h1 className="mb-3 font-['Playfair_Display',serif] text-3xl font-bold text-foreground">Detail Reservasi</h1>
                            <p className="text-sm text-muted-foreground">
                                Langkah 1: Tentukan waktu. Langkah 2: Pilih meja di peta. Langkah 3: Konfirmasi.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* WAKTU & TANGGAL */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-5">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">1. Kapan Anda datang?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                                            <Calendar size={14} className="text-amber-500" /> Tanggal
                                        </label>
                                        <Input
                                            type="date"
                                            min={minDateLocal}
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="h-12 rounded-xl border-border bg-card"
                                            required
                                        />
                                        {errors.date && <p className="text-[10px] text-red-500">{errors.date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                                            <Clock size={14} className="text-amber-500" /> Waktu
                                        </label>
                                        <Input
                                            type="time"
                                            value={data.time}
                                            onChange={(e) => setData('time', e.target.value)}
                                            className="h-12 rounded-xl border-border bg-card"
                                            required
                                        />
                                        {errors.time && <p className="text-[10px] text-red-500">{errors.time}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* PILIHAN MEJA */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-5">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">2. Meja Pilihan</h3>
                                {errors.resto_table_id && <p className="mb-3 rounded-lg bg-destructive/10 p-2 text-xs font-medium text-destructive">{errors.resto_table_id}</p>}
                                
                                {data.resto_table_id ? (
                                    <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">
                                                    Meja {tables.find((t: any) => t.id === data.resto_table_id)?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Maks. {tables.find((t: any) => t.id === data.resto_table_id)?.capacity} Orang
                                                </p>
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setData('resto_table_id', '')} className="text-destructive hover:bg-destructive/10">
                                            Batal
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border bg-card py-6 text-center">
                                        <p className="text-sm text-muted-foreground/60">
                                            {data.date && data.time ? 'Silakan klik meja berwarna hijau di Peta (Kiri).' : 'Isi tanggal & waktu terlebih dahulu.'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* KONTAK DETAIL */}
                            <div className="rounded-2xl border border-border bg-muted/30 p-5">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">3. Identitas Anda</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Nama Lengkap"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            className="h-12 rounded-xl border-border bg-card"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="h-12 rounded-xl border-border bg-card"
                                            readOnly={!!auth.user}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            placeholder="No. WhatsApp"
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="h-12 rounded-xl border-border bg-card"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Input
                                                type="number"
                                                min="1"
                                                max="20"
                                                placeholder="Jumlah Tamu"
                                                value={data.guest_count}
                                                onChange={(e) => setData('guest_count', parseInt(e.target.value))}
                                                className="h-12 rounded-xl border-border bg-card"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        placeholder="Catatan tambahan (Opsional)"
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        className="h-20 resize-none rounded-xl border-border bg-card"
                                    />
                                </div>
                            </div>
                            
                            {/* RINGKASAN PEMBAYARAN */}
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500">Ringkasan Pembayaran</h3>
                                
                                {items.length > 0 ? (
                                    <div className="mb-4 space-y-2 border-b border-amber-500/20 pb-4">
                                        {items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm text-foreground/80">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span className="font-medium">Rp {((Number(item.price)) * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mb-4 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-500/80">
                                        Anda belum memilih menu makanan (Pre-order kosong).
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-foreground">
                                        <span>Total Makanan</span>
                                        <span className="font-bold">Rp {cartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-foreground">
                                        <span>Ketentuan DP {cartTotal > 0 ? '(50%)' : '(Tarif Dasar)'}</span>
                                        <span className="font-bold text-rose-500">Rp {dpAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-xs text-muted-foreground/60 font-medium">
                                    Anda akan diarahkan ke halaman pembayaran DP setelah konfirmasi.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || !data.resto_table_id}
                                className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-base font-semibold text-white shadow-xl shadow-amber-900/20 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                            >
                                Lanjutkan ke Pembayaran (Rp {dpAmount.toLocaleString('id-ID')})
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </div>
                </div>
                
                <AIChatbot />
            </div>
        </>
    );
}
