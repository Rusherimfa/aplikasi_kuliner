import { Head, Link, useForm, router } from '@inertiajs/react';
import Navbar from '@/pages/welcome/sections/navbar';
import Footer from '@/pages/welcome/sections/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarRange, Clock, Users, ArrowLeft, Trash2, Utensils, CheckCircle2, Clock3, XCircle, Plus, Minus, PencilLine, MessageCircle, QrCode, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function ReservationShow({ auth, reservation, availableMenus }: any) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Check if reservation is pending (editable)
    const isPending = reservation.status === 'pending';
    const isAwaitingPayment = reservation.status === 'awaiting_payment';
    const isConfirmed = reservation.status === 'confirmed' || reservation.status === 'completed';
    const isCheckedIn = !!reservation.checked_in_at;

    // QR code URL — uses free qrserver.com API
    const checkInUrl = `${window.location.origin}/checkin/${reservation.check_in_token}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodeURIComponent(checkInUrl)}`;

    const { data, setData, put, processing, errors } = typeof useForm === 'function' ? useForm({
        date: reservation.date,
        time: reservation.time,
        guest_count: reservation.guest_count,
        special_requests: reservation.special_requests || '',
        menus: reservation.menus || [],
    }) : { data: {}, setData: () => {}, put: () => {}, processing: false, errors: {} };

    // Fake the useForm hook locally if inertia v3 useForm causes issues here (standard approach below)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/reservations/${reservation.id}/customer`, data, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat diurungkan.')) {
            router.delete(`/reservations/${reservation.id}`);
        }
    };

    const addMenu = (menu: any) => {
        const existing = data.menus.find((m: any) => m.id === menu.id);
        if (existing) {
            setData('menus', data.menus.map((m: any) => 
                m.id === menu.id ? { ...m, quantity: m.quantity + 1 } : m
            ));
        } else {
            setData('menus', [...data.menus, { ...menu, quantity: 1, notes: '' }]);
        }
    };

    const updateMenuQuantity = (id: number, delta: number) => {
        setData('menus', data.menus.map((m: any) => {
            if (m.id === id) {
                const newQuantity = m.quantity + delta;
                return newQuantity > 0 ? { ...m, quantity: newQuantity } : m;
            }
            return m;
        }).filter((m: any) => m.id !== id || m.quantity + delta > 0)); // also removes if reaches 0 but we prevented it above, so if 0 we can detach
    };
    
    const removeMenu = (id: number) => {
        setData('menus', data.menus.filter((m: any) => m.id !== id));
    };

    // Calculate total price
    const calculateTotal = (menusList: any[]) => {
        return menusList.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || item.pivot?.quantity || 1)), 0);
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const displayMenus = isEditing ? data.menus : reservation.menus;
    const currentTotal = calculateTotal(displayMenus);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500">
            <Head title={`Detail Reservasi #RES-${reservation.id} - RestoWeb`} />
            
            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-24 pb-20 sm:pt-32 lg:pb-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <Link href="/reservations/history" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-amber-600 transition-colors">
                            <ArrowLeft size={16} /> Kembali ke Riwayat
                        </Link>

                        {isPending && !isEditing && (
                            <div className="flex gap-3">
                                <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 border-border">
                                    <PencilLine size={16} /> Ubah Pesanan
                                </Button>
                                <Button onClick={handleDelete} variant="destructive" className="gap-2 bg-rose-600 hover:bg-rose-700">
                                    <Trash2 size={16} /> Batalkan
                                </Button>
                            </div>
                        )}
                        {isEditing && (
                            <div className="flex gap-3">
                                <Button onClick={() => { setIsEditing(false); setData('menus', reservation.menus) }} variant="ghost" className="text-muted-foreground">
                                    Batal Ubah
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        {/* Main Detail / Form */}
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-start justify-between border-b border-border pb-6">
                                <div>
                                    <h1 className="font-['Playfair_Display',serif] text-3xl font-bold">Tiket Reservasi</h1>
                                    <p className="mt-1 font-mono text-sm text-muted-foreground">#RES-{reservation.id.toString().padStart(4, '0')}</p>
                                </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
                                    ${isConfirmed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : ''}
                                    ${reservation.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : ''}
                                    ${reservation.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : ''}
                                    ${isAwaitingPayment ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : ''}
                                `}>
                                    {isConfirmed && 'Dikonfirmasi'}
                                    {reservation.status === 'completed' && 'Selesai'}
                                    {reservation.status === 'rejected' && 'Dibatalkan'}
                                    {reservation.status === 'pending' && 'Menunggu Verifikasi'}
                                    {isAwaitingPayment && 'Menunggu Pembayaran'}
                                </span>
                            </div>
                            </div>
                            
                            <div className="mb-6 flex justify-end">
                                <a 
                                    href={`https://wa.me/6281234567890?text=Halo%20Admin%20RestoWeb,%20saya%20ingin%20bertanya%20seputar%20reservasi%20saya%20dengan%20ID:%20RES-${reservation.id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-full transition-colors"
                                >
                                    <MessageCircle size={16} /> Live Chat WA dengan Admin
                                </a>
                            </div>

                            {isEditing ? (
                                <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Tanggal</Label>
                                            <Input id="date" type="date" value={data.date} onChange={e => setData('date', e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time">Waktu</Label>
                                            <Input id="time" type="time" value={data.time} onChange={e => setData('time', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="guest_count">Jumlah Tamu</Label>
                                        <Input id="guest_count" type="number" min="1" max="20" value={data.guest_count} onChange={e => setData('guest_count', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="special_requests">Catatan Tambahan</Label>
                                        <Textarea id="special_requests" placeholder="Ada alergi makanan atau permintaan posisi meja?" value={data.special_requests} onChange={e => setData('special_requests', e.target.value)} rows={3} />
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CalendarRange size={16} /> Tanggal</span>
                                            <span className="text-lg font-semibold">{new Date(reservation.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Clock size={16} /> Waktu</span>
                                            <span className="text-lg font-semibold">{reservation.time} WIB</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Users size={16} /> Meja Untuk</span>
                                            <span className="text-lg font-semibold">{reservation.guest_count} Orang</span>
                                        </div>
                                    </div>

                                    {reservation.special_requests && (
                                        <div className="rounded-2xl bg-amber-500/10 p-5">
                                            <span className="mb-2 block text-sm font-semibold text-amber-500">Catatan Khusus</span>
                                            <p className="text-foreground/80">{reservation.special_requests}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Order Summary & Menu Selection */}
                        <div className="flex flex-col gap-6">

                            {/* QR Code Digital Ticket */}
                            {reservation.check_in_token && !isAwaitingPayment && (
                                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm text-center">
                                    <div className="mb-3 flex items-center justify-center gap-2">
                                        <QrCode size={18} className="text-amber-600" />
                                        <h2 className="font-['Playfair_Display',serif] text-lg font-bold">Tiket Check-in Digital</h2>
                                    </div>
                                    <p className="mb-4 text-xs text-muted-foreground">
                                        Tunjukkan QR ini kepada staf saat Anda tiba di restoran.
                                    </p>

                                    {isCheckedIn ? (
                                        <div className="rounded-2xl bg-emerald-500/10 p-4">
                                            <ShieldCheck size={36} className="mx-auto mb-2 text-emerald-500" />
                                            <p className="text-sm font-bold text-emerald-500">Sudah Check-in ✅</p>
                                            <p className="text-xs text-emerald-500/60 mt-1">
                                                {new Date(reservation.checked_in_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="inline-block rounded-2xl bg-white p-3 shadow-md ring-1 ring-border/10 dark:bg-zinc-800 dark:ring-white/10">
                                                <img
                                                    src={qrImageUrl}
                                                    alt="QR Code Check-in"
                                                    width={160}
                                                    height={160}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <div className="mt-3 inline-block rounded-full bg-zinc-950 px-4 py-1.5 font-mono text-[10px] font-bold tracking-widest text-amber-500">
                                                {reservation.check_in_token?.slice(0, 8).toUpperCase()}
                                            </div>
                                        </>
                                    )}

                                    {reservation.payment_status === 'paid' && (
                                        <div className="mt-4 rounded-xl bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-500">
                                            🔥 DP Lunas: Rp {Number(reservation.booking_fee).toLocaleString('id-ID')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Awaiting payment CTA */}
                            {isAwaitingPayment && (
                                <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-500/20 dark:bg-blue-500/5">
                                    <p className="mb-1 text-sm font-bold text-blue-800 dark:text-blue-300">Belum Dibayar</p>
                                    <p className="mb-4 text-xs text-blue-600/80 dark:text-blue-400/60">Selesaikan pembayaran DP untuk mendapatkan tiket dan QR check-in.</p>
                                    <Link href={`/reservations/payment/${reservation.id}`}>
                                        <Button className="h-10 w-full rounded-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">Bayar DP Sekarang</Button>
                                    </Link>
                                </div>
                            )}

                            <div className="rounded-3xl border border-border bg-muted/40 p-6 shadow-inner">
                                <h2 className="mb-4 flex items-center gap-2 font-['Playfair_Display',serif] text-xl font-bold">
                                    <Utensils size={20} className="text-amber-600" /> Makanan Dipesan
                                </h2>
                                
                                {displayMenus.length === 0 ? (
                                    <p className="py-4 text-center text-sm text-slate-500 dark:text-neutral-400 italic">Belum pesanan makanan.</p>
                                ) : (
                                    <ul className="space-y-4 mb-6">
                                        {displayMenus.map((item: any, idx: number) => {
                                            const qty = item.quantity || item.pivot?.quantity || 1;
                                            return (
                                            <li key={idx} className="flex justify-between items-start gap-3 text-sm">
                                                <div className="flex-1">
                                                    <span className="font-semibold">{item.name}</span>
                                                    <div className="text-muted-foreground">{formatRupiah(item.price)} x {qty}</div>
                                                </div>
                                                <div className="font-semibold whitespace-nowrap">
                                                    {formatRupiah(item.price * qty)}
                                                </div>
                                            </li>
                                        )})}
                                    </ul>
                                )}

                                <div className="mt-auto border-t border-border pt-4">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Estimasi Total</span>
                                        <span className="text-amber-600 dark:text-amber-500">{formatRupiah(currentTotal)}</span>
                                    </div>
                                    <p className="mt-2 text-[10px] text-muted-foreground/60 leading-tight">Harga akhir dapat berubah sesuai pajak restoran dan layanan di tempat.</p>
                                </div>

                                {isEditing && (
                                    <Button type="submit" form="edit-form" disabled={processing} className="mt-6 w-full h-12 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg shadow-amber-600/20">
                                        Simpan Perubahan
                                    </Button>
                                )}
                            </div>

                            {/* Menu Catalog (Only visible when editing) */}
                            {isEditing && (
                                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                                    <h3 className="mb-4 font-semibold">Tersedia Pre-Order</h3>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {availableMenus.length === 0 && <p className="text-xs text-muted-foreground">Katalog menu sedang kosong.</p>}
                                        {availableMenus.map((menu: any) => {
                                            const inCart = data.menus.find((m: any) => m.id === menu.id);
                                            return (
                                            <div key={menu.id} className="flex flex-col gap-2 p-3 rounded-2xl border border-border hover:border-amber-500/30 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium text-sm">{menu.name}</span>
                                                    <span className="font-semibold text-xs text-amber-600">{formatRupiah(menu.price)}</span>
                                                </div>
                                                {inCart ? (
                                                    <div className="flex items-center justify-between bg-muted p-1 rounded-full text-foreground">
                                                        <button type="button" onClick={() => removeMenu(menu.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-full">
                                                            <Trash2 size={14} />
                                                        </button>
                                                        <div className="flex items-center gap-3 px-2">
                                                            <button type="button" onClick={() => updateMenuQuantity(menu.id, -1)} className="p-1 bg-card rounded-full shadow-sm">
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="font-semibold text-sm w-4 text-center">{inCart.quantity || inCart.pivot?.quantity || 1}</span>
                                                            <button type="button" onClick={() => updateMenuQuantity(menu.id, 1)} className="p-1 bg-card rounded-full shadow-sm">
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button type="button" variant="outline" size="sm" onClick={() => addMenu(menu)} className="h-8 text-xs rounded-full w-full">
                                                        Tambah
                                                    </Button>
                                                )}
                                            </div>
                                        )})}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
