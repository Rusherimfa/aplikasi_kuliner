import { Link, usePage } from '@inertiajs/react';
import { ChefHat, LayoutGrid, BookOpen, Calendar, Bell, LogOut } from 'lucide-react';
import { dashboard } from '@/routes';

export default function RestoAdminLayout({ children }: { children: React.ReactNode }) {
    const { auth, url } = usePage().props as any;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : (url ?? '');

    const navItems = [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Manajemen Menu', href: '/menus', icon: BookOpen },
        { title: 'Meja & Reservasi', href: '/reservations', icon: Calendar },
    ];

    return (
        <div className="flex h-screen w-full bg-background text-foreground font-['Inter',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card/95 backdrop-blur-xl">
                {/* Logo Area */}
                <div className="flex h-20 items-center gap-3 border-b border-border px-8">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-900/20">
                        <ChefHat size={20} className="text-white" />
                    </div>
                    <span className="font-['Playfair_Display',serif] text-xl font-bold tracking-wide text-foreground">
                        RestoWeb Admin
                    </span>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4">
                    <div className="mb-4 px-4 text-xs font-semibold tracking-widest text-amber-500/70 uppercase">
                        Operasional
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = currentUrl === item.href || currentUrl.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-amber-500/10 text-amber-500 shadow-sm shadow-amber-900/10'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <item.icon
                                        size={18}
                                        className={isActive ? 'text-amber-500' : 'opacity-70'}
                                    />
                                    {item.title}
                                    {isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Area */}
                <div className="border-t border-border p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold">
                            {auth?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-semibold text-foreground">{auth?.user?.name || 'Admin User'}</p>
                            <p className="truncate text-xs text-muted-foreground">{auth?.user?.email || 'admin@restoweb.com'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex flex-1 flex-col pl-72">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-20 items-center justify-end border-b border-border bg-card/80 px-8 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-500 border-2 border-card"></span>
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex h-10 items-center gap-2 rounded-full border border-border bg-transparent px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <LogOut size={16} />
                            Log Out
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
