import { AppContent } from '@/components/app/app-content';
import { AppShell } from '@/components/app/app-shell';
import { AppSidebar } from '@/components/app/app-sidebar';
import { AppSidebarHeader } from '@/components/app/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { usePage, Link } from '@inertiajs/react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth } = usePage().props as any;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {auth.user && !auth.user.is_verified && (
                    <div className="bg-amber-500 text-black px-4 py-2 text-center text-xs font-black tracking-widest uppercase">
                        Akun Anda belum terverifikasi.{' '}
                        <Link href="/verify-otp" className="underline hover:text-white transition-colors">
                            Verifikasi Sekarang untuk Memesan
                        </Link>
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
