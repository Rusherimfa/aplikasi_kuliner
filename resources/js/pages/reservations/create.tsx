import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import { store } from '@/routes/reservations';

// Shared Components
import Navbar from '../welcome/sections/navbar';

export default function CreateReservation() {
    const { auth, currentTeam, seatingLayout = [] } = usePage().props as any;
    const dashboardUrl = currentTeam ? dashboard(currentTeam.slug).url : '/';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        date: '',
        time: '',
        guest_count: 2,
        table_seat_id: null as number | null,
        special_requests: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store().url);
    };

    return (
        <>
            <Head title="Pesan Meja - RestoWeb" />

            <div className="flex min-h-screen flex-col bg-[#0A0A0B] font-['Inter',sans-serif] text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 md:flex-row">
                <Navbar
                    auth={auth}
                    dashboardUrl={dashboardUrl}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* Left Side: Editorial Banner */}
                <div className="relative hidden flex-col justify-end overflow-hidden bg-[#0A0A0B] p-12 shadow-2xl md:flex md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop"
                        alt="Meja Restoran"
                        className="absolute inset-0 h-full w-full object-cover opacity-20 transition-transform duration-10000 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent"></div>
                    
                    <div className="relative z-10 max-w-lg pb-12">
                        <span className="mb-4 block text-sm font-medium tracking-widest text-amber-500 uppercase">
                            Reservasi Eksklusif
                        </span>
                        <h1 className="mb-6 font-['Playfair_Display',serif] text-5xl leading-tight font-bold text-white lg:text-6xl">
                            Meja Anda Menanti
                        </h1>
                        <p className="mb-8 text-lg font-light text-white/60">
                            Pesan tempat Anda untuk malam gastronomi yang tak terlupakan. Kami menyiapkan setiap detail hingga sempurna bahkan sebelum Anda tiba.
                        </p>
                        <div className="flex items-center gap-4 text-white/30">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <span className="text-xs font-semibold tracking-widest uppercase">
                                RestoWeb
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div className="relative flex w-full flex-col items-center justify-center bg-[#0A0A0B] p-6 pt-32 pb-24 md:w-1/2 md:p-12 lg:p-24">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/5 to-transparent opacity-50 md:hidden"></div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="mb-3 font-['Playfair_Display',serif] text-3xl font-bold text-white">
                                Detail Reservasi
                            </h2>
                            <p className="text-sm text-white/50">
                                Silakan isi formulir di bawah ini. Untuk rombongan lebih dari 20 orang, hubungi kami secara langsung.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                                    <Calendar size={16} className="text-amber-500" />
                                    Tanggal
                                </label>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="h-14 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/10 focus:ring-amber-500/50"
                                    required
                                    style={{ colorScheme: 'dark' }}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-xs text-red-400">{errors.date}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                                        <Clock size={16} className="text-amber-500" />
                                        Waktu
                                    </label>
                                    <Input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) => setData('time', e.target.value)}
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/10 focus:ring-amber-500/50"
                                        required
                                        style={{ colorScheme: 'dark' }}
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-xs text-red-400">{errors.time}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                                        <Users size={16} className="text-amber-500" />
                                        Tamu
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.guest_count}
                                        onChange={(e) => setData('guest_count', parseInt(e.target.value))}
                                        className="h-14 rounded-2xl border-white/10 bg-white/5 px-4 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/10 focus:ring-amber-500/50"
                                        required
                                    />
                                    {errors.guest_count && (
                                        <p className="mt-1 text-xs text-red-400">{errors.guest_count}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">
                                    Pilih Kursi
                                </label>
                                <div className="max-h-56 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-3">
                                    {seatingLayout.length === 0 && (
                                        <p className="text-sm text-white/50">
                                            Denah kursi belum tersedia.
                                        </p>
                                    )}

                                    {seatingLayout.map((table: any) => (
                                        <div key={table.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                                            <p className="mb-2 text-xs font-semibold tracking-wide text-amber-400">
                                                {table.code} · {table.name}
                                            </p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {table.seats.map((seat: any) => {
                                                    const selected = data.table_seat_id === seat.id;
                                                    const disabled = seat.is_reserved || !seat.is_active;

                                                    return (
                                                        <button
                                                            key={seat.id}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => setData('table_seat_id', seat.id)}
                                                            className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                                                                seat.is_reserved
                                                                    ? 'cursor-not-allowed border-rose-500/30 bg-rose-500/20 text-rose-200'
                                                                    : !seat.is_active
                                                                      ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                                                                      : selected
                                                                        ? 'border-amber-400 bg-amber-500/25 text-amber-100'
                                                                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                                                            }`}
                                                            title={
                                                                seat.is_reserved
                                                                    ? 'Sudah dipesan'
                                                                    : !seat.is_active
                                                                      ? 'Kursi sedang nonaktif'
                                                                      : 'Klik untuk pilih kursi'
                                                            }
                                                        >
                                                            {seat.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.table_seat_id && (
                                    <p className="mt-1 text-xs text-red-400">{errors.table_seat_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">
                                    Catatan Tambahan <span className="font-normal text-white/30">(Opsional)</span>
                                </label>
                                <Textarea
                                    placeholder="Alergi, hari jadi, preferensi meja khusus..."
                                    value={data.special_requests}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setData('special_requests', e.target.value)
                                    }
                                    className="min-h-[120px] resize-none rounded-3xl border-white/10 bg-white/5 p-4 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:bg-white/10 focus:ring-amber-500/50"
                                />
                                {errors.special_requests && (
                                    <p className="mt-1 text-xs text-red-400">{errors.special_requests}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 text-base font-semibold text-white shadow-xl shadow-amber-900/40 transition-all duration-300 hover:from-amber-400 hover:to-amber-600 disabled:opacity-70"
                            >
                                Konfirmasi Pemesanan 
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
