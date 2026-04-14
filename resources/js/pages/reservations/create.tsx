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
        customer_phone: '',
        date: '',
        time: '',
        guest_count: 2,
        special_requests: '',
        resto_table_id: '',
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

            {/* Left Side: Interactive Floor Plan */}
            <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-24 md:min-h-screen md:w-1/2 lg:p-16 border-r border-white/5">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-30" />
                
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10 w-full max-w-xl flex flex-col items-center"
                >
                    <div className="mb-12 text-center space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase glow-primary">
                            <MapPin size={12} />
                            <span>Interactive Map</span>
                        </div>
                        <h2 className="font-['Playfair_Display',serif] text-4xl font-black text-white tracking-tight leading-tight">Pilih <span className="italic font-serif opacity-40">Lokasi</span> Spesifik Anda</h2>
                        <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">
                            {!data.date || !data.time 
                                ? 'Tentukan waktu kunjungan untuk melihat ketersediaan meja.'
                                : 'Pilih unit meja yang sesuai dengan kenyamanan Anda.'}
                        </p>
                    </div>

                    {/* Digital Floor Plan Frame */}
                    <div className="relative mx-auto aspect-square w-full max-w-md rounded-[3rem] border border-white/10 bg-black/40 p-8 shadow-3xl backdrop-blur-2xl ring-1 ring-white/5">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex h-8 w-40 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Panggung Utama</span>
                        </div>
                        
                        <div className="grid h-full w-full gap-3" 
                             style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gridTemplateRows: 'repeat(12, minmax(0, 1fr))' }}>
                            {tables.map((t: any) => {
                                const isBooked = bookedTableIds.includes(t.id);
                                const isSelected = data.resto_table_id === t.id;
                                const isDisabled = !data.date || !data.time || isBooked;
                                
                                let bgClass = 'bg-zinc-900/50 border-white/5 text-zinc-800';
                                
                                if (!isDisabled) {
                                    bgClass = isSelected 
                                        ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.4)] scale-110 z-20' 
                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 hover:scale-105 cursor-pointer';
                                } else if (isBooked) {
                                    bgClass = 'bg-rose-500/10 border-rose-500/30 text-rose-500 cursor-not-allowed';
                                }

                                const isRound = t.category === 'window';
                                
                                return (
                                    <motion.button
                                        key={t.id}
                                        whileHover={!isDisabled ? { scale: 1.1 } : {}}
                                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                        type="button"
                                        onClick={() => !isDisabled && setData('resto_table_id', t.id)}
                                        disabled={isDisabled}
                                        className={`relative flex flex-col items-center justify-center border transition-all duration-500 ${isRound ? 'rounded-full' : 'rounded-2xl'} ${bgClass}`}
                                        style={{ 
                                            gridColumn: `${t.pos_x} / span ${t.capacity >= 6 ? 3 : (t.capacity >= 4 ? 2 : 1)}`, 
                                            gridRow: `${t.pos_y} / span 2` 
                                        }}
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-tighter">{t.name}</span>
                                        {isBooked && <Lock size={8} className="absolute -bottom-1 -right-1 text-rose-500" />}
                                        {isSelected && <CheckCircle2 size={10} className="absolute -top-1 -right-1 text-black" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-10 flex flex-wrap justify-center gap-8 px-4">
                        {[
                            { color: 'bg-emerald-500/20 border-emerald-500/50', label: 'Tersedia' },
                            { color: 'bg-rose-500/20 border-rose-500/50', label: 'Dipesan' },
                            { color: 'bg-orange-500 border-orange-500', label: 'Pilihanmu' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2.5">
                                <div className={`h-3 w-3 rounded-full border ${item.color}`} />
                                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Booking Form */}
            <div className="relative z-10 flex w-full flex-col py-16 px-6 md:w-1/2 md:p-16 lg:px-24 pt-32 h-screen overflow-y-auto scrollbar-hide">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-lg mx-auto"
                >
                    <div className="mb-12 space-y-4">
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Konfigurasi <br /><span className="italic font-serif opacity-40">Kehadiran</span></h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-neutral-500 max-w-xs">
                            Lengkapi detail di bawah for memastikan pengalaman bersantap yang personal and eksklusif.
                        </p>
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
                            </div>

                            <div className="pt-2">
                                <AnimatePresence mode="wait">
                                    {data.resto_table_id ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-orange-500/5 px-6 py-4"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/20 font-black">
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
                                        <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Info size={20} className="text-slate-300 dark:text-neutral-700" />
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                                                    Pilih meja di peta Interaktif <br /> (Sisi Kiri Di Desktop)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

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

                        {/* Section 3: Summary & Payment */}
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
                                    <span className="text-3xl font-black tracking-tighter">
                                        Rp {dpAmount.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-[200px]">
                                    Required down payment to secure your exclusive spot and pre-ordered delicacies.
                                </p>
                            </div>

                            <div className="mt-10">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.resto_table_id}
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

