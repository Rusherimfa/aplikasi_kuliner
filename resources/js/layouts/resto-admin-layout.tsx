import { Link, usePage } from '@inertiajs/react';
import {
    ChefHat,
    LayoutGrid,
    BookOpen,
    Calendar,
    Bell,
    Headphones,
    LogOut,
    ChevronRight,
    Users,
    MessageSquare,
    Menu,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/use-translations';
import NotificationDropdown from '@/components/app/notification-dropdown';
import StaffGuestChatInbox from '@/components/app/staff-guest-chat-inbox';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function RestoAdminLayout({ children }: { children: React.ReactNode }) {
    const { auth = { user: null } } = usePage().props as any;
    const { url } = usePage();
    const { __ } = useTranslations();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (auth.user) {
            const notificationChannel = ['admin', 'staff'].includes(
                auth.user.role,
            )
                ? 'staff.notifications'
                : auth.user.role === 'kurir'
                  ? `user.${auth.user.id}`
                  : null;

            if (!notificationChannel) {
                return;
            }

            const channel = (window as any).Echo.private(notificationChannel)
                .listen('.message.sent', (data: any) => {
                    toast.info(`${__('Pesan Baru dari')} ${data.message.sender.name}`, {
                        description:
                            data.message.content.substring(0, 50) +
                            (data.message.content.length > 50 ? '...' : ''),
                        icon: <MessageSquare className="h-4 w-4" />,
                        action: {
                            label: __('Buka Dashboard'),
                            onClick: () => {
                                // Redirect logic could go here if we have a specific chat page
                            },
                        },
                    });
                })
                .listen('.guest-message.sent', (data: any) => {
                    if (auth.user.role !== 'staff') {
                        return;
                    }

                    toast.info(
                        `${__('Pesan baru dari')} ${data.conversation.guest_name}`,
                        {
                            description: data.message.content,
                            icon: <Headphones className="h-4 w-4" />,
                        },
                    );
                });

            return () => {
                channel.stopListening('.message.sent');
                channel.stopListening('.guest-message.sent');
            };
        }
    }, [auth.user]);

    const currentUrl = url || '';

    const navItems = [
        { title: __('Dashboard'), href: '/dashboard', icon: LayoutGrid },
        {
            title: __('Katalog Menu'),
            href: '/menus',
            icon: BookOpen,
            roles: ['admin', 'staff'],
        },
        {
            title: __('Meja & Reservasi'),
            href: '/reservations',
            icon: Calendar,
            roles: ['admin', 'staff'],
        },
        {
            title: __('Kitchen View'),
            href: '/kitchen',
            icon: ChefHat,
            roles: ['admin', 'staff'],
        },
        {
            title: __('Manajemen Akun'),
            href: '/accounts',
            icon: Users,
            roles: ['admin'],
        },
    ].filter((item) => !item.roles || item.roles.includes(auth.user.role));

    return (
        <div className="flex min-h-screen w-full bg-transparent font-['Inter',sans-serif] text-slate-900 dark:text-slate-100 selection:bg-sky-500/30 selection:text-sky-200 relative overflow-hidden">
            {/* Global Interactive Background (Synced with Landing Page) */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 opacity-40 dark:opacity-60" 
                     style={{ 
                         backgroundImage: `
                            radial-gradient(at 0% 0%, oklch(0.25 0.12 240 / 0.15) 0px, transparent 50%),
                            radial-gradient(at 100% 0%, oklch(0.30 0.15 220 / 0.1) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, oklch(0.20 0.1 260 / 0.12) 0px, transparent 50%),
                            radial-gradient(at 0% 100%, oklch(0.35 0.12 200 / 0.08) 0px, transparent 50%)
                         `
                     }} 
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Floating Glass Sidebar */}
            <aside className={`fixed inset-y-4 left-4 z-50 flex w-72 flex-col rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-3xl shadow-2xl transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] lg:translate-x-0'}`}>
                {/* Logo Area */}
                <div className="flex h-24 items-center gap-4 px-8 border-b border-white/5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-xl shadow-sky-900/40 transform -rotate-3 transition-transform hover:rotate-0">
                        <ChefHat size={22} className="text-black" />
                    </div>
                    <div>
                        <span className="font-['Playfair_Display',serif] text-xl font-black tracking-tight text-white block leading-none">
                            Ocean's <span className="text-sky-500">Resto</span>
                        </span>
                        <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                            {auth.user.role === 'admin'
                                ? __('Owner Suite')
                                : auth.user.role === 'kurir'
                                  ? __('Delivery Hub')
                                  : __('Staff Station')}
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-8 px-5 custom-scrollbar">
                    <div className="mb-6 px-4 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                        {__('Management Hub')}
                    </div>
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive =
                                currentUrl === item.href ||
                                currentUrl.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-500 ${
                                        isActive
                                            ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20'
                                            : 'text-white/40 hover:bg-white/5 hover:text-white/80 border border-transparent'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-black/10 text-black' : 'bg-white/5 group-hover:bg-sky-500/10 group-hover:text-sky-500'}`}>
                                        <item.icon
                                            size={18}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                        />
                                    </div>
                                    <span className="flex-1 tracking-tight">{item.title}</span>
                                    {isActive && <ChevronRight size={14} className="opacity-40" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Area */}
                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-4 rounded-3xl bg-white/[0.03] border border-white/5 p-4 transition-all hover:bg-white/[0.05] group cursor-pointer shadow-lg shadow-black/20">
                        <div className="relative">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-sky-500 font-black border border-white/10 overflow-hidden">
                                {auth?.user?.avatar ? (
                                    <img src={auth.user.avatar} className="h-full w-full object-cover" alt="" />
                                ) : (
                                    auth?.user?.name?.charAt(0) || 'A'
                                )}
                            </div>
                            <div className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-black bg-emerald-500" />
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                            <p className="truncate text-sm font-bold text-white group-hover:text-sky-500 transition-colors tracking-tight">{auth?.user?.name || __('Admin')}</p>
                            <p className="truncate text-[10px] font-medium text-white/30 uppercase tracking-widest mt-0.5">{__(auth?.user?.role || 'Administrator')}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex flex-1 flex-col lg:pl-80 relative z-10 w-full min-h-screen">
                {/* Modern Header */}
                <header className="sticky top-4 z-40 flex h-20 items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-10">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 text-white/60 hover:text-white transition-colors shadow-xl"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-2 md:gap-3 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-1.5 md:p-2 pr-4 md:pr-6 shadow-2xl">
                        <div className="flex items-center gap-1 px-1 md:px-2">
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                        </div>
                        
                        <div className="h-6 w-px bg-white/10" />
                        
                        <NotificationDropdown />
                        
                        <div className="h-6 w-px bg-white/10 hidden sm:block" />

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="hidden sm:flex h-11 items-center gap-2.5 rounded-xl bg-white/5 px-4 md:px-6 text-xs font-black tracking-widest uppercase text-white/60 transition-all hover:bg-rose-500/20 hover:text-rose-500 border border-white/5"
                        >
                            <LogOut size={14} strokeWidth={2.5} />
                            <span className="hidden md:inline">{__('Sign Out')}</span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60 hover:bg-rose-500/20 hover:text-rose-500 border border-white/5"
                        >
                            <LogOut size={14} strokeWidth={2.5} />
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="relative z-20 w-full px-4 sm:px-6 lg:px-10 py-6 md:py-10">
                    {children}
                </div>
            </main>

            {auth.user.role === 'staff' && (
                <StaffGuestChatInbox currentUser={auth.user} />
            )}
        </div>
    );
}
