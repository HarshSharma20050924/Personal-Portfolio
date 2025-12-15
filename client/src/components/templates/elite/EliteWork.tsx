
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '../../../types';
import { ArrowUpRight } from 'lucide-react';

const EliteWork: React.FC<{ projects: Project[] }> = ({ projects = [] }) => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const safeProjects = projects || [];

  return (
    <section id="work" className="relative py-32 px-4 bg-[#050505] min-h-screen flex flex-col justify-center">
      
      {/* Background Image Preview */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20">
        <AnimatePresence mode="wait">
            {hoveredProject !== null && (
                <motion.img 
                    key={hoveredProject}
                    src={safeProjects[hoveredProject].imageUrl}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover blur-sm"
                />
            )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60" /> 
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
         <div className="mb-12 flex items-end justify-between border-b border-white/20 pb-4">
             <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Selected Works</h3>
             <span className="text-xs text-gray-600 font-mono">Index 01 — {String(safeProjects.length).padStart(2, '0')}</span>
         </div>
      
         <div className="flex flex-col">
            {safeProjects.length > 0 ? (
                safeProjects.map((project, index) => (
                    <Link 
                        to={`/project/${project.id || index}`}
                        key={index}
                        onMouseEnter={() => setHoveredProject(index)}
                        onMouseLeave={() => setHoveredProject(null)}
                        className="group flex items-center justify-between py-10 border-b border-white/10 hover:border-white/40 transition-colors cursor-pointer elite-interactive"
                    >
                        <div className="flex items-baseline gap-6 md:gap-12">
                            <span className="text-xs font-mono text-gray-600 group-hover:text-blue-500 transition-colors">
                                0{index + 1}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-gray-400 group-hover:text-white group-hover:translate-x-4 transition-all duration-300">
                                {project.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <span className="text-xs font-mono text-gray-500 hidden md:block">
                                {project.tags[0] || 'Development'}
                            </span>
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-gray-500 font-mono text-center py-20">No projects to display.</div>
            )}
         </div>
      </div>
    </section>
  );
};

export default EliteWork;
