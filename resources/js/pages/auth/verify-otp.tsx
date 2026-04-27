import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import AuthLayout from '@/layouts/auth-layout';
import otpRoutes from '@/routes/otp';
import { useTranslations } from '@/hooks/use-translations';

export default function VerifyOtp({ email, status }: { email: string; status?: string }) {
    const { __ } = useTranslations();
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(otpRoutes.verify().url);
    };

    return (
        <AuthLayout title={__('Security Verification')} description={__('Complete your two-factor authentication.')}>
            <Head title={__('OTP Verification — Boutique Security')} />

            <div className="w-full max-w-sm mx-auto space-y-10">
                <div className="text-center space-y-4">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mx-auto h-20 w-20 rounded-[2rem] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500"
                    >
                        <ShieldCheck size={40} strokeWidth={1.5} />
                    </motion.div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white font-['Playfair_Display',serif] tracking-tight">{__('One-Time')} <span className="italic font-serif opacity-40">{__('Code')}</span></h2>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <Mail size={12} className="text-slate-400" />
                            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{email}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 max-w-[240px] leading-relaxed mt-2">
                            {__('We have sent a 6-digit security code to your email. Please enter it below.')}
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
                                maxLength={6}
                                placeholder="0 0 0 0 0 0"
                                className="h-20 text-center text-4xl font-black tracking-[0.5em] rounded-[1.5rem] border-slate-200 dark:border-white/10 dark:bg-black/40 focus:ring-sky-500/20 shadow-inner"
                                onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                                required
                                autoFocus
                            />
                        </div>
                        {errors.otp && (
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center mt-2">{errors.otp}</p>
                        )}
                        {status && (
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center mt-2">{status}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Button 
                            className="w-full h-16 rounded-[1.25rem] bg-sky-500 text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-sky-500/30 transition-all hover:bg-sky-600 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            disabled={processing || data.otp.length !== 6}
                        >
                            {__('Verify Now')}
                            <ArrowRight size={16} className="ml-3" />
                        </Button>

                        <div className="pt-4 text-center">
                            <Link
                                href={otpRoutes.resend().url}
                                method="post"
                                alt=""
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
