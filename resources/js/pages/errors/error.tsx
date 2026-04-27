import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Anchor, Compass, AlertTriangle, ShieldAlert, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLogoIcon from '@/components/app/app-logo-icon';

interface ErrorProps {
    status: number;
}

export default function ErrorPage({ status }: ErrorProps) {
    const title: Record<number, string> = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
        401: '401: Unauthorized',
        419: '419: Page Expired',
    };

    const description: Record<number, string> = {
        503: 'Kami sedang melakukan pemeliharaan rutin. Silakan kembali sesaat lagi.',
        500: 'Terjadi badai di server kami. Tim teknis sedang berupaya menenangkan ombak.',
        404: 'Maaf, halaman yang Anda cari telah hanyut ke dasar samudra.',
        403: 'Area ini terbatas. Anda tidak memiliki izin untuk menyelam di sini.',
        401: 'Identitas Anda belum terverifikasi untuk memasuki teluk ini.',
        419: 'Sesi Anda telah berakhir karena pasang surut air laut. Silakan muat ulang halaman.',
    };

    const icons: Record<number, any> = {
        503: Anchor,
        500: AlertTriangle,
        404: Compass,
        403: ShieldAlert,
        401: ShieldAlert,
        419: Waves,
    };

    const Icon = icons[status] || AlertTriangle;

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] font-['Inter',sans-serif] text-slate-800 dark:text-neutral-200 transition-colors duration-500 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <Head title={title[status] || 'Error'} />

            {/* Ambient Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-sky-500/5 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-sky-600/5 blur-[100px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl"
            >
                {/* Logo Section */}
                <div className="flex justify-center mb-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-12 w-12 rounded-2xl bg-sky-500 flex items-center justify-center shadow-xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                            <AppLogoIcon className="text-white h-8 w-8" />
                        </div>
                        <span className="font-['Playfair_Display',serif] text-2xl font-black tracking-tighter dark:text-white">
                            Ocean's <span className="italic text-sky-500">Resto</span>
                        </span>
                    </Link>
                </div>

                {/* Error Card */}
                <div className="glass-card bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[3rem] p-12 md:p-16 text-center shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                    
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                        className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500 mb-8 border border-sky-500/20 shadow-inner"
                    >
                        <Icon size={48} strokeWidth={1.5} />
                    </motion.div>

                    <h1 className="font-['Playfair_Display',serif] text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                        {status}
                    </h1>
                    
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-200 mb-6 tracking-tight uppercase tracking-[0.1em]">
                        {title[status]?.split(': ')[1] || 'Unknown Error'}
                    </h2>

                    <p className="text-lg font-medium text-slate-500 dark:text-neutral-500 max-w-md mx-auto mb-12 leading-relaxed">
                        {description[status] || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            variant="outline"
                            className="h-16 rounded-2xl px-8 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-[12px] font-black uppercase tracking-[0.2em]"
                        >
                            <button onClick={() => window.history.back()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </button>
                        </Button>
                        
                        <Button
                            asChild
                            className="h-16 rounded-2xl px-10 bg-sky-500 hover:bg-sky-600 text-black shadow-xl shadow-sky-500/20 text-[12px] font-black uppercase tracking-[0.2em]"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Return Home
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-white/20">
                        &copy; {new Date().getFullYear()} Ocean's Resto Premium &mdash; All Rights Reserved
                    </p>
                </div>
            </motion.div>

            {/* Decorative Waves at bottom */}
            <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none overflow-hidden h-32">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </div>
    );
}
