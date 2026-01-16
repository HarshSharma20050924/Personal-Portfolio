import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroData } from '../../../types';
import TechOrb from './3d/TechOrb';

const EliteHero: React.FC<{ data: HeroData; isDark: boolean }> = ({ data, isDark }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  if (!data) return null;

  const fullName = data.name || "ARCHITECT";
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  return (
    <section id="hero" className="relative h-[100svh] w-full flex flex-col justify-center items-center px-4 overflow-hidden pt-24 md:pt-10 bg-white dark:bg-[#050505] transition-colors duration-500">
      
      {/* 3D Orb Background */}
      <TechOrb isDark={isDark} />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full flex flex-col items-center pointer-events-none"
      >
        <div className="flex flex-col items-center justify-center leading-[0.8] select-none text-center w-full mix-blend-difference">
            
            {/* First Name */}
            <motion.h1
               initial={{ y: 30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="text-[13vw] md:text-[13vw] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-500 dark:from-white dark:to-gray-500 select-none z-10"
            >
                {firstName.toUpperCase()}
            </motion.h1>
            
            {/* Last Name */}
            {lastName && (
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    className="text-[13vw] md:text-[13vw] font-heading font-black tracking-tighter text-black/5 dark:text-white/5 select-none relative mt-2 md:-mt-[3vw] z-0"
                    style={{ WebkitTextStroke: isDark ? '1px rgba(255,255,255,0.4)' : '1px rgba(0,0,0,0.4)' }}
                >
                    {lastName.toUpperCase()}
                </motion.h1>
            )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end mt-12 md:mt-20 w-full max-w-4xl border-t border-black/10 dark:border-white/10 pt-8 px-4"
        >
          <div className="max-w-md text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed tracking-wide font-light">
              {data.description}
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-center md:text-right">
             <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1">Status</p>
             <p className="text-black dark:text-white font-medium font-mono text-xs">{data.title.toUpperCase()}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 text-black dark:text-white">
         <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-current to-transparent" />
         <span className="text-[8px] uppercase tracking-[0.4em] font-mono">Scroll</span>
      </div>
    </section>
  );
};

export default EliteHero;