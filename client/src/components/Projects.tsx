import React from 'react';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">Featured Projects</h2>
      <p className="text-lg text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
        A selection of projects that I'm proud of.
      </p>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {projects.map((project) => (
          <div key={project.title} className="group relative bg-white dark:bg-slate-800/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <img src={project.imageUrl} alt={project.title} className="w-full h-60 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-200 mb-4">{project.description}</p>
                <div className="flex justify-center space-x-4">
                  {project.liveUrl && <a href={project.liveUrl} className="bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors">Live Demo</a>}
                  {project.repoUrl && <a href={project.repoUrl} className="bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">GitHub</a>}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{project.title}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
