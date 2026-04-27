import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, MessageSquare, Send, User, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/hooks/use-translations';
import {
    messages as guestMessages,
    store as guestStore,
} from '@/routes/guest-chat';
import {
    messages as staffMessages,
    store as staffStore,
} from '@/routes/guest-chat/staff';

type GuestSupportMessage = {
    id: number;
    conversation_id?: number;
    content: string;
    sender_type: 'guest' | 'staff';
    sender: {
        id: number | null;
        name: string;
        role: string;
    };
    read_at?: string | null;
    created_at: string;
};

type GuestSupportChatProps = {
    currentUser?: any;
    conversationId?: number;
    defaultOpen?: boolean;
    hideToggle?: boolean;
    placement?: 'left' | 'right';
    title?: string;
    subtitle?: string;
    onClose?: () => void;
};

export default function GuestSupportChat({
    currentUser,
    conversationId,
    defaultOpen = false,
    hideToggle = false,
    placement = 'left',
    title,
    subtitle,
    onClose,
}: GuestSupportChatProps) {
    const storageKey = 'guest-support-chat';
    const { __ } = useTranslations();
    const isStaffMode = Boolean(conversationId);
    const persistedGuestState =
        !isStaffMode && typeof window !== 'undefined'
            ? (() => {
                  const savedState = window.localStorage.getItem(storageKey);

                  if (!savedState) {
                      return null;
                  }

                  try {
                      return JSON.parse(savedState) as {
                          conversationId?: number;
                          guestName?: string;
                      };
                  } catch {
                      window.localStorage.removeItem(storageKey);

                      return null;
                  }
              })()
            : null;
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [messages, setMessages] = useState<GuestSupportMessage[]>([]);
    const [guestName, setGuestName] = useState(
        persistedGuestState?.guestName ?? '',
    );
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState<
        number | undefined
    >(conversationId ?? persistedGuestState?.conversationId);
    const scrollRef = useRef<HTMLDivElement>(null);

    const launcherPosition =
        placement === 'left'
            ? 'bottom-32 left-6 md:bottom-8 md:left-8'
            : 'bottom-8 right-8';
    const panelPosition =
        placement === 'left'
            ? 'bottom-32 left-4 md:bottom-8 md:left-8'
            : 'bottom-8 right-8';

    useEffect(() => {
        if (isStaffMode || typeof window === 'undefined') {
            return;
        }

        if (!currentConversationId && !guestName) {
            return;
        }

        window.localStorage.setItem(
            storageKey,
            JSON.stringify({
                conversationId: currentConversationId,
                guestName,
            }),
        );
    }, [currentConversationId, guestName, isStaffMode]);

    const fetchMessages = useCallback(() => {
        setIsLoading(true);

        const url = isStaffMode
            ? staffMessages.url(conversationId)
            : guestMessages.url({
                  query: currentConversationId
                      ? { conversation_id: currentConversationId }
                      : undefined,
              });

        fetch(url, {
            headers: { Accept: 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.messages ?? []);

                if (data.conversation?.id) {
                    setCurrentConversationId(data.conversation.id);
                }

                if (data.conversation?.guest_name) {
                    setGuestName(data.conversation.guest_name);
                }
            })
            .finally(() => setIsLoading(false));
    }, [conversationId, currentConversationId, isStaffMode]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const initialFetch = window.setTimeout(fetchMessages, 0);
        const interval = window.setInterval(fetchMessages, 8000);

        return () => {
            window.clearTimeout(initialFetch);
            window.clearInterval(interval);
        };
    }, [fetchMessages, isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (!isOpen || !currentConversationId || !(window as any).Echo) {
            return;
        }

        const channel = (window as any).Echo.channel(
            `guest-chat.${currentConversationId}`,
        ).listen('.guest-message.sent', () => {
            fetchMessages();
        });

        return () => {
            channel.stopListening('.guest-message.sent');
            (window as any).Echo.leave(`guest-chat.${currentConversationId}`);
        };
    }, [currentConversationId, fetchMessages, isOpen]);

    const sendMessage = (event: FormEvent) => {
        event.preventDefault();

        if (!newMessage.trim()) {
            return;
        }

        const content = newMessage;
        setNewMessage('');

        const url = isStaffMode
            ? staffStore.url(conversationId)
            : guestStore.url();
        const payload = isStaffMode
            ? { content }
            : {
                  content,
                  guest_name: guestName,
                  conversation_id: currentConversationId,
              };

        fetch(url, {
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
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to send guest chat message');
                }

                return response.json();
            })
            .then((message: GuestSupportMessage) => {
                if (message.conversation_id) {
                    setCurrentConversationId(message.conversation_id);
                }

                setMessages((current) => {
                    if (current.some((item) => item.id === message.id)) {
                        return current;
                    }

                    return [...current, message];
                });
            })
            .catch(() => setNewMessage(content));
    };

    const closeChat = () => {
        setIsOpen(false);
        onClose?.();
    };

    return (
        <>
            {!hideToggle && !isOpen && (
                <motion.button
                    type="button"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setIsOpen(true)}
                    className={`fixed ${launcherPosition} group z-[65] flex h-14 w-14 items-center justify-center rounded-full bg-sky-500 text-black shadow-xl shadow-sky-500/30`}
                    aria-label={__('Open staff chat')}
                >
                    <MessageSquare
                        size={23}
                        className="transition-transform group-hover:-rotate-6"
                    />
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.96 }}
                        className={`fixed ${panelPosition} z-[70] flex h-[560px] max-h-[calc(100vh-9rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-black/20 sm:w-[390px] dark:border-white/10 dark:bg-[#0F0F11]`}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 text-black">
                                    <Headphones size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                        {title || __('Chat with Staff')}
                                    </h3>
                                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                        {subtitle || __('Staff restoran')}
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={closeChat}
                                className="rounded-full"
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        {!isStaffMode && messages.length === 0 && (
                            <div className="border-b border-slate-100 p-4 dark:border-white/5">
                                <Input
                                    value={guestName}
                                    onChange={(event) =>
                                        setGuestName(event.target.value)
                                    }
                                    placeholder={__('Your name')}
                                    className="h-12 rounded-2xl border-slate-200 px-5 text-sm font-medium dark:border-white/10 dark:bg-black/40"
                                />
                            </div>
                        )}

                        <div
                            ref={scrollRef}
                            className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-5"
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                                        <MessageSquare size={20} />
                                    </div>
                                    <p className="max-w-56 text-xs leading-relaxed font-bold tracking-widest text-muted-foreground uppercase">
                                        {isLoading
                                            ? __('Loading conversation')
                                            : __(
                                                  'Kirim pesan, staff akan membalas dari panel restoran.',
                                              )}
                                    </p>
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const isMe = isStaffMode
                                        ? message.sender.id === currentUser?.id
                                        : message.sender_type === 'guest';

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            <div
                                                className={`flex max-w-[85%] items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                            >
                                                {!isMe && (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                                                        <User size={14} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col gap-1">
                                                    {!isMe && (
                                                        <span className="ml-1 text-[10px] font-black tracking-tight text-muted-foreground/60 uppercase">
                                                            {
                                                                message.sender
                                                                    .name
                                                            }
                                                        </span>
                                                    )}
                                                    <div
                                                        className={`rounded-2xl px-4 py-3 text-sm ${
                                                            isMe
                                                                ? 'rounded-tr-none bg-sky-500 font-medium text-black'
                                                                : 'rounded-tl-none bg-slate-100 text-slate-900 dark:bg-white/[0.05] dark:text-slate-200'
                                                        }`}
                                                    >
                                                        {message.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <form
                            onSubmit={sendMessage}
                            className="border-t border-slate-100 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/[0.01]"
                        >
                            <div className="relative">
                                <Input
                                    placeholder={__('Type your message...')}
                                    value={newMessage}
                                    onChange={(event) =>
                                        setNewMessage(event.target.value)
                                    }
                                    className="h-14 rounded-2xl border-slate-200 pr-14 pl-5 font-medium dark:border-white/10 dark:bg-black/40"
                                />
                                <button
                                    type="submit"
                                    className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-black transition-transform hover:scale-105"
                                    aria-label={__('Send message')}
                                >
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
