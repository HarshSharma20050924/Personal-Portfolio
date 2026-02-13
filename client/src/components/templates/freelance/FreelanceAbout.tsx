
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { AIGlobe } from './AIGlobe';

export const FreelanceAbout = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="about" 
      ref={ref} 
      className="py-40 bg-elite-bg relative overflow-hidden"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-24">
        
        <motion.div 
          className="w-full md:w-1/2 relative z-10 h-[500px] flex items-center justify-center"
          style={{ opacity }}
        >
           <AIGlobe />
        </motion.div>

        <motion.div 
          className="w-full md:w-1/2"
          style={{ y: textY, opacity }}
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
      </div>
    </section>
  );
};
