
import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { Project } from '../types';

const M = motion as any;

interface ProjectGalleryProps {
    projects: Project[];
    template?: string;
}

const CinematicCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    return (
        <M.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.0, ease: "easeOut", delay: index * 0.1 }}
            className="w-full max-w-5xl mx-auto mb-32 relative group"
        >
            <Link to={`/project/${project.id || index}`} className="block relative elite-interactive">
                {/* Image Container - No complex layout animations */}
                <div className="relative aspect-[2/1] overflow-hidden bg-[#111] border border-white/5 group-hover:border-white/20 transition-colors duration-500">
                    <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-60 group-hover:opacity-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Typography */}
                <div className="flex items-start justify-between mt-6 px-2">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-mono text-gray-600">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-300 group-hover:text-white transition-colors tracking-tight">
                                {project.title}
                            </h2>
                        </div>
                        <p className="text-gray-500 text-sm max-w-md line-clamp-2 pl-8">
                            {project.description}
                        </p>
                    </div>
                    
                    <span className="text-xs font-mono text-gray-600 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full group-hover:text-white group-hover:border-white/30 transition-colors">
                        {project.tags[0]}
                    </span>
                </div>
            </Link>
        </M.div>
    );
};

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, template }) => {
    const isElite = template === 'elite';
    const lenis = useLenis();
    
    // Ensure scroll is at top instantly when mounting
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [lenis]);

    const baseClasses = isElite 
        ? "bg-[#050505] text-white font-sans selection:bg-white selection:text-black min-h-screen" 
        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen";

    return (
        <div className={baseClasses}>
            {/* Nav - Fixed, outside animation flow */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pt-10 md:pt-6 flex justify-between items-center bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
                <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity elite-interactive text-white">
                    <ArrowLeft size={18} />
                    Back
                </Link>
                <h1 className="text-xs uppercase tracking-[0.3em] font-mono text-white/50">Archive Index</h1>
            </nav>

            <M.div 
                className="pt-32 md:pt-40 pb-20 px-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="max-w-5xl mx-auto mb-24 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2">WORKS</h1>
                        <p className="text-gray-500 text-sm max-w-md mt-4">
                            A curated selection of digital experiences, applications, and experiments.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-xs font-mono text-gray-600 uppercase tracking-widest block">
                            Total Projects
                        </span>
                        <span className="text-4xl font-mono text-white">
                            {String(projects.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-12">
                    {projects.map((project, idx) => (
                        <CinematicCard key={project.id || idx} project={project} index={idx} />
                    ))}
                </div>

                <div className="h-[20vh] flex items-center justify-center mt-20">
                    <p className="text-gray-700 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" /> 
                        End of Transmission 
                        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    </p>
                </div>
            </M.div>
        </div>
    );
};

export default ProjectGallery;
