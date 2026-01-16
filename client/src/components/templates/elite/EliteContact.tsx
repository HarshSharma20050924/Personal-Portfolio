
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroData, SocialLink } from '../../../types';
import { ArrowRight, Mail, ArrowUpRight, Send, Check } from 'lucide-react';
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
              setTimeout(() => setStatus('idle'), 3000);
          } else {
              setStatus('error');
          }
      } catch (err) {
          setStatus('error');
      }
  };

  return (
    <section id="contact" className="py-32 md:py-40 px-6 flex flex-col items-center justify-center bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-500">
      <div className="max-w-4xl w-full relative z-10">
        
        {/* Header */}
        <div className="w-full flex justify-center mb-12">
            <Magnet padding={200} magnetStrength={25}>
                <h2 className="text-[14vw] md:text-9xl font-black text-black dark:text-white tracking-tighter leading-none cursor-default select-none mix-blend-difference text-center">
                LET'S TALK
                </h2>
            </Magnet>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 mb-20 items-start">
            
            {/* Left: Contact Info */}
            <div className="flex flex-col gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Direct Channel</h3>
                    {safeData.email && (
                        <a 
                        href={`mailto:${safeData.email}`}
                        className="text-2xl md:text-3xl text-black dark:text-white hover:opacity-70 transition-opacity flex items-center gap-2 justify-center md:justify-start elite-interactive font-light"
                        >
                        {safeData.email}
                        <ArrowUpRight className="w-5 h-5 opacity-50" />
                        </a>
                    )}
                </div>
                <p className="text-gray-500 dark:text-gray-600 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                    Available for new partnerships. Building performant digital products for visionaries.
                </p>
            </div>

            {/* Right: Message Form */}
            <div className="bg-gray-50 dark:bg-[#0a0a0a] p-8 rounded-2xl border border-black/5 dark:border-white/5">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Send Transmission</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="NAME" 
                            required
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <input 
                            type="email" 
                            placeholder="EMAIL" 
                            required
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                    </div>
                    <textarea 
                        placeholder="MESSAGE_CONTENT..." 
                        rows={3}
                        required
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 text-sm text-black dark:text-white placeholder-gray-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={status === 'sending' || status === 'success'}
                        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-widest rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                    >
                        {status === 'sending' ? 'TRANSMITTING...' : status === 'success' ? 'SENT SUCCESSFULLY' : 'SEND MESSAGE'}
                        {status === 'success' ? <Check size={14} /> : <Send size={14} />}
                    </button>
                    {status === 'error' && <p className="text-red-500 text-xs text-center">Transmission Failed. Try again.</p>}
                </form>
            </div>
        </div>

        <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
          {safeLinks.map((link, idx) => (
            <M.a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 elite-interactive py-2 border-b border-transparent hover:border-black/20 dark:hover:border-white/20"
            >
              {link.name} <ArrowRight size={12} className="-rotate-45" />
            </M.a>
          ))}
        </div>
      </div>
      
      <footer className="mt-32 text-gray-400 dark:text-gray-800 text-[10px] uppercase tracking-[0.5em] font-mono">
         © {new Date().getFullYear()} {safeData.name.toUpperCase()}
      </footer>
    </section>
  );
};

export default EliteContact;
