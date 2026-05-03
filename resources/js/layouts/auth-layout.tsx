import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import GlobalCustomerChat from '@/components/app/global-customer-chat';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {children}
            <GlobalCustomerChat />
        </AuthLayoutTemplate>
    );
}
