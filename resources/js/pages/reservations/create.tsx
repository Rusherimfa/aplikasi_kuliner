import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, Lock, MapPin, Info, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { dashboard } from '@/routes';
import { useCart } from '@/hooks/use-cart';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../welcome/sections/navbar';
import AIChatbot from '@/components/app/ai-chatbot';

export default function CreateReservation() {
    const { auth, tables = [], bookedTableIds = [] } = usePage().props as any;
    const dashboardUrl = dashboard()?.url || '/dashboard';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth.user ? auth.user.name : '',
        customer_email: auth.user ? auth.user.email : '',
        customer_phone: auth.user && auth.user.phone ? auth.user.phone : '',
        date: '',
        time: '',
        guest_count: 2,
        special_requests: '',
        resto_table_id: '',
        type: 'dine_in' as 'dine_in' | 'delivery' | 'takeaway',
        delivery_address: '',
        use_points: false,
    });

    const { items, cartTotal } = useCart();
    const dpAmount = cartTotal > 0 ? cartTotal * 0.5 : 50000;

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDateLocal = today.toISOString().slice(0, 10);

    useEffect(() => {
        if (data.date && data.time) {
            router.reload({
                data: { date: data.date, time: data.time },
                only: ['bookedTableIds'],
                preserveState: true,
                preserveScroll: true,
            });
            if (data.resto_table_id && bookedTableIds.includes(data.resto_table_id)) {
                setData('resto_table_id', '');
            }
        }
    }, [data.date, data.time]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/reservations', {
            ...data,
            menus: items.map(i => ({ id: i.id, quantity: i.quantity, notes: '' }))
        });
    };

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-foreground transition-colors duration-500 flex flex-col md:flex-row overflow-hidden">
            <Head title="Pesan Meja — Pengalaman Kuliner Premium" />
            
            <Navbar
                auth={auth}
                dashboardUrl={dashboardUrl}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Left Side: Dynamic Content (Map for Dine-in, Minimalist for Others) */}
            <div className={`relative flex min-h-[40vh] md:min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 md:py-24 md:w-1/2 lg:p-16 border-r border-white/5 transition-all duration-700 ${data.type !== 'dine_in' ? 'bg-orange-500/5' : ''}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
                
                <AnimatePresence mode="wait">
                    {data.type === 'dine_in' ? (
                        <motion.div 
                            key="map-view"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="relative z-10 w-full max-w-xl flex flex-col items-center"
                        >
                            <div className="mb-12 text-center space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">
                                    <MapPin size={12} />
                                    <span>Interactive Map</span>
                                </div>
                                <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">Pilih <span className="italic font-serif opacity-40">Lokasi</span> Spesifik Anda</h2>
                            </div>

                            <div className="relative mx-auto aspect-square w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] border border-white/10 bg-black/40 p-4 md:p-8 shadow-3xl backdrop-blur-2xl ring-1 ring-white/5">
                                <div className="grid h-full w-full gap-2 md:gap-3" style={{ 
                                    gridTemplateColumns: window.innerWidth < 768 ? 'repeat(6, minmax(0, 1fr))' : 'repeat(12, minmax(0, 1fr))', 
                                    gridTemplateRows: window.innerWidth < 768 ? 'repeat(18, minmax(0, 1fr))' : 'repeat(12, minmax(0, 1fr))' 
                                }}>
                                    {/* Overlay if Date/Time is not selected */}
                                    {(!data.date || !data.time) && (
                                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-[2.5rem] md:rounded-[3rem] bg-black/60 backdrop-blur-sm border border-white/5 transition-all duration-500">
                                            <div className="flex flex-col items-center p-6 text-center transform hover:scale-105 transition-transform duration-500">
                                                <div className="h-16 w-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
                                                    <Lock size={24} />
                                                </div>
                                                <h3 className="font-serif text-xl font-black text-white mb-2">Peta Terkunci</h3>
                                                <p className="text-xs text-white/60 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                                                    Atur jadwal kedatangan di panel kanan untuk melihat meja yang tersedia.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {tables.map((t: any) => {
                                        const isBooked = bookedTableIds.includes(t.id);
                                        const isSelected = data.resto_table_id === t.id;
                                        const isDisabled = !data.date || !data.time || isBooked;
                                        
                                        let bgClass = 'bg-white/[0.04] border-white/10 text-white/30 backdrop-blur-md shadow-inner';
                                        
                                        if (!isDisabled) {
                                            bgClass = isSelected 
                                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-none text-black shadow-[0_0_30px_rgba(249,115,22,0.5)] scale-110 z-30 ring-2 ring-orange-400/50 ring-offset-2 ring-offset-black' 
                                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-500/40';
                                        } else if (isBooked) {
                                            bgClass = 'bg-rose-500/5 border-rose-500/10 text-rose-500/40 cursor-not-allowed relative overflow-hidden';
                                        }

                                        return (
                                            <motion.button
                                                key={t.id}
                                                type="button"
                                                onClick={() => !isDisabled && setData('resto_table_id', t.id)}
                                                disabled={isDisabled}
                                                className={`relative flex flex-col items-center justify-center border transition-all duration-500 ${t.category === 'window' ? 'rounded-[2rem]' : 'rounded-[1.25rem]'} ${bgClass} group`}
                                                style={{ 
                                                    gridColumn: window.innerWidth < 768 
                                                        ? `${((t.pos_x - 1) % 6) + 1} / span ${t.capacity >= 6 ? 3 : (t.capacity >= 4 ? 2 : 1)}`
                                                        : `${t.pos_x} / span ${t.capacity >= 6 ? 3 : (t.capacity >= 4 ? 2 : 1)}`, 
                                                    gridRow: window.innerWidth < 768
                                                        ? `${Math.floor((t.pos_x - 1) / 6) * 3 + t.pos_y} / span 2`
                                                        : `${t.pos_y} / span 2` 
                                                }}
                                            >
                                                {isBooked && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-20 transform -rotate-12">
                                                        <div className="w-full h-px bg-rose-500"></div>
                                                    </div>
                                                )}
                                                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-tighter ${isSelected ? 'text-black' : ''}`}>{t.name}</span>
                                                {/* Tooltip on hover */}
                                                {!isDisabled && !isSelected && (
                                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 text-emerald-400 text-[10px] px-3 py-1 rounded-xl shadow-xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-1.5">
                                                        <CheckCircle2 size={10} />
                                                        Tersedia
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="minimal-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10 w-full max-w-md text-center space-y-8"
                        >
                            <div className="h-40 w-40 rounded-[3rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-500 glow-primary mb-10">
                                {data.type === 'takeaway' ? <Users size={60} /> : <MapPin size={60} />}
                            </div>
                            <h2 className="font-['Playfair_Display',serif] text-5xl font-black text-white tracking-tight">
                                {data.type === 'takeaway' ? 'Self ' : 'Gourmet '}
                                <span className="italic font-serif opacity-40">{data.type === 'takeaway' ? 'Pick-up' : 'Delivery'}</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                {data.type === 'takeaway' 
                                    ? 'Nikmati hidangan kami di mana pun Anda inginkan. Siap diambil sesuai jadwal pilihan Anda.'
                                    : 'Pengalaman Chef di rumah Anda. Kami mengantarkan eksklusivitas langsung ke pintu Anda.'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Side: Booking Form */}
            <div className="relative z-10 flex w-full flex-col py-12 px-6 md:w-1/2 md:p-16 lg:px-24 pt-20 md:pt-32 min-h-screen overflow-y-auto scrollbar-hide pb-32">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-lg mx-auto"
                >
                    <div className="mb-12 space-y-6">
                        <div className="flex p-1.5 bg-slate-100 dark:bg-white/[0.03] rounded-[2rem] border border-slate-200 dark:border-white/5">
                            {(['dine_in', 'delivery', 'takeaway'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setData('type', type)}
                                    className={`flex-1 py-3 h-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${data.type === type ? 'bg-orange-500 text-black shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {type.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Konfigurasi <br /><span className="italic font-serif opacity-40">Kehadiran</span></h1>
                    </div>

                    <form onSubmit={submit} className="space-y-10">
                        {/* Section 1: Schedule */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Calendar size={16} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">1. Schedule & Table</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arrival Date</label>
                                    <Input
                                        type="date"
                                        min={minDateLocal}
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Arrival Time</label>
                                    <Input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                        required
                                    />
                                </div>
                            </div>                             <div className="pt-2">
                                <AnimatePresence mode="wait">
                                    {data.type === 'dine_in' ? (
                                        data.resto_table_id ? (
                                            <motion.div 
                                                key="table-selected"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/5 px-6 py-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg font-black">
                                                        {tables.find((t: any) => t.id === data.resto_table_id)?.name}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Selected Table</p>
                                                        <p className="text-sm font-medium text-slate-500">Kapasitas {tables.find((t: any) => t.id === data.resto_table_id)?.capacity} Tamu</p>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" onClick={() => setData('resto_table_id', '')} className="text-rose-500 hover:bg-rose-500/10 font-black text-[10px] tracking-widest uppercase">
                                                    Batal
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="table-not-selected" className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Pilih meja di peta Interaktif</p>
                                            </motion.div>
                                        )
                                    ) : data.type === 'delivery' ? (
                                        <motion.div 
                                            key="delivery-address"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-4"
                                        >
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gourmet Delivery Address</label>
                                            <Textarea 
                                                placeholder="Lengkapi alamat pengiriman eksklusif Anda..."
                                                value={data.delivery_address}
                                                onChange={e => setData('delivery_address', e.target.value)}
                                                className="h-28 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold p-5"
                                                required={data.type === 'delivery'}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="takeaway-info"
                                            className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 text-center"
                                        >
                                            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Siap Diambil di Restoran</p>
                                            <p className="text-[10px] text-slate-500 mt-1 uppercase">Tanpa Reservasi Meja</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
>

                        {/* Section 2: Personal Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                    <Users size={16} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">2. Guest Information</h3>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-5">
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                        readOnly={!!auth.user}
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="relative group">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                                        <Input
                                            type="number"
                                            min="1"
                                            max="20"
                                            placeholder="Guest Count"
                                            value={data.guest_count}
                                            onChange={(e) => setData('guest_count', parseInt(e.target.value))}
                                            className="h-14 pl-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20"
                                            required
                                        />
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Special requests or dietary restrictions (Optional)"
                                    value={data.special_requests}
                                    onChange={(e) => setData('special_requests', e.target.value)}
                                    className="h-28 resize-none rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-orange-500/20 p-5"
                                />
                            </div>
                        </div>

                        {/* Optional: Loyalty Redemption */}
                        {auth.user && auth.user.points > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                                        <Lock size={16} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">3. Loyalty Privileges</h3>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => setData('use_points', !data.use_points)}
                                    className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between text-left group ${data.use_points ? 'bg-orange-500/5 border-orange-500 shadow-xl' : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-orange-500/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${data.use_points ? 'bg-orange-500 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-orange-500'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Tukarkan {Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100))} Poin</p>
                                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Dapatkan diskon Rp {(Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100)) * 100).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-12 rounded-full relative transition-colors ${data.use_points ? 'bg-orange-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                                        <motion.div 
                                            animate={{ x: data.use_points ? 24 : 4 }}
                                            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                                        />
                                    </div>
                                </button>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Anda memiliki {auth.user.points} fpt poin tersedia</p>
                            </div>
                        )}

                        {/* Section 4: Summary & Payment */}
                        <div className="glass-card p-10 rounded-[2.5rem] bg-orange-500 shadow-2xl shadow-orange-500/20 text-black overflow-hidden relative">
                            <CreditCard size={150} className="absolute -bottom-10 -right-10 text-black/5" />
                            
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b border-black/10 pb-4">
                                Strategic Summary
                            </h3>
                            
                            <div className="space-y-3 mb-10">
                                {items.length > 0 ? (
                                    items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm font-bold">
                                            <span className="opacity-60">{item.quantity}x {item.name}</span>
                                            <span>Rp {((Number(item.price)) * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                                        No pre-order menu items selected.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-t border-black/10 pt-6">
                                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Initial Commitment</span>
                                    <div className="text-right">
                                        {data.use_points && (
                                            <p className="text-[10px] font-black line-through opacity-40 mb-1 leading-none">
                                                Rp {dpAmount.toLocaleString('id-ID')}
                                            </p>
                                        )}
                                        <span className="text-3xl font-black tracking-tighter">
                                            Rp {(dpAmount - (data.use_points ? Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100)) * 100 : 0)).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-[200px]">
                                    Required down payment to secure your exclusive spot and pre-ordered delicacies.
                                </p>
                            </div>

                            <div className="mt-10">
                                <Button
                                    type="submit"
                                    disabled={processing || (data.type === 'dine_in' && !data.resto_table_id)}
                                    className="w-full h-16 rounded-[1.25rem] bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-50"
                                >
                                    Proceed to Settlement
                                    <ArrowRight size={16} className="ml-3" />
                                </Button>
                            </div>
                        </div>
                    </form>
                </motion.div>
                
                <AIChatbot />
            </div>
        </div>
    );
}

