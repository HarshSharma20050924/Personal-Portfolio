
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Maximize2, Minimize2, Trash2, Terminal, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatWidget.css';

const M = motion as any;

interface Message {
  role: 'user' | 'ai';
  content: string;
  hasAnimated?: boolean;
}

interface ChatWidgetProps {
    template?: string;
}

// Component for AI Message to handle its own typing state
const AIMessage: React.FC<{ 
    content: string; 
    shouldAnimate: boolean;
    onAnimationComplete?: () => void;
}> = ({ content, shouldAnimate, onAnimationComplete }) => {
    const [text, setText] = useState(shouldAnimate ? '' : content);
    
    useEffect(() => {
        if (!shouldAnimate) {
            setText(content);
            return;
        }
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < content.length) {
                setText(content.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                if (onAnimationComplete) onAnimationComplete();
            }
        }, 15); // Fast typing speed

        return () => clearInterval(interval);
    }, [content, shouldAnimate, onAnimationComplete]);

    return (
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-sm leading-relaxed prose-a:text-blue-500 hover:prose-a:text-blue-600 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
            </ReactMarkdown>
        </div>
    );
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ template }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Initialize from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
      try {
          const saved = localStorage.getItem('portfolio_chat_history');
          if (saved) {
              const parsed = JSON.parse(saved);
              return parsed.map((m: Message) => ({ ...m, hasAnimated: true }));
          }
      } catch (e) {
          console.error("Failed to load chat history", e);
      }
      return [{ role: 'ai', content: "System online. Accessing portfolio archives... How may I assist you?", hasAnimated: false }];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const isElite = template === 'elite';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      localStorage.setItem('portfolio_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isExpanded]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, hasAnimated: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply, hasAnimated: false }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Connection interrupted. Neural link unstable. Please try again.", hasAnimated: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsAnimated = (index: number) => {
      setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, hasAnimated: true } : msg));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'ai', content: "Memory buffer flushed. Awaiting new input.", hasAnimated: false }]);
    localStorage.removeItem('portfolio_chat_history');
  };

  // Prevent scroll propagation to body
  const stopPropagation = (e: React.WheelEvent | React.TouchEvent) => {
      e.stopPropagation();
  };

  if (isElite) {
    return (
        <div className="chat-widget-container font-mono" onWheel={stopPropagation} onTouchMove={stopPropagation} data-lenis-prevent>
            <AnimatePresence>
                {isOpen && (
                    <M.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            width: isMobile ? '90vw' : (isExpanded ? '500px' : '400px'),
                            height: isMobile ? '60vh' : (isExpanded ? '85vh' : '550px'),
                            marginBottom: '1rem', 
                            originX: 1, 
                            originY: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`
                            pointer-events-auto flex flex-col overflow-hidden
                            bg-white/90 dark:bg-black/90 backdrop-blur-md 
                            border border-gray-200 dark:border-white/20 
                            shadow-2xl dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]
                            mb-4 rounded-lg text-slate-800 dark:text-gray-200
                        `}
                    >
                        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/50">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 dark:bg-green-500 animate-pulse shadow-sm" />
                                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-700 dark:text-white">System.AI_Core</h3>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400 dark:text-white/50">
                                <button onClick={handleClearChat} className="hover:text-slate-900 dark:hover:text-white transition-colors" title="Clear Chat"><Trash2 size={14} /></button>
                                <button onClick={() => setIsExpanded(!isExpanded)} className="hover:text-slate-900 dark:hover:text-white transition-colors" title={isExpanded ? "Minimize" : "Expand"}>
                                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors" title="Close"><X size={14} /></button>
                            </div>
                        </div>

                        <div 
                            ref={scrollAreaRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-black/40 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/20 scrollbar-track-transparent overscroll-contain"
                            data-lenis-prevent // Important for stopping Lenis scroll hijacking
                        >
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        {msg.role === 'user' ? <><User size={8} /> USER</> : <><Terminal size={8} /> SYSTEM_RESPONSE</>}
                                    </span>
                                    <div className={`
                                        max-w-[95%] p-3 rounded-md border
                                        ${msg.role === 'user' 
                                            ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 text-slate-800 dark:text-white text-right' 
                                            : 'bg-white dark:bg-black/60 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 text-left shadow-sm'
                                        }
                                    `}>
                                        {msg.role === 'ai' ? (
                                            <AIMessage 
                                                content={msg.content} 
                                                shouldAnimate={!msg.hasAnimated} 
                                                onAnimationComplete={() => markMessageAsAnimated(idx)}
                                            />
                                        ) : (
                                            <div className="text-sm">{msg.content}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em]">PROCESSING</span>
                                    <div className="flex gap-1 h-1">
                                        <motion.div animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-slate-300 dark:bg-white/50" />
                                        <motion.div animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-slate-300 dark:bg-white/50" />
                                        <motion.div animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-slate-300 dark:bg-white/50" />
                                    </div>
                                </div>
                             )}
                             <div ref={messagesEndRef} />
                        </div>

                        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-black/80">
                             <div className="flex items-center gap-3">
                                <span className="text-blue-500 dark:text-green-500 animate-pulse">{'>'}</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white text-sm font-mono placeholder-slate-400 dark:placeholder-white/20 focus:ring-0"
                                    placeholder="Input command..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="text-slate-600 dark:text-white hover:text-blue-500 dark:hover:text-green-400 disabled:opacity-30 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                             </div>
                        </div>
                    </M.div>
                )}
            </AnimatePresence>

            <M.button
                className={`
                    pointer-events-auto w-12 h-12 flex items-center justify-center transition-all
                    bg-white dark:bg-black border border-gray-200 dark:border-white/20 
                    text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white dark:hover:text-black dark:hover:border-white 
                    shadow-lg dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]
                `}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={20} /> : <Terminal size={20} />}
            </M.button>
        </div>
    );
  }

  return (
    <div className="chat-widget-container" onWheel={stopPropagation} onTouchMove={stopPropagation} data-lenis-prevent>
      <AnimatePresence>
        {isOpen && (
          <M.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isMobile ? '90vw' : (isExpanded ? '480px' : '400px'),
              height: isMobile ? '60vh' : (isExpanded ? '85vh' : '600px'),
              marginBottom: '1rem',
              originX: 1,
              originY: 1,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              pointer-events-auto flex flex-col overflow-hidden shadow-2xl
              bg-white dark:bg-slate-900 
              border border-gray-200 dark:border-gray-700
              rounded-2xl
            `}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-800 dark:text-gray-100 text-sm">Portfolio AI</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assistant Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button onClick={handleClearChat} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"><Trash2 size={16} /></button>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"><X size={18} /></button>
              </div>
            </div>

            <div 
                ref={scrollAreaRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20 scroll-smooth overscroll-contain"
                data-lenis-prevent
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'}`}>
                    {msg.role === 'ai' ? (
                        <AIMessage content={msg.content} shouldAnimate={!msg.hasAnimated} onAnimationComplete={() => markMessageAsAnimated(idx)} />
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="typing-dots flex gap-1 text-gray-400 dark:text-gray-500">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-shrink-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-100 dark:bg-slate-800 border-transparent focus:border-primary dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 border-2 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button className={`p-3 rounded-xl flex items-center justify-center transition-all ${inputValue.trim() && !isLoading ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`} onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                  <Send size={20} />
                </button>
              </div>
            </div>
          </M.div>
        )}
      </AnimatePresence>

      <M.button
        className={`pointer-events-auto w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all bg-primary hover:bg-blue-600 text-white border-4 border-white dark:border-slate-800`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </M.button>
    </div>
  );
};

export default ChatWidget;
