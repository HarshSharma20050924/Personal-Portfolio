
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { SplitText } from '../../SplitText';
import { useNavigate } from 'react-router-dom';
import { HeroData, SocialLink } from '../../../types';
import { getSocialIcon } from '../../../utils/socialIcons';

export const FreelanceHero = ({ data, socialLinks }: { data: HeroData, socialLinks?: SocialLink[] }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Mouse Parallax
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

  // Scroll Animations
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Adjusted opacity to fade out later [0.3 start -> 0.8 end]
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8], [1, 1, 0]); 
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const textX = useTransform(springX, [-0.5, 0.5], ["-15px", "15px"]);
  const textY = useTransform(springY, [-0.5, 0.5], ["-15px", "15px"]);
  const imgMouseX = useTransform(springX, [-0.5, 0.5], ["20px", "-20px"]);

  // Filter visible links
  const visibleLinks = socialLinks?.filter(s => s.showInFreelance) || [];

  return (
    <section 
      ref={ref} 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-elite-bg pt-24 pb-12 md:pt-20 md:pb-0"
    >
      <motion.div 
        style={{ y: bgY, opacity }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-elite-accent/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-purple-900/5 rounded-full blur-[120px] animate-pulse-slow" />
      </motion.div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        
        <motion.div 
          style={{ x: textX, y: textY, opacity }} 
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-20 order-2 lg:order-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 md:mb-8 flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-sm"
          >
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-xs font-mono text-elite-sub tracking-widest uppercase">Available for Select Projects</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white leading-[1.1] mb-6 md:mb-8 tracking-tight whitespace-nowrap">
            <SplitText className="inline-block" delay={0.2} wordDelay={0.03}>
              Grow your business
            </SplitText>
            
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-neutral-400">
               <SplitText delay={0.6} wordDelay={0.03}>
                 with {data.name.split(' ')[0]}
               </SplitText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-lg text-elite-sub leading-relaxed mb-8 md:mb-10 font-light tracking-wide"
          >
            Engineering digital ecosystems that operate with <span className="text-white font-medium">precision</span> and <span className="text-white font-medium">autonomy</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact')}
                className="clickable px-10 py-4 bg-white text-black text-sm font-semibold tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                Start Transformation
                </motion.button>

                {/* Hero Social Links */}
                <div className="flex gap-4">
                    {visibleLinks.map((link) => {
                        const Icon = getSocialIcon(link.icon);
                        return (
                            <a 
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="clickable p-3 rounded-full border border-white/10 text-elite-sub hover:text-white hover:border-elite-accent hover:bg-elite-accent/10 transition-all duration-300"
                                title={link.name}
                            >
                                <Icon size={18} />
                            </a>
                        );
                    })}
                </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-5 relative flex justify-center lg:justify-end h-[40vh] md:h-[50vh] lg:min-h-screen items-center lg:items-end lg:-mt-64 order-1 lg:order-2">
            <motion.div 
               initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
               style={{ 
                 y,
                 opacity, 
                 scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]), 
                 x: imgMouseX,
                 rotateY: useTransform(springX, [-0.5, 0.5], [-5, 5]) 
               }}
               className="relative w-full max-w-[280px] md:max-w-md lg:max-w-full origin-bottom"
            >
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-elite-accent/10 blur-[100px] rounded-full mix-blend-screen opacity-50" />
               <img 
                 src={data.profileImageUrl} 
                 alt={data.name} 
                 className="relative z-10 w-full h-auto object-contain mask-gradient-b drop-shadow-2xl will-change-transform grayscale hover:grayscale-0 transition-all duration-700"
                 style={{ 
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                 }}
               />
            </motion.div>
        </div>
      </div>
    </section>
  );
};
