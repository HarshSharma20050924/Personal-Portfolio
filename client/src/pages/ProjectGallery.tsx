
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Project } from '../types';

interface ProjectGalleryProps {
    projects: Project[];
    template?: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, template }) => {
    const isElite = template === 'elite';

    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => a.title.localeCompare(b.title));
    }, [projects]);

    const baseClasses = isElite 
        ? "bg-[#050505] text-white min-h-screen font-sans selection:bg-white selection:text-black" 
        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans";

    return (
        <div className={baseClasses}>
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
                <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
                    <ArrowLeft size={18} />
                    Back to Overview
                </Link>
                <h1 className="text-xs uppercase tracking-[0.3em] font-mono text-gray-500">Project Archive</h1>
                <div className="w-20 md:w-40 flex justify-end" />
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <header className="mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter mb-4"
                    >
                        COLLECTION
                    </motion.h1>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <p className="text-gray-500 font-mono text-xs uppercase">Comprehensive list sorted A-Z</p>
                        <span className="text-gray-500 font-mono text-xs">{projects.length} Total Artifacts</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
                    {sortedProjects.map((project, idx) => (
                        <motion.div
                            key={project.id || idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link 
                                to={`/project/${project.id || idx}`}
                                className="group relative block aspect-[4/5] overflow-hidden bg-black"
                            >
                                <img 
                                    src={project.imageUrl} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <span className="text-[10px] font-mono text-blue-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        ID: {String(project.id || idx).padStart(3, '0')}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-none">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                        {project.description}
                                    </p>
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {project.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[9px] uppercase tracking-widest px-2 py-1 border border-white/10 rounded-full text-gray-500 bg-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>

            <footer className="py-20 text-center border-t border-white/5">
                <p className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.2em]">End of Archive</p>
            </footer>
        </div>
    );
};

export default ProjectGallery;
