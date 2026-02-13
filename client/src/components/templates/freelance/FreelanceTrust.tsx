
import React from 'react';
import { motion } from 'framer-motion';

const items = [
  { label: "ARCHITECTURE", value: "SCALABLE" },
  { label: "RELIABILITY", value: "99.9%" },
  { label: "OPERATIONS", value: "AUTONOMOUS" },
  { label: "GROWTH", value: "DATA-DRIVEN" },
];

export const FreelanceTrust = () => {
  return (
    <section className="py-10 border-y border-white/[0.08] bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
         <div className="flex flex-wrap justify-between items-center gap-8">
            {items.map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="flex items-center gap-3"
               >
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <div className="flex flex-col">
                     <span className="text-[10px] text-elite-sub font-mono tracking-widest uppercase">{item.label}</span>
                     <span className="text-sm text-white font-medium tracking-wide">{item.value}</span>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
};
