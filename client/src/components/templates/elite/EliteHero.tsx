import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroData } from '../../../types';
import TechOrb from './3d/TechOrb';

const EliteHero: React.FC<{ data: HeroData }> = ({ data }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  if (!data) return null;

  const fullName = data.name || "ARCHITECT";
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col justify-center items-center px-4 md:px-6 overflow-hidden pt-20">
      
      {/* 3D Background */}
      <TechOrb />

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full flex flex-col items-center"
      >
        <div className="flex flex-col items-center justify-center leading-[0.85] select-none text-center">
            
            {/* First Name - Gradient Fill */}
            <motion.h1
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="text-[12vw] md:text-[13vw] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 select-none z-10 mix-blend-difference"
            >
                {firstName.toUpperCase()}
            </motion.h1>
            
            {/* Last Name - Outline Style - INCREASED VISIBILITY */}
            {lastName && (
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                    // Changed margin-top: Positive spacing on mobile (mt-2), overlapping on desktop (-mt)
                    className="text-[12vw] md:text-[13vw] font-heading font-black tracking-tighter text-white/10 select-none relative mt-2 md:-mt-[3vw] z-0"
                    style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.6)' }}
                >
                    {lastName.toUpperCase()}
                </motion.h1>
            )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-end mt-16 w-full max-w-4xl border-t border-white/10 pt-6 px-4"
        >
          <div className="max-w-md">
            <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide font-light">
              {data.description}
            </p>
          </div>
          <div className="hidden md:block text-right mt-4 md:mt-0">
             <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Current Role</p>
             <p className="text-white font-medium font-mono text-sm">{data.title}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2, duration: 1 }}
         className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
         <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
         <span className="text-[10px] uppercase tracking-widest text-gray-600">Scroll</span>
      </motion.div>
    </section>
  );
};

export default EliteHero;