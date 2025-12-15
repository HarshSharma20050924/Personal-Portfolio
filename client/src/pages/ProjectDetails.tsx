
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, FileText, PlayCircle, Box } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailsProps {
    projects: Project[];
    template?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects, template }) => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const isElite = template === 'elite';

    useEffect(() => {
        const found = projects.find(p => String(p.id) === id) || projects[Number(id)];
        setProject(found || null);
        window.scrollTo(0, 0);
    }, [id, projects]);

    if (!project) {
        return <div className="min-h-screen flex items-center justify-center text-white">Project not found.</div>;
    }

    const baseClasses = isElite 
        ? "bg-[#050505] text-white selection:bg-white selection:text-black min-h-screen font-sans" 
        : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans";

    const accentColor = isElite ? "text-blue-500" : "text-primary dark:text-blue-400";

    return (
        <div className={baseClasses}>
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm">
                <Link to="/" className={`flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity ${isElite ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    <ArrowLeft size={20} />
                    Back to Gallery
                </Link>
                {isElite && <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Project Details</span>}
            </nav>

            {/* Hero Header */}
            <header className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 z-0">
                     {/* If video exists, use it as bg? Maybe overkill. Just image for now. */}
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-20 h-full max-w-6xl mx-auto px-6 flex flex-col justify-end pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex gap-4 mb-4">
                            {project.tags.map((tag, i) => (
                                <span key={i} className={`text-xs font-mono uppercase tracking-widest px-3 py-1 border rounded-full ${isElite ? 'border-white/20 bg-black/50 text-white' : 'border-white/80 bg-white/20 text-white'}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-none">
                            {project.title}
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed">
                            {project.description}
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
                
                {/* Links / Actions Bar */}
                <section className="flex flex-wrap gap-6 border-b border-gray-200 dark:border-gray-800 pb-12">
                     {project.liveUrl && (
                         <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isElite ? 'bg-white text-black hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                             <ExternalLink size={18} /> Live Demo
                         </a>
                     )}
                     {project.repoUrl && (
                         <a href={project.repoUrl} target="_blank" rel="noreferrer" className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all ${isElite ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                             <Github size={18} /> View Code
                         </a>
                     )}
                     {project.huggingFaceUrl && (
                         <a href={project.huggingFaceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 transition-all">
                             <Box size={18} /> Hugging Face
                         </a>
                     )}
                     {project.docUrl && (
                         <a href={project.docUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all">
                             <FileText size={18} /> Documentation
                         </a>
                     )}
                </section>

                {/* Video Showcase */}
                {project.videoUrl && (
                    <section>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${isElite ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            Project Showcase
                        </h2>
                        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                            {/* Check if YouTube or direct file */}
                            {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                                <iframe 
                                    src={project.videoUrl.replace('watch?v=', 'embed/')} 
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Project Showcase"
                                />
                            ) : (
                                <video controls className="w-full h-full" poster={project.imageUrl}>
                                    <source src={project.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </section>
                )}

                {/* Documentation / Deep Dive */}
                <section className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isElite ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            About this Project
                        </h2>
                        <div className={`prose ${isElite ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}>
                           <p className="text-lg leading-relaxed opacity-90">
                               {project.description}
                           </p>
                           <p className="mt-4 opacity-80">
                               This project was built to solve specific challenges. By leveraging modern technologies, 
                               we achieved significant performance improvements and a seamless user experience. 
                               Refer to the linked documentation for technical implementation details.
                           </p>
                        </div>
                    </div>
                    <div>
                         <h3 className={`text-sm font-mono uppercase tracking-widest mb-6 ${isElite ? 'text-gray-500' : 'text-gray-500'}`}>
                             Tech Stack
                         </h3>
                         <div className="flex flex-wrap gap-2">
                             {project.tags.map((tag) => (
                                 <div key={tag} className={`px-4 py-3 rounded-lg border ${isElite ? 'border-white/10 bg-white/5 text-gray-300' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
                                     {tag}
                                 </div>
                             ))}
                         </div>
                    </div>
                </section>
                
            </main>

            <footer className={`py-12 border-t ${isElite ? 'bg-black border-white/10 text-gray-600' : 'bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 text-gray-500'} text-center text-sm font-mono`}>
                <Link to="/" className="hover:text-white transition-colors">Return to Portfolio</Link>
            </footer>
        </div>
    );
};

export default ProjectDetails;
