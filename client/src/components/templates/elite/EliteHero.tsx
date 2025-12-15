
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroData } from '../../../types';

const EliteHero: React.FC<{ data: HeroData }> = ({ data }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  if (!data) return null;

  const fullName = data.name || "ARCHITECT";
  // Split name into First and Last for stacked layout
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  const description = data.description || "";
  const title = data.title || "";

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden pt-20">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl w-full flex flex-col items-center"
      >
        <motion.div 
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center leading-none"
        >
            {/* First Name - Outlined/Stroked style look or huge bold */}
            <motion.h1
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="text-[12vw] md:text-[13vw] font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 select-none"
            >
                {firstName.toUpperCase()}
            </motion.h1>
            
            {/* Last Name - if exists, styled slightly differently or solid to contrast */}
            {lastName && (
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[12vw] md:text-[13vw] font-heading font-black tracking-tighter text-white/10 select-none relative -mt-[2vw] md:-mt-[3vw]"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
                >
                    {lastName.toUpperCase()}
                </motion.h1>
            )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex justify-between items-end mt-16 w-full max-w-4xl border-t border-white/10 pt-6"
        >
          <div className="max-w-md">
            <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide font-light">
              {description}
            </p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Current Role</p>
             <p className="text-white font-medium">{title}</p>
          </div>
        </motion.div>
      </motion.div>

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
