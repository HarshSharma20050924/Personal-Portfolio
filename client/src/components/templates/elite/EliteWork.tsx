import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Project } from '../../../types';
import { ArrowUpRight } from 'lucide-react';

const ProjectItem: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, opacity }}
      className="group relative w-full min-h-[80vh] flex items-center justify-center py-20"
    >
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem] opacity-40 group-hover:opacity-60 transition-opacity duration-700">
        <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
          />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <span className="inline-block text-xs font-mono text-gray-400 mb-4 border border-gray-800 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
              0{index + 1} / {project.tags?.[0] || 'Project'}
           </span>
           <h2 className="text-6xl md:text-8xl font-bold text-white mb-6 group-hover:translate-x-4 transition-transform duration-500">
             {project.title}
           </h2>
           <p className="text-gray-300 max-w-lg text-lg leading-relaxed backdrop-blur-md bg-black/20 p-4 rounded-xl border border-white/5">
             {project.description}
           </p>
        </div>

        <div className="flex gap-4">
           {project.liveUrl && (
             <a 
               href={project.liveUrl} 
               target="_blank" 
               rel="noreferrer"
               className="w-20 h-20 rounded-full border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 elite-interactive group/btn"
             >
               <ArrowUpRight className="w-8 h-8 group-hover/btn:rotate-45 transition-transform duration-300" />
             </a>
           )}
        </div>
      </div>
    </motion.div>
  );
};

const EliteWork: React.FC<{ projects: Project[] }> = ({ projects = [] }) => {
  const safeProjects = projects || [];
  
  return (
    <section id="work" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto mb-20">
         <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Selected Works</h3>
         <div className="h-[1px] w-full bg-white/10" />
      </div>
      
      <div className="flex flex-col gap-20">
        {safeProjects.length > 0 ? (
          safeProjects.map((project, i) => (
            <ProjectItem key={i} project={project} index={i} />
          ))
        ) : (
          <div className="text-gray-500 font-mono text-center">No projects to display.</div>
        )}
      </div>
    </section>
  );
};

export default EliteWork;