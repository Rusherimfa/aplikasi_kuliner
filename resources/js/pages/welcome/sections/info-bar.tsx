import { Clock, MapPin, CalendarDays, ChefHat } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

export default function InfoBar() {
    const { __ } = useTranslations();

    const INFO_ITEMS = [
        {
            icon: Clock,
            label: __('Opening Hours'),
            value: __('Sen – Jum: 08:00 – 22:00'),
        },
        {
            icon: MapPin,
            label: __('Location'),
            value: __('Ruko Bandar, Balikpapan'),
        },
        {
            icon: CalendarDays,
            label: __('Reservation'),
            value: __('Online or Call (0542) 739439'),
        },
        {
            icon: ChefHat,
            label: __('Signature Cuisine'),
            value: __('Fresh Sea-to-Table Experience'),
        },
    ];

    return (
        <div className="relative overflow-hidden bg-background py-16 md:py-24 transition-colors duration-1000 border-y border-black/5 dark:border-white/5">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-8 md:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className="group flex flex-col gap-6 p-10 rounded-[3rem] glass-elite border border-black/5 dark:border-white/5 transition-all duration-700 hover:translate-y-[-12px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xl transition-all duration-700 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 group-hover:scale-110">
                                <Icon size={28} strokeWidth={1.5} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary block mb-3 opacity-80">
                                    {label}
                                </span>
                                <p className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight italic opacity-90 group-hover:opacity-100 transition-opacity">
                                    {value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
