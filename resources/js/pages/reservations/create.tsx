import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { dashboard } from '@/routes';

// Shared Components
import Navbar from '../welcome/sections/navbar';
import AIChatbot from '@/components/app/ai-chatbot';

export default function CreateReservation() {
    const { auth, currentTeam } = usePage().props as any;
    const dashboardUrl = dashboard().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        date: '',
        time: '',
        guest_count: 2,
        special_requests: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reservations');
    };

    return (
        <>
            <Head title="Pesan Meja - RestoWeb" />

            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-['Inter',sans-serif] text-slate-600 selection:bg-amber-100 selection:text-amber-900 md:flex-row">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* Left Side: Editorial Banner */}
                <div className="relative hidden flex-col justify-end overflow-hidden bg-slate-900 p-12 shadow-2xl md:flex md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop"
                        alt="Meja Restoran"
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.85] transition-transform duration-10000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                    
                    <div className="relative z-10 max-w-lg pb-12">
                        <span className="mb-4 block text-sm font-medium tracking-widest text-amber-500 uppercase">
                            Reservasi Eksklusif
                        </span>
                        <h1 className="mb-6 font-['Playfair_Display',serif] text-5xl leading-tight font-bold text-white lg:text-6xl">
                            Meja Anda Menanti
                        </h1>
                        <p className="mb-8 text-lg font-light text-white/80">
                            Pesan tempat Anda untuk malam gastronomi yang tak terlupakan. Kami menyiapkan setiap detail hingga sempurna bahkan sebelum Anda tiba.
                        </p>
                        <div className="flex items-center gap-4 text-white/40">
                            <div className="h-px flex-1 bg-white/20"></div>
                            <span className="text-xs font-semibold tracking-widest uppercase">
                                RestoWeb
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div className="relative flex w-full flex-col items-center justify-center bg-white p-6 pt-32 pb-24 md:w-1/2 md:p-12 lg:p-24 shadow-[-20px_0_40px_rgb(0,0,0,0.02)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent opacity-50 md:hidden"></div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="mb-3 font-['Playfair_Display',serif] text-3xl font-bold text-slate-900">
                                Detail Reservasi
                            </h2>
                            <p className="text-sm text-slate-500">
                                Silakan isi formulir di bawah ini. Untuk rombongan lebih dari 20 orang, hubungi kami secara langsung.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
                                    <Input
                                        type="text"
                                        placeholder="Nama Lengkap Anda"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="mt-1.5 h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                        required
                                    />
                                    {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name as string}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Email Utama</label>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="mt-1.5 h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                            required
                                        />
                                        {errors.customer_email && <p className="mt-1 text-xs text-red-500">{errors.customer_email as string}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">No. WhatsApp</label>
                                        <Input
                                            type="tel"
                                            placeholder="+62 8..."
                                            value={data.customer_phone}
                                            onChange={(e) => setData('customer_phone', e.target.value)}
                                            className="mt-1.5 h-12 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                            required
                                        />
                                        {errors.customer_phone && <p className="mt-1 text-xs text-red-500">{errors.customer_phone as string}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-slate-200" />

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Calendar size={16} className="text-amber-500" />
                                    Tanggal
                                </label>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="h-14 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                    required
                                    style={{ colorScheme: 'light' }}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Clock size={16} className="text-amber-500" />
                                        Waktu
                                    </label>
                                    <Input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="h-14 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                        required
                                        style={{ colorScheme: 'light' }}
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-xs text-red-500">{errors.time}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <Users size={16} className="text-amber-500" />
                                        Tamu
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.guest_count}
                                        onChange={(e) => setData('guest_count', parseInt(e.target.value))}
                                        className="h-14 rounded-2xl border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                        required
                                    />
                                    {errors.guest_count && (
                                        <p className="mt-1 text-xs text-red-500">{errors.guest_count}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Catatan Tambahan <span className="font-normal text-slate-400">(Opsional)</span>
                                </label>
                                <Textarea
                                    placeholder="Alergi, hari jadi, preferensi meja khusus..."
                                    value={data.special_requests}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('special_requests', e.target.value)
                                    }
                                    className="min-h-[120px] resize-none rounded-3xl border-slate-200 bg-white p-4 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-amber-500/20 shadow-sm"
                                />
                                {errors.special_requests && (
                                    <p className="mt-1 text-xs text-red-500">{errors.special_requests}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-base font-semibold text-white shadow-xl shadow-amber-900/20 transition-all duration-300 hover:scale-105 hover:from-amber-400 hover:to-amber-600 disabled:opacity-70"
                            >
                                Konfirmasi Pemesanan 
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
