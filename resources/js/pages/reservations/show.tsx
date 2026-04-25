import { Head, Link, useForm, router, useHttp } from '@inertiajs/react';
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
    Trash,
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
    CreditCard,
    Truck,
    Star,
    Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import BoutiqueChat from '@/components/app/boutique-chat';
import GourmetTrackingMap from '@/components/app/gourmet-tracking-map';
import { useTranslations } from '@/hooks/use-translations';

export default function ReservationShow({ auth, reservation, availableMenus }: any) {
    const { __, locale } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const http = useHttp();
    
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

    useEffect(() => {
        // Listen for main reservation status changes
        const resChannel = window.Echo.channel(`reservations.${reservation.id}`)
            .listen('.ReservationStatusUpdated', (e: any) => {
                router.reload({ 
                    preserveScroll: true,
                    onSuccess: () => toast.success(__('Status reservasi Anda telah diperbarui!'))
                });
            })
            .listen('.DishStatusUpdated', (e: any) => {
                router.reload({ 
                    preserveScroll: true,
                    onSuccess: () => toast.success(`${__('Piring')} "${e.itemName}" ${__('kini')} ${e.status.toUpperCase()}`)
                });
            })
            .listen('.service.request.created', (e: any) => {
                router.reload({ preserveScroll: true });
            });

        return () => {
            resChannel.stopListening('.ReservationStatusUpdated');
            resChannel.stopListening('.DishStatusUpdated');
        };
    }, [reservation.id, __]);

    const handleDelete = () => {
        if (confirm(__('Anda yakin ingin membatalkan reservasi ini? Tindakan ini tidak dapat diurungkan.'))) {
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
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const displayMenus = isEditing ? data.menus : reservation.menus;
    const currentTotal = calculateTotal(displayMenus);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 overflow-hidden">
            <Head title={`Boutique Pass #RES-${reservation.id} - Ocean's Resto`} />
            
            {/* Ambient Lighting */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-600/5 blur-[120px]" />

            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    
                    {/* Header Navigation */}
                    <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
                        <Link href="/reservations/history" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-sky-500 transition-colors">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {__('Kembali ke Riwayat')}
                        </Link>

                        <div className="flex gap-4">
                            {isConfirmed && reservation.status !== 'completed' && !isEditing && (
                                <Button onClick={() => router.put(`/reservations/${reservation.id}`, { status: 'completed' })} className="h-11 px-6 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all">
                                    <CheckCircle2 size={14} className="mr-2" /> {__('Selesaikan Kedatangan')}
                                </Button>
                            )}
                            {isPending && !isEditing && (
                                <div className="flex gap-3">
                                    <Button onClick={() => setIsEditing(true)} variant="outline" className="h-11 px-6 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:text-sky-500 transition-all">
                                        <PencilLine size={14} className="mr-2" /> {__('Ubah Reservasi')}
                                    </Button>
                                    <Button onClick={handleDelete} variant="destructive" className="h-11 px-6 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                                        <Trash2 size={14} className="mr-2" /> {__('Batalkan')}
                                    </Button>
                                </div>
                            )}
                            {isEditing && (
                                <Button onClick={() => { setIsEditing(false); setData('menus', reservation.menus) }} className="h-11 px-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                    {__('Batal Ubah')}
                                </Button>
                            )}
                        </div>
                    </div>

                        {/* Gourmet Service Hub UI */}
                        <div className="space-y-10">
                            {reservation.checked_in_at && reservation.status === 'confirmed' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-sky-500 rounded-[2.5rem] p-8 shadow-2xl shadow-sky-500/20 text-black relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Bell size={120} />
                                    </div>
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-2">Gourmet Service Hub</h3>
                                            <h2 className="text-2xl font-black font-['Playfair_Display',serif] tracking-tight leading-tight">{__('Butuh Bantuan?')}</h2>
                                            <p className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">{__('Satu sentuhan untuk pelayanan eksklusif kami.')}</p>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                                            {[
                                                { type: 'waiter', label: __('Pelayan'), icon: Bell },
                                                { type: 'bill', label: __('Minta Bill'), icon: CreditCard },
                                                { type: 'refill', label: __('Refill Air'), icon: Utensils },
                                                { type: 'napkins', label: __('Tissue'), icon: Sparkles },
                                            ].map((service) => (
                                                <button
                                                    key={service.type}
                                                    onClick={() => {
                                                        http.post('/service-requests', {
                                                            reservation_id: reservation.id,
                                                            type: service.type,
                                                        }, {
                                                            onSuccess: () => {
                                                                toast.success(__('Permintaan Terkirim'), {
                                                                    description: __('Staff kami akan segera menuju meja Anda.')
                                                                });
                                                            },
                                                            onError: () => {
                                                                toast.error(__('Gagal mengirim permintaan.'));
                                                            }
                                                        });
                                                    }}
                                                    className="bg-black/10 hover:bg-black/20 border border-black/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                                                >
                                                    <service.icon size={18} className="group-hover:animate-bounce" />
                                                    <span className="text-[8px] font-black uppercase tracking-tighter text-center">{service.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* The Pass Card */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card relative rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] backdrop-blur-3xl overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600" />
                                
                                <div className="p-10 md:p-14">
                                    <div className="flex items-start justify-between mb-16">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles size={14} className="text-sky-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-white/20">{__('Official Dining Pass')}</span>
                                            </div>
                                            <h1 className="font-['Playfair_Display',serif] text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                                Boutique <span className="italic font-serif opacity-40 text-sky-500">Pass</span>
                                            </h1>
                                            <p className="font-mono text-sm font-bold text-sky-500/60 uppercase tracking-widest mt-2 px-3 py-1 bg-sky-500/5 inline-block rounded-lg">#RES-{reservation.id.toString().padStart(4, '0')}</p>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-3 text-right">
                                             <span className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl
                                                ${isConfirmed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                ${reservation.status === 'rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : ''}
                                                ${reservation.status === 'pending' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : ''}
                                                ${isAwaitingPayment ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''}
                                            `}>
                                                <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${isConfirmed ? 'bg-emerald-400' : (reservation.status === 'rejected' ? 'bg-rose-500' : 'bg-sky-400')}`} />
                                                {isConfirmed && __('Experience Confirmed')}
                                                {reservation.status === 'completed' && __('Completed')}
                                                {reservation.status === 'rejected' && __('Cancelled')}
                                                {reservation.status === 'pending' && __('Awaiting Verification')}
                                                {isAwaitingPayment && __('Awaiting Payment')}
                                            </span>
                                            
                                            <div className="flex gap-3">
                                                <a 
                                                    href={`https://wa.me/6281234567890?text=Halo%20Admin%20Ocean's Resto,%20saya%20ingin%20bertanya%20seputar%20reservasi%20saya%20dengan%20ID:%20RES-${reservation.id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="group/wa inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-500/60 hover:text-emerald-400 transition-colors"
                                                >
                                                    WhatsApp <MessageCircle size={14} className="group-hover/wa:rotate-12 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time Live Chat Component */}
                                    <BoutiqueChat reservationId={reservation.id} currentUser={auth.user} />

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
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{__('Reservation Date')}</Label>
                                                        <Input type="date" value={data.date} onChange={e => setData('date', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-sky-500/20 transition-all font-sans" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{__('Time Slot')}</Label>
                                                        <Input type="time" value={data.time} onChange={e => setData('time', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-sky-500/20 transition-all font-sans" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{__('Guest Capacity')}</Label>
                                                    <Input type="number" min="1" max="20" value={data.guest_count} onChange={e => setData('guest_count', e.target.value)} required className="h-16 rounded-2xl bg-white/5 border-white/10 text-lg font-bold px-6 focus:ring-sky-500/20 transition-all font-sans" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{__('Special Requests & Celebrations')}</Label>
                                                    <Textarea placeholder={__('Birthday, Anniversary, or special dietary needs...')} value={data.special_requests} onChange={e => setData('special_requests', e.target.value)} rows={4} className="rounded-3xl bg-white/5 border-white/10 text-lg font-medium p-6 focus:ring-sky-500/20 transition-all font-sans" />
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
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><CalendarRange size={14} className="text-sky-500" /> {__('Date')}</span>
                                                    <span className="text-xl font-bold dark:text-white block">{new Date(reservation.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><Clock size={14} className="text-sky-500" /> {__('Time')}</span>
                                                    <span className="text-xl font-bold dark:text-white block">{reservation.time} <span className="text-sm opacity-30">WIB</span></span>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.2em]"><Users size={14} className="text-sky-500" /> {__('Seats')}</span>
                                                    <span className="text-xl font-bold dark:text-white block">{reservation.guest_count} {__('People')}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                     {/* Experience Journey Stepper */}
                                    <div className="mt-12 mb-8">
                                        <div className="flex items-center justify-between relative">
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-white/5 -translate-y-1/2 z-0" />
                                            
                                            {[
                                                { label: __('Booked'), icon: Ticket, active: true },
                                                { label: __('Check-in'), icon: ShieldCheck, active: isCheckedIn },
                                                { label: __('Cooking'), icon: ChefHat, active: reservation.menus.some((m: any) => m.pivot?.status === 'cooking' || m.pivot?.status === 'preparing') },
                                                { label: __('Enjoy'), icon: Utensils, active: reservation.status === 'completed' || reservation.menus.every((m: any) => m.pivot?.status === 'ready' || m.pivot?.status === 'served') }
                                            ].map((step, idx) => (
                                                <div key={idx} className="relative z-10 flex flex-col items-center">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${step.active ? 'bg-sky-500 border-sky-500 text-[#0A0A0B]' : 'bg-slate-50 dark:bg-[#0A0A0B] border-slate-200 dark:border-white/10 text-slate-300 dark:text-white/20'}`}>
                                                        <step.icon size={18} />
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest mt-2 ${step.active ? 'text-sky-500' : 'text-slate-300 dark:text-white/10'}`}>{step.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {!isEditing && reservation.special_requests && (
                                        <div className="mt-12 group/note relative">
                                            <div className="absolute -left-10 top-0 bottom-0 w-1 bg-sky-500/20 rounded-full group-hover:bg-sky-500 transition-colors" />
                                            <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-3 block">{__('Boutique Notes')}</span>
                                            <p className="text-lg font-medium text-slate-500 dark:text-neutral-400 italic">"{reservation.special_requests}"</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-white/[0.04] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 shadow-xl">
                                            <MapPin size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{__('Reserved Table')}</p>
                                            <p className="text-xl font-black text-white">{reservation.resto_table ? `${__('Table Section')} ${reservation.resto_table.name}` : __('Priority Waiting List')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
                                            <CreditCard size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{__('Entry Fee Status')}</p>
                                            <p className="text-xl font-black text-white">{reservation.payment_status === 'paid' ? __('Paid & Secured') : __('Awaiting Payment')}</p>
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
                                    <h3 className="text-2xl font-black text-white font-['Playfair_Display',serif] tracking-tight mb-8">{__('Customize Your Courses')}</h3>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                                        {availableMenus.map((menu: any) => {
                                            const inCart = data.menus.find((m: any) => m.id === menu.id);
                                            return (
                                            <div key={menu.id} className="glass-card p-6 rounded-[2rem] border border-white/5 flex flex-col h-full bg-white/[0.01] hover:bg-white/5 hover:border-sky-500/20 transition-all group/card">
                                                <div className="flex-1 mb-6">
                                                    <p className="text-sm font-black text-white uppercase group-hover/card:text-sky-500 transition-colors">{menu.name}</p>
                                                    <p className="text-xs text-sky-500 italic mt-1 font-black">{formatRupiah(menu.price)}</p>
                                                </div>
                                                {inCart ? (
                                                    <div className="flex items-center justify-between bg-black/40 p-2 rounded-2xl border border-white/5">
                                                        <button type="button" onClick={() => updateMenuQuantity(menu.id, -1)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-sky-500 hover:text-black transition-all">
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-black text-sm w-6 text-center text-white">{inCart.quantity || inCart.pivot?.quantity || 1}</span>
                                                        <button type="button" onClick={() => updateMenuQuantity(menu.id, 1)} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-sky-500 hover:text-black transition-all">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button type="button" onClick={() => addMenu(menu)} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black">
                                                        {__('Add to Pass')}
                                                    </Button>
                                                )}
                                            </div>
                                        )})}
                                    </div>
                                </motion.div>
                            )}

                             {/* Review Section (Visible when completed) */}
                            {reservation.status === 'completed' && !reservation.review && (
                                <ReviewForm reservationId={reservation.id} />
                            )}

                            {reservation.review && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-[3rem] border border-sky-500/20 bg-sky-500/5 p-10 shadow-3xl text-center"
                                >
                                    <div className="h-16 w-16 rounded-full bg-sky-500 mx-auto mb-6 flex items-center justify-center text-black">
                                        <Star size={32} fill="currentColor" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white font-['Playfair_Display',serif] mb-2">{__('Terima Kasih!')}</h3>
                                    <p className="text-sm text-sky-500/60 font-medium">{__('Ulasan Anda telah kami terima untuk meningkatkan pelayanan kami.')}</p>
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
                                    className="rounded-[3rem] border border-sky-500/20 bg-black p-10 shadow-3xl text-center relative overflow-hidden group/qr"
                                >
                                    <div className="absolute inset-0 bg-grid-white opacity-5" />
                                    
                                    <div className="relative mb-10 flex items-center justify-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20">
                                            <QrCode size={20} />
                                        </div>
                                        <h2 className="font-['Playfair_Display',serif] text-2xl font-black text-white tracking-tight">{__('Digital Ticket')}</h2>
                                    </div>

                                    <div className="relative">
                                        {isCheckedIn ? (
                                            <div className="py-12 px-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center gap-6">
                                                <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                                    <ShieldCheck size={40} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-emerald-400 uppercase tracking-tighter">{__('Verified Arrival')}</p>
                                                    <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">
                                                        {new Date(reservation.checked_in_at).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <div className="inline-block rounded-[2.5rem] bg-white p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] ring-1 ring-white/10 group-hover/qr:scale-105 transition-transform duration-700">
                                                    <img src={qrImageUrl} alt="QR Code" className="w-full h-auto rounded-2xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">{__('Tunjukkan pada Staf saat Tiba')}</p>
                                                    <div className="h-1 w-20 bg-sky-500/40 mx-auto rounded-full" />
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
                                    <Utensils size={24} className="text-sky-500" /> {__('Ocean\'s Selection')}
                                </h2>
                                
                                <div className="flex-1">
                                    {displayMenus.length === 0 ? (
                                        <div className="py-12 text-center rounded-[2rem] border border-dashed border-white/5 bg-white/[0.01]">
                                            <ChefHat size={32} className="mx-auto text-white/10 mb-4" />
                                            <p className="text-sm text-white/20 italic font-medium">{__('Belum ada pilihan menu.')}</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-6 mb-10">
                                            {displayMenus.map((item: any, idx: number) => {
                                                const qty = item.quantity || item.pivot?.quantity || 1;
                                                return (
                                                <li key={idx} className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-sky-500 transition-colors leading-tight">{item.name}</p>
                                                            {item.pivot?.status && (
                                                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0 border-0 ${
                                                                    item.pivot.status === 'ready' ? 'text-emerald-400' : 
                                                                    item.pivot.status === 'cooking' ? 'text-sky-400 animate-pulse' : 
                                                                    item.pivot.status === 'preparing' ? 'text-blue-400' : 'text-white/20'
                                                                }`}>
                                                                    {__(item.pivot.status)}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[.2em]">{formatRupiah(item.price)} <span className="text-sky-500/40 italic">x {qty}</span></p>
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
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{__('Estimated Total')}</p>
                                            <p className="text-sky-500 font-serif italic text-sm">{__('Fine Dining Selection')}</p>
                                        </div>
                                        <p className="text-4xl font-black text-white tracking-tighter">{formatRupiah(currentTotal)}</p>
                                    </div>
                                    
                                    {isEditing ? (
                                        <Button type="submit" form="edit-form" disabled={processing} className="w-full h-16 rounded-2xl bg-sky-500 text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-sky-500/20 hover:bg-white hover:scale-[1.02] transition-all">
                                            {processing ? __('Crafting Pass...') : __('Finalize Reservation')}
                                        </Button>
                                    ) : (
                                        isAwaitingPayment && (
                                            <Link href={`/reservations/payment/${reservation.id}`}>
                                                <Button className="w-full h-16 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-white hover:text-black hover:scale-[1.02] transition-all">
                                                    {__('Complete Secure Payment')}
                                                </Button>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </motion.div>
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

function ReviewForm({ reservationId }: { reservationId: number }) {
    const { __ } = useTranslations();
    const { data, setData, post, processing } = useForm({
        rating: 5,
        message: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/reservations/${reservationId}/reviews`, {
            onSuccess: () => toast.success(__('Terima kasih atas ulasan Anda!')),
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[3.5rem] bg-white dark:bg-white/[0.03] border border-sky-500/30 p-12 shadow-[0_50px_100px_-20px_rgba(255,165,0,0.1)] relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={120} className="text-sky-500" />
            </div>
            
            <h3 className="text-3xl font-black text-white font-['Playfair_Display',serif] tracking-tight mb-2">{__('How was your stay?')}</h3>
            <p className="text-slate-400 text-sm mb-10 font-medium tracking-wide">{__('Help us perfect the boutique experience.')}</p>
            
            <form onSubmit={submit} className="space-y-8 relative z-10">
                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500/60">{__('Boutique Rating')}</Label>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setData('rating', star)}
                                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${data.rating >= star ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20 scale-110' : 'bg-white/5 text-white/20 hover:bg-white/10'}`}
                            >
                                <Star size={20} fill={data.rating >= star ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500/60">{__('Share Your Experience')}</Label>
                    <Textarea 
                        placeholder={__('What did you love about your gastronomy journey?')}
                        value={data.message}
                        onChange={e => setData('message', e.target.value)}
                        className="rounded-[2rem] bg-black/40 border-white/5 focus:border-sky-500/50 min-h-[140px] p-6 text-white"
                    />
                </div>

                <Button disabled={processing} className="w-full h-16 rounded-[2rem] bg-sky-500 text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-sky-500/20">
                    {processing ? __('Sharing Experience...') : __('Post Testimonial')}
                </Button>
            </form>
        </motion.div>
    );
}

