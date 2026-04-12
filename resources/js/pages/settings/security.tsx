import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, KeyRound, Lock, Shield, ShieldCheck, ShieldOff } from 'lucide-react';
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

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
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
            <Head title="Keamanan Akun" />
            <h1 className="sr-only">Keamanan Akun</h1>

            <div className="space-y-8">
                {/* Change Password Card */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                            <KeyRound size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold tracking-tight text-foreground">Ubah Password</h2>
                            <p className="text-xs text-muted-foreground">Gunakan kata sandi yang panjang dan acak agar akun Anda tetap aman</p>
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
                        className="space-y-5"
                    >
                        {({ errors: formErrors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-sm font-medium text-muted-foreground">
                                        Password Saat Ini
                                    </Label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            className="pl-9 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                                            autoComplete="current-password"
                                            placeholder="Masukkan password saat ini"
                                        />
                                    </div>
                                    <InputError message={formErrors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                                        Password Baru
                                    </Label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="pl-9 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                                            autoComplete="new-password"
                                            placeholder="Masukkan password baru"
                                        />
                                    </div>
                                    <InputError message={formErrors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-medium text-muted-foreground">
                                        Konfirmasi Password Baru
                                    </Label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="pl-9 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                                            autoComplete="new-password"
                                            placeholder="Ulangi password baru"
                                        />
                                    </div>
                                    <InputError message={formErrors.password_confirmation} />
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="rounded-full bg-amber-500 px-6 font-semibold text-zinc-950 hover:bg-amber-400 transition-all duration-200"
                                    >
                                        Simpan Password
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                                            <CheckCircle2 size={16} />
                                            Password berhasil diperbarui!
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two Factor Auth Card */}
                {canManageTwoFactor && (
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                        <div className="mb-6 flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${twoFactorEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="font-semibold tracking-tight text-foreground">Autentikasi Dua Faktor (2FA)</h2>
                                <p className="text-xs text-muted-foreground">Tambahkan lapisan keamanan ekstra pada akun Anda</p>
                            </div>
                            {twoFactorEnabled && (
                                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Aktif
                                </span>
                            )}
                        </div>

                         {twoFactorEnabled ? (
                            <div className="space-y-5">
                                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                                    <p className="text-sm text-emerald-300/80">
                                        Autentikasi dua faktor sedang aktif. Anda akan diminta memasukkan kode aman saat login dari perangkat baru.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-full"
                                            >
                                                <ShieldOff size={16} className="mr-2" />
                                                Nonaktifkan 2FA
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
                            <div className="space-y-5">
                                <div className="rounded-xl border border-border bg-muted/30 p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Saat Anda mengaktifkan 2FA, Anda akan diminta memasukkan kode aman selama login. Kode ini dapat diambil dari aplikasi TOTP di ponsel Anda (mis. Google Authenticator).
                                    </p>
                                </div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                        className="rounded-full bg-amber-500 px-6 font-semibold text-zinc-950 hover:bg-amber-400"
                                    >
                                        <ShieldCheck size={16} className="mr-2" />
                                        Lanjutkan Pengaturan 2FA
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
                                                className="rounded-full bg-amber-500 px-6 font-semibold text-zinc-950 hover:bg-amber-400"
                                            >
                                                <Shield size={16} className="mr-2" />
                                                Aktifkan 2FA
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
                    </div>
                )}
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Keamanan Akun',
            href: edit(),
        },
    ],
};
