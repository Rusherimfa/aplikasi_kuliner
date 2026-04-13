import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Camera, CheckCircle2, Mail, User } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/auth/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const initials = auth.user.name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <>
            <Head title="Pengaturan Profil" />
            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-8">
                {/* Profile Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                    {/* Header bar */}
                    <div className="relative h-24 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent">
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5" />
                    </div>

                    {/* Avatar & Name area */}
                    <div className="px-8 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                            <div className="relative self-start">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 text-2xl font-bold text-black shadow-xl shadow-orange-900/30 ring-4 ring-background">
                                    {initials}
                                </div>
                                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 shadow-md">
                                    <Camera size={12} className="text-black" />
                                </div>
                            </div>
                            <div className="mb-1">
                                <p className="text-xl font-bold text-foreground">{auth.user.name}</p>
                                <p className="text-sm text-muted-foreground">{auth.user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Info Form */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="font-semibold tracking-tight text-foreground">Informasi Profil</h2>
                            <p className="text-xs text-muted-foreground">Perbarui nama dan alamat email akun Anda</p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-5"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        className="rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-colors"
                                        defaultValue={auth.user.name ?? ''}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-9 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-colors"
                                            defaultValue={auth.user.email ?? ''}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="email@kamu.com"
                                        />
                                    </div>
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                                        <p className="text-sm text-orange-400/80">
                                            Email Anda belum terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-semibold text-orange-400 underline underline-offset-2 hover:text-orange-300 transition-colors"
                                            >
                                                Klik di sini untuk kirim ulang email verifikasi.
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <p className="mt-2 text-sm font-medium text-emerald-400">
                                                ✓ Tautan verifikasi baru telah dikirim ke email Anda.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 pt-2">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="rounded-full bg-orange-500 px-6 font-semibold text-zinc-950 hover:bg-orange-400 transition-all duration-200"
                                    >
                                        Simpan Perubahan
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 translate-y-1"
                                        leave="transition ease-in-out duration-200"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                                            <CheckCircle2 size={16} />
                                            Tersimpan!
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Delete Account */}
                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
