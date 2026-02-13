
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { FreelanceNavigation } from '../components/templates/freelance/FreelanceNavigation';
import FreelanceCursor from '../components/templates/freelance/FreelanceCursor';
import { Service, Project } from '../types';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [nextServiceId, setNextServiceId] = useState<number | null>(null);
  const [nextServiceTitle, setNextServiceTitle] = useState<string>('');

  const { scrollYProgress } = useScroll();
  const heroTextY = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
      fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            const services: Service[] = data.services || [];
            const allProjects: Project[] = data.projects || [];
            
            const currentServiceIndex = services.findIndex(s => String(s.id) === id);
            
            if (currentServiceIndex !== -1) {
                const currentService = services[currentServiceIndex];
                setService(currentService);
                
                const relatedProjects = allProjects.filter(p => p.serviceId === currentService.id && p.showInFreelance);
                setProjects(relatedProjects);

                const nextIndex = (currentServiceIndex + 1) % services.length;
                const nextS = services[nextIndex];
                if (nextS) {
                    setNextServiceId(nextS.id || null);
                    setNextServiceTitle(nextS.title);
                }
            }
        });
  }, [id]);

  if (!service) return <div className="min-h-screen bg-elite-bg flex items-center justify-center text-white">Loading Capability...</div>;

  const handleStartProject = () => {
    navigate('/contact', { state: { service: service.title } });
  };

  const handleNextProject = () => {
    if(nextServiceId) navigate(`/service/${nextServiceId}`);
  };

  return (
    <div className="bg-elite-bg min-h-screen relative overflow-x-hidden text-white cursor-none">
      <FreelanceCursor />
      <FreelanceNavigation />
      
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none pt-24"
      >
        <button onClick={() => navigate('/work')} className="pointer-events-auto clickable flex items-center gap-2 hover:opacity-70 transition-opacity uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> All Work
        </button>
        <span className="uppercase tracking-widest text-xs font-mono">{service.title}</span>
      </motion.div>

      <section className="h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-elite-bg to-elite-bg">
             <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="will-change-transform">
            <span className="text-elite-accent font-mono text-xs tracking-[0.3em] uppercase mb-6 block">Capability</span>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-8xl font-display font-medium text-white mb-6"
            >
              {service.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-2xl text-white/60 font-light tracking-wide max-w-2xl mx-auto"
            >
              {service.tagline}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-20 bg-elite-bg pb-20">
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-40 border-t border-white/10 pt-20">
            <div className="lg:col-span-4">
               <span className="text-xs font-mono text-elite-sub uppercase tracking-widest">The Philosophy</span>
            </div>
            <div className="lg:col-span-8">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl leading-relaxed text-white font-light"
              >
                {service.description}
              </motion.p>
            </div>
          </div>

          <div className="space-y-32">
            {projects.length > 0 ? projects.map((work, index) => (
              <div key={work.id || index} className="group">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden bg-neutral-900 mb-8"
                >
                   <img 
                     src={work.imageUrl} 
                     alt={work.title} 
                     className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
                   />
                   {(work.liveUrl || work.repoUrl) && (
                       <div className="absolute top-4 right-4 z-20 flex gap-2">
                           {work.liveUrl && (
                               <a href={work.liveUrl} target="_blank" rel="noreferrer" className="clickable p-3 bg-white text-black rounded-full hover:bg-elite-accent hover:text-white transition-colors">
                                   <ExternalLink size={20} />
                               </a>
                           )}
                       </div>
                   )}
                </motion.div>
                
                <div className="flex flex-col md:flex-row justify-between items-start border-t border-white/10 pt-6">
                   <div>
                      <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-3xl font-display text-white">{work.title}</h3>
                          {work.liveUrl && (
                              <a href={work.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-mono uppercase tracking-widest text-elite-sub hover:text-white border-b border-white/20 hover:border-white transition-colors clickable">
                                  Live Site
                              </a>
                          )}
                      </div>
                      {work.outcome && (
                          <div className="flex items-center gap-2 text-elite-accent">
                            <CheckCircle2 size={16} />
                            <span className="text-sm font-mono uppercase">{work.outcome.substring(0, 40)}{work.outcome.length > 40 ? '...' : ''}</span>
                          </div>
                      )}
                   </div>
                   <div className="mt-4 md:mt-0">
                      <span className="text-xs font-mono text-elite-sub uppercase tracking-widest">Case Study 0{index + 1}</span>
                   </div>
                </div>
              </div>
            )) : (
                <div className="text-center text-gray-500 py-20 border border-dashed border-white/10 rounded-xl">
                    No public case studies available for this service yet.
                </div>
            )}
          </div>

          <div className="mt-40 border-t border-white/10 pt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div 
               onClick={handleStartProject}
               className="clickable group border border-white/10 p-10 hover:bg-white hover:border-white transition-all duration-500 cursor-none"
             >
                <span className="block text-xs font-mono text-elite-sub uppercase mb-4 group-hover:text-black/60">Interest Piqued?</span>
                <div className="flex justify-between items-center">
                   <span className="text-3xl font-display text-white group-hover:text-black">Start Project</span>
                   <ArrowRight className="text-white group-hover:text-black -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
             </div>

             {nextServiceId && (
                 <div 
                   onClick={handleNextProject}
                   className="clickable group border border-white/10 p-10 hover:border-elite-accent transition-colors duration-500 cursor-none text-right"
                 >
                    <span className="block text-xs font-mono text-elite-sub uppercase mb-4">Next Capability</span>
                    <div className="flex justify-end items-center gap-4">
                       <span className="text-3xl font-display text-white group-hover:text-elite-accent transition-colors">{nextServiceTitle}</span>
                       <ArrowRight className="text-white group-hover:text-elite-accent transition-colors" />
                    </div>
                 </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
