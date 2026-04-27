import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHttp, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
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

export default function BoutiqueChat({ reservationId, orderId, currentUser }: { reservationId?: number, orderId?: number, currentUser: any }) {
    const { __ } = useTranslations();
    const { props } = usePage();
    const { locale } = props as any;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const http = useHttp();

    const type = reservationId ? 'reservations' : 'orders';
    const id = reservationId || orderId;

    useEffect(() => {
        if (!id) return;

        // Fetch initial messages
        fetchMessages();

        // Listen for real-time messages on private channel
        const channel = (window as any).Echo.private(`${type}.${id}`)
            .listen('.message.sent', (data: { message: Message }) => {
                setMessages(prev => [...prev, data.message]);
                if (!isOpen && data.message.sender.id !== currentUser.id) {
                    setUnreadCount(prev => prev + 1);
                }
            });

        return () => {
            channel.stopListening('.message.sent');
        };
    }, [id, type]);

    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markMessagesAsRead();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const fetchMessages = () => {
        console.log('Fetching messages for:', { type, id });
        fetch(`/${type}/${id}/messages`, {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Messages fetched:', data.length);
            setMessages(data);
            const unread = data.filter((m: any) => !m.read_at && m.sender.id !== currentUser.id).length;
            setUnreadCount(unread);
        })
        .catch(err => console.error('Failed to fetch messages:', err));
    };

    const markMessagesAsRead = () => {
        fetch(`/chat/${id}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ type })
        })
        .then(res => res.json())
        .then(() => {
            setUnreadCount(0);
            setMessages(prev => prev.map(m => ({ ...m, read_at: m.read_at || new Date().toISOString() })));
        })
        .catch(err => console.error('Failed to mark read:', err));
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !id) return;

        const content = newMessage;
        setNewMessage('');

        console.log('Sending message via fetch:', { type, id, content });

        fetch(`/${type}/${id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ content })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Message sent successfully:', data);
            setMessages(prev => [...prev, data]);
        })
        .catch(error => {
            console.error('Failed to send message:', error);
            toast.error(__('Failed to send message'));
            setNewMessage(content);
        });
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-sky-500 text-black shadow-2xl shadow-sky-500/40 flex items-center justify-center z-[60] group"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-6 w-6 bg-rose-500 border-2 border-white dark:border-black rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[10px] font-black text-white">{unreadCount}</span>
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
                        className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white dark:bg-[#0F0F11] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col z-[60] overflow-hidden backdrop-blur-3xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-sky-500/5">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-sky-500 flex items-center justify-center text-black">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{__('Boutique Support')}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{__('Active Assistant')}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                        >
                            <div className="text-center py-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{__('Gourmet Conversation Started')}</span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.sender.id === currentUser.id;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-start gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isMe && (
                                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${msg.is_chatbot ? 'bg-sky-500/10 text-sky-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {msg.is_chatbot ? <Sparkles size={14} /> : <User size={14} />}
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                {!isMe && !msg.is_chatbot && (
                                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tight ml-1">
                                                        {msg.sender.name}
                                                    </span>
                                                )}
                                                <div className={`px-4 py-3 rounded-2xl text-sm ${
                                                    isMe ? 'bg-sky-500 text-black font-medium rounded-tr-none' : 
                                                    'bg-slate-100 dark:bg-white/[0.05] text-slate-900 dark:text-slate-200 rounded-tl-none'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 px-2">
                                                        {new Date(msg.created_at).toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
                            <div className="relative group">
                                <Input 
                                    placeholder={__('Ask for concierge assistance...')}
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="h-14 pl-6 pr-14 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-slate-900 dark:text-white focus:ring-sky-500/20 font-medium"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-sky-500 text-black rounded-xl hover:scale-105 transition-transform"
                                >
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                            <p className="text-center mt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">{__('Powered by Reverb Real-time')}</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

