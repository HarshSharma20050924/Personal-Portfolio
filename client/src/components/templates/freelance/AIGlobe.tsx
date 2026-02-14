
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Bot, ArrowRight, CornerDownLeft, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Typed Message Interface ---
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
        <div className="prose prose-sm prose-invert max-w-none text-xs md:text-sm font-light leading-relaxed prose-p:my-1 prose-headings:my-2 prose-strong:text-blue-400 prose-a:text-blue-400 hover:prose-a:text-blue-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
            {!hasCompleted.current && <span className="inline-block w-1.5 h-3 bg-blue-500 ml-1 animate-pulse align-middle" />}
        </div>
    );
};

export const AIGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false); // Mobile tap state
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<GlobeMessage[]>([
    { 
        id: 'init-1',
        sender: 'bot', 
        text: "System initialized. I am the digital representative. I can provide details on services, availability, and technical architecture.", 
        isTyping: false
    }
  ]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Scroll Logic ---
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
    if (isChatOpen) {
        setTimeout(scrollToBottom, 100);
        // Prevent body scroll on mobile when chat is open
        if (isMobile) document.body.style.overflow = 'hidden';
    } else {
        if (isMobile) document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [chatHistory, isChatOpen, isBotThinking, isMobile]);

  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    const newMsgId = Date.now().toString();

    setChatHistory(prev => [
        ...prev, 
        { id: newMsgId, sender: 'user', text: userMsg, isTyping: false }
    ]);
    setChatMessage('');
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

  const handleTypingComplete = (id: string) => {
      setChatHistory(prev => prev.map(msg => msg.id === id ? { ...msg, isTyping: false } : msg));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleGlobeClick = () => {
      if (isMobile && !isActive) {
          // First tap activates, second tap opens
          setIsActive(true);
          setTimeout(() => setIsChatOpen(true), 300); // Small delay to show activation
      } else {
          setIsChatOpen(true);
      }
  };

  // --- Physics Refs ---
  const particlesRef = useRef<{ x: number, y: number, z: number, r: number }[]>([]);
  const rotationRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });
  
  // --- Interactive Globe Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        if(canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    if (particlesRef.current.length === 0) {
        // Reduced particle count for mobile to prevent lag
        const particleCount = window.innerWidth < 768 ? 40 : 90;
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 100;
            particlesRef.current.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi),
                r: Math.random() * 1.5 + 0.5,
            });
        }
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseRef.current.x = (e.clientX - centerX) * 0.0001; 
        mouseRef.current.y = (e.clientY - centerY) * 0.0001;
    };
    
    window.addEventListener('mousemove', handleGlobalMouseMove);

    let animId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const baseRotation = 0.002; 
      const targetRotY = baseRotation + (mouseRef.current.x * 5);
      const targetRotX = mouseRef.current.y * 5;

      rotationRef.current.y += (targetRotY - rotationRef.current.y) * 0.05;
      rotationRef.current.x += (targetRotX - rotationRef.current.x) * 0.05;
      
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      // Update positions
      particlesRef.current.forEach(p => {
        const x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        const z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
        const y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

        p.x = x1; p.y = y1; p.z = z2;

        const scale = 250 / (250 + p.z);
        const alpha = Math.max(0.1, (p.z + 100) / 200);
        
        ctx.beginPath();
        const screenX = p.x * scale + cx;
        const screenY = p.y * scale + cy;
        
        ctx.arc(screenX, screenY, p.r * scale, 0, Math.PI * 2);
        
        // Force blue color if active (tapped) or open
        if (isChatOpen || isHovered || isActive) {
            ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`; 
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connections - Only draw if active to save FPS
      if (isChatOpen || isHovered || isActive) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          // Optimized connection drawing: step by 2 or 3 to reduce n^2 checks
          const step = window.innerWidth < 768 ? 3 : 2; 
          for(let i=0; i<particlesRef.current.length; i+=step) { 
              for(let j=i+1; j<particlesRef.current.length; j+=step) {
                  const p1 = particlesRef.current[i];
                  const p2 = particlesRef.current[j];
                  const dx = p1.x - p2.x;
                  const dy = p1.y - p2.y;
                  const dz = p1.z - p2.z;
                  const distSq = dx*dx + dy*dy + dz*dz;
                  
                  if (distSq < 1200) {
                      const scale1 = 250 / (250 + p1.z);
                      const scale2 = 250 / (250 + p2.z);
                      ctx.moveTo(p1.x * scale1 + cx, p1.y * scale1 + cy);
                      ctx.lineTo(p2.x * scale2 + cx, p2.y * scale2 + cy);
                  }
              }
          }
          ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    
    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('resize', resizeCanvas);
    };
  }, [isChatOpen, isHovered, isActive]);

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
        <canvas ref={canvasRef} className="w-full h-full" />
        
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

      {/* Twin Interface Chat - Bottom Sheet on Mobile */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsChatOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 touch-none"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`
                fixed md:absolute z-50 
                bottom-0 left-0 right-0 h-[85dvh] rounded-t-3xl border-t border-white/10 bg-[#050505]
                md:bottom-auto md:left-[110%] md:right-auto md:h-[550px] md:w-[420px] md:rounded-[1.5rem] md:bg-[#050505]/95 md:backdrop-blur-xl md:border
                shadow-2xl flex flex-col overflow-hidden
              `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
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
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }} 
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white clickable"
                        aria-label="Close Chat"
                    >
                        <X size={18} />
                    </button>
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
                                        onComplete={() => handleTypingComplete(msg.id)}
                                    />
                                ) : msg.sender === 'bot' ? (
                                    <div className="prose prose-sm prose-invert max-w-none text-xs md:text-sm font-light leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
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
                <div className="p-4 bg-black/80 md:bg-black/40 border-t border-white/10 shrink-0 pb-8 md:pb-4">
                    <div className="relative flex items-center group">
                        <input 
                            type="text" 
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Inquire about services..."
                            className="w-full bg-[#151515] border border-white/10 rounded-xl pl-5 pr-12 py-4 text-base md:text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner font-light"
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
