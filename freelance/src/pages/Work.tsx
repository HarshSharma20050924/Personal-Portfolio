
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitText } from '../components/SplitText';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import FreelanceCursor from '../components/FreelanceCursor';
import { Project, Service } from '../types';
import { API_BASE } from '../config';

const WorkPage = ({ name }: { name?: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/data`)
      .then(res => res.json())
      .then(data => {
        if(data && Array.isArray(data.projects)) {
            setProjects(data.projects.filter((p: any) => p.showInFreelance));
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-elite-bg pt-32 pb-20 text-white cursor-none">
      <FreelanceCursor />
      <FreelanceNavigation name={name} />
      
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
             {projects.map((project, index) => {
                const targetUrl = project.liveUrl || project.repoUrl;
                const isClickable = !!targetUrl;
                
                const Content = (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: index * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className={`group ${isClickable ? 'cursor-none' : 'cursor-default'} clickable`}
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
                       {isClickable && (
                         <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="text-white" size={20} />
                         </div>
                       )}
                    </div>
                    
                    <div className="flex justify-between items-start border-t border-white/10 pt-4">
                       <div>
                         <h2 className="text-2xl font-display text-white mb-1 group-hover:text-elite-accent transition-colors">{project.title}</h2>
                         <p className="text-elite-sub text-sm uppercase tracking-wide">{project.tags[0]}</p>
                       </div>
                       <span className="text-xs font-mono text-elite-accent pt-2">0{index + 1}</span>
                    </div>
                  </motion.div>
                );

                if (isClickable) {
                  return (
                    <a key={project.id || index} href={targetUrl} target="_blank" rel="noreferrer">
                      {Content}
                    </a>
                  );
                }

                return <div key={project.id || index}>{Content}</div>;
             })}
          </div>
        )}

      </div>
    </div>
  );
};

export default WorkPage;
