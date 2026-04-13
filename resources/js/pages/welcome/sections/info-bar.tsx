import { Clock, MapPin, CalendarDays, ChefHat } from 'lucide-react';

const INFO_ITEMS = [
    {
        icon: Clock,
        label: 'Jam Buka',
        value: 'Sen – Ming: 11:00 – 23:00',
    },
    {
        icon: MapPin,
        label: 'Lokasi',
        value: 'Sudirman CBD, Jakarta Pusat',
    },
    {
        icon: CalendarDays,
        label: 'Reservasi',
        value: 'Online atau hubungi (021) 555-0123',
    },
    {
        icon: ChefHat,
        label: 'Chef Eksekutif',
        value: 'Chef Ahmad Reza, 15 thn pengalaman',
    },
];

export default function InfoBar() {
    return (
        <div className="relative overflow-hidden bg-[#FDFBF7] dark:bg-neutral-950 border-y border-slate-200/60 dark:border-neutral-800 py-12 transition-colors duration-500">
            {/* Decorative grain */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
                }}
            />
            {/* orange glow accent */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/40 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="group flex items-center gap-4 rounded-2xl border border-orange-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-sm transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 dark:hover:border-orange-900/50 dark:hover:bg-orange-500/10 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-500 ring-1 ring-orange-200 dark:ring-orange-900 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase">
                                    {label}
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-white">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
