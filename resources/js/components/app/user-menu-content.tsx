import { Link } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { LogoutConfirmationDialog } from '@/components/app/logout-confirmation-dialog';
import { UserInfo } from '@/components/app/user-info';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslations } from '@/hooks/use-translations';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const { __ } = useTranslations();
    const cleanup = useMobileNavigation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={'/reservations/history'}
                        prefetch
                        onClick={cleanup}
                    >
                        <Calendar className="mr-2" />
                        {__('Activity Record')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        {__('Settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onSelect={(event) => {
                    event.preventDefault();
                    setLogoutDialogOpen(true);
                }}
                data-test="logout-button"
            >
                <LogOut className="mr-2" />
                {__('End Session')}
            </DropdownMenuItem>

            <LogoutConfirmationDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                onBeforeLogout={cleanup}
            />
        </>
    );
}
