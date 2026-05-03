import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import AuthLayout from '@/layouts/auth-layout';
import otpRoutes from '@/routes/otp';
import { useTranslations } from '@/hooks/use-translations';

export default function VerifyOtp() {
    const { __ } = useTranslations();
    const { email, status } = usePage().props as any;
    const { warning } = (usePage().props as any).flash || {};

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(otpRoutes.verify().url);
    };

    return (
        <AuthLayout 
            title={__('Security Verification')}
            description={__('Complete your two-factor authentication.')}
        >
            <Head title={__('OTP Verification — Boutique Security')} />

            <div className="w-full max-w-sm mx-auto space-y-8">
                <div className="text-center space-y-4">
                    {warning && (
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-6 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 text-center text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 backdrop-blur-md"
                        >
                            {warning}
                        </motion.div>
                    )}
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto h-20 w-20 rounded-[2rem] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500"
                    >
                        <ShieldCheck size={40} strokeWidth={1.5} />
                    </motion.div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <Mail size={12} className="text-slate-400" />
                            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{email}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mt-2 transition-colors">
                            {__('Kami telah mengirimkan kode keamanan 6-digit ke WhatsApp dan Email Anda. Silakan masukkan di bawah ini.')}
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="space-y-2">
                        <div className="relative group">
                            <Input
                                id="otp"
                                type="text"
                                name="otp"
                                value={data.otp}
                                onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                placeholder="000000"
                                className="h-20 text-center text-4xl font-black tracking-[0.5em] rounded-[1.5rem] border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white focus:ring-sky-500/20 shadow-inner transition-colors"
                                required
                                autoFocus
                            />
                        </div>
                        {status && (
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center mt-2">{status}</p>
                        )}
                        {errors.otp && (
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center mt-2">{errors.otp}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Button 
                            className="w-full h-16 rounded-[1.25rem] bg-sky-500 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-sky-500/30 transition-all hover:bg-sky-600 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            disabled={processing || data.otp.length !== 6}
                        >
                            {__('Verify Now')}
                            <ArrowRight size={16} className="ml-3" />
                        </Button>

                        <div className="pt-4 text-center">
                            <Link
                                href={otpRoutes.resend().url}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors"
                            >
                                <RefreshCw size={12} /> {__('Resend Code')}
                            </Link>
                        </div>
                    </div>
                </form>

                <div className="pt-10 border-t border-slate-100 dark:border-white/5 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-neutral-700">
                        Boutique Concierge Security System
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
