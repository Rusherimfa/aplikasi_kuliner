import { Link, usePage } from '@inertiajs/react';
import { ChefHat, LayoutGrid, BookOpen, Calendar, Bell, LogOut, ChevronRight, Users, MessageSquare } from 'lucide-react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function RestoAdminLayout({ children }: { children: React.ReactNode }) {
    const { auth, url } = usePage().props as any;

    useEffect(() => {
        if (auth.user && ['admin', 'staff', 'kurir'].includes(auth.user.role)) {
            const channel = (window as any).Echo.private('staff.notifications')
                .listen('.message.sent', (data: any) => {
                    toast.info(`Pesan Baru dari ${data.message.sender.name}`, {
                        description: data.message.content.substring(0, 50) + (data.message.content.length > 50 ? '...' : ''),
                        icon: <MessageSquare className="h-4 w-4" />,
                        action: {
                            label: 'Buka Dashboard',
                            onClick: () => {
                                // Redirect logic could go here if we have a specific chat page
                            }
                        }
                    });
                });

            return () => {
                channel.stopListening('.message.sent');
            };
        }
    }, [auth.user]);

    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : (url ?? '');

    const navItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Katalog Menu', href: '/menus', icon: BookOpen, roles: ['admin', 'staff'] },
        { title: 'Meja & Reservasi', href: '/reservations', icon: Calendar, roles: ['admin', 'staff'] },
        { title: 'Kitchen View', href: '/kitchen', icon: ChefHat, roles: ['admin', 'staff'] },
        { title: 'Manajemen Akun', href: '/accounts', icon: Users, roles: ['admin'] },
    ].filter(item => !item.roles || item.roles.includes(auth.user.role));

    return (
        <div className="flex min-h-screen w-full bg-[#0A0A0B] text-foreground font-sans selection:bg-sky-500/30 selection:text-sky-200">
            {/* Ambient Background Glows */}
            <div className="fixed -top-24 -left-24 h-96 w-96 rounded-full bg-sky-600/5 blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-800/5 blur-[120px] pointer-events-none" />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-black/40 backdrop-blur-3xl lg:translate-x-0 transition-transform duration-500">
                {/* Logo Area */}
                <div className="flex h-24 items-center gap-4 px-8">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-xl shadow-sky-900/40 transform -rotate-3 transition-transform hover:rotate-0">
                        <ChefHat size={22} className="text-black" />
                    </div>
                    <div>
                        <span className="font-['Playfair_Display',serif] text-xl font-black tracking-tight text-white block leading-none">
                            Resto<span className="text-sky-500">Web</span>
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mt-1 block">
                            {auth.user.role === 'admin' ? 'Owner Suite' : auth.user.role === 'kurir' ? 'Delivery Hub' : 'Staff Station'}
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-8 px-5">
                    <div className="mb-6 px-4 text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
                        Management
                    </div>
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            const isActive = currentUrl === item.href || currentUrl.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                                        isActive
                                            ? 'bg-sky-500/10 text-sky-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)] border border-sky-500/10'
                                            : 'text-white/40 hover:bg-white/5 hover:text-white/80 border border-transparent'
                                    }`}
                                >
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-sky-500/10 text-sky-500' : 'bg-white/5 group-hover:bg-sky-500/10 group-hover:text-sky-500'}`}>
                                        <item.icon
                                            size={18}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                        />
                                    </div>
                                    <span className="flex-1">{item.title}</span>
                                    {isActive ? (
                                        <ChevronRight size={14} className="opacity-40" />
                                    ) : (
                                        <div className="h-1 w-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Area */}
                <div className="p-6">
                    <div className="flex items-center gap-4 rounded-3xl bg-white/[0.03] border border-white/5 p-4 transition-all hover:bg-white/[0.05] group cursor-pointer shadow-lg shadow-black/20">
                        <div className="relative">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-sky-500 font-black border border-white/10">
                                {auth?.user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-black" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-bold text-white group-hover:text-sky-500 transition-colors tracking-tight">{auth?.user?.name || 'Admin User'}</p>
                            <p className="truncate text-[10px] font-medium text-white/30 uppercase tracking-widest mt-0.5">{auth?.user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex flex-1 flex-col pl-72 relative z-10 w-full min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-24 items-center justify-end border-b border-white/5 bg-[#0A0A0B]/80 px-10 backdrop-blur-3xl">
                    <div className="flex items-center gap-5">
                        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 text-white/40 transition-all hover:bg-white/[0.08] hover:text-white hover:scale-105 active:scale-95 group shadow-lg shadow-black/20">
                            <Bell size={18} strokeWidth={1.5} />
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-pulse"></span>
                        </button>
                        
                        <div className="h-6 w-px bg-white/5 mx-1" />

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-11 items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/5 px-6 text-xs font-black tracking-[0.1em] uppercase text-white/50 transition-all hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/20"
                        >
                            <LogOut size={14} strokeWidth={2.5} />
                            Log Out
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="px-10 py-10 w-full relative z-20">
                    {children}
                </div >
            </main>
        </div>
    );
}


