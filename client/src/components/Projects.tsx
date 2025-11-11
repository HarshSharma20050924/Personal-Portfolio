import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const imageBaseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';

  return (
    <section id="projects" className="py-20">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold flex items-center justify-center">
          Portfolio Highlights <span className="w-3 h-3 bg-primary rounded-full ml-3"></span>
        </h2>
        <p className="mt-4 text-lg text-secondary max-w-3xl mx-auto">
          A collection of my most impactful projects focusing on full-stack development and data science.
        </p>
      </div>
      <motion.div 
        ref={ref}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {projects.map((project) => (
          <motion.div 
            key={project.title} 
            className="group relative bg-white rounded-lg shadow-soft overflow-hidden border border-black/10"
            variants={itemVariants}
          >
            <div className="overflow-hidden">
                <img src={`${imageBaseUrl}${project.imageUrl}`} alt={project.title} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
              <div className="text-center text-background">
                <h3 className="text-2xl font-bold font-heading mb-2">{project.title}</h3>
                <p className="text-slate-200 mb-6">{project.description}</p>
                <div className="flex justify-center space-x-4">
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Live Demo"><ExternalLink /></a>}
                  {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="GitHub Repository"><Github /></a>}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;