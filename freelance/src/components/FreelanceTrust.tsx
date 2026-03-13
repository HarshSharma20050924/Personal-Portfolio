
import React from 'react';
import { motion } from 'framer-motion';

const items = [
  "SCALABLE ARCHITECTURE",
  "99.9% RELIABILITY",
  "AUTONOMOUS OPERATIONS",
  "DATA-DRIVEN GROWTH",
  "MODULAR SYSTEMS",
  "HIGH PERFORMANCE",
  "SECURE INFRASTRUCTURE",
  "AI INTEGRATION"
];

export const FreelanceTrust = () => {
  return (
    <section className="py-8 bg-[#0D0D0D] border-y border-white/[0.05] overflow-hidden relative group">
      
      {/* Interactive Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-elite-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none" />

      <div className="flex whitespace-nowrap mask-gradient-x">
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </section>
  );
};

const MarqueeContent = () => (
  <motion.div 
    animate={{ x: "-100%" }}
    transition={{ 
        repeat: Infinity, 
        ease: "linear", 
        duration: 40 
    }}
    className="flex gap-16 items-center pr-16"
  >
    {items.map((item, i) => (
       <div key={i} className="flex items-center gap-4 group/item cursor-default">
          <div className="w-1.5 h-1.5 bg-elite-accent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover/item:scale-150 transition-transform duration-300" />
          <span className="text-sm font-mono tracking-[0.2em] text-white/50 group-hover/item:text-white transition-colors duration-300 uppercase">
            {item}
          </span>
       </div>
    ))}
  </motion.div>
);
