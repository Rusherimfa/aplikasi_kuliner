import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/app/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';
import { Monitor } from 'lucide-react';

export default function Appearance() {
    return (
        <>
            <Head title="Tampilan Antarmuka" />
            <h1 className="sr-only">Tampilan Antarmuka</h1>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold tracking-tight text-foreground">Tampilan Antarmuka</h2>
                        <p className="text-xs text-muted-foreground">Sesuaikan mode tampilan akun Anda (Terang / Gelap / Sistem)</p>
                    </div>
                </div>
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Tampilan Antarmuka',
            href: editAppearance(),
        },
    ],
};
