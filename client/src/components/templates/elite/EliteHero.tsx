
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroData, SocialLink } from '../../../types';
import TechOrb from './3d/TechOrb';
import Magnet from '../../Magnet';
import { getSocialIcon } from '../../../utils/socialIcons';
import { Download } from 'lucide-react';

const EliteHero: React.FC<{ data: HeroData; socialLinks: SocialLink[]; isDark: boolean }> = ({ data, socialLinks, isDark }) => {
  const { scrollY } = useScroll();
  // Extended the scroll range so elements stay visible longer
  const y = useTransform(scrollY, [0, 800], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  if (!data) return null;

  const fullName = data.name || "ARCHITECT";
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  return (
    <section id="hero" className="relative min-h-[100svh] w-full flex flex-col justify-center items-center px-4 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-500 pb-40 pt-40 md:pt-0">
      
      {/* 3D Orb Background */}
      <TechOrb isDark={isDark} />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full flex flex-col items-center pointer-events-none"
      >
        {/* Name Container */}
        <div className="flex flex-col items-center justify-center leading-[0.85] select-none text-center w-full mix-blend-difference mt-20 md:mt-32">
            
            {/* First Name */}
            <motion.h1
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="text-[15vw] md:text-[13vw] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 select-none z-10"
            >
                {firstName.toUpperCase()}
            </motion.h1>
            
            {/* Last Name */}
            {lastName && (
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    className="text-[15vw] md:text-[13vw] font-heading font-black tracking-tighter text-black/5 dark:text-white/5 select-none relative -mt-[2vw] md:-mt-[3vw] z-0"
                    style={{ WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.4)' : '1px rgba(0,0,0,0.4)' }}
                >
                    {lastName.toUpperCase()}
                </motion.h1>
            )}
        </div>

        {/* Description & Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end mt-12 w-full max-w-4xl border-t border-black/10 dark:border-white/10 pt-6 px-4 gap-6"
        >
          <div className="max-w-xs md:max-w-md text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-base leading-relaxed tracking-wide font-light">
              {data.description}
            </p>
          </div>
          <div className="text-center md:text-right">
             <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Status</p>
             <p className="text-black dark:text-white font-medium font-mono text-xs">{data.title.toUpperCase()}</p>
          </div>
        </motion.div>

        {/* Social Icons & CV */}
        <div className="flex flex-col items-center gap-8 mt-12 pointer-events-auto z-20">
            
            {/* Icons */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex gap-8 flex-wrap justify-center"
            >
                {socialLinks && socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.icon);
                    return (
                        <Magnet key={link.name} padding={20} magnetStrength={3}>
                            <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="group flex flex-col items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors elite-interactive"
                                title={link.name}
                            >
                                <div className="p-3 rounded-full border border-transparent group-hover:border-black/10 dark:group-hover:border-white/10 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-all duration-300">
                                    <Icon size={24} className="group-hover:text-blue-500 dark:group-hover:text-orange-500 transition-colors" />
                                </div>
                            </a>
                        </Magnet>
                    )
                })}
            </motion.div>

            {/* Resume Button */}
            {data.resumeUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <a 
                        href={data.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-gray-500 hover:text-black dark:hover:text-white transition-all elite-interactive py-2 px-6 border border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-full"
                    >
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">[</span>
                        <span className="flex items-center gap-2">
                            DOWNLOAD_CV <Download size={12} />
                        </span>
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">]</span>
                    </a>
                </motion.div>
            )}
        </div>

      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 text-black dark:text-white pointer-events-none">
         <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-current to-transparent" />
         <span className="text-[8px] uppercase tracking-[0.4em] font-mono">Scroll</span>
      </div>
    </section>
  );
};

export default EliteHero;
