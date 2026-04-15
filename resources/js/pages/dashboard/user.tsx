import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarPlus, Sparkles, UtensilsCrossed, LogOut, CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { logout } from '@/routes';

type Props = {
    roleLabel: string;
};

export default function UserDashboard({ roleLabel }: Props) {
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
        };
    };
    const [showSuccessPopup, setShowSuccessPopup] = useState(Boolean(flash?.success));

    return (
        <>
            <Head title="Dashboard User" />

            <div className="flex h-full flex-1 flex-col justify-center gap-6 bg-slate-50 px-6 py-10">
                <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/20">
                        <Sparkles size={18} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Selamat datang di Dashboard {roleLabel}
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Kelola reservasi pribadi Anda dan jelajahi menu restoran dengan cepat.
                    </p>

                    <div className="mt-4">
                        <Link href={logout()} as="button">
                            <Button
                                variant="outline"
                                className="rounded-xl border-rose-200 bg-white text-rose-600 shadow-sm hover:bg-rose-50 hover:text-rose-700"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <Link href="/reservations/create">
                            <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:from-amber-400 hover:to-amber-600">
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Buat Reservasi
                            </Button>
                        </Link>
                        <Link href="/catalog">
                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            >
                                <UtensilsCrossed className="mr-2 h-4 w-4" />
                                Lihat Menu
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
                <DialogContent className="max-w-sm rounded-2xl border-emerald-200/60 bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-emerald-700">
                            <CircleCheckBig className="h-5 w-5" />
                            Berhasil Menambahkan
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            {flash?.success}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
