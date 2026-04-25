import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, KeyRound, Lock, Shield, ShieldCheck, ShieldOff, Zap, ShieldAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import TwoFactorRecoveryCodes from '@/components/auth/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/auth/two-factor-setup-modal';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

import { useTranslations } from '@/hooks/use-translations';
import SettingsLayout from '@/layouts/settings/layout';

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { __ } = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title={__('Account Security')} />
            
            <div className="space-y-12 pb-20 sm:pb-0">
                {/* Change Password Card - Cinematic Glass */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[3rem] border border-black/5 dark:border-white/5 bg-muted/20 dark:bg-white/[0.02] p-8 sm:p-12 shadow-xl dark:shadow-2xl backdrop-blur-xl"
                >
                    <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                                <KeyRound size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{__('Security Protocol')}</h2>
                                <p className="text-muted-foreground/60 font-medium">{__('Fortify your presence with a complex digital cipher.')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500/10 border border-sky-500/20">
                            <Zap size={14} className="text-sky-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">{__('High Strength Required')}</span>
                        </div>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errs) => {
                            if (errs.password) passwordInput.current?.focus();
                            if (errs.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="grid gap-10 sm:grid-cols-2"
                    >
                        {({ errors: formErrors, processing, recentlySuccessful, setData }) => (
                            <>
                                <div className="sm:col-span-2 grid gap-3">
                                    <Label htmlFor="current_password" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                        {__('Current Cipher')}
                                    </Label>
                                    <div className="group relative">
                                        <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="h-16 pl-14 rounded-2xl border-black/5 dark:border-white/5 bg-muted/30 dark:bg-white/5 text-foreground dark:text-white text-lg font-medium placeholder:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                            autoComplete="current-password"
                                            placeholder={__('Verify your existing access...')}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                        />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500" />
                                    </div>
                                    <InputError className="ml-2" message={formErrors.current_password} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                        {__('New Cipher')}
                                    </Label>
                                    <div className="group relative">
                                        <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="h-16 pl-14 rounded-2xl border-black/5 dark:border-white/5 bg-muted/30 dark:bg-white/5 text-foreground dark:text-white text-lg font-medium placeholder:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                            autoComplete="new-password"
                                            placeholder={__('The new sequence...')}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                    </div>
                                    <InputError className="ml-2" message={formErrors.password} />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="password_confirmation" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                        {__('Confirm Sequence')}
                                    </Label>
                                    <div className="group relative">
                                        <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="h-16 pl-14 rounded-2xl border-black/5 dark:border-white/5 bg-muted/30 dark:bg-white/5 text-foreground dark:text-white text-lg font-medium placeholder:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                            autoComplete="new-password"
                                            placeholder={__('Mirror the cipher...')}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                    <InputError className="ml-2" message={formErrors.password_confirmation} />
                                </div>

                                <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-8 pt-6">
                                    <Button
                                        disabled={processing}
                                        className="h-18 px-12 rounded-full bg-sky-600 dark:bg-sky-500 text-white dark:text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-xl dark:shadow-[0_15px_40px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-50"
                                    >
                                        {processing ? __('Processing...') : __('Sync New Cipher')}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-out duration-700"
                                        enterFrom="opacity-0 translate-x-8"
                                        leave="transition ease-in duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 size={20} /> {__('Protocol Updated')}
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </motion.div>

                {/* Two Factor Auth Card - Advanced Security Layer */}
                {canManageTwoFactor && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="rounded-[3rem] border border-black/5 dark:border-white/5 bg-muted/20 dark:bg-white/[0.02] p-8 sm:p-12 shadow-xl dark:shadow-2xl backdrop-blur-xl"
                    >
                        <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "flex h-16 w-16 items-center justify-center rounded-[1.5rem] transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.1)]",
                                    twoFactorEnabled ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20" : "bg-muted text-muted-foreground ring-1 ring-black/5 dark:ring-white/5"
                                )}>
                                    <Shield size={32} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">{__('Multi-Factor Gateway')}</h2>
                                    <p className="text-muted-foreground/60 font-medium">{__('Add an impenetrable layer to your digital sanctuary.')}</p>
                                </div>
                            </div>
                            {twoFactorEnabled && (
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-3"
                                >
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">{__('Shield Active')}</span>
                                </motion.div>
                            )}
                        </div>

                         {twoFactorEnabled ? (
                            <div className="space-y-10">
                                <div className="rounded-[2rem] border border-emerald-500/10 bg-emerald-500/[0.03] p-8 flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <p className="text-emerald-700 dark:text-emerald-300/80 font-medium leading-relaxed italic">
                                        {__('Gateway protection is fully operational. You will be challenged with a secondary verification cipher upon every new session entrance.')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                className="h-16 px-10 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-rose-500/20 hover:scale-105 transition-all"
                                            >
                                                <ShieldOff size={18} className="mr-3" />
                                                {__('Dissolve Shield')}
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div className="rounded-[2rem] border border-black/5 dark:border-white/5 bg-muted/30 dark:bg-white/5 p-8 flex items-start gap-6">
                                    <div className="h-12 w-12 rounded-2xl bg-muted dark:bg-white/5 flex items-center justify-center text-muted-foreground shrink-0">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-relaxed italic">
                                        {__('Enabling the gateway will require you to provide a temporary dynamic cipher from your verified TOTP terminal (e.g., Google Authenticator) during every login ritual.')}
                                    </p>
                                </div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="h-18 px-12 rounded-full bg-sky-600 dark:bg-sky-500 text-white dark:text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-xl dark:shadow-[0_15px_40px_rgba(14,165,233,0.4)] hover:scale-105 transition-all"
                                    >
                                        <ShieldCheck size={18} className="mr-3" />
                                        {__('Complete Gateway Link')}
                                    </Button>
                                ) : (
                                    <Form
                                        {...enable.form()}
                                        onSuccess={() => setShowSetupModal(true)}
                                    >
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-18 px-12 rounded-full bg-sky-600 dark:bg-sky-500 text-white dark:text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-xl dark:shadow-[0_15px_40px_rgba(14,165,233,0.4)] hover:scale-105 transition-all"
                                            >
                                                <Shield size={18} className="mr-3" />
                                                {__('Initialize Shield')}
                                            </Button>
                                        )}
                                    </Form>
                                )}
                            </div>
                        )}

                        <TwoFactorSetupModal
                            isOpen={showSetupModal}
                            onClose={() => setShowSetupModal(false)}
                            requiresConfirmation={requiresConfirmation}
                            twoFactorEnabled={twoFactorEnabled}
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            clearSetupData={clearSetupData}
                            fetchSetupData={fetchSetupData}
                            errors={errors}
                        />
                    </motion.div>
                )}
            </div>
        </>
    );
}

Security.layout = (page: any) => (
    <SettingsLayout>{page}</SettingsLayout>
);

