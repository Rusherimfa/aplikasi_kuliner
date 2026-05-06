import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';
import { logout } from '@/routes';

type LogoutConfirmationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBeforeLogout?: () => void;
};

export function LogoutConfirmationDialog({
    open,
    onOpenChange,
    onBeforeLogout,
}: LogoutConfirmationDialogProps) {
    const { __ } = useTranslations();

    const confirmLogout = () => {
        onOpenChange(false);
        onBeforeLogout?.();
        router.post(logout().url);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{__('End your session?')}</DialogTitle>
                    <DialogDescription>
                        {__(
                            'Are you sure you want to sign out of your account?',
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{__('Cancel')}</Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={confirmLogout}
                    >
                        <LogOut className="mr-2" />
                        {__('Sign Out')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
