import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  template?: string;
}

const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const Projects: React.FC<ProjectsProps> = ({ projects, template = 'default' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const isMinimalist = template === 'minimalist';

  return (
    <section id="projects" className="py-10 scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl font-bold flex items-center justify-center text-text dark:text-dark-text">
          Featured Projects
        </h2>
        <p className="mt-4 text-lg text-secondary dark:text-dark-secondary max-w-3xl mx-auto">
          A selection of projects that demonstrate my passion for building.
        </p>
      </div>
      <motion.div 
        ref={ref}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {projects.map((project) => {
          if (isMinimalist) {
            return (
              <motion.div
                key={project.title}
                className="bg-white dark:bg-dark-off-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col"
                variants={itemVariants}
              >
                <div className="overflow-hidden h-48">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-heading mb-2 text-text dark:text-dark-text">{project.title}</h3>
                  <p className="text-secondary dark:text-dark-secondary mb-4 text-sm flex-grow">{project.description}</p>
                  <div className="flex gap-4 mt-auto">
                      {project.repoUrl && <a href={project.repoUrl} className="text-sm font-medium text-primary hover:underline">Code</a>}
                      {project.liveUrl && <a href={project.liveUrl} className="text-sm font-medium text-primary hover:underline">Live Demo</a>}
                  </div>
                </div>
              </motion.div>
            );
          }
          
          // Default Template - Restored Clean Hover Overlay
          return (
            <motion.div 
              key={project.title} 
              className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg"
              variants={itemVariants}
            >
              <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50" 
                  />
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-center">
                <h3 className="text-2xl font-bold font-heading text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-6 line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {project.description}
                </p>
                <div className="flex gap-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-primary transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white hover:text-primary transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={24} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  );
};

export default Projects;