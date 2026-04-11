import { Head, Link } from '@inertiajs/react';
import Navbar from '@/pages/welcome/sections/navbar';
import Footer from '@/pages/welcome/sections/footer';
import { Button } from '@/components/ui/button';
import { CalendarRange, Clock, Users, ArrowRight, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ReservationHistory({ auth, reservations }: any) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'completed':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><CheckCircle2 size={12} /> Dikonfirmasi</span>;
            case 'awaiting_payment':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"><Clock3 size={12} /> Menunggu Pembayaran</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"><XCircle size={12} /> Ditolak / Dibatalkan</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"><Clock3 size={12} /> Menunggu Verifikasi</span>;
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-amber-100 selection:text-amber-900 dark:selection:bg-amber-900/30 dark:selection:text-amber-300 transition-colors duration-500">
            <Head title="Riwayat Reservasi - RestoWeb" />
            
            <Navbar auth={auth} dashboardUrl="/dashboard" mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="pt-24 pb-20 sm:pt-32 lg:pb-28">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-10 md:mb-16">
                        <h1 className="font-['Playfair_Display',serif] text-4xl font-bold text-foreground md:text-5xl mb-4">
                            Reservasi <span className="text-amber-600 dark:text-amber-500 italic">Saya</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Pantau status meja Anda dan lihat riwayat kunjungan makan bersama kami.
                        </p>
                    </div>

                    {/* Content */}
                    {reservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-border bg-card/50 px-6 py-20 text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 ring-8 ring-amber-50/50 dark:ring-amber-500/5">
                                <CalendarRange size={32} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-foreground">Belum Ada Reservasi</h3>
                            <p className="mb-8 max-w-sm text-muted-foreground leading-relaxed">
                                Anda belum pernah membuat reservasi meja. Pesan sekarang untuk mengamankan tempat Anda malam ini.
                            </p>
                            <Link href="/reservations/create">
                                <Button className="h-12 rounded-full bg-amber-600 px-8 font-semibold text-white hover:bg-amber-700">
                                    Pesan Meja Sekarang
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {reservations.map((r: any) => (
                                <Link href={`/reservations/${r.id}`} key={r.id} className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-200 dark:hover:border-neutral-700 sm:flex-row sm:items-center sm:p-8">
                                    <div className="flex-1">
                                        <div className="mb-4">{getStatusBadge(r.status)}</div>
                                        <h3 className="mb-2 font-['Playfair_Display',serif] text-2xl font-bold text-foreground">
                                            Meja untuk {r.guest_count} Orang
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><CalendarRange size={16} className="text-amber-500" /> {new Date(r.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-amber-500" /> {r.time} WIB</span>
                                            <span className="flex items-center gap-1.5"><Users size={16} className="text-amber-500" /> Atas Nama: {r.customer_name}</span>
                                        </div>
                                        
                                        {r.special_requests && (
                                            <div className="mt-4 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                                                <span className="block font-semibold mb-1 text-foreground">Catatan Khusus:</span>
                                                "{r.special_requests}"
                                            </div>
                                        )}
                                    </div>
                                    <div className="shrink-0 pt-4 sm:pt-0 sm:border-l sm:border-border sm:pl-8">
                                        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-2">ID Reservasi</p>
                                        <p className="font-mono text-sm text-foreground">#RES-{r.id.toString().padStart(4, '0')}</p>
                                        
                                        {r.status === 'awaiting_payment' ? (
                                            <Link href={`/reservations/payment/${r.id}`} className="mt-4 flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20">
                                                Bayar DP Sekarang <ArrowRight size={16} />
                                            </Link>
                                        ) : (
                                            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-amber-600 transition-transform group-hover:translate-x-1 dark:text-amber-500">
                                                Lihat Detail <ArrowRight size={16} />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
