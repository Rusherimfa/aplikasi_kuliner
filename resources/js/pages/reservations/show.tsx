import { Head, Link, useForm, router } from '@inertiajs/react';
import Navbar from '@/pages/welcome/sections/navbar';
import Footer from '@/pages/welcome/sections/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    CalendarRange, 
    Clock, 
    Users, 
    ArrowLeft, 
    Trash2, 
    Utensils, 
    CheckCircle2, 
    Clock3, 
    XCircle, 
    Plus, 
    Minus, 
    PencilLine, 
    MessageCircle, 
    QrCode, 
    MapPin, 
    ShieldCheck,
    ChefHat,
    Ticket,
    Sparkles,
    CreditCard
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReservationShow({ auth, reservation, availableMenus }: any) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Status helpers
    const isPending = reservation.status === 'pending';
    const isAwaitingPayment = reservation.status === 'awaiting_payment';
    const isConfirmed = reservation.status === 'confirmed' || reservation.status === 'completed';
    const isCheckedIn = !!reservation.checked_in_at;

    // QR code URL
    const checkInUrl = `${window.location.origin}/checkin/${reservation.check_in_token}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(checkInUrl)}`;

    const { data, setData, put, processing, errors } = typeof useForm === 'function' ? useForm({
        date: reservation.date,
        time: reservation.time,
        guest_count: reservation.guest_count,
        special_requests: reservation.special_requests || '',
        menus: reservation.menus || [],
    }) : { data: {}, setData: () => {}, put: () => {}, processing: false, errors: {} } as any;

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
        }).filter((m: any) => m.id !== id || m.quantity + delta > 0));
    };
    
    const removeMenu = (id: number) => {
        setData('menus', data.menus.filter((m: any) => m.id !== id));
    };

    const calculateTotal = (menusList: any[]) => {
        return menusList.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || item.pivot?.quantity || 1)), 0);
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const displayMenus = isEditing ? data.menus : reservation.menus;
    const currentTotal = calculateTotal(displayMenus);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 overflow-hidden">
            <Head title={`Boutique Pass #RES-${reservation.id} - RestoWeb`} />
            
            {/* Ambient Lighting */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-orange-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-[120px]" />

            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    
                    {/* Header Navigation */}
                    <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
                        <Link href="/reservations/history" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-500 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Riwayat
                        </Link>

                        <div className="flex gap-4">
                            {isPending && !isEditing && (
                                <div className="flex gap-3">
                                    <Button onClick={() => setIsEditing(true)} variant="outline" className="h-11 px-6 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:text-orange-500 transition-all">
                                        <PencilLine size={14} className="mr-2" /> Ubah Reservasi
                                    </Button>
                                    <Button onClick={handleDelete} variant="destructive" className="h-11 px-6 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                                        <Trash2 size={14} className="mr-2" /> Batalkan
                                    </Button>
                                </div>
                            )}
                            {isEditing && (
                                <Button onClick={() => { setIsEditing(false); setData('menus', reservation.menus) }} className="h-11 px-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                    Batal Ubah
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
                        {/* Digital Ticket Side */}
                        <div className="space-y-10">
                            {/* The Pass Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card relative rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] backdrop-blur-3xl overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />
                                
                                <div className="p-10 md:p-14">
                                    <div className="flex items-start justify-between mb-16">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles size={14} className="text-orange-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-white/20">Official Dining Pass</span>
                                            </div>
                                            <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                                Boutique <span className="italic font-serif opacity-40 text-orange-500">Pass</span>
                                            </h1>
                                            <p className="font-mono text-sm font-bold text-orange-500/60 uppercase tracking-widest mt-2 px-3 py-1 bg-orange-500/5 inline-block rounded-lg">#RES-{reservation.id.toString().padStart(4, '0')}</p>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-3 text-right">
                                             <span className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl
                                                ${isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                ${reservation.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : ''}
                                                ${reservation.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                                                ${isAwaitingPayment ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''}
                                            `}>
                                                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isConfirmed ? 'bg-emerald-400' : (reservation.status === 'rejected' ? 'bg-rose-500' : 'bg-orange-400')}`} />
                                                {isConfirmed && 'Experience Confirmed'}
                                                {reservation.status === 'completed' && 'Completed'}
                                                {reservation.status === 'rejected' && 'Cancelled'}
                                                {reservation.status === 'pending' && 'Awaiting Verification'}
                                                {isAwaitingPayment && 'Awaiting Payment'}
                                            </span>
                                            
                                            <a 
                                                href={`https://wa.me/6281234567890?text=Halo%20Admin%20RestoWeb,%20saya%20ingin%20bertanya%20seputar%20reservasi%20saya%20dengan%20ID:%20RES-${reservation.id}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="group/wa inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-500/60 hover:text-emerald-400 transition-colors"
                                            >
                                                Concierge Chat <MessageCircle size={14} className="group-hover/wa:rotate-12 transition-transform" />
                                            </a>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isEditing ? (
                                            <motion.form 
                                                key="edit-form"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                onSubmit={handleSubmit} 
                                                className="space-y-10"
                                            >
                                                <div className="grid gap-8 md:grid-cols-2">
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Reservation Date</Label>
                                                        <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-orange-500/20 transition-all font-sans" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Time Slot</Label>
                                                        <Input type="time" value={data.time} onChange={e => setData('time', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-orange-500/20 transition-all font-sans" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Guest Capacity</Label>
                                                    <Input type="number" min="1" max="20" value={data.guest_count} onChange={e => setData('guest_count', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-orange-500/20 transition-all font-sans" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Special Requests & Celebrations</Label>
                                                    <Textarea placeholder="Brithday, Anniversary, or special dietary needs..." value={data.special_requests} onChange={e => setData('special_requests', e.target.value)} rows={4} className="rounded-3xl bg-white/5 border-white/10 text-lg font-medium p-6 focus:ring-orange-500/20 transition-all font-sans" />
                                                </div>
                                            </motion.form>
                                        ) : (
                                            <motion.div 
                                                key="view-details"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="grid gap-10 md:grid-cols-3 border-y border-slate-200 dark:border-white/5 py-12"
                                            >
                                                <div className="space-y-2">
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><CalendarRange size={14} className="text-orange-500" /> Date</span>
                                                    <span className="text-xl font-bold dark:text-white block">{new Date(reservation.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><Clock size={14} className="text-orange-500" /> Time</span>
                                                    <span className="text-xl font-bold dark:text-white block">{reservation.time} <span className="text-sm opacity-30">WIB</span></span>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><Users size={14} className="text-orange-500" /> Seats</span>
                                                    <span className="text-xl font-bold dark:text-white block">{reservation.guest_count} People</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!isEditing && reservation.special_requests && (
                                        <div className="mt-12 group/note relative">
                                            <div className="absolute -left-10 top-0 bottom-0 w-1 bg-orange-500/20 rounded-full group-hover:bg-orange-500 transition-colors" />
                                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 block">Boutique Notes</span>
                                            <p className="text-lg font-medium text-slate-500 dark:text-neutral-400 italic">"{reservation.special_requests}"</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-white/[0.04] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-xl">
                                            <MapPin size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Reserved Table</p>
                                            <p className="text-xl font-black text-white">{reservation.restoTable ? `Table Section ${reservation.restoTable.name}` : 'Priority Waiting List'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
                                            <CreditCard size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Entry Fee Status</p>
                                            <p className="text-xl font-black text-white">{reservation.payment_status === 'paid' ? 'Paid & Secured' : 'Awaiting Payment'}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Menu Selection Section (when editing) */}
                            {isEditing && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl"
                                >
                                    <h3 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight mb-8">Customize Your Courses</h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                        {availableMenus.map((menu: any) => {
                                            const inCart = data.menus.find((m: any) => m.id === menu.id);
                                            return (
                                            <div key={menu.id} className="glass-card p-6 rounded-[2rem] border border-white/5 flex flex-col h-full bg-white/[0.01] hover:bg-white/5 hover:border-orange-500/20 transition-all group/card">
                                                <div className="flex-1 mb-6">
                                                    <p className="text-sm font-black text-white uppercase group-hover/card:text-orange-500 transition-colors">{menu.name}</p>
                                                    <p className="text-xs text-orange-500 italic mt-1 font-black">{formatRupiah(menu.price)}</p>
                                                </div>
                                                {inCart ? (
                                                    <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-white/5">
                                                        <button type="button" onClick={() => updateMenuQuantity(menu.id, -1)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-orange-500 hover:text-black transition-all">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-black text-sm w-6 text-center text-white">{inCart.quantity || inCart.pivot?.quantity || 1}</span>
                                                        <button type="button" onClick={() => updateMenuQuantity(menu.id, 1)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-orange-500 hover:text-black transition-all">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button type="button" onClick={() => addMenu(menu)} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black">
                                                        Add to Pass
                                                    </Button>
                                                )}
                                            </div>
                                        )})}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Sidebar: QR & Order Summary */}
                        <div className="flex flex-col gap-10">
                            {/* Digital Passport QR */}
                            {reservation.check_in_token && !isAwaitingPayment && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="rounded-[3rem] border border-orange-500/20 bg-black p-10 shadow-3xl text-center relative overflow-hidden group/qr"
                                >
                                    <div className="absolute inset-0 bg-grid-white opacity-5" />
                                    
                                    <div className="relative mb-10 flex items-center justify-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                                            <QrCode size={20} />
                                        </div>
                                        <h2 className="font-['Playfair_Display',serif] text-2xl font-black text-white tracking-tight">Digital Ticket</h2>
                                    </div>

                                    <div className="relative">
                                        {isCheckedIn ? (
                                            <div className="py-12 px-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center gap-6">
                                                <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                                    <ShieldCheck size={40} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-emerald-400 uppercase tracking-tighter">Verified Arrival</p>
                                                    <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">
                                                        {new Date(reservation.checked_in_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <div className="inline-block rounded-[2.5rem] bg-white p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] ring-1 ring-white/10 group-hover/qr:scale-105 transition-transform duration-700">
                                                    <img src={qrImageUrl} alt="QR Code" className="w-full h-auto rounded-2xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Tunjukkan pada Staf saat Tiba</p>
                                                    <div className="h-1 w-20 bg-orange-500/40 mx-auto rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Order Summary */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 shadow-3xl flex flex-col h-full ring-1 ring-white/5"
                            >
                                <h2 className="mb-10 flex items-center gap-4 font-['Playfair_Display',serif] text-2xl font-black text-white">
                                    <Utensils size={24} className="text-orange-500" /> Gastronomy Log
                                </h2>
                                
                                <div className="flex-1">
                                    {displayMenus.length === 0 ? (
                                        <div className="py-12 text-center rounded-[2rem] border border-dashed border-white/5 bg-white/[0.01]">
                                            <ChefHat size={32} className="mx-auto text-white/10 mb-4" />
                                            <p className="text-sm text-white/20 italic font-medium">Belum ada pilihan menu.</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-6 mb-10">
                                            {displayMenus.map((item: any, idx: number) => {
                                                const qty = item.quantity || item.pivot?.quantity || 1;
                                                return (
                                                <li key={idx} className="flex justify-between items-start gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[.2em]">{formatRupiah(item.price)} <span className="text-orange-500/40 italic">x {qty}</span></p>
                                                    </div>
                                                    <p className="text-sm font-black text-white italic whitespace-nowrap">
                                                        {formatRupiah(item.price * qty)}
                                                    </p>
                                                </li>
                                            )})}
                                        </ul>
                                    )}
                                </div>

                                <div className="mt-8 pt-10 border-t border-white/5">
                                    <div className="flex justify-between items-end mb-6">
                                        <div className="space-y-1 text-left">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Estimated Total</p>
                                            <p className="text-orange-500 font-serif italic text-sm">Fine Dining Selection</p>
                                        </div>
                                        <p className="text-4xl font-black text-white tracking-tighter">{formatRupiah(currentTotal)}</p>
                                    </div>
                                    
                                    {isEditing ? (
                                        <Button type="submit" form="edit-form" disabled={processing} className="w-full h-16 rounded-2xl bg-orange-500 text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-orange-500/20 hover:bg-white hover:scale-[1.02] transition-all">
                                            {processing ? 'Crafting Pass...' : 'Finalize Reservation'}
                                        </Button>
                                    ) : (
                                        isAwaitingPayment && (
                                            <Link href={`/reservations/payment/${reservation.id}`}>
                                                <Button className="w-full h-16 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-white hover:text-black hover:scale-[1.02] transition-all">
                                                    Complete Secure Payment
                                                </Button>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
            `}} />
        </div>
    );
}
