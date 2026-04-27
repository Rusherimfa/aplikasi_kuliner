import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Bot, User, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/use-translations';

interface Message {
    id: number;
    content: string;
    sender: {
        id: number;
        name: string;
        role: string;
    };
    is_chatbot: boolean;
    read_at?: string | null;
    created_at: string;
}

type BoutiqueChatProps = {
    reservationId?: number;
    orderId?: number;
    currentUser: any;
    defaultOpen?: boolean;
    hideToggle?: boolean;
    placement?: 'left' | 'right';
    title?: string;
    subtitle?: string;
    onClose?: () => void;
};

export default function BoutiqueChat({
    reservationId,
    orderId,
    currentUser,
    defaultOpen = false,
    hideToggle = false,
    placement = 'right',
    title,
    subtitle,
    onClose,
}: BoutiqueChatProps) {
    const { __ } = useTranslations();
    const { props } = usePage();
    const { locale } = props as any;
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const type = reservationId ? 'reservations' : 'orders';
    const id = reservationId || orderId;
    const currentUserId = currentUser?.id;
    const launcherPosition =
        placement === 'left'
            ? 'bottom-32 left-6 md:bottom-8 md:left-8'
            : 'bottom-8 right-8';
    const panelPosition =
        placement === 'left'
            ? 'bottom-32 left-4 md:bottom-8 md:left-8'
            : 'bottom-8 right-8';

    const fetchMessages = useCallback(() => {
        if (!id || !currentUserId) {
            return;
        }

        fetch(`/${type}/${id}/messages`, {
            headers: { Accept: 'application/json' },
        })
            .then((res) => res.json())
            .then((data) => {
                setMessages(data);
                const unread = data.filter(
                    (m: Message) => !m.read_at && m.sender.id !== currentUserId,
                ).length;
                setUnreadCount(unread);
            })
            .catch((err) => console.error('Failed to fetch messages:', err));
    }, [currentUserId, id, type]);

    const markMessagesAsRead = useCallback(() => {
        if (!id) {
            return;
        }

        fetch(`/chat/${id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    (
                        document.querySelector(
                            'meta[name="csrf-token"]',
                        ) as HTMLMetaElement
                    )?.content || '',
                Accept: 'application/json',
            },
            body: JSON.stringify({ type }),
        })
            .then((res) => res.json())
            .then(() => {
                setUnreadCount(0);
                setMessages((prev) =>
                    prev.map((m) => ({
                        ...m,
                        read_at: m.read_at || new Date().toISOString(),
                    })),
                );
            })
            .catch((err) => console.error('Failed to mark read:', err));
    }, [id, type]);

    useEffect(() => {
        if (!id || !currentUserId || !(window as any).Echo) {
            return;
        }

        fetchMessages();

        const channel = (window as any).Echo.private(`${type}.${id}`).listen(
            '.message.sent',
            (data: { message: Message }) => {
                setMessages((prev) => [...prev, data.message]);

                if (!isOpen && data.message.sender.id !== currentUserId) {
                    setUnreadCount((prev) => prev + 1);
                }
            },
        );

        return () => {
            channel.stopListening('.message.sent');
        };
    }, [currentUserId, fetchMessages, id, isOpen, type]);

    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markMessagesAsRead();
        }
    }, [isOpen, markMessagesAsRead, unreadCount]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !id) {
            return;
        }

        const content = newMessage;
        setNewMessage('');

        fetch(`/${type}/${id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN':
                    (
                        document.querySelector(
                            'meta[name="csrf-token"]',
                        ) as HTMLMetaElement
                    )?.content || '',
                Accept: 'application/json',
            },
            body: JSON.stringify({ content }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();
            })
            .then((data) => {
                setMessages((prev) => [...prev, data]);
            })
            .catch((error) => {
                console.error('Failed to send message:', error);
                toast.error(__('Failed to send message'));
                setNewMessage(content);
            });
    };

    const closeChat = () => {
        setIsOpen(false);
        onClose?.();
    };

    if (!id) {
        return null;
    }

    return (
        <>
            {/* Floating Toggle Button */}
            {!hideToggle && !isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className={`fixed ${launcherPosition} group z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-sky-500 text-black shadow-2xl shadow-sky-500/40`}
                >
                    <MessageCircle
                        size={28}
                        className="transition-transform group-hover:rotate-12"
                    />
                    {unreadCount > 0 && (
<<<<<<< HEAD
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-rose-500 border-2 border-white dark:border-black rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[10px] font-black text-white">{unreadCount}</span>
=======
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-rose-500 shadow-lg">
                            <span className="text-[10px] font-black text-white">
                                {unreadCount}
                            </span>
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c
                        </div>
                    )}
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        className={`fixed ${panelPosition} z-[70] flex h-[600px] max-h-[calc(100vh-9rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl sm:w-[400px] dark:border-white/10 dark:bg-[#0F0F11]`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 bg-sky-500/5 p-6 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-black">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                        {title || __('Boutique Support')}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                            {subtitle || __('Active Assistant')}
                                        </span>
                                    </div>
                                </div>
                            </div>
<<<<<<< HEAD
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
=======
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeChat}
                                className="rounded-full transition-colors hover:bg-white/10"
                            >
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6"
                        >
                            <div className="py-4 text-center">
                                <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
                                    {__('Gourmet Conversation Started')}
                                </span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.sender.id === currentUser.id;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`flex max-w-[85%] items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {!isMe && (
                                                <div
                                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${msg.is_chatbot ? 'bg-sky-500/10 text-sky-500' : 'bg-blue-500/10 text-blue-500'}`}
                                                >
                                                    {msg.is_chatbot ? (
                                                        <Sparkles size={14} />
                                                    ) : (
                                                        <User size={14} />
                                                    )}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                {!isMe && !msg.is_chatbot && (
                                                    <span className="ml-1 text-[10px] font-black tracking-tight text-muted-foreground/60 uppercase">
                                                        {msg.sender.name}
                                                    </span>
                                                )}
                                                <div
                                                    className={`rounded-2xl px-4 py-3 text-sm ${
                                                        isMe
                                                            ? 'rounded-tr-none bg-sky-500 font-medium text-black'
                                                            : 'rounded-tl-none bg-slate-100 text-slate-900 dark:bg-white/[0.05] dark:text-slate-200'
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>
                                                <div
                                                    className={`mt-1 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <span className="px-2 text-[9px] font-bold text-muted-foreground uppercase opacity-40">
                                                        {new Date(
                                                            msg.created_at,
                                                        ).toLocaleTimeString(
                                                            locale === 'id'
                                                                ? 'id-ID'
                                                                : 'en-US',
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={sendMessage}
                            className="border-t border-slate-100 bg-slate-50 p-6 dark:border-white/5 dark:bg-white/[0.01]"
                        >
                            <div className="group relative">
                                <Input
                                    placeholder={__(
                                        'Ask for concierge assistance...',
                                    )}
                                    value={newMessage}
<<<<<<< HEAD
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="h-14 pl-6 pr-14 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white focus:ring-sky-500/20 font-medium"
=======
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                    className="h-14 rounded-2xl border-slate-200 pr-14 pl-6 font-medium focus:ring-sky-500/20 dark:border-white/10 dark:bg-black/40"
>>>>>>> 854faaa89de91e541e11f652cb2fc3d468ba2b2c
                                />
                                <button
                                    type="submit"
                                    className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-black transition-transform hover:scale-105"
                                >
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                            <p className="mt-4 text-center text-[9px] font-bold tracking-widest text-muted-foreground uppercase opacity-40">
                                {__('Powered by Reverb Real-time')}
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
