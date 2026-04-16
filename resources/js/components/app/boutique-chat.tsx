import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useHttp } from '@inertiajs/react';
import { toast } from 'sonner';

interface Message {
    id: number;
    content: string;
    sender: {
        id: number;
        name: string;
        role: string;
    };
    is_chatbot: boolean;
    created_at: string;
}

export default function BoutiqueChat({ reservationId, currentUser }: { reservationId: number, currentUser: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const http = useHttp();

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            
            // Listen for real-time messages
            const channel = (window as any).Echo.channel(`reservations.${reservationId}`)
                .listen('.message.sent', (data: { message: Message }) => {
                    setMessages(prev => [...prev, data.message]);
                });

            return () => {
                channel.stopListening('.message.sent');
            };
        }
    }, [isOpen, reservationId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = () => {
        http.get(`/reservations/${reservationId}/messages`, {
            onSuccess: (data: any) => {
                setMessages(data);
            }
        });
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage('');

        http.post(`/reservations/${reservationId}/messages`, { content }, {
            onSuccess: (data: any) => {
                // The message list is updated via broadcast as well, but we can optimistically update or rely on broadcast
                // Since we use .toOthers() in backend, we should add it here
                setMessages(prev => [...prev, data]);
            },
            onError: () => {
                toast.error('Gagal mengirim pesan');
            }
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
                    className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-orange-500 text-black shadow-2xl shadow-orange-500/40 flex items-center justify-center z-[60] group"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-black border-2 border-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-black text-orange-500 animate-pulse">!</span>
                    </div>
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
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-orange-500/5">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-black">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Boutique Support</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
                        >
                            <div className="text-center py-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Gourmet Conversation Started</span>
                            </div>

                            {messages.map((msg) => {
                                const isMe = msg.sender.id === currentUser.id;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex items-start gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isMe && (
                                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${msg.is_chatbot ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {msg.is_chatbot ? <Sparkles size={14} /> : <User size={14} />}
                                                </div>
                                            )}
                                            <div className={`px-4 py-3 rounded-2xl text-sm ${
                                                isMe ? 'bg-orange-500 text-black font-medium rounded-tr-none' : 
                                                'bg-slate-100 dark:bg-white/[0.05] text-slate-900 dark:text-slate-200 rounded-tl-none'
                                            }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 mt-1.5 px-2">
                                            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
                            <div className="relative group">
                                <Input 
                                    placeholder="Ask for concierge assistance..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="h-14 pl-6 pr-14 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-black/40 focus:ring-orange-500/20 font-medium"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-orange-500 text-black rounded-xl hover:scale-105 transition-transform"
                                >
                                    <Send size={16} fill="currentColor" />
                                </button>
                            </div>
                            <p className="text-center mt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Powered by Reverb Real-time</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
