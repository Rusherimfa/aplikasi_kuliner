import { Head, Link } from '@inertiajs/react';
import Navbar from '@/pages/welcome/sections/navbar';
import Footer from '@/pages/welcome/sections/footer';
import { Button } from '@/components/ui/button';
import { 
    CalendarRange, 
    Clock, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    Clock3, 
    XCircle, 
    MapPin, 
    CalendarPlus, 
    RotateCcw,
    Utensils,
    ChefHat,
    History as HistoryIcon,
    Sparkles
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { useTranslations } from '@/hooks/use-translations';
import BoutiqueChat from '@/components/app/boutique-chat';
import { MessageCircle } from 'lucide-react';

export default function ReservationHistory({ auth, reservations }: any) {
    const { __, locale } = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const { addItem, setCartOpen } = useCart();

    const sortedReservations = useMemo(() => {
        const now = new Date();
        const upcoming = reservations.filter((r: any) => new Date(r.date) >= now && r.status !== 'rejected');
        const past = reservations.filter((r: any) => new Date(r.date) < now || r.status === 'rejected');
        return { upcoming, past };
    }, [reservations]);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { label: string, color: string, icon: any }> = {
            'confirmed': { label: __('Dikonfirmasi'), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
            'completed': { label: __('Selesai'), color: 'bg-white/5 text-white/40 border-white/10', icon: CheckCircle2 },
            'awaiting_payment': { label: __('Menunggu Bayar'), color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]', icon: Clock3 },
            'rejected': { label: __('Dibatalkan'), color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: XCircle },
            'pending': { label: __('Verifikasi'), color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: Clock3 }
        };
        const config = variants[status] || variants.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} px-3 py-1 text-[10px] font-black uppercase tracking-wider`}>
                <Icon size={10} /> {config.label}
            </span>
        );
    };

    const handleReorder = (menus: any[]) => {
        menus.forEach(menu => {
            addItem({
                id: menu.id,
                name: menu.name,
                price: menu.price
            });
        });
        setCartOpen(true);
    };

    const generateCalendarLink = (r: any) => {
        const title = encodeURIComponent(`Dining at Ocean's Resto - Table for ${r.guest_count}`);
        const dateStr = r.date.replace(/-/g, '');
        const timeStr = r.time.replace(/:/g, '');
        const dates = `${dateStr}T${timeStr}00/${dateStr}T${parseInt(timeStr.substring(0,2))+2}${timeStr.substring(2)}00`;
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=Reservation%20Confirmed%20#RES-${r.id}&location=Ocean's Resto%20Boutique%20Dining`;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-sans text-foreground transition-colors duration-500 selection:bg-sky-500/30 overflow-hidden">
            <Head title={`${__('My Experiences')} — Ocean's Resto`} />
            
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-sky-500/5 blur-[140px]" />
            <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-600/5 blur-[120px]" />

            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-32 pb-32 relative z-10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="h-1 w-8 rounded-full bg-sky-500" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-sky-500 uppercase">{__('Personal Journey')}</span>
                            </div>
                            <h1 className="font-['Playfair_Display',serif] text-5xl font-black text-slate-900 dark:text-white md:text-6xl tracking-tighter">
                                My <span className="italic font-serif opacity-40 text-sky-500">Experiences</span>
                            </h1>
                            <p className="mt-4 text-lg font-medium text-slate-500 dark:text-neutral-500 max-w-lg">
                                {__('Pantau reservasi mendatang dan kenang momen kuliner berharga Anda bersama kami.')}
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-white/50 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-xl">
                            <button 
                                onClick={() => setActiveTab('upcoming')}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'upcoming' ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Sparkles size={14} /> {__('Upcoming')}
                            </button>
                            <button 
                                onClick={() => setActiveTab('past')}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'past' ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-white'}`}
                            >
                                <HistoryIcon size={14} /> {__('Past')}
                            </button>
                        </div>
                    </div>

                    {/* Timeline / List Content */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-8"
                        >
                            {sortedReservations[activeTab].length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-2">
                                    <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-10 text-slate-300 dark:text-neutral-800">
                                        {activeTab === 'upcoming' ? <CalendarRange size={48} /> : <HistoryIcon size={48} />}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 italic font-serif">
                                        {activeTab === 'upcoming' ? __('No Adventures Planned') : __('A Fresh Start Awaits')}
                                    </h3>
                                    <p className="text-slate-500 dark:text-neutral-500 font-medium mb-12 max-w-sm text-center">
                                        {activeTab === 'upcoming' 
                                            ? __('Jadwalkan momen kuliner istimewa Anda malam ini.') 
                                            : __('Mari ciptakan kenangan baru di meja terbaik kami.')}
                                    </p>
                                    <Link href="/reservations/create">
                                        <Button className="h-14 rounded-2xl px-10 bg-sky-500 text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-sky-500/10">
                                            {__('Buat Reservasi')} <ArrowRight size={18} className="ml-3" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                sortedReservations[activeTab].map((r: any, idx: number) => (
                                    <motion.div 
                                        key={r.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative"
                                    >
                                        <div className="glass-card flex flex-col md:flex-row gap-8 p-8 md:p-12 rounded-[3.5rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-3xl shadow-3xl hover:border-sky-500/30 transition-all duration-700">
                                            {/* Left Info */}
                                            <div className="flex-1 space-y-8">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    {getStatusBadge(r.status)}
                                                    <span className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-[.3em]">#RES-{r.id.toString().padStart(4, '0')}</span>
                                                </div>

                                                <div className="space-y-3">
                                                    <h3 className="font-['Playfair_Display',serif] text-4xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-500 transition-colors">
                                                        {__('Meja untuk')} {r.guest_count} {__('Orang')}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 dark:text-neutral-400">
                                                        <span className="flex items-center gap-2.5"><CalendarRange size={16} className="text-sky-500" /> {new Date(r.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                        <span className="flex items-center gap-2.5"><Clock size={16} className="text-sky-500" /> {r.time} WIB</span>
                                                        <span className="flex items-center gap-2.5"><ChefHat size={16} className="text-sky-500" /> {r.customer_name}</span>
                                                    </div>
                                                </div>

                                                {/* Menus List */}
                                                {r.menus && r.menus.length > 0 && (
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em]">{__('Ocean\'s Selection')}</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {r.menus.map((m: any) => (
                                                                <div key={m.id} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/5 dark:bg-white/5 border border-sky-500/10 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-white/60">
                                                                    <Utensils size={12} className="text-sky-500" /> {m.name} <span className="opacity-30">x{m.pivot.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right Actions */}
                                            <div className="md:w-72 flex flex-col justify-center gap-4 md:pl-12 md:border-l border-slate-200 dark:border-white/5">
                                                {r.status === 'awaiting_payment' ? (
                                                    <Link href={`/reservations/payment/${r.id}`} className="w-full h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                                                        {__('Selesaikan Pembayaran')} <ArrowRight size={16} className="ml-2" />
                                                    </Link>
                                                ) : (
                                                    <>
                                                        {activeTab === 'upcoming' && (
                                                            <>
                                                                <a 
                                                                    href={generateCalendarLink(r)}
                                                                    target="_blank"
                                                                    className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-black transition-all group/btn"
                                                                >
                                                                    <CalendarPlus size={16} className="mr-3 text-sky-500 group-hover/btn:text-black" /> {__('Add to Calendar')}
                                                                </a>
                                                                <a 
                                                                    href="https://maps.google.com"
                                                                    target="_blank"
                                                                    className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-black transition-all group/btn"
                                                                >
                                                                    <MapPin size={16} className="mr-3 text-sky-500 group-hover/btn:text-black" /> {__('Get Directions')}
                                                                </a>
                                                            </>
                                                        )}
                                                        {activeTab === 'past' && r.menus && r.menus.length > 0 && (
                                                            <Button 
                                                                onClick={() => handleReorder(r.menus)}
                                                                className="w-full h-14 bg-sky-500 text-black rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-xl shadow-sky-500/20 hover:scale-[1.02]"
                                                            >
                                                                <RotateCcw size={16} className="mr-3" /> {__('Re-Order Selection')}
                                                            </Button>
                                                        )}
                                                        <Link href={`/reservations/${r.id}`} className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                                                            {__('View Details')}
                                                        </Link>
                                                        <Button 
                                                            onClick={() => setActiveChatId(activeChatId === r.id ? null : r.id)}
                                                            variant="outline"
                                                            className={`w-full h-14 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all mt-2 ${
                                                                activeChatId === r.id ? 'bg-sky-500 text-black border-sky-500' : 'border-white/10 hover:bg-white/5 text-white/60'
                                                            }`}
                                                        >
                                                            <MessageCircle size={16} className="mr-2" /> {__('Chat with Staff')}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            
            {activeChatId && (
                <BoutiqueChat reservationId={activeChatId} currentUser={auth.user} />
            )}
            <Footer />
        </div>
    );
}


