import { motion, AnimatePresence } from 'framer-motion';
import {
    Headphones,
    Inbox,
    MessageSquare,
    RefreshCw,
    Truck,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import BoutiqueChat from '@/components/app/boutique-chat';
import GuestSupportChat from '@/components/app/guest-support-chat';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { threads as chatThreads } from '@/routes/chat';

type ChatThread = {
    id: string;
    type: 'reservations' | 'orders' | 'guest';
    chat_type?: 'support' | 'delivery';
    record_id: number;
    title: string;
    subtitle: string;
    badge: string;
    status: string;
    unread_count: number;
    last_message?: {
        content: string;
        sender_name?: string;
        created_at?: string;
    } | null;
};

export default function HomeLiveChat({ currentUser }: { currentUser: any }) {
    const { __ } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatList, setChatList] = useState<ChatThread[]>([]);
    const [activeThread, setActiveThread] = useState<ChatThread | null>(null);

    const unreadTotal = chatList.reduce(
        (total, thread) => total + thread.unread_count,
        0,
    );

    const fetchThreads = useCallback(() => {
        if (!currentUser?.id) {
            return;
        }

        setIsLoading(true);

        fetch(chatThreads.url(), {
            headers: { Accept: 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => setChatList(data.threads ?? []))
            .finally(() => setIsLoading(false));
    }, [currentUser?.id]);

    useEffect(() => {
        if (!currentUser?.id || !(window as any).Echo) {
            return;
        }

        const userChannel = (window as any).Echo.private(
            `user.${currentUser.id}`,
        ).listen('.message.sent', fetchThreads);
        const staffChannel = ['admin', 'staff'].includes(currentUser.role)
            ? (window as any).Echo.private('staff.notifications').listen(
                  '.message.sent',
                  fetchThreads,
              )
            : null;

        return () => {
            userChannel.stopListening('.message.sent');
            staffChannel?.stopListening('.message.sent');
        };
    }, [currentUser?.id, currentUser?.role, fetchThreads]);

    useEffect(() => {
        if (currentUser?.role !== 'staff') {
            return;
        }

        const initialFetch = window.setTimeout(fetchThreads, 0);
        const interval = window.setInterval(fetchThreads, 10000);

        return () => {
            window.clearTimeout(initialFetch);
            window.clearInterval(interval);
        };
    }, [currentUser?.role, fetchThreads]);

    if (!currentUser?.id) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-32 left-6 z-[65] flex flex-col items-start md:bottom-8 md:left-8">
                <AnimatePresence>
                    {isOpen && !activeThread && (
                        <motion.div
                            initial={{ opacity: 0, y: 18, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 18, scale: 0.96 }}
                            className="mb-4 flex max-h-[520px] w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-black/20 sm:w-[390px] dark:border-white/10 dark:bg-[#0F0F11]"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-black">
                                        <Headphones size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                            {__('Live Chat')}
                                        </h3>
                                        <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            {__('Customer, Staff & Kurir')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={fetchThreads}
                                        className="rounded-full"
                                        disabled={isLoading}
                                    >
                                        <RefreshCw
                                            size={16}
                                            className={
                                                isLoading ? 'animate-spin' : ''
                                            }
                                        />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-full"
                                    >
                                        <X size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3">
                                {chatList.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 px-8 py-12 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
                                            <Inbox size={20} />
                                        </div>
                                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                            {__('Belum ada percakapan aktif')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {chatList.map((thread) => (
                                            <button
                                                key={thread.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveThread(thread);
                                                    setIsOpen(false);
                                                }}
                                                className="group flex w-full items-start gap-3 rounded-2xl border border-transparent p-3 text-left transition-colors hover:border-sky-500/20 hover:bg-sky-500/5 dark:hover:bg-white/[0.04]"
                                            >
                                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                                                    {thread.type === 'guest' ? (
                                                        <Headphones size={18} />
                                                    ) : thread.badge.includes(
                                                          'Kurir',
                                                      ) ? (
                                                        <Truck size={18} />
                                                    ) : (
                                                        <MessageSquare
                                                            size={18}
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                                                            {thread.title}
                                                        </p>
                                                        {thread.unread_count >
                                                            0 && (
                                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                                                                {
                                                                    thread.unread_count
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs font-semibold text-muted-foreground">
                                                        {thread.subtitle}
                                                    </p>
                                                    <div className="mt-2 flex items-center justify-between gap-3">
                                                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black tracking-widest text-slate-500 uppercase dark:bg-white/5 dark:text-white/40">
                                                            {thread.badge}
                                                        </span>
                                                        <span className="text-[9px] font-black tracking-widest text-sky-500 uppercase">
                                                            {thread.status}
                                                        </span>
                                                    </div>
                                                    {thread.last_message && (
                                                        <p className="mt-2 truncate text-[11px] text-muted-foreground">
                                                            {
                                                                thread
                                                                    .last_message
                                                                    .sender_name
                                                            }
                                                            :{' '}
                                                            {
                                                                thread
                                                                    .last_message
                                                                    .content
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!activeThread && (
                    <motion.button
                        type="button"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                            if (!isOpen) {
                                fetchThreads();
                            }

                            setIsOpen((open) => !open);
                        }}
                        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-black shadow-xl shadow-sky-500/30 transition-transform"
                    >
                        <MessageSquare
                            size={23}
                            className="transition-transform group-hover:-rotate-6"
                        />
                        {unreadTotal > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-black text-white dark:border-black">
                                {unreadTotal}
                            </span>
                        )}
                    </motion.button>
                )}
            </div>

            {activeThread?.type === 'guest' ? (
                <GuestSupportChat
                    key={activeThread.id}
                    currentUser={currentUser}
                    conversationId={activeThread.record_id}
                    defaultOpen
                    hideToggle
                    placement="left"
                    title={activeThread.title}
                    subtitle={activeThread.badge}
                    onClose={() => {
                        setActiveThread(null);
                        fetchThreads();
                    }}
                />
            ) : activeThread ? (
                <BoutiqueChat
                    key={activeThread.id}
                    currentUser={currentUser}
                    reservationId={
                        activeThread.type === 'reservations'
                            ? activeThread.record_id
                            : undefined
                    }
                    orderId={
                        activeThread.type === 'orders'
                            ? activeThread.record_id
                            : undefined
                    }
                    chatType={activeThread.chat_type}
                    defaultOpen
                    hideToggle
                    placement="left"
                    title={activeThread.title}
                    subtitle={activeThread.badge}
                    onClose={() => {
                        setActiveThread(null);
                        fetchThreads();
                    }}
                />
            ) : null}
        </>
    );
}
