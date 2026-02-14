
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    title: "Discovery",
    desc: "Deep dive into operational bottlenecks and revenue goals."
  },
  {
    title: "Engineering",
    desc: "Architecting the solution using high-fidelity code and automation tools."
  },
  {
    title: "Deployment",
    desc: "Seamless integration into your existing infrastructure."
  },
  {
    title: "Growth",
    desc: "Continuous optimization and scaling based on data feedback."
  }
];

export const FreelanceProcess = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-40 bg-elite-bg relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-4">The Methodology</h2>
          <p className="text-elite-sub">From chaos to clarity.</p>
        </div>

        <div ref={ref} className="relative max-w-3xl mx-auto">
          {/* Static Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
          
          {/* Dynamic Progress Line */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-elite-accent -translate-x-1/2" 
          />
          
          <div className="space-y-32">
            {steps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessStep = ({ step, index }: { step: any, index: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  // Fade In and Fade Out
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.8, 1], [0, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const color = useTransform(scrollYProgress, [0.4, 0.6], ["#333", "#3B82F6"]); 

  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale }}
      className={`flex flex-col md:flex-row gap-8 md:gap-20 items-start md:items-center relative ${index % 2 !== 0 ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}
    >
      <motion.div 
        style={{ backgroundColor: color, borderColor: color }}
        className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10" 
      />

      <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${index % 2 !== 0 ? '' : 'md:pr-10'} ${index % 2 !== 0 ? 'md:pl-10' : ''}`}>
        <h3 className="text-2xl font-display font-medium text-white mb-2">{step.title}</h3>
        <p className="text-elite-sub leading-relaxed">{step.desc}</p>
      </div>
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
}
