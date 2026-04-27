import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Inbox, MessageSquare, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import GuestSupportChat from '@/components/app/guest-support-chat';
import { Button } from '@/components/ui/button';
import { threads as chatThreads } from '@/routes/chat';

type GuestThread = {
    id: string;
    type: 'guest';
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

export default function StaffGuestChatInbox({
    currentUser,
}: {
    currentUser: any;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [threads, setThreads] = useState<GuestThread[]>([]);
    const [activeThread, setActiveThread] = useState<GuestThread | null>(null);

    const unreadTotal = threads.reduce(
        (total, thread) => total + thread.unread_count,
        0,
    );

    const fetchThreads = useCallback(() => {
        if (currentUser?.role !== 'staff') {
            return;
        }

        setIsLoading(true);

        fetch(chatThreads.url(), {
            headers: { Accept: 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                setThreads(
                    (data.threads ?? []).filter(
                        (thread: GuestThread) => thread.type === 'guest',
                    ),
                );
            })
            .finally(() => setIsLoading(false));
    }, [currentUser?.role]);

    useEffect(() => {
        if (currentUser?.role !== 'staff') {
            return;
        }

        const initialFetch = window.setTimeout(fetchThreads, 0);
        const interval = window.setInterval(fetchThreads, 8000);

        return () => {
            window.clearTimeout(initialFetch);
            window.clearInterval(interval);
        };
    }, [currentUser?.role, fetchThreads]);

    useEffect(() => {
        if (currentUser?.role !== 'staff' || !(window as any).Echo) {
            return;
        }

        const channel = (window as any).Echo.private(
            'staff.notifications',
        ).listen('.guest-message.sent', fetchThreads);

        return () => {
            channel.stopListening('.guest-message.sent');
        };
    }, [currentUser?.role, fetchThreads]);

    if (currentUser?.role !== 'staff') {
        return null;
    }

    return (
        <div className="relative">
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
                    className="group fixed right-6 bottom-32 z-[65] flex h-14 items-center gap-3 rounded-full bg-sky-500 px-5 text-black shadow-xl shadow-sky-500/30 transition-transform md:right-8 md:bottom-8"
                    aria-label="Buka inbox chat tamu"
                >
                    <Headphones
                        size={20}
                        className="transition-transform group-hover:-rotate-6"
                    />
                    <span className="text-[10px] font-black tracking-[0.16em] uppercase">
                        Guest Chat
                    </span>
                    {unreadTotal > 0 && (
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-black text-white">
                            {unreadTotal}
                        </span>
                    )}
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        className="fixed right-4 bottom-32 z-[80] flex max-h-[520px] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F11] shadow-2xl shadow-black/40 md:right-8 md:bottom-8 lg:w-[420px]"
                    >
                        <div className="flex items-center justify-between border-b border-white/5 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-black">
                                    <Headphones size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight text-white uppercase">
                                        Guest Chat
                                    </h3>
                                    <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                                        Home visitor messages
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={fetchThreads}
                                    className="rounded-full text-white/40 hover:bg-white/10 hover:text-white"
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
                                    className="rounded-full text-white/40 hover:bg-white/10 hover:text-white"
                                >
                                    <X size={18} />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3">
                            {threads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-8 py-12 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/30">
                                        <Inbox size={20} />
                                    </div>
                                    <p className="text-xs font-bold tracking-widest text-white/30 uppercase">
                                        Belum ada chat tamu
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {threads.map((thread) => (
                                        <button
                                            key={thread.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveThread(thread);
                                                setIsOpen(false);
                                            }}
                                            className="group flex w-full items-start gap-3 rounded-2xl border border-transparent p-3 text-left transition-colors hover:border-sky-500/20 hover:bg-sky-500/5"
                                        >
                                            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                                                <MessageSquare size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="truncate text-sm font-black text-white">
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
                                                <p className="mt-0.5 truncate text-xs font-semibold text-white/40">
                                                    {thread.subtitle}
                                                </p>
                                                {thread.last_message && (
                                                    <p className="mt-2 truncate text-[11px] text-white/30">
                                                        {
                                                            thread.last_message
                                                                .sender_name
                                                        }
                                                        :{' '}
                                                        {
                                                            thread.last_message
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

            {activeThread && (
                <GuestSupportChat
                    key={activeThread.id}
                    currentUser={currentUser}
                    conversationId={activeThread.record_id}
                    defaultOpen
                    hideToggle
                    placement="right"
                    title={activeThread.title}
                    subtitle="Guest & Staff"
                    onClose={() => {
                        setActiveThread(null);
                        fetchThreads();
                    }}
                />
            )}
        </div>
    );
}
