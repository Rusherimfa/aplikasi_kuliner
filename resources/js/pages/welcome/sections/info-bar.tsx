import { Clock, MapPin, CalendarDays } from 'lucide-react';

export default function InfoBar() {
    return (
        <div className="border-y border-slate-200/50 bg-white/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 divide-y divide-slate-200 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="flex flex-col items-center justify-center p-4">
                        <Clock className="mb-3 h-6 w-6 text-amber-700" />
                        <h3 className="mb-1 font-semibold text-slate-900">Opening Hours</h3>
                        <p className="text-sm text-slate-500">Mon – Sun: 11:00 AM – 11:00 PM</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 pt-8 md:pt-4">
                        <MapPin className="mb-3 h-6 w-6 text-amber-700" />
                        <h3 className="mb-1 font-semibold text-slate-900">Location</h3>
                        <p className="text-sm text-slate-500">Sudirman Central Business District, ID</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 pt-8 md:pt-4">
                        <CalendarDays className="mb-3 h-6 w-6 text-amber-700" />
                        <h3 className="mb-1 font-semibold text-slate-900">Reservations</h3>
                        <p className="text-sm text-slate-500">Book online or call (021) 555-0123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
