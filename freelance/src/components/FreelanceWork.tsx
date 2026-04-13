
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Project, Service } from '../types';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const WorkCard = ({ project, index }: { project: Project, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.95, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Determine link target: liveUrl > repoUrl
  const targetUrl = project.liveUrl || project.repoUrl;
  const isClickable = !!targetUrl;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isClickable) {
      return <a href={targetUrl} target="_blank" rel="noreferrer" className="block w-full">{children}</a>
    }
    return <div className="block w-full">{children}</div>
  }

  return (
    <div ref={containerRef} className="min-h-[60vh] md:min-h-screen flex items-center justify-center sticky top-0 py-10 md:py-20">
      <CardWrapper>
        <motion.div
          style={{ 
            scale: isMobile ? 1 : scale, 
            opacity: isMobile ? 1 : opacity, 
            y: isMobile ? 0 : y 
          }}
          className="relative w-full max-w-5xl aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl origin-bottom group clickable"
        >
          <div className="absolute inset-0 w-full h-full">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-elite-accent rounded-full animate-pulse" />
                <span className="text-elite-sub text-[10px] font-mono uppercase tracking-[0.2em]">{project.tags[0] || 'Freelance'}</span>
              </div>
              <h3 className="text-2xl md:text-6xl font-display font-medium text-white mb-3 leading-tight flex items-center gap-3">
                {project.title}
                {isClickable && <ExternalLink size={20} className="md:size-8 opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity" />}
              </h3>
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed mb-0 line-clamp-2 md:line-clamp-none">
                {project.description}
              </p>
            </div>

            {project.outcome && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-xl whitespace-nowrap shrink-0">
                <span className="block text-[10px] text-elite-sub uppercase tracking-wider mb-1">Result</span>
                <span className="text-lg md:text-2xl font-display font-bold text-white tracking-tight">{project.outcome}</span>
              </div>
            )}
          </div>
        </motion.div>
      </CardWrapper>
    </div>
  );
};

export const FreelanceWork = ({ projects, services }: { projects: Project[], services: Service[] }) => {
  // Filter for freelance + featured only
  const freelanceProjects = projects.filter(p => p.showInFreelance && p.featured);

  return (
    <section id="work" className="bg-elite-bg relative py-32">
      <div className="container mx-auto px-4 mb-20 text-center">
        <span className="text-elite-accent font-medium tracking-[0.2em] uppercase text-xs">Case Studies</span>
        <h2 className="text-4xl md:text-6xl font-display font-medium text-white mt-4">Selected Works</h2>
      </div>

      <div className="container mx-auto px-4">
        {freelanceProjects.length > 0 ? (
          freelanceProjects.map((project, index) => (
            <WorkCard key={project.id || index} project={project} index={index} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-20 border border-dashed border-white/10 rounded-xl">
            No featured freelance projects. Mark projects as "Show in Freelance" AND "Featured" in Admin.
          </div>
        )}
      </div>

      <div className="flex justify-center mt-20">
        <Link to="/work" className="px-8 py-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-colors text-sm uppercase tracking-widest clickable">
          View Full Archive
        </Link>
      </div>
    </section>
  );
};
