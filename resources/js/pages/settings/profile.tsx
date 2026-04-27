import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { Camera, CheckCircle2, Mail, User, Phone, Sparkles, Trash2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/auth/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

import { useTranslations } from '@/hooks/use-translations';
import SettingsLayout from '@/layouts/settings/layout';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props as any;
    const { __ } = useTranslations();
    const [preview, setPreview] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        _method: 'PATCH',
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        phone: auth.user.phone ?? '',
        avatar: null as File | null,
        current_password: '',
    });

    const updateAvatar = (file: File) => {
        router.post(ProfileController.update.url(), {
            _method: 'PATCH',
            avatar: file,
        }, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setPreview(null);
            },
            onError: (errors) => {
                console.error('Avatar update failed:', errors);
                setPreview(null);
            }
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmDialog(true);
    };

    const confirmUpdate = () => {
        setShowConfirmDialog(false);
        form.post(ProfileController.update.url(), {
            preserveScroll: true,
            onSuccess: () => setPreview(null),
        });
    };

    const initials = auth.user.name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Head title={__('Profile Settings')} />
            
            <div className="space-y-12 pb-20 sm:pb-0">
                {/* Profile Hero Card - Cinematic Centerpiece */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="group relative overflow-hidden rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-white/10 dark:to-transparent shadow-xl dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-700 hover:border-sky-500/30 ring-1 ring-slate-100 dark:ring-transparent"
                >
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
                    
                    {/* Dynamic Hero Banner */}
                    <div className="relative h-40 sm:h-56 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 via-sky-600/20 to-indigo-400/20 dark:from-sky-600/40 dark:via-sky-900/40 dark:to-indigo-900/40" />
                        <motion.div 
                            animate={{ 
                                x: [0, 20, 0],
                                y: [0, -10, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.2),transparent_50%)]" 
                        />
                        <div className="absolute -bottom-1 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-background via-white/40 dark:via-background/40 to-transparent" />
                    </div>

                    <div className="relative px-8 sm:px-12 pb-12">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 -mt-20 sm:-mt-24">
                            {/* Cinematic Avatar Upload */}
                            <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                                <motion.div 
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                    className="flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-[3rem] bg-gradient-to-br from-sky-400 to-indigo-600 p-1 shadow-2xl shadow-sky-500/20 ring-4 ring-black/5 dark:ring-white/10 backdrop-blur-2xl overflow-hidden"
                                >
                                    <div className="h-full w-full rounded-[2.8rem] overflow-hidden bg-slate-50 dark:bg-zinc-950 flex items-center justify-center text-5xl font-black text-slate-900 dark:text-white">
                                        {preview ? (
                                            <img src={preview} className="h-full w-full object-cover" alt="Preview" />
                                        ) : auth.user.avatar ? (
                                            <img src={auth.user.avatar} className="h-full w-full object-cover" alt={auth.user.name ?? ''} />
                                        ) : (
                                            initials
                                        )}
                                        
                                        {/* Overlay with glass effect */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-sky-500/10 dark:bg-sky-500/20 opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 backdrop-blur-md">
                                            <div className="flex flex-col items-center gap-2">
                                                <Camera className="text-slate-900 dark:text-white h-10 w-10 drop-shadow-lg" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{__('Update Focus')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white dark:text-black shadow-lg dark:shadow-[0_10px_30px_rgba(14,165,233,0.5)] ring-4 ring-white dark:ring-background transition-transform duration-500 group-hover/avatar:rotate-12 group-hover/avatar:scale-110"
                                >
                                    <Zap size={24} strokeWidth={3} />
                                </motion.div>
                            </div>

                            <div className="flex-1 text-center sm:text-left mb-4">
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-foreground uppercase italic">{auth.user.name}</h2>
                                        <Sparkles className="h-6 w-6 text-sky-600 dark:text-sky-400 animate-pulse" />
                                    </div>
                                    <p className="text-xl font-medium text-slate-500 dark:text-muted-foreground/60">{auth.user.email}</p>
                                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/30">
                                            <ShieldCheck size={14} /> {__('Premium Culinary Elite')}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40 ring-1 ring-slate-200 dark:ring-white/10">
                                            {__('Rank')}: #001
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <form
                    onSubmit={submit}
                    className="grid gap-12 sm:grid-cols-12"
                >
                        <>
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setPreview(reader.result as string);
                                        reader.readAsDataURL(file);
                                        updateAvatar(file);
                                    }
                                }}
                            />

                            {/* Main Identity Form */}
                            <div className="sm:col-span-8 space-y-12">
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 sm:p-12 shadow-xl dark:shadow-2xl backdrop-blur-xl ring-1 ring-slate-100 dark:ring-transparent"
                                >
                                    <div className="mb-12 flex items-center gap-6">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-sky-500/10 text-sky-500 dark:text-sky-400 ring-1 ring-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                                            <User size={32} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-foreground uppercase italic">{__('Core Identity')}</h3>
                                            <p className="text-slate-500 dark:text-muted-foreground/60 font-medium">{__('Refine how you appear in our exclusive circle.')}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-8">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                                {__('Visual Name')}
                                            </Label>
                                            <div className="group relative">
                                                <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                                <Input
                                                    id="name"
                                                    className="h-16 pl-14 rounded-2xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-lg font-medium placeholder:text-slate-300 dark:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                                    name="name"
                                                    defaultValue={auth.user.name}
                                                    required
                                                    autoComplete="name"
                                                    placeholder={__('The name of the legend...')}
                                                    onChange={(e) => form.setData('name', e.target.value)}
                                                />
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500" />
                                            </div>
                                            <InputError className="mt-1 ml-2" message={form.errors.name} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="email" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                                {__('Digital Signature')}
                                            </Label>
                                            <div className="group relative">
                                                <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className="h-16 pl-14 rounded-2xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-lg font-medium placeholder:text-slate-300 dark:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                                    autoComplete="username"
                                                    defaultValue={auth.user.email}
                                                    placeholder="legend@oceanresto.com"
                                                    onChange={(e) => form.setData('email', e.target.value)}
                                                />
                                            </div>
                                            <InputError className="mt-1 ml-2" message={form.errors.email} />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="phone" className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                                {__('Direct Line')}
                                            </Label>
                                            <div className="group relative">
                                                <Phone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    className="h-16 pl-14 rounded-2xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-lg font-medium placeholder:text-slate-300 dark:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                                    name="phone"
                                                    defaultValue={auth.user.phone}
                                                    placeholder="+62 812..."
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                />
                                            </div>
                                            <InputError className="mt-1 ml-2" message={form.errors.phone} />
                                        </div>
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 animate-in fade-in zoom-in duration-500">
                                            <p className="text-amber-600 dark:text-amber-400/90 font-medium leading-relaxed">
                                                {__('Verification pending for your digital signature.')}{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-black text-amber-600 dark:text-amber-400 underline underline-offset-8 hover:text-amber-500 dark:hover:text-amber-300 transition-all"
                                                >
                                                    {__('RESEND LINK')}
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <p className="mt-4 text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                                                    <CheckCircle2 size={18} />
                                                    {__('NEW LINK DISPATCHED')}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-16 flex flex-col sm:flex-row items-center gap-8">
                                        <Button
                                            disabled={form.processing}
                                            className="h-18 px-12 rounded-full bg-sky-600 dark:bg-sky-500 text-white dark:text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-xl dark:shadow-[0_15px_40px_rgba(14,165,233,0.4)] hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-50"
                                        >
                                            {form.processing ? __('Processing...') : __('Commit Changes')}
                                        </Button>
                                        
                                        <Transition
                                            show={form.recentlySuccessful}
                                            enter="transition ease-out duration-700"
                                            enterFrom="opacity-0 translate-x-8"
                                            leave="transition ease-in duration-300"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 size={20} /> {__('Synchronized')}
                                            </p>
                                        </Transition>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar Elements */}
                            <div className="sm:col-span-4 space-y-8">
                                <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="rounded-[3rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl ring-1 ring-slate-100 dark:ring-transparent"
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 dark:text-muted-foreground/30 mb-8">{__('Access Points')}</h4>
                                    <div className="space-y-6">
                                        <Link href="/settings/security" className="flex items-center justify-between group p-3 -mx-3 rounded-2xl hover:bg-sky-500/10 transition-all duration-500">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-foreground">{__('Security Protocol')}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-muted-foreground/40 font-medium">{__('Update password')}</span>
                                            </div>
                                            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white dark:group-hover:text-black transition-all duration-500 border border-slate-100 dark:border-transparent">
                                                <ArrowLeft size={16} className="rotate-180" />
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="rounded-[3rem] border border-rose-500/10 dark:border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/5 p-10 shadow-xl dark:shadow-2xl backdrop-blur-xl group"
                                >
                                    <div className="flex items-center gap-4 mb-6 text-rose-600 dark:text-rose-500">
                                        <Trash2 size={24} />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">{__('Finality Zone')}</h4>
                                    </div>
                                    <p className="text-sm text-rose-500/60 dark:text-rose-400/60 mb-8 leading-relaxed font-medium italic">{__('Deleting your presence will permanently dissolve your legacy, reservations, and elite status.')}</p>
                                    <DeleteUser />
                                </motion.div>
                            </div>
                        </>
                </form>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 backdrop-blur-2xl p-8 shadow-3xl">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-sky-500/10 text-sky-500 dark:text-sky-400 ring-1 ring-sky-500/20">
                            <ShieldCheck size={40} strokeWidth={1.5} />
                        </div>
                        <DialogTitle className="text-center text-2xl font-black uppercase tracking-tight italic text-slate-900 dark:text-white">
                            {__('Konfirmasi Perubahan')}
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 dark:text-muted-foreground/60 font-medium leading-relaxed">
                            {__('Untuk keamanan, silakan masukkan kata sandi Anda untuk mengonfirmasi perubahan profil ini.')}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="confirm_password" title={__('Password Konfirmasi')} className="ml-2 text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-500/70">
                                {__('Konfirmasi Sandi')}
                            </Label>
                            <div className="group relative">
                                <ShieldCheck size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-muted-foreground/30 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-500 transition-all duration-500" />
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    className="h-16 pl-14 rounded-2xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-lg font-medium placeholder:text-slate-300 dark:text-muted-foreground/20 focus:border-sky-500/50 focus:ring-sky-500/20 focus:bg-sky-500/5 transition-all duration-500"
                                    placeholder="••••••••"
                                    value={form.data.current_password}
                                    onChange={(e) => form.setData('current_password', e.target.value)}
                                />
                            </div>
                            <InputError message={form.errors.current_password} className="ml-2" />
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowConfirmDialog(false);
                                form.setData('current_password', '');
                            }}
                            className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-muted dark:hover:bg-white/5"
                        >
                            {__('Batal')}
                        </Button>
                        <Button
                            onClick={confirmUpdate}
                            disabled={form.processing || !form.data.current_password}
                            className="flex-1 h-14 rounded-2xl bg-sky-600 dark:bg-sky-500 text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {form.processing ? __('Memproses...') : __('Ya, Perbarui')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Profile.layout = (page: any) => (
    <SettingsLayout>{page}</SettingsLayout>
);

