
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Maximize2, Minimize2, Trash2, Terminal } from 'lucide-react';
import './ChatWidget.css';

const M = motion as any;

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatWidgetProps {
    template?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ template }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "System online. How may I assist you with this portfolio data?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isElite = template === 'elite';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isExpanded]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
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
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Connection interrupted. Retry recommended." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'ai', content: "Memory buffer cleared. Ready for input." }]);
  };

  if (isElite) {
    return (
        <div className="chat-widget-container font-mono">
            <AnimatePresence>
                {isOpen && (
                    <M.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: isExpanded ? '-50%' : '0%',
                            width: isExpanded ? '90vw' : '400px',
                            height: isExpanded ? 'calc(100vh - 160px)' : '550px',
                            position: isExpanded ? 'fixed' : 'relative',
                            top: isExpanded ? '50%' : 'auto',
                            left: isExpanded ? '50%' : 'auto',
                            x: isExpanded ? '-50%' : '0%',
                            zIndex: 100,
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`
                            pointer-events-auto flex flex-col overflow-hidden
                            bg-black border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]
                            ${isExpanded ? 'fixed inset-0 m-auto' : 'mb-4'}
                        `}
                    >
                        {/* Elite Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-black">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white animate-pulse" />
                                <h3 className="text-xs uppercase tracking-widest text-white">System.AI</h3>
                            </div>
                            <div className="flex items-center gap-4 text-white/50">
                                <button onClick={handleClearChat} className="hover:text-white transition-colors"><Trash2 size={14} /></button>
                                <button onClick={() => setIsExpanded(!isExpanded)} className="hover:text-white transition-colors">
                                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors"><X size={14} /></button>
                            </div>
                        </div>

                        {/* Elite Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-black">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                                        {msg.role === 'user' ? 'USER' : 'SYSTEM'}
                                    </span>
                                    <div className={`
                                        max-w-[90%] text-sm leading-relaxed
                                        ${msg.role === 'user' ? 'text-white text-right' : 'text-gray-400 text-left border-l border-white/20 pl-3'}
                                    `}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex justify-start">
                                    <span className="text-[10px] text-white/30 uppercase tracking-widest animate-pulse">Processing...</span>
                                </div>
                             )}
                             <div ref={messagesEndRef} />
                        </div>

                        {/* Elite Input */}
                        <div className="p-4 border-t border-white/20 bg-black">
                             <div className="flex items-center gap-2">
                                <span className="text-white/50">{'>'}</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-white text-sm font-mono placeholder-white/20"
                                    placeholder="Execute command..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="text-white/50 hover:text-white disabled:opacity-30 transition-colors uppercase text-xs tracking-widest"
                                >
                                    SEND
                                </button>
                             </div>
                        </div>
                    </M.div>
                )}
            </AnimatePresence>

            <M.button
                className={`
                    pointer-events-auto w-12 h-12 flex items-center justify-center transition-all
                    bg-black border border-white/20 text-white hover:bg-white hover:text-black hover:border-white
                `}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <X size={20} /> : <Terminal size={20} />}
            </M.button>
        </div>
    );
  }

  // Default Chat Widget Style
  return (
    <div className="chat-widget-container">
      <AnimatePresence>
        {isOpen && (
          <M.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: isExpanded ? '-50%' : '0%',
              width: isExpanded ? '90vw' : '400px',
              height: isExpanded ? 'calc(100vh - 160px)' : '600px',
              position: isExpanded ? 'fixed' : 'relative',
              top: isExpanded ? '50%' : 'auto',
              left: isExpanded ? '50%' : 'auto',
              x: isExpanded ? '-50%' : '0%',
              zIndex: 100,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              pointer-events-auto flex flex-col overflow-hidden shadow-2xl
              bg-white dark:bg-slate-900 
              border border-gray-200 dark:border-gray-700
              ${isExpanded ? 'rounded-2xl fixed inset-0 m-auto' : 'rounded-2xl mb-4'}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-800 dark:text-gray-100 text-sm">AI Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Llama 3</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleClearChat}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                  title="Clear Chat"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                  title={isExpanded ? "Minimize" : "Maximize"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20 scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                      }
                    `}
                  >
                    {msg.content}
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

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
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
                <button 
                  className={`
                    p-3 rounded-xl flex items-center justify-center transition-all
                    ${inputValue.trim() && !isLoading
                      ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30' 
                      : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    }
                  `}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </M.div>
        )}
      </AnimatePresence>

      <M.button
        className={`
          pointer-events-auto w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all
          bg-primary hover:bg-blue-600 text-white
          border-4 border-white dark:border-slate-800
        `}
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
