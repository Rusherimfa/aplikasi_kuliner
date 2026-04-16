import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Utensils, Calendar, PieChart, Settings, Truck } from 'lucide-react';
import AppLogo from '@/components/app/app-logo';
import { NavFooter } from '@/components/app/nav-footer';
import { NavMain } from '@/components/app/nav-main';
import { NavUser } from '@/components/app/nav-user';
import { TeamSwitcher } from '@/components/teams/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const dashboardUrl = page.props.currentTeam
        ? dashboard(page.props.currentTeam.slug)
        : '/';

    const userRole = page.props.auth.user.role;

    let mainNavItems: NavItem[] = [];

    if (userRole === 'admin') {
        mainNavItems = [
            { title: 'Overview', href: dashboardUrl, icon: LayoutGrid },
            { title: 'Intelligence', href: '/analytics', icon: PieChart },
            { title: 'Manajemen Reservasi', href: '/reservations', icon: Calendar },
            { title: 'Buku Menu', href: '/menus', icon: BookOpen },
            { title: 'Dapur (KDS)', href: '/kitchen', icon: Utensils },
            { title: 'Service Hub', href: '/service-requests', icon: Settings }, // Or another icon
            { title: 'Pengaturan', href: '/settings/profile', icon: Settings },
        ];
    } else if (userRole === 'staff') {
        mainNavItems = [
            { title: 'Operasional', href: dashboardUrl, icon: LayoutGrid },
            { title: 'Manajemen Reservasi', href: '/reservations', icon: Calendar },
            { title: 'Dapur (KDS)', href: '/kitchen', icon: Utensils },
            { title: 'Service Hub', href: '/service-requests', icon: BookOpen },
            { title: 'Pengaturan', href: '/settings/profile', icon: Settings },
        ];
    } else if (userRole === 'kurir') {
        mainNavItems = [
            { title: 'Dashboard Delivery', href: dashboardUrl, icon: Truck },
            { title: 'Pengaturan', href: '/settings/profile', icon: Settings },
        ];
    } else {
        // Customer
        mainNavItems = [
            { title: 'Beranda', href: '/', icon: LayoutGrid },
            { title: 'Katalog Menu', href: '/catalog', icon: Utensils },
            { title: 'Buat Reservasi', href: '/reservations/create', icon: Calendar },
            { title: 'Aktivitas Saya', href: '/reservations/history', icon: BookOpen },
            { title: 'Pengaturan', href: '/settings/profile', icon: Settings },
        ];
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
