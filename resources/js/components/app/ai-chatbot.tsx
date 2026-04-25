import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ChefHat } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

interface ChatMessage {
    id: string;
    text: string;
    isBot: boolean;
}

export default function AIChatbot() {
    const { __ } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize greeting after translations are ready
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    text: __('Hello! I am RestoBot, your virtual assistant. How can I help you today?'),
                    isBot: true,
                },
            ]);
        }
    }, [__]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const suggestions = [
        __('Best Seller Menu'),
        __('Menu Price List'),
        __('How to Reserve a Table'),
        __('Restaurant Opening Hours'),
    ];

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // User message
        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            text: text,
            isBot: false,
        };
        
        setMessages((prev) => [...prev, newUserMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/chatbot/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || ''
                },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            
            const botResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: data.reply || __('Sorry, the bot system is currently experiencing issues.'),
                isBot: true,
            };
            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: __('Connection lost. Failed to connect to server.'),
                isBot: true,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatMessage = (text: string) => {
        return text.split('\n').map((line, i) => {
            let formattedLine = line.replace(/\*([^*]+)\*/g, '<strong class="font-black text-sky-400">$1</strong>');
            formattedLine = formattedLine.replace(/_([^_]+)_/g, '<em class="text-white/70">$1</em>');
            return (
                <span key={i}>
                    <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    {i !== text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="fixed bottom-32 right-6 md:bottom-6 md:right-6 z-50 flex flex-col items-end font-['Inter',sans-serif]">
            {isOpen ? (
                <div className="mb-4 flex h-[65vh] max-h-[500px] sm:h-[500px] w-[calc(100vw-3rem)] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B]/95 shadow-2xl shadow-black backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-700 shadow-lg shadow-sky-900/30">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-['Playfair_Display',serif] font-bold text-white text-lg leading-none">
                                    RestoBot <span className="text-sky-500 rounded px-1.5 py-0.5 bg-sky-500/10 text-[10px] ml-1 font-sans align-middle">AI</span>
                                </h3>
                                <p className="text-xs text-white/50 mt-1">{__('Ocean\'s Resto Online Assistant')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="relative flex-1 w-full bg-[#0A0A0B]/50">
                        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 scroll-smooth overscroll-contain scrollbar-thin scrollbar-thumb-sky-500/50 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                                            msg.isBot
                                                ? 'bg-white/10 text-white rounded-tl-sm'
                                                : 'bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md shadow-sky-900/20 rounded-tr-sm'
                                        }`}
                                    >
                                        {formatMessage(msg.text)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 border border-white/5">
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Suggestions */}
                    {messages.length === 1 && !isTyping && (
                        <div className="border-t border-white/5 p-3 flex flex-wrap gap-2 bg-white/[0.02]">
                            {suggestions.map((sug) => (
                                <button
                                    key={sug}
                                    onClick={() => handleSend(sug)}
                                    className="text-[11px] font-medium border border-sky-500/30 text-sky-500/80 rounded-full px-3 py-1.5 hover:bg-sky-500/10 hover:text-sky-400 transition-colors"
                                >
                                    {sug}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-3 bg-[#0A0A0B]">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend(inputText);
                            }}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={__('Ask something...')}
                                className="w-full rounded-full border border-white/10 bg-white/5 pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-white transition-opacity disabled:opacity-30 disabled:hover:scale-100 hover:scale-105"
                            >
                                <Send size={14} className="ml-0.5" />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-700 shadow-xl shadow-sky-900/40 hover:scale-105 transition-all duration-300"
                >
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                    <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-sky-700 rounded-full">
                        <Sparkles size={16} className="absolute top-3 right-3 text-white/80" />
                        <Bot size={24} className="text-white relative z-10" />
                    </div>
                    {/* Badge */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#0A0A0B]"></span>
                    </span>
                </button>
            )}
        </div>
    );
}

