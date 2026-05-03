import { usePage } from '@inertiajs/react';
import HomeLiveChat from '@/components/app/home-live-chat';
import GuestSupportChat from '@/components/app/guest-support-chat';

export default function GlobalCustomerChat() {
    const { auth } = usePage().props as any;

    const showChat = !auth?.user || auth.user.role === 'customer';

    if (!showChat) return null;

    return (
        <>
            {auth?.user ? <HomeLiveChat currentUser={auth.user} /> : <GuestSupportChat />}
        </>
    );
}
