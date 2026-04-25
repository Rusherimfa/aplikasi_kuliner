import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Calendar, Clock, MapPin, QrCode, Search, Star, ReceiptText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';

export default function CustomerReservations({ reservations }: any) {
    const { __, locale } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: __('Riwayat Reservasi Saya'),
            href: '/reservations/history',
        },
    ];

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const isUpcoming = (date: string) => {
        const resDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return resDate >= today;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${__('Riwayat Reservasi Saya')} - Ocean's Resto`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{__('Riwayat Reservasi Saya')}</h1>
                    <p className="text-muted-foreground">{__('Pantau jadwal dan pembayaran tiket kedatangan Anda di bawah ini.')}</p>
                </div>

                <div className="grid gap-6">
                    {reservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
                            <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="text-xl font-semibold">{__('Belum Ada Reservasi')}</h3>
                            <p className="mt-2 text-muted-foreground max-w-sm">
                                {__('Anda belum memiliki riwayat reservasi bersama kami. Silakan pilih meja dan nikmati makan malam yang eksklusif.')}
                            </p>
                            <Button asChild className="mt-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold">
                                <Link href="/reservations/create">{__('Mulai Booking Meja')}</Link>
                            </Button>
                        </div>
                    ) : (
                        reservations.map((reservation: any) => (
                            <Card key={reservation.id} className="overflow-hidden border-border bg-card">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row shadow-sm">
                                        
                                        {/* Status & Date Side */}
                                        <div className="bg-muted/50 p-6 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-sky-500">
                                                        Booking ID: #{reservation.id.toString().padStart(6, '0')}
                                                    </span>
                                                    {reservation.status === 'confirmed' ? (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none">{__('Sukses')}</Badge>
                                                    ) : reservation.status === 'completed' ? (
                                                        <Badge variant="secondary" className="border-none">{__('Selesai')}</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-muted-foreground">{__('Menunggu')}</Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-['Playfair_Display',serif] text-foreground">
                                                    {new Date(reservation.date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </h3>
                                            </div>
                                            
                                            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5 bg-background/40 px-3 py-1.5 rounded-lg border border-border">
                                                    <Clock size={16} className="text-sky-500" />
                                                    <span>{reservation.time.substring(0, 5)} WIB</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-background/40 px-3 py-1.5 rounded-lg border border-border">
                                                    <Calendar size={16} className="text-sky-500" />
                                                    <span>{reservation.guest_count} Pax</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                                    <MapPin size={18} className="text-sky-500" />
                                                    {__('Meja Eksklusif')}: {reservation.resto_table?.name || __('Belum Dipilih')}
                                                </h4>
                                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                                    {__('Akan atas nama Bapak/Ibu')} <span className="font-semibold text-foreground">{reservation.customer_name}</span>. {' '}
                                                    <br/>
                                                    {__('Catatan khusus')}: {reservation.special_requests || '-'}
                                                </p>
                                                {reservation.menus && reservation.menus.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-border">
                                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">{__('Pre-Order Menu')}:</p>
                                                        <div className="flex flex-wrap gap-2 text-sm">
                                                            {reservation.menus.slice(0, 3).map((menu: any) => (
                                                                <span key={menu.id} className="bg-muted px-2.5 py-1 rounded-md text-foreground">
                                                                    {menu.name}
                                                                </span>
                                                            ))}
                                                            {reservation.menus.length > 3 && (
                                                                <span className="text-xs text-muted-foreground flex items-center">+{reservation.menus.length - 3} {__('lainnya')}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full border-t border-border pt-4">
                                                {reservation.status === 'confirmed' && isUpcoming(reservation.date) && (
                                                    <Button className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-900/20" asChild>
                                                        <a href={`/reservations/${reservation.id}`} target="_blank" rel="noopener noreferrer">
                                                            <QrCode size={18} className="mr-2" />
                                                            {__('Lihat QR-Code Check In')}
                                                        </a>
                                                    </Button>
                                                )}

                                                {reservation.payment_status === 'pending' && reservation.status === 'pending' && (
                                                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/40" asChild>
                                                        <Link href={`/reservations/payment/${reservation.id}`}>
                                                            <ReceiptText size={18} className="mr-2" />
                                                            {__('Selesaikan Pembayaran DP')}
                                                        </Link>
                                                    </Button>
                                                )}

                                                {reservation.status === 'completed' && (
                                                    <Button variant="outline" className="w-full sm:w-auto border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 active:scale-95 transition-transform">
                                                        <Star size={18} className="mr-2" />
                                                        {__('Berikan Ulasan Layanan')}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

CustomerReservations.layout = (page: any) => page;

