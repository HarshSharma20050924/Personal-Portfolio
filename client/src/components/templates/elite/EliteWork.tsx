
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '../../../types';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';

const M = motion as any;

const EliteWork: React.FC<{ projects: Project[] }> = ({ projects = [] }) => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  const featuredProjects = projects.filter(p => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  return (
    <section 
        id="work" 
        className="relative py-20 md:py-32 px-4 bg-[#050505] min-h-screen z-20 overflow-hidden" 
    >
      {/* Background Reveal Layer */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
         <AnimatePresence>
            {hoveredProject !== null && (
                <M.div
                    key={hoveredProject}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img 
                        src={displayProjects[hoveredProject].imageUrl} 
                        alt="Background" 
                        className="w-full h-full object-cover filter blur-sm grayscale-[50%]"
                    />
                    <div className="absolute inset-0 bg-[#050505]/60" />
                </M.div>
            )}
         </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
         <div className="mb-12 md:mb-20 flex items-end justify-between border-b border-white/10 pb-6">
             <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">SELECTED WORKS</h2>
             <span className="text-xs text-gray-600 font-mono hidden md:block">
                 (01) — ({String(displayProjects.length).padStart(2, '0')})
             </span>
         </div>
      
         <div className="flex flex-col">
            {displayProjects.map((project, index) => (
                <Link 
                    to={`/project/${project.id || index}`}
                    key={index}
                    onMouseEnter={() => setHoveredProject(index)}
                    onMouseLeave={() => setHoveredProject(null)}
                    className="group relative flex flex-col md:flex-row items-baseline justify-between py-8 md:py-12 border-b border-white/5 hover:border-white/20 transition-all duration-500 elite-interactive"
                >
                    <div className="flex items-center gap-4 md:gap-8 z-10">
                        <span className="text-xs font-mono text-gray-600 group-hover:text-white transition-colors duration-300">
                            0{index + 1}
                        </span>
                        <h3 className="text-2xl md:text-5xl font-bold text-gray-400 group-hover:text-white group-hover:pl-4 transition-all duration-300">
                            {project.title}
                        </h3>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center gap-4 z-10 opacity-50 group-hover:opacity-100 transition-opacity pl-8 md:pl-0">
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                            {project.tags[0] || 'Development'}
                        </span>
                        <ArrowUpRight size={20} className="text-white transform group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                </Link>
            ))}
         </div>

         <div className="flex justify-center mt-20">
            <Link 
                to="/gallery" 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 rounded-full overflow-hidden elite-interactive hover:bg-white/10 transition-colors"
            >
                <LayoutGrid size={18} className="text-white relative z-10" />
                <span className="text-sm font-bold uppercase tracking-widest text-white relative z-10">View Archive</span>
            </Link>
         </div>
      </div>
    </section>
  );
};

export default EliteWork;
