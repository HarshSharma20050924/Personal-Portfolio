import React from 'react';
import { HeroData, SocialLink } from '../../../types';
import { ArrowRight } from 'lucide-react';

const EliteContact: React.FC<{ data: HeroData; socialLinks: SocialLink[] }> = ({ data, socialLinks = [] }) => {
  const safeLinks = socialLinks || [];
  const safeData = data || { email: '', name: '' };

  return (
    <section id="contact" className="py-40 px-6 flex flex-col items-center justify-center bg-[#050505] border-t border-white/5">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-[10vw] md:text-8xl font-black text-white tracking-tighter mb-10 leading-none">
          LET'S TALK
        </h2>
        
        <div className="flex flex-col items-center gap-8 mb-20">
           {safeData.email && (
             <a 
               href={`mailto:${safeData.email}`}
               className="text-2xl md:text-4xl text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-2 elite-interactive"
             >
               {safeData.email}
             </a>
           )}
           <p className="text-gray-600 max-w-md">
             Open for select opportunities. I specialize in building high-performance digital experiences for forward-thinking brands.
           </p>
        </div>

        <div className="flex justify-center gap-12">
          {safeLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.url} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-mono text-gray-500 uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center gap-2 elite-interactive"
            >
              {link.name} <ArrowRight size={14} className="-rotate-45" />
            </a>
          ))}
        </div>
      </div>
      
      <footer className="mt-32 text-gray-800 text-xs uppercase tracking-widest">
         © {new Date().getFullYear()} {safeData.name}. All Rights Reserved.
      </footer>
    </section>
  );
};

export default EliteContact;