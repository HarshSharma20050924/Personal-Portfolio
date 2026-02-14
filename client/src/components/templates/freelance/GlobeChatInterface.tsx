
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bot, ArrowRight, CornerDownLeft, Activity, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SmartLink } from '../../SmartLink';

interface GlobeMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    isTyping?: boolean;
}

// --- Robust Typing Animation Component ---
const AIMessage: React.FC<{ 
    content: string; 
    onComplete?: () => void;
}> = ({ content, onComplete }) => {
    const [displayContent, setDisplayContent] = useState('');
    const hasCompleted = useRef(false);

    useEffect(() => {
        if (!content) {
            if (onComplete) onComplete();
            return;
        }

        hasCompleted.current = false;
        setDisplayContent(''); 
        
        let currentIndex = 0;
        const speed = 12; // Fast typing speed

        const interval = setInterval(() => {
            if (currentIndex < content.length) {
                setDisplayContent(prev => content.slice(0, prev.length + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                if (!hasCompleted.current) {
                    hasCompleted.current = true;
                    if (onComplete) onComplete();
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [content]);

    return (
        <div className="prose prose-sm prose-invert max-w-none text-xs md:text-sm font-light leading-relaxed prose-p:my-1 prose-headings:my-2 prose-strong:text-blue-400">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({node, ...props}) => <SmartLink {...props} />
                }}
            >
                {displayContent}
            </ReactMarkdown>
            {!hasCompleted.current && <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse align-middle" />}
        </div>
    );
};

interface GlobeChatInterfaceProps {
    onClose: () => void;
    onClear: () => void;
    onSend: (msg: string) => void;
    chatHistory: GlobeMessage[];
    isBotThinking: boolean;
    isMobile: boolean;
}

export const GlobeChatInterface: React.FC<GlobeChatInterfaceProps> = ({ onClose, onClear, onSend, chatHistory, isBotThinking, isMobile }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [chatMessage, setChatMessage] = useState('');

    const scrollToBottom = () => {
        if (scrollRef.current) {
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                        top: scrollRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
    };

    useEffect(() => {
        setTimeout(scrollToBottom, 100);
    }, [chatHistory, isBotThinking]);

    const handleSend = () => {
        if (!chatMessage.trim()) return;
        onSend(chatMessage);
        setChatMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
            fixed md:absolute z-50 
            bottom-0 left-0 right-0 md:inset-auto md:bottom-0 md:left-[110%] md:right-auto
            h-[70vh] md:h-[550px] md:w-[420px] w-full md:w-[420px]
            bg-[#050505] md:bg-[#050505]/95 md:backdrop-blur-xl md:border md:border-white/10 md:rounded-[1.5rem] md:shadow-2xl 
            rounded-t-3xl md:rounded-[1.5rem]
            flex flex-col overflow-hidden
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0 safe-area-top">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Bot size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wide font-display">Agency Twin</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">System Active</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                        title="Clear History"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(); }} 
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white clickable z-50"
                        aria-label="Close Chat"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Message Area */}
            <div 
                ref={scrollRef}
                className="flex-1 p-5 overflow-y-auto space-y-4 overscroll-contain scroll-smooth bg-transparent"
                onWheel={(e) => e.stopPropagation()} 
                onTouchMove={(e) => e.stopPropagation()} 
            >
                {chatHistory.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`
                                max-w-[85%] p-4 shadow-sm backdrop-blur-sm
                                ${msg.sender === 'user' 
                                    ? 'bg-blue-600/90 text-white rounded-2xl rounded-tr-sm' 
                                    : 'bg-[#151515]/90 text-gray-200 border border-white/10 rounded-2xl rounded-tl-sm'
                                }
                            `}
                        >
                            {msg.sender === 'bot' && msg.isTyping ? (
                                <AIMessage 
                                    content={msg.text} 
                                    // onComplete handled by parent state update if needed
                                />
                            ) : msg.sender === 'bot' ? (
                                <div className="prose prose-sm prose-invert max-w-none text-xs md:text-sm font-light leading-relaxed">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({node, ...props}) => <SmartLink {...props} />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-xs md:text-sm">{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}
                
                {isBotThinking && (
                    <div className="flex justify-start">
                        <div className="bg-[#151515] px-4 py-3 rounded-2xl rounded-tl-sm border border-white/10 flex gap-1.5 items-center">
                            <Activity size={14} className="text-blue-400 animate-spin" />
                            <span className="text-[10px] text-gray-500 font-mono uppercase">Processing</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/80 md:bg-black/40 border-t border-white/10 shrink-0 pb-8 md:pb-4 safe-area-bottom">
                <div className="relative flex items-center group">
                    <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Inquire about services..."
                        // text-base prevents auto-zoom on iOS
                        className="w-full bg-[#151515] border border-white/10 rounded-xl pl-5 pr-12 py-4 text-base md:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner font-light"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!chatMessage.trim()}
                        className={`absolute right-2 p-2 rounded-lg transition-all duration-300 clickable ${chatMessage.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-transparent text-gray-600'}`}
                    >
                        {chatMessage.trim() ? <ArrowRight size={18} /> : <CornerDownLeft size={18} />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
