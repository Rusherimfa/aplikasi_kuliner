import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Inbox } from 'lucide-react';
import { router, usePage, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useTranslations } from '@/hooks/use-translations';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NotificationDropdown() {
    const { auth, locale: appLocale } = usePage().props as any;
    const { __ } = useTranslations();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(auth.notifications?.unreadCount || 0);

    const dateLocale = appLocale === 'id' ? id : enUS;

    useEffect(() => {
        // Listen for real-time notifications via Echo
        if (auth.user) {
            const channel = (window as any).Echo.private(`App.Models.User.${auth.user.id}`)
                .notification((notification: any) => {
                    // Normalize real-time notification to match database structure
                    const normalized = {
                        id: notification.id || Math.random().toString(36).substr(2, 9),
                        data: notification.data || {
                            title: notification.title,
                            message: notification.message,
                            type: notification.type,
                            url: notification.url,
                            metadata: notification.metadata
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setNotifications((prev: any[]) => [normalized, ...prev]);
                    setUnreadCount((prev: number) => prev + 1);
                });

            return () => {
                (window as any).Echo.leave(`App.Models.User.${auth.user.id}`);
            };
        }
    }, [auth.user]);

    const fetchNotifications = async () => {
        console.log('Fetching notifications...');
        setLoading(true);
        try {
            const response = await fetch('/notifications');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Notifications fetched:', data);
            setNotifications(data.data || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content,
                    'Accept': 'application/json'
                }
            });
            setNotifications((prev: any[]) => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
            setUnreadCount((prev: number) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content,
                    'Accept': 'application/json'
                }
            });
            setNotifications((prev: any[]) => prev.map(n => ({ ...n, read_at: new Date() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await fetch(`/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as any)?.content,
                    'Accept': 'application/json'
                }
            });
            setNotifications((prev: any[]) => prev.filter(n => n.id !== id));
            // Adjust unread count if it was unread
            const wasUnread = notifications.find(n => n.id === id)?.read_at === null;
            if (wasUnread) setUnreadCount((prev: number) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return (
        <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
            <DropdownMenuTrigger asChild>
                <button 
                    type="button"
                    className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500 group shadow-lg ${
                        unreadCount > 0 
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 shadow-sky-500/10' 
                        : 'bg-slate-200/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                    } border backdrop-blur-md hover:scale-110 active:scale-95`}
                >
                    <Bell size={20} strokeWidth={unreadCount > 0 ? 2 : 1.5} className={unreadCount > 0 ? 'animate-pulse' : ''} />
                    {unreadCount > 0 && (
                        <>
                            <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center px-1.5 rounded-full bg-sky-500 text-[10px] font-black text-white dark:text-black shadow-[0_0_20px_rgba(14,165,233,0.6)] border-2 border-white dark:border-slate-900 z-10">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                            <span className="absolute inset-0 rounded-2xl bg-sky-500/20 animate-ping duration-[2000ms] -z-10" />
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-96 mt-4 z-[100] p-0 glass-island bg-white/95 dark:bg-transparent border-slate-200 dark:border-white/10 backdrop-blur-3xl shadow-4xl animate-in fade-in slide-in-from-top-4 duration-300 overflow-hidden">
                <div className="flex flex-col max-h-[32rem]">
                    <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                        <div>
                            <h3 className="font-serif text-lg font-black text-slate-900 dark:text-white tracking-tight">{__('Pusat Notifikasi')}</h3>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest mt-0.5">{unreadCount} {__('Belum Terbaca')}</p>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-[10px] font-black text-sky-500 dark:text-sky-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5"
                            >
                                <Check size={12} /> {__('Tandai Semua')}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-10 flex flex-col items-center justify-center gap-3 opacity-20 dark:opacity-40">
                                <div className="h-8 w-8 rounded-full border-2 border-t-sky-500 border-slate-200 dark:border-white/10 animate-spin" />
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{__('Menyelam...')}</span>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center opacity-30">
                                <Inbox size={40} strokeWidth={1} className="mb-4 text-slate-900 dark:text-white" />
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{__('Belum ada kabar baru')}</p>
                                <p className="text-[10px] uppercase tracking-widest mt-1 text-slate-500 dark:text-white/50">{__('Semua tenang di bawah laut')}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`p-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group relative ${!notification.read_at ? 'bg-sky-500/[0.01] dark:bg-sky-500/[0.02]' : ''}`}
                                    >
                                        {!notification.read_at && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
                                        )}
                                        <div className="flex gap-4">
                                            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border ${
                                                notification.data.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                notification.data.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                notification.data.type === 'error' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                'bg-sky-500/10 text-sky-500 border-sky-500/20'
                                            }`}>
                                                <Bell size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">{notification.data.title}</h4>
                                                    <span className="text-[10px] font-medium text-slate-400 dark:text-white/30 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: dateLocale })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 leading-relaxed line-clamp-2">{notification.data.message}</p>
                                                
                                                <div className="flex items-center gap-4 mt-4">
                                                    {notification.data.url && (
                                                        <Link 
                                                            href={notification.data.url}
                                                            className="text-[10px] font-black text-sky-600 dark:text-sky-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors"
                                                        >
                                                            <ExternalLink size={10} /> {__('Lihat')}
                                                        </Link>
                                                    )}
                                                    {!notification.read_at && (
                                                        <button 
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-[10px] font-black text-slate-400 dark:text-white/30 hover:text-emerald-500 flex items-center gap-1 uppercase tracking-widest transition-colors"
                                                        >
                                                            <Check size={10} /> {__('Tandai Baca')}
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-[10px] font-black text-slate-300 dark:text-white/10 hover:text-rose-500 flex items-center gap-1 uppercase tracking-widest transition-colors ml-auto opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
