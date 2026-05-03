import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import GlobalCustomerChat from '@/components/app/global-customer-chat';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
            <GlobalCustomerChat />
        </AppLayoutTemplate>
    );
}
