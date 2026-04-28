import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
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
import { useTranslations } from '@/hooks/use-translations';

export default function CreateReservation() {
    const { __, locale } = useTranslations();
    const { auth, tables = [], availableMenus = [], bookedTableIds = [] } = usePage().props as any;
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
        type: 'dine_in',
        use_points: false,
    });

    const [selectedMenus, setSelectedMenus] = useState<any[]>([]);
    const [preorder, setPreorder] = useState(false);

    const foodTotal = selectedMenus.reduce((total, item) => total + (item.price * item.quantity), 0);
    const dpAmount = foodTotal > 0 ? foodTotal * 0.5 : 50000;

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const minDateLocal = today.toISOString().slice(0, 10);

    useEffect(() => {
        if (data.date && data.time) {
            router.get(window.location.pathname, { date: data.date, time: data.time }, {
                preserveState: true,
                preserveScroll: true,
                only: ['bookedTableIds'],
            });
            if (data.resto_table_id && bookedTableIds.includes(data.resto_table_id)) {
                setData('resto_table_id', '');
            }
        }
    }, [data.date, data.time]);

    useEffect(() => {
        if (data.resto_table_id) {
            const table = tables.find((t: any) => t.id === data.resto_table_id);
            if (table) {
                setData('guest_count', table.capacity);
            }
        } else {
            setData('guest_count', 0);
        }
    }, [data.resto_table_id]);

    useEffect(() => {
        if (auth.user) {
            const savedState = sessionStorage.getItem('pending_reservation');
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);
                    setData(prev => ({
                        ...prev,
                        date: parsed.date || prev.date,
                        time: parsed.time || prev.time,
                        resto_table_id: parsed.resto_table_id || prev.resto_table_id
                    }));
                } catch(e) {}
                sessionStorage.removeItem('pending_reservation');
            }
        }
    }, [auth.user]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/reservations', {
            ...data,
            menus: preorder ? selectedMenus.map(i => ({ id: i.id, quantity: i.quantity, notes: '' })) : []
        });
    };

    return (
        <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-foreground transition-colors duration-500 flex flex-col md:flex-row overflow-hidden">
            <Head title={__('Pesan Meja — Pengalaman Kuliner Premium')} />
            
            <Navbar
                auth={auth}
                dashboardUrl={dashboardUrl}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Left Side: Dynamic Content (Map for Dine-in, Minimalist for Others) */}
            <div className={`relative flex min-h-[40vh] md:min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 md:py-24 md:w-1/2 lg:p-16 border-r border-white/5 transition-all duration-700 ${data.type !== 'dine_in' ? 'bg-sky-500/5' : ''}`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
                
                <motion.div 
                    key="map-view"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="relative z-10 w-full max-w-xl flex flex-col items-center"
                >
                            <div className="mb-12 text-center space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-1.5 text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">
                                    <MapPin size={12} />
                                    <span>{__('Interactive Map')}</span>
                                </div>
                                <h2 className="font-serif text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{__('Pilih')} <span className="italic font-serif opacity-40">{__('Lokasi Spesifik Anda')}</span></h2>
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
                                                <div className="h-16 w-16 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4 border border-sky-500/20 shadow-[0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
                                                    <Lock size={24} />
                                                </div>
                                                <h3 className="font-serif text-xl font-black text-white mb-2">{__('Peta Terkunci')}</h3>
                                                <p className="text-xs text-white/60 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                                                    {__('Atur jadwal kedatangan di panel kanan untuk melihat meja yang tersedia.')}
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
                                                ? 'bg-gradient-to-br from-sky-400 to-sky-600 border-none text-black shadow-[0_0_30px_rgba(249,115,22,0.5)] scale-110 z-30 ring-2 ring-sky-400/50 ring-offset-2 ring-offset-black' 
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
                                                        {__('Tersedia')}
                                                    </div>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
            </div>

            {/* Right Side: Booking Form */}
            <div className="relative z-10 flex w-full flex-col py-12 px-6 md:w-1/2 md:p-16 lg:px-24 pt-20 md:pt-32 min-h-screen overflow-y-auto scrollbar-hide pb-32">
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-lg mx-auto"
                >
                    <div className="mb-12 space-y-6">
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{__('Makan di Tempat &')} <br /><span className="italic font-serif opacity-40">{__('Reservasi Meja')}</span></h1>
                        <p className="text-slate-500 text-sm font-medium">{__('Boking meja untuk acara spesial Anda di restoran kami.')}</p>
                    </div>

                    <form onSubmit={submit} className="space-y-10">
                        {/* Section 1: Schedule */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                                    <Calendar size={16} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{__('1. Schedule & Table')}</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{__('Arrival Date')}</label>
                                    <Input
                                        type="date"
                                        min={minDateLocal}
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{__('Arrival Time')}</label>
                                    <Input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20"
                                        required
                                    />
                                </div>
                            </div>                             <div className="pt-2">
                                <AnimatePresence mode="wait">
                                        {data.resto_table_id ? (
                                            <motion.div 
                                                key="table-selected"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center justify-between rounded-2xl border border-sky-500/20 bg-sky-500/5 px-6 py-4"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-black shadow-lg font-black">
                                                        {tables.find((t: any) => t.id === data.resto_table_id)?.name}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{__('Selected Table')}</p>
                                                        <p className="text-sm font-medium text-slate-500">{__('Kapasitas')} {tables.find((t: any) => t.id === data.resto_table_id)?.capacity} {__('Tamu')}</p>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" onClick={() => setData('resto_table_id', '')} className="text-rose-500 hover:bg-rose-500/10 font-black text-[10px] tracking-widest uppercase">
                                                    {__('Batal')}
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="table-not-selected" className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{__('Pilih meja di peta Interaktif')}</p>
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Section 2: Personal Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                                    <Users size={16} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{__('2. Guest Information')}</h3>
                            </div>

                            {auth.user ? (
                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        placeholder={__('Nama Lengkap')}
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-5">
                                        <Input
                                            type="email"
                                            placeholder={__('Email Address')}
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20"
                                            readOnly={!!auth.user}
                                            required
                                        />
                                        <Input
                                            type="tel"
                                            placeholder={__('WhatsApp Number')}
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="h-14 rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="relative group">
                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                            <Input
                                                type="text"
                                                value={data.resto_table_id ? `${tables.find((t: any) => t.id === data.resto_table_id)?.capacity} ${__('Tamu (Sesuai Meja)')}` : __('Pilih Meja Terlebih Dahulu')}
                                                className="h-14 pl-14 rounded-2xl border-border bg-slate-50 dark:bg-white/[0.01] font-semibold focus:ring-0 text-slate-500 cursor-not-allowed"
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        placeholder={__('Special requests or dietary restrictions (Optional)')}
                                        value={data.special_requests}
                                        onChange={(e) => setData('special_requests', e.target.value)}
                                        className="h-28 resize-none rounded-2xl border-border bg-white dark:bg-white/[0.02] font-semibold focus:ring-sky-500/20 p-5"
                                    />
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-sky-500/5 border border-sky-500/20 rounded-3xl">
                                    <Users size={48} className="mx-auto text-sky-500/50 mb-4" />
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">{__('Autentikasi Diperlukan')}</h4>
                                    <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">{__('Silakan login terlebih dahulu untuk melanjutkan proses reservasi. Data Anda aman bersama kami.')}</p>
                                    <a 
                                        href="/reservations/auth-intent"
                                        onClick={() => {
                                            sessionStorage.setItem('pending_reservation', JSON.stringify({
                                                date: data.date,
                                                time: data.time,
                                                resto_table_id: data.resto_table_id,
                                            }));
                                        }}
                                        className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-sky-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-sky-400 transition-colors"
                                    >
                                        {__('Login untuk Melanjutkan')}
                                    </a>
                                </div>
                            )}
                        </div>

                        {auth.user && (
                            <>
                                {/* Section 3: Pre-order Menu */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle2 size={16} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{__('3. Pilihan Menu Berkelas')}</h3>
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => {
                                    setPreorder(!preorder);
                                    if(preorder) setSelectedMenus([]); // clear if unchecked
                                }}
                                className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between text-left group ${preorder ? 'bg-emerald-500/5 border-emerald-500 shadow-xl' : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-emerald-500/30'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${preorder ? 'bg-emerald-500 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-emerald-500'}`}>
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{__('Pre-order Makanan?')}</p>
                                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{__('Siapkan santapan sebelum tiba untuk menghemat waktu.')}</p>
                                    </div>
                                </div>
                                <div className={`h-6 w-12 rounded-full relative transition-colors ${preorder ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                                    <motion.div 
                                        animate={{ x: preorder ? 24 : 4 }}
                                        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                                    />
                                </div>
                            </button>

                            <AnimatePresence>
                                {preorder && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden space-y-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {availableMenus.map((menu: any) => {
                                                const selectedItem = selectedMenus.find(i => i.id === menu.id);
                                                const quantity = selectedItem ? selectedItem.quantity : 0;

                                                const handleAdd = () => {
                                                    setSelectedMenus(prev => {
                                                        const exists = prev.find(i => i.id === menu.id);
                                                        if(exists) return prev.map(i => i.id === menu.id ? {...i, quantity: i.quantity + 1} : i);
                                                        return [...prev, { id: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
                                                    });
                                                };

                                                const handleRemove = () => {
                                                    setSelectedMenus(prev => {
                                                        const exists = prev.find(i => i.id === menu.id);
                                                        if(!exists) return prev;
                                                        if(exists.quantity === 1) return prev.filter(i => i.id !== menu.id);
                                                        return prev.map(i => i.id === menu.id ? {...i, quantity: i.quantity - 1} : i);
                                                    });
                                                };

                                                return (
                                                    <div key={menu.id} className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-white dark:bg-white/[0.02]">
                                                        <div className="flex gap-4 items-center">
                                                            <div className="h-16 w-16 bg-slate-100 dark:bg-white/5 rounded-xl overflow-hidden shrink-0">
                                                                <img src={menu.image_path.startsWith('http') ? menu.image_path : `/storage/${menu.image_path}`} alt={menu.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-sm font-black tracking-tight">{menu.name}</span>
                                                                <span className="text-[10px] text-sky-500 font-bold mt-1">Rp {Number(menu.price).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
                                                            <span className="text-[10px] text-slate-400 font-bold">{__('Qty')}</span>
                                                            <div className="flex items-center gap-3">
                                                                <button type="button" onClick={handleRemove} className="h-6 w-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs">-</button>
                                                                <span className="text-xs font-black w-4 text-center">{quantity}</span>
                                                                <button type="button" onClick={handleAdd} className="h-6 w-6 rounded-full bg-sky-500 text-black flex items-center justify-center font-bold text-xs">+</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Optional: Loyalty Redemption */}
                        {auth.user && auth.user.points > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                                        <Lock size={16} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">{__('4. Loyalty Privileges')}</h3>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => setData('use_points', !data.use_points)}
                                    className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between text-left group ${data.use_points ? 'bg-sky-500/5 border-sky-500 shadow-xl' : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-sky-500/30'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${data.use_points ? 'bg-sky-500 text-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-sky-500'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{__('Tukarkan')} {Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100))} {__('Poin')}</p>
                                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">{__('Dapatkan diskon')} Rp {(Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100)) * 100).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-12 rounded-full relative transition-colors ${data.use_points ? 'bg-sky-500' : 'bg-slate-200 dark:bg-white/10'}`}>
                                        <motion.div 
                                            animate={{ x: data.use_points ? 24 : 4 }}
                                            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                                        />
                                    </div>
                                </button>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{__('Anda memiliki')} {auth.user.points} {__('fpt poin tersedia')}</p>
                            </div>
                        )}

                        {/* Section 4: Summary & Payment */}
                        <div className="glass-card p-10 rounded-[2.5rem] bg-sky-500 shadow-2xl shadow-sky-500/20 text-black overflow-hidden relative">
                            <CreditCard size={150} className="absolute -bottom-10 -right-10 text-black/5" />
                            
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b border-black/10 pb-4">
                                {__('Strategic Summary')}
                            </h3>
                            
                            <div className="space-y-3 mb-10">
                                {selectedMenus.length > 0 ? (
                                    selectedMenus.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm font-bold opacity-80">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>Rp {(item.price * item.quantity).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                                        {__('No pre-order menu items selected.')}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-t border-black/10 pt-6">
                                    <span className="text-xs font-black uppercase tracking-widest opacity-60">{__('Initial Commitment')}</span>
                                    <div className="text-right">
                                        {data.use_points && (
                                            <p className="text-[10px] font-black line-through opacity-40 mb-1 leading-none">
                                                Rp {dpAmount.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                            </p>
                                        )}
                                        <span className="text-3xl font-black tracking-tighter">
                                            Rp {(dpAmount - (data.use_points ? Math.min(auth.user.points, Math.floor((dpAmount * 0.5) / 100)) * 100 : 0)).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed max-w-[200px]">
                                    {__('Required down payment to secure your exclusive spot and pre-ordered delicacies.')}
                                </p>
                            </div>

                            <div className="mt-10">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.resto_table_id}
                                    className="w-full h-16 rounded-[1.25rem] bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-slate-900 active:scale-95 disabled:opacity-50"
                                >
                                    {__('Kirim Pengajuan Reservasi')}
                                    <ArrowRight size={16} className="ml-3" />
                                </Button>
                            </div>
                        </div>
                        </>
                        )}
                    </form>
                </motion.div>
                
                <AIChatbot />
            </div>
        </div>
    );
}


