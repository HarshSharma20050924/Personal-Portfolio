
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'bot', text: string}[]>([
    { sender: 'bot', text: "Hello. I am the digital twin. Accessing freelance knowledge base. How can I assist your architecture today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // --- Chat Functionality ---
  const handleSend = async () => {
    if (!chatMessage.trim()) return;

    // 1. Add User Message
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');
    setIsTyping(true);

    try {
      // 2. Call RAG API with 'freelance' template context
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userMsg,
            template: 'freelance', // Important: Context switch
            history: chatHistory.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
        })
      });
      
      const data = await res.json();
      
      // 3. Add Bot Response
      const botResponse = data.reply || "I am processing that data.";
      setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { sender: 'bot', text: "Connection to neural core unstable. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- Globe Animation Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let particles: { x: number, y: number, z: number, r: number }[] = [];
    const particleCount = 150; 
    let rotation = 0;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 100;
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        r: Math.random() * 2 + 1
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      rotation += 0.005;

      // Draw connections first (background)
      ctx.strokeStyle = isHovered ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      particles.forEach((p, i) => {
        const x1 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const z1 = p.z * Math.cos(rotation) + p.x * Math.sin(rotation);
        const scale1 = 200 / (200 + z1);
        const x2D = x1 * scale1 + cx;
        const y2D = p.y * scale1 + cy;

        // Optimization: check fewer connections or simplify distance check
        for(let j = i+1; j < particleCount; j++){
             const p2 = particles[j];
             const dx = p.x - p2.x;
             const dy = p.y - p2.y;
             const dz = p.z - p2.z;
             // Simple rough distance check before sqrt
             if (dx*dx + dy*dy + dz*dz < 1600) { 
                 const x1_p2 = p2.x * Math.cos(rotation) - p2.z * Math.sin(rotation);
                 const z1_p2 = p2.z * Math.cos(rotation) + p2.x * Math.sin(rotation);
                 const scale2 = 200 / (200 + z1_p2);
                 ctx.moveTo(x2D, y2D);
                 ctx.lineTo(x1_p2 * scale2 + cx, p2.y * scale2 + cy);
             }
        }
      });
      ctx.stroke();

      // Draw Particles
      ctx.fillStyle = isHovered ? '#3B82F6' : '#FFFFFF';
      particles.forEach(p => {
        const x1 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const z1 = p.z * Math.cos(rotation) + p.x * Math.sin(rotation);
        const scale = 200 / (200 + z1);
        const alpha = Math.max(0, (z1 + 100) / 200);
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x1 * scale + cx, p.y * scale + cy, p.r * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-80 h-80 cursor-none clickable"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsChatOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className={`absolute inset-0 rounded-full blur-[60px] transition-colors duration-500 pointer-events-none ${isHovered ? 'bg-elite-accent/20' : 'bg-white/5'}`} />
        <motion.div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-xs text-white border border-white/10 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        >
          Click to Initialize Twin
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute z-50 bottom-0 right-0 md:-right-20 w-80 md:w-96 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-elite-accent rounded-full animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider">Harsh AI Twin (Freelance)</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }} className="hover:text-elite-accent text-white">
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/50 scrollbar-thin scrollbar-thumb-white/10">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-elite-accent text-white rounded-tr-sm' 
                      : 'bg-white/10 text-neutral-200 rounded-tl-sm'
                  }`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                       <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                       <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                       <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                 </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-neutral-900 border-t border-white/5 relative">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about expertise..."
                className="w-full bg-black border border-white/10 rounded-full px-4 py-3 text-sm focus:border-elite-accent focus:outline-none pr-10 text-white placeholder:text-neutral-600"
              />
              <button onClick={handleSend} className="absolute right-6 top-1/2 -translate-y-1/2 text-elite-accent hover:scale-110 transition-transform">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
