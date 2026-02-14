
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GlobeRenderer } from './GlobeRenderer';
import { GlobeChatInterface } from './GlobeChatInterface';

interface GlobeMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    isTyping?: boolean;
}

export const AIGlobe = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize Chat History with Persistence
  const [chatHistory, setChatHistory] = useState<GlobeMessage[]>(() => {
      try {
          const saved = localStorage.getItem('freelance_chat_history');
          if (saved) {
              const parsed = JSON.parse(saved);
              // CRITICAL FIX: Ensure animation flags are reset for loaded history
              return parsed.map((msg: GlobeMessage) => ({
                  ...msg,
                  isTyping: false
              }));
          }
      } catch (e) { console.error("History load error", e); }
      
      return [{ 
        id: 'init-1',
        sender: 'bot', 
        text: "System initialized. I am the digital representative. I can provide details on services, availability, and technical architecture.", 
        isTyping: false
      }];
  });

  // Save on update
  useEffect(() => {
      localStorage.setItem('freelance_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scroll when chat is open on mobile
  useEffect(() => {
    if (isChatOpen && isMobile) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isChatOpen, isMobile]);

  const handleSend = async (userMsg: string) => {
    const newMsgId = Date.now().toString();

    setChatHistory(prev => [
        ...prev, 
        { id: newMsgId, sender: 'user', text: userMsg, isTyping: false }
    ]);
    setIsBotThinking(true);

    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMsg,
            template: 'freelance', 
            history: chatHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        })
      });
      
      const data = await res.json();
      const botResponse = data.reply || "Analysis complete. System ready.";
      
      setIsBotThinking(false);
      setChatHistory(prev => [
          ...prev, 
          { id: Date.now().toString(), sender: 'bot', text: botResponse, isTyping: true }
      ]);

    } catch (error) {
      setIsBotThinking(false);
      setChatHistory(prev => [
          ...prev, 
          { id: Date.now().toString(), sender: 'bot', text: "Uplink unstable. Please try again.", isTyping: true }
      ]);
    }
  };

  const handleClearHistory = () => {
      localStorage.removeItem('freelance_chat_history');
      setChatHistory([{ 
        id: Date.now().toString(),
        sender: 'bot', 
        text: "Memory flushed. System ready for new input.", 
        isTyping: false
      }]);
  };

  const handleGlobeClick = () => {
      if (isMobile && !isActive) {
          setIsActive(true);
          setTimeout(() => setIsChatOpen(true), 300);
      } else {
          setIsChatOpen(true);
      }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] cursor-none clickable z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleGlobeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <GlobeRenderer 
            isHovered={isHovered} 
            isActive={isActive} 
            isMobile={isMobile} 
            isChatOpen={isChatOpen} 
        />
        
        {/* Glow effect behind globe */}
        <div className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-700 pointer-events-none ${isHovered || isChatOpen || isActive ? 'bg-blue-500/20' : 'bg-white/5'}`} />
        
        <AnimatePresence>
            {!isChatOpen && (
                <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 pointer-events-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: (isHovered || isActive) ? 1 : 0, y: (isHovered || isActive) ? 0 : 10 }}
                exit={{ opacity: 0 }}
                >
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-[10px] font-medium tracking-widest text-white uppercase">Initialize Twin</span>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isChatOpen && (
            <GlobeChatInterface 
                onClose={() => setIsChatOpen(false)}
                onClear={handleClearHistory}
                onSend={handleSend}
                chatHistory={chatHistory}
                isBotThinking={isBotThinking}
                isMobile={isMobile}
            />
        )}
      </AnimatePresence>
    </div>
  );
};
