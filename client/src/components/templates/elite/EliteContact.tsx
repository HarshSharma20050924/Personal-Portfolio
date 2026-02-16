
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroData, SocialLink } from '../../../types';
import { ArrowRight, ArrowUpRight, Send, Check, Loader2 } from 'lucide-react';
import Magnet from '../../Magnet';

const M = motion as any;

const EliteContact: React.FC<{ data: HeroData; socialLinks: SocialLink[] }> = ({ data, socialLinks = [] }) => {
  const safeLinks = socialLinks || [];
  const safeData = data || { email: '', name: '' };
  
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('sending');
      try {
          const res = await fetch('/api/messages/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form)
          });
          if (res.ok) {
              setStatus('success');
              setForm({ name: '', email: '', message: '' });
              // Automatically reset after 5 seconds to allow sending another
              setTimeout(() => setStatus('idle'), 5000); 
          } else {
              setStatus('error');
          }
      } catch (err) {
          setStatus('error');
      }
  };

  return (
    <section id="contact" className="relative py-24 md:py-40 px-4 md:px-6 flex flex-col items-center justify-center bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-500">
      
      {/* BACKGROUND AMBIENCE (Blue/Indigo - Matching Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-600/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        
        {/* Header */}
        <div className="w-full flex justify-center mb-16 md:mb-24">
            <Magnet padding={200} magnetStrength={15}>
                <h2 className="text-[12vw] md:text-8xl font-black text-black dark:text-white tracking-tighter leading-none cursor-default select-none mix-blend-difference text-center">
                LET'S TALK
                </h2>
            </Magnet>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 mb-24 items-start">
            
            {/* Left: Contact Info */}
            <div className="flex flex-col gap-12 text-center md:text-left order-2 md:order-1">
                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Contact Details</h3>
                    {safeData.email && (
                        <a 
                        href={`mailto:${safeData.email}`}
                        className="text-xl md:text-2xl text-black dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors flex items-center gap-3 justify-center md:justify-start elite-interactive font-light"
                        >
                        {safeData.email}
                        <ArrowUpRight className="w-4 h-4 opacity-50 shrink-0" />
                        </a>
                    )}
                </div>
                
                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Social Connections</h3>
                    <div className="flex justify-center md:justify-start gap-x-8 gap-y-4 flex-wrap">
                        {safeLinks.map((link, idx) => (
                            <M.a 
                            key={link.name} 
                            href={link.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 transition-colors flex items-center gap-2 elite-interactive group"
                            >
                            {link.name} 
                            <ArrowRight size={10} className="-rotate-45 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </M.a>
                        ))}
                    </div>
                </div>

                <p className="text-gray-500 dark:text-gray-600 text-sm leading-relaxed max-w-sm mx-auto md:mx-0 pt-4 font-light">
                    Always interested in discussing new partnerships, engineering challenges, and creative ventures.
                </p>
            </div>

            {/* Right: Message Form */}
            <div className="w-full order-1 md:order-2 min-h-[450px] relative">
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <M.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute inset-0 bg-gray-50/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center p-8 rounded-3xl"
                        >
                            <M.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mb-6 shadow-xl"
                            >
                                <Check size={28} strokeWidth={3} />
                            </M.div>
                            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Message Sent</h3>
                            <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                                Thank you for reaching out. I have received your inquiry and will respond shortly.
                            </p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="text-xs font-bold font-mono uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:opacity-50 transition-opacity text-black dark:text-white"
                            >
                                Send Another
                            </button>
                        </M.div>
                    ) : (
                        <M.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-50/50 dark:bg-[#0a0a0a]/50 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-black/5 dark:border-white/5 w-full h-full flex flex-col justify-center"
                        >
                            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-10">
                                Send a Message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="Name" 
                                            required
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-3 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="email" 
                                            placeholder="Email Address" 
                                            required
                                            value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-3 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <textarea 
                                            placeholder="Your Message" 
                                            rows={4}
                                            required
                                            value={form.message}
                                            onChange={e => setForm({...form, message: e.target.value})}
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-white/10 py-3 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none font-medium"
                                        />
                                    </div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={status === 'sending'}
                                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    {status === 'sending' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                </button>
                                {status === 'error' && <p className="text-red-500 text-xs font-mono text-center mt-2">Error: Failed to send.</p>}
                            </form>
                        </M.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
      
      <footer className="mt-32 text-gray-400 dark:text-gray-800 text-[10px] uppercase tracking-[0.5em] font-mono text-center">
         © {new Date().getFullYear()} {safeData.name.toUpperCase()}
      </footer>
    </section>
  );
};

export default EliteContact;
