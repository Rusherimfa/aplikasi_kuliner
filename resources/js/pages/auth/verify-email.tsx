// Components
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { LogoutConfirmationDialog } from '@/components/app/logout-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from '@/hooks/use-translations';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const { __ } = useTranslations();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    return (
        <>
            <Head title={__('Email verification')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {__('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            {__('Resend verification email')}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setLogoutDialogOpen(true)}
                            className="mx-auto block text-sm underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                            {__('Log out')}
                        </button>
                    </>
                )}
            </Form>

            <LogoutConfirmationDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
            />
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
