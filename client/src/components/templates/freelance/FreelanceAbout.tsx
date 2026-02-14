
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { AIGlobe } from './AIGlobe';

export const FreelanceAbout = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Fade In/Out Logic
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [100, 0, 0, -100]);

  // Magnetic Attraction Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const globeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const globeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);
  const textX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const textY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      id="about" 
      ref={ref} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-40 bg-elite-bg relative overflow-hidden"
    >
      <motion.div 
        className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-24"
        style={{ opacity, y }}
      >
        {/* Magnetic Globe Container */}
        <motion.div 
          className="w-full md:w-1/2 relative z-10 h-[500px] flex items-center justify-center"
          style={{ x: globeX, y: globeY }}
        >
           <AIGlobe />
        </motion.div>

        {/* Magnetic Text Container */}
        <motion.div 
          className="w-full md:w-1/2"
          style={{ x: textX, y: textY }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-10 leading-[1.2]">
            Building Leverage. <br/>
            <span className="text-elite-sub">Not just code.</span>
          </h2>
          
          <div className="space-y-10 text-elite-sub text-lg leading-relaxed font-light">
            <p>
              Inefficiency is the silent killer of modern business. My role goes beyond traditional development; I partner with stakeholders to identify bottlenecks and engineer digital solutions that reclaim time and capital.
            </p>
            <p>
              From automating lead intake to integrating sophisticated AI agents, my focus is purely on ROI. I build systems that work while you sleep.
            </p>
            <p className="text-white font-medium">
              I work with a limited roster of global clients to ensure every project receives the architectural precision it demands.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
