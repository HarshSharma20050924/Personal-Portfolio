
import React from 'react';
import { motion } from 'framer-motion';
import { HeroData, SocialLink } from '../../../types';
import { ArrowRight, Mail, ArrowUpRight } from 'lucide-react';
import Magnet from '../../Magnet';

const M = motion as any;

const EliteContact: React.FC<{ data: HeroData; socialLinks: SocialLink[] }> = ({ data, socialLinks = [] }) => {
  const safeLinks = socialLinks || [];
  const safeData = data || { email: '', name: '' };

  return (
    <section id="contact" className="py-40 px-6 flex flex-col items-center justify-center bg-[#050505] border-t border-white/5 overflow-hidden">
      <div className="max-w-4xl w-full text-center relative z-10">
        
        {/* Centered Container for Magnet */}
        <div className="w-full flex justify-center mb-10">
            <Magnet padding={200} magnetStrength={30}>
                <h2 className="text-[10vw] md:text-9xl font-black text-white tracking-tighter leading-none cursor-default select-none mix-blend-difference">
                LET'S TALK
                </h2>
            </Magnet>
        </div>
        
        <div className="flex flex-col items-center gap-8 mb-20">
           {safeData.email && (
             <div className="relative group">
                 <a 
                   href={`mailto:${safeData.email}`}
                   className="text-2xl md:text-4xl text-gray-400 hover:text-white transition-colors flex items-center gap-4 elite-interactive group"
                 >
                   <Mail className="w-6 h-6 md:w-8 md:h-8" />
                   {safeData.email}
                   <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all" />
                 </a>
             </div>
           )}
           <p className="text-gray-600 max-w-md mt-4 text-center">
             Open for select opportunities. I specialize in building high-performance digital experiences for forward-thinking brands.
           </p>
        </div>

        <div className="flex justify-center gap-4 md:gap-12 flex-wrap">
          {safeLinks.map((link, idx) => (
            <M.a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-sm font-mono text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 elite-interactive py-2 border-b border-transparent hover:border-blue-500"
            >
              {link.name} <ArrowRight size={14} className="-rotate-45" />
            </M.a>
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <footer className="mt-32 text-gray-800 text-xs uppercase tracking-widest">
         © {new Date().getFullYear()} {safeData.name}. All Rights Reserved.
      </footer>
    </section>
  );
};

export default EliteContact;
