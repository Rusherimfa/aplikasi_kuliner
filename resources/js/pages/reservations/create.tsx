import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateReservation() {
    const { data, setData, post, processing, errors } = useForm({
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
            <Head title="Book a Table - RestoWeb" />

            <div className="flex min-h-screen flex-col bg-slate-50 font-['Inter',sans-serif] text-slate-800 md:flex-row">
                {/* Left Side: Editorial Banner */}
                <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 shadow-2xl md:flex md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop"
                        alt="Restaurant Table"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                    />
                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900/50 px-4 py-2 text-slate-300 backdrop-blur-md transition-colors hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            <span className="text-sm font-medium">
                                Return Home
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <h1 className="mb-6 font-['Playfair_Display',serif] text-5xl leading-tight font-bold text-white lg:text-6xl">
                            Your Table Awaits
                        </h1>
                        <p className="mb-8 text-lg font-light text-slate-300">
                            Reserve your spot for an unforgettable evening of
                            culinary excellence. We prepare every detail to
                            perfection before you even arrive.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-500/50"></div>
                            <span className="text-sm font-medium tracking-widest text-amber-500 uppercase">
                                RestoWeb
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Form */}
                <div className="relative flex w-full items-center justify-center bg-white p-6 md:w-1/2 md:p-12 lg:p-24">
                    <div className="w-full max-w-md">
                        {/* Mobile back button */}
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 md:hidden"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back</span>
                        </Link>

                        <div className="mb-10">
                            <h2 className="mb-2 font-['Playfair_Display',serif] text-3xl font-bold text-slate-900">
                                Reservation Details
                            </h2>
                            <p className="text-sm text-slate-500">
                                Please fill out the form below. For parties
                                larger than 20, contact us directly.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <Calendar
                                        size={16}
                                        className="text-amber-700"
                                    />
                                    Date
                                </label>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                    className="h-12 border-slate-200 bg-slate-50 focus:border-amber-500 focus:ring-amber-500"
                                    required
                                />
                                {errors.date && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Clock
                                            size={16}
                                            className="text-amber-700"
                                        />
                                        Time
                                    </label>
                                    <Input
                                        type="time"
                                        value={data.time}
                                        onChange={(e) =>
                                            setData('time', e.target.value)
                                        }
                                        className="h-12 border-slate-200 bg-slate-50"
                                        required
                                    />
                                    {errors.time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.time}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Users
                                            size={16}
                                            className="text-amber-700"
                                        />
                                        Guests
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={data.guest_count}
                                        onChange={(e) =>
                                            setData(
                                                'guest_count',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className="h-12 border-slate-200 bg-slate-50"
                                        required
                                    />
                                    {errors.guest_count && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.guest_count}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Special Requests{' '}
                                    <span className="font-normal text-slate-400">
                                        (Optional)
                                    </span>
                                </label>
                                <Textarea
                                    placeholder="Allergies, anniversaries, specific table preferences..."
                                    value={data.special_requests}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) =>
                                        setData(
                                            'special_requests',
                                            e.target.value,
                                        )
                                    }
                                    className="min-h-[120px] resize-none border-slate-200 bg-slate-50"
                                />
                                {errors.special_requests && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.special_requests}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-base text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800"
                            >
                                Confirm Reservation <ArrowRight size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
