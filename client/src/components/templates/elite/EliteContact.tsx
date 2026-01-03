
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
    <section id="contact" className="py-32 md:py-40 px-6 flex flex-col items-center justify-center bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 overflow-hidden transition-colors duration-500">
      <div className="max-w-4xl w-full text-center relative z-10">
        
        {/* Centered Magnet Container */}
        <div className="w-full flex justify-center mb-12">
            <Magnet padding={200} magnetStrength={25}>
                <h2 className="text-[16vw] md:text-9xl font-black text-black dark:text-white tracking-tighter leading-none cursor-default select-none mix-blend-difference">
                LET'S TALK
                </h2>
            </Magnet>
        </div>
        
        <div className="flex flex-col items-center gap-6 mb-20">
           {safeData.email && (
             <div className="relative group">
                 <a 
                   href={`mailto:${safeData.email}`}
                   className="text-lg md:text-4xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-4 elite-interactive group font-light"
                 >
                   <Mail className="w-5 h-5 md:w-8 md:h-8" />
                   {safeData.email}
                   <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 opacity-0 group-hover:opacity-100 transform translate-y-1 md:translate-y-2 group-hover:translate-y-0 transition-all" />
                 </a>
             </div>
           )}
           <p className="text-gray-500 dark:text-gray-600 text-sm md:text-base max-w-md mt-4 text-center leading-relaxed">
             Available for new partnerships. Building performant digital products for visionaries.
           </p>
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
