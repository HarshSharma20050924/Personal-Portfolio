
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { HeroData, SocialLink } from '../../../types';
import Magnet from '../../Magnet';
import { getSocialIcon } from '../../../utils/socialIcons';
import { Download, ArrowDown } from 'lucide-react';

const EliteHero: React.FC<{ data: HeroData; socialLinks: SocialLink[]; isDark: boolean }> = ({ data, socialLinks, isDark }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 400 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  if (!data) return null;

  const [firstName, ...rest] = data.name.split(' ');
  const lastName = rest.join(' ');

  // Parallax values
  const textX = useTransform(springX, [-0.5, 0.5], ["-20px", "20px"]);
  const textY = useTransform(springY, [-0.5, 0.5], ["-20px", "20px"]);
  const imgX = useTransform(springX, [-0.5, 0.5], ["20px", "-20px"]);
  const imgY = useTransform(springY, [-0.5, 0.5], ["20px", "-20px"]);

  return (
    <section 
      id="hero" 
      className="relative min-h-[100svh] w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-12 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-500 pt-32 md:pt-0"
      onMouseMove={handleMouseMove}
    >
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Column: Typography */}
      <motion.div 
        style={{ y, opacity, x: textX }}
        className="flex-1 z-10 flex flex-col justify-center items-start h-full md:pr-10"
      >
        <div className="overflow-hidden mb-2">
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400"
            >
                {data.title}
            </motion.p>
        </div>

        <div className="relative mb-8">
            <motion.h1
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black dark:text-white leading-[0.9] mix-blend-difference"
            >
                {firstName.toUpperCase()}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-800 dark:from-gray-600 dark:to-gray-200">
                    {lastName.toUpperCase()}
                </span>
            </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md leading-relaxed font-light mb-8"
        >
          {data.description}
        </motion.p>

        <div className="flex flex-wrap gap-4 items-center">
            {socialLinks.map((link, idx) => {
                const Icon = getSocialIcon(link.icon);
                return (
                    <Magnet key={link.name} padding={20} magnetStrength={3}>
                        <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            <Icon size={16} />
                        </a>
                    </Magnet>
                );
            })}
            
            {data.resumeUrl && (
                <Magnet padding={50} magnetStrength={5}>
                    <a 
                        href={data.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                        CV <Download size={14} />
                    </a>
                </Magnet>
            )}
        </div>
      </motion.div>

      {/* Right Column: Image */}
      <div className="flex-1 relative h-[50vh] md:h-screen w-full flex items-center justify-center md:justify-end mt-12 md:mt-0">
         <motion.div 
            style={{ x: imgX, y: imgY, rotateY: textX }} 
            className="relative w-full max-w-lg aspect-[3/4] md:h-[80vh] overflow-hidden"
         >
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-900 z-0" />
            <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={data.profileImageUrl}
                alt="Portrait"
                className="relative z-10 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 contrast-125"
            />
            {/* Overlay Lines */}
            <div className="absolute inset-0 border-[1px] border-white/20 z-20 m-4 pointer-events-none" />
            <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end">
                <span className="text-[10px] text-white font-mono uppercase tracking-widest bg-black/50 px-2 py-1 backdrop-blur-md">
                    System.Arch
                </span>
            </div>
         </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference text-white md:left-12 md:translate-x-0"
      >
         <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
         <ArrowDown size={14} className="animate-bounce" />
      </motion.div>
    </section>
  );
};

export default EliteHero;
