
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitText } from '../components/SplitText';
import { FreelanceNavigation } from '../components/templates/freelance/FreelanceNavigation';
import EliteCursor from '../components/templates/elite/EliteCursor';
import { Project } from '../types';

export const WorkPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // In a real app we'd fetch from API, here we simulate or use context if available
    // For now fetching the main data endpoint
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if(data && Array.isArray(data.projects)) {
            // Filter freelance
            setProjects(data.projects.filter((p: any) => p.showInFreelance));
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-elite-bg pt-32 pb-20 text-white cursor-none">
      <EliteCursor />
      <FreelanceNavigation />
      
      <div className="container mx-auto px-4">
        
        <div className="mb-20 border-b border-white/10 pb-8">
           <h1 className="text-6xl md:text-8xl font-display text-white mb-6">
             <SplitText delay={0.2}>Index</SplitText>
           </h1>
           <p className="text-elite-sub max-w-xl text-lg">
             A selected archive of engineered systems and digital infrastructure.
           </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-white/50 text-center py-20 font-mono">Initializing Archive...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
             {projects.map((project, index) => (
               <Link key={project.id || index} to={`/project/${project.id || index}`}>
                  <motion.div
                     initial={{ opacity: 0, y: 100 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-10%" }}
                     transition={{ delay: index * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                     className="group cursor-none clickable"
                  >
                     <div className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-6 relative">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <motion.img 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowUpRight className="text-white" size={20} />
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-start border-t border-white/10 pt-4">
                        <div>
                          <h2 className="text-2xl font-display text-white mb-1 group-hover:text-elite-accent transition-colors">{project.title}</h2>
                          <p className="text-elite-sub text-sm uppercase tracking-wide">{project.tags[0]}</p>
                        </div>
                        <span className="text-xs font-mono text-elite-accent pt-2">0{index + 1}</span>
                     </div>
                  </motion.div>
               </Link>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};
