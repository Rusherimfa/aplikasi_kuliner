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
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import StaffGuestChatInbox from '@/components/app/staff-guest-chat-inbox';

export default function RestoAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth, url } = usePage().props as any;

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
                    toast.info(`Pesan Baru dari ${data.message.sender.name}`, {
                        description:
                            data.message.content.substring(0, 50) +
                            (data.message.content.length > 50 ? '...' : ''),
                        icon: <MessageSquare className="h-4 w-4" />,
                        action: {
                            label: 'Buka Dashboard',
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
                        `Pesan baru dari ${data.conversation.guest_name}`,
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

    const currentUrl =
        typeof window !== 'undefined' ? window.location.pathname : (url ?? '');

    const navItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        {
            title: 'Katalog Menu',
            href: '/menus',
            icon: BookOpen,
            roles: ['admin', 'staff'],
        },
        {
            title: 'Meja & Reservasi',
            href: '/reservations',
            icon: Calendar,
            roles: ['admin', 'staff'],
        },
        {
            title: 'Kitchen View',
            href: '/kitchen',
            icon: ChefHat,
            roles: ['admin', 'staff'],
        },
        {
            title: 'Manajemen Akun',
            href: '/accounts',
            icon: Users,
            roles: ['admin'],
        },
    ].filter((item) => !item.roles || item.roles.includes(auth.user.role));

    return (
        <div className="flex min-h-screen w-full bg-[#0A0A0B] font-sans text-foreground selection:bg-sky-500/30 selection:text-sky-200">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed -top-24 -left-24 h-96 w-96 rounded-full bg-sky-600/5 blur-[120px]" />
            <div className="pointer-events-none fixed -right-24 -bottom-24 h-96 w-96 rounded-full bg-sky-800/5 blur-[120px]" />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl transition-transform duration-500 lg:translate-x-0">
                {/* Logo Area */}
                <div className="flex h-24 items-center gap-4 px-8">
                    <div className="flex h-11 w-11 shrink-0 -rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-xl shadow-sky-900/40 transition-transform hover:rotate-0">
                        <ChefHat size={22} className="text-black" />
                    </div>
                    <div>
                        <span className="block font-['Playfair_Display',serif] text-xl leading-none font-black tracking-tight text-white">
                            Resto<span className="text-sky-500">Web</span>
                        </span>
                        <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                            {auth.user.role === 'admin'
                                ? 'Owner Suite'
                                : auth.user.role === 'kurir'
                                  ? 'Delivery Hub'
                                  : 'Staff Station'}
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto px-5 py-8">
                    <div className="mb-6 px-4 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                        Management
                    </div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive =
                                currentUrl === item.href ||
                                currentUrl.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                                        isActive
                                            ? 'border border-sky-500/10 bg-sky-500/10 text-sky-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]'
                                            : 'border border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'
                                    }`}
                                >
                                    <div
                                        className={`rounded-xl p-2 transition-all duration-300 ${isActive ? 'bg-sky-500/10 text-sky-500' : 'bg-white/5 group-hover:bg-sky-500/10 group-hover:text-sky-500'}`}
                                    >
                                        <item.icon
                                            size={18}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                        />
                                    </div>
                                    <span className="flex-1">{item.title}</span>
                                    {isActive ? (
                                        <ChevronRight
                                            size={14}
                                            className="opacity-40"
                                        />
                                    ) : (
                                        <div className="h-1 w-1 rounded-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Area */}
                <div className="p-6">
                    <div className="group flex cursor-pointer items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-4 shadow-lg shadow-black/20 transition-all hover:bg-white/[0.05]">
                        <div className="relative">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 font-black text-sky-500">
                                {auth?.user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="absolute -right-1 -bottom-1 h-3.5 w-3.5 rounded-full border-2 border-black bg-emerald-500" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-bold tracking-tight text-white transition-colors group-hover:text-sky-500">
                                {auth?.user?.name || 'Admin User'}
                            </p>
                            <p className="mt-0.5 truncate text-[10px] font-medium tracking-widest text-white/30 uppercase">
                                {auth?.user?.role || 'Administrator'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="relative z-10 flex min-h-screen w-full flex-1 flex-col pl-72">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-24 items-center justify-end border-b border-white/5 bg-[#0A0A0B]/80 px-10 backdrop-blur-3xl">
                    <div className="flex items-center gap-5">
                        {auth.user.role !== 'staff' && (
                            <>
                                <button className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-white/40 shadow-lg shadow-black/20 transition-all hover:scale-105 hover:bg-white/[0.08] hover:text-white active:scale-95">
                                    <Bell size={18} strokeWidth={1.5} />
                                    <span className="absolute top-3 right-3 h-2 w-2 animate-pulse rounded-full bg-sky-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
                                </button>

                                <div className="mx-1 h-6 w-px bg-white/5" />
                            </>
                        )}

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-11 items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-xs font-black tracking-[0.1em] text-white/50 uppercase shadow-lg shadow-black/20 transition-all hover:scale-[1.02] hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-500 active:scale-95"
                        >
                            <LogOut size={14} strokeWidth={2.5} />
                            Log Out
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="relative z-20 w-full px-10 py-10">
                    {children}
                </div>
            </main>

            {auth.user.role === 'staff' && (
                <StaffGuestChatInbox currentUser={auth.user} />
            )}
        </div>
    );
}
