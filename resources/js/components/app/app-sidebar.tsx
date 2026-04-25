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
import { useTranslations } from '@/hooks/use-translations';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { __ } = useTranslations();
    const page = usePage();
    const dashboardUrl = page.props.currentTeam
        ? dashboard(page.props.currentTeam.slug)
        : '/';

    const userRole = (page.props.auth as any).user.role;

    let mainNavItems: NavItem[] = [];

    if (userRole === 'admin') {
        mainNavItems = [
            { title: __('Overview'), href: dashboardUrl, icon: LayoutGrid },
            { title: __('Intelligence'), href: '/analytics', icon: PieChart },
            { title: __('Reservation Control'), href: '/reservations', icon: Calendar },
            { title: __('Gourmet Ledger'), href: '/menus', icon: BookOpen },
            { title: __('Kitchen Operations'), href: '/kitchen', icon: Utensils },
            { title: __('Concierge Hub'), href: '/service-requests', icon: Settings }, // Or another icon
            { title: __('Settings'), href: '/settings/profile', icon: Settings },
        ];
    } else if (userRole === 'staff') {
        mainNavItems = [
            { title: __('Operational Command'), href: dashboardUrl, icon: LayoutGrid },
            { title: __('Reservation Control'), href: '/reservations', icon: Calendar },
            { title: __('Kitchen Operations'), href: '/kitchen', icon: Utensils },
            { title: __('Concierge Hub'), href: '/service-requests', icon: BookOpen },
            { title: __('Settings'), href: '/settings/profile', icon: Settings },
        ];
    } else if (userRole === 'kurir') {
        mainNavItems = [
            { title: __('Logistics Hub'), href: dashboardUrl, icon: Truck },
            { title: __('Settings'), href: '/settings/profile', icon: Settings },
        ];
    } else {
        // Customer
        mainNavItems = [
            { title: __('Sanctuary'), href: '/', icon: LayoutGrid },
            { title: __('Culinary Catalog'), href: '/catalog', icon: Utensils },
            { title: __('Secure a Table'), href: '/reservations/create', icon: Calendar },
            { title: __('Activity Record'), href: '/reservations/history', icon: BookOpen },
            { title: __('Settings'), href: '/settings/profile', icon: Settings },
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
