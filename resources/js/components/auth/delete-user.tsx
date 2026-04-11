import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { Trash2, TriangleAlert } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                    <TriangleAlert size={20} />
                </div>
                <div>
                    <h2 className="font-semibold tracking-tight text-foreground">Hapus Akun</h2>
                    <p className="text-xs text-muted-foreground">Hapus akun Anda beserta seluruh data secara permanen</p>
                </div>
            </div>

            <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/8 p-4">
                <p className="text-sm leading-relaxed text-rose-300/80">
                    <span className="font-semibold text-rose-300">Perhatian: </span>
                    Setelah akun dihapus, seluruh data dan riwayat reservasi Anda akan dihapus secara permanen dan tidak dapat dipulihkan kembali.
                </p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        data-test="delete-user-button"
                        className="rounded-full"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Hapus Akun Saya
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-white/10 bg-zinc-950 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                            <TriangleAlert size={20} />
                        </div>
                        <DialogTitle className="text-white">
                            Hapus Akun Secara Permanen?
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-zinc-400">
                        Tindakan ini tidak dapat dibatalkan. Seluruh data akun Anda termasuk riwayat reservasi akan dihapus selamanya. Masukkan password Anda untuk mengkonfirmasi.
                    </DialogDescription>

                    <Form
                        {...ProfileController.destroy.form()}
                        options={{ preserveScroll: true }}
                        onError={() => passwordInput.current?.focus()}
                        resetOnSuccess
                        className="space-y-5"
                    >
                        {({ resetAndClearErrors, processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm text-zinc-400">
                                        Konfirmasi Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        ref={passwordInput}
                                        placeholder="Masukkan password Anda"
                                        autoComplete="current-password"
                                        className="rounded-xl border-white/10 bg-white/5"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-full border-white/10"
                                            onClick={() => resetAndClearErrors()}
                                        >
                                            Batal
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        className="rounded-full"
                                        asChild
                                    >
                                        <button
                                            type="submit"
                                            data-test="confirm-delete-user-button"
                                        >
                                            <Trash2 size={16} className="mr-2" />
                                            Ya, Hapus Akun
                                        </button>
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
