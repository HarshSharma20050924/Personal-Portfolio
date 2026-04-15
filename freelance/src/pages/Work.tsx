
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { SplitText } from '../components/SplitText';
import { FreelanceNavigation } from '../components/FreelanceNavigation';
import FreelanceCursor from '../components/FreelanceCursor';
import { Project, Service } from '../types';
import { API_BASE } from '../config';
import { AnimatePresence } from 'framer-motion';

const WorkPage = ({ name }: { name?: string }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    <div className="min-h-screen bg-elite-bg pt-32 pb-20 text-white cursor-none font-sans">
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
          <div className="flex justify-center py-20">
            <span className="text-[10px] font-mono tracking-[1em] text-blue-500 uppercase animate-pulse">
                SYSTEM_LABS
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
             {projects.map((project, index) => {
                const targetUrl = project.liveUrl || project.repoUrl;
                const isClickable = !!targetUrl;
                
                return (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: index * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <div 
                      className="aspect-[4/3] overflow-hidden bg-neutral-900 mb-8 relative border border-white/5 cursor-pointer"
                      onClick={() => setSelectedImage(project.imageUrl)}
                    >
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                       <motion.img 
                         whileHover={{ scale: 1.05 }}
                         transition={{ duration: 0.7, ease: "easeOut" }}
                         src={project.imageUrl} 
                         alt={project.title} 
                         className="w-full h-full object-cover"
                       />
                       <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500" size={32} />
                       </div>
                       {isClickable && (
                         <a 
                          href={targetUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-6 right-6 z-30 bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-elite-accent hover:text-white"
                         >
                            <ArrowUpRight size={20} />
                         </a>
                       )}
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-3xl font-display text-white mb-2 group-hover:text-elite-accent transition-colors">{project.title}</h2>
                            <p className="text-elite-sub text-[10px] font-mono uppercase tracking-[0.2em]">{project.tags[0]}</p>
                          </div>
                          <span className="text-xs font-mono text-elite-accent/40 pt-2">/0{index + 1}</span>
                       </div>
                       <p className="text-elite-sub/80 text-sm leading-relaxed mb-6 max-w-lg">
                          {project.description}
                        </p>

                        {(project.media && project.media.length > 0) && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-mono text-elite-accent uppercase tracking-[0.2em] mb-4">Proof of Work // System Proofs</h4>
                            <div className="flex flex-wrap gap-3">
                              {project.media.map((m: any, mIdx: number) => (
                                <div 
                                  key={mIdx}
                                  className="w-20 h-20 rounded-lg overflow-hidden border border-white/5 cursor-zoom-in hover:border-elite-accent transition-colors"
                                  onClick={() => setSelectedImage(m.url)}
                                >
                                  <img src={m.url} alt={m.title || "Proof"} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                </div>
                              ))}
                              {project.challengeImage && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/5 cursor-zoom-in hover:border-elite-accent" onClick={() => setSelectedImage(project.challengeImage)}>
                                  <img src={project.challengeImage} alt="Challenge Proof" className="w-full h-full object-cover grayscale hover:grayscale-0" />
                                </div>
                              )}
                              {project.outcomeImage && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/5 cursor-zoom-in hover:border-elite-accent" onClick={() => setSelectedImage(project.outcomeImage)}>
                                  <img src={project.outcomeImage} alt="Outcome Proof" className="w-full h-full object-cover grayscale hover:grayscale-0" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                );
             })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              src={selectedImage} 
              alt="Project Full Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkPage;
