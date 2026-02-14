
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowUp, FileText } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { Project } from '../types';

const M = motion as any;

interface ProjectDetailsProps {
    projects: Project[];
    template?: string;
}

const PullUpNavigationFooter: React.FC<{ nextProject: Project; onNavigate: () => void }> = ({ nextProject, onNavigate }) => {
    const dragY = useMotionValue(0);
    const [triggered, setTriggered] = useState(false);
    
    // Map drag distance to visual properties
    const contentY = useTransform(dragY, [0, -300], [0, -60]); 
    const progress = useTransform(dragY, [0, -200], [0, 100]);
    const imageOpacity = useTransform(dragY, [0, -200], [0.1, 0.6]); 
    const imageScale = useTransform(dragY, [0, -300], [1.1, 1]); 
    
    const handleDragEnd = () => {
        if (dragY.get() <= -150) {
            setTriggered(true);
            onNavigate();
        }
    };

    return (
        <section className="h-[50vh] bg-white dark:bg-[#050505] border-t border-black/5 dark:border-white/5 relative overflow-hidden flex flex-col justify-end transition-colors duration-500">
            {/* Background Hint - Next Project Image */}
            <M.div 
                style={{ opacity: imageOpacity, scale: imageScale }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <img src={nextProject?.imageUrl} alt="" className="w-full h-full object-cover grayscale blur-sm" />
                <div className="absolute inset-0 bg-white/80 dark:bg-black/50" />
            </M.div>

            {/* Content Container */}
            <M.div 
                style={{ y: contentY }}
                className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none pb-10"
            >
                <M.p 
                    style={{ opacity: useTransform(dragY, [0, -50], [1, 0]) }}
                    className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8 animate-pulse"
                >
                    Pull Up to Enter Next
                </M.p>

                <div className="flex flex-col items-center gap-6">
                     <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl backdrop-blur-md">
                        <ArrowUp size={24} className="text-black dark:text-white" />
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <M.circle 
                                cx="50" cy="50" r="48" 
                                stroke="currentColor" strokeWidth="2" 
                                fill="none"
                                pathLength="100"
                                strokeDasharray="100 100"
                                className="text-black dark:text-white"
                                style={{ strokeDashoffset: useTransform(progress, p => 100 - p) }}
                            />
                        </svg>
                     </div>

                     <div className="text-center space-y-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Next Project</span>
                        <h2 className="text-2xl md:text-4xl font-black text-black dark:text-white uppercase tracking-tight max-w-lg leading-none">
                            {nextProject?.title}
                        </h2>
                     </div>
                </div>
            </M.div>

            <M.div
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                drag="y"
                dragConstraints={{ top: -300, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ y: dragY }}
            />
        </section>
    );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects = [], template }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const lenis = useLenis();
    const { scrollY } = useScroll();
    
    // Filter projects if in freelance template mode
    const displayProjects = template === 'freelance' 
        ? projects.filter(p => p.showInFreelance)
        : projects;

    const projectIndex = displayProjects.findIndex(p => String(p.id) === id || String(displayProjects.indexOf(p)) === id);
    const project = displayProjects[projectIndex];
    
    const nextIndex = projectIndex === -1 ? 0 : (projectIndex + 1) % displayProjects.length;
    const nextProject = displayProjects[nextIndex];

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        if (lenis) lenis.scrollTo(0, { immediate: true });
    }, [id, lenis]);

    const handleNavigate = () => {
        if (!nextProject) return;
        const nextId = nextProject.id !== undefined ? nextProject.id : nextIndex;
        setTimeout(() => {
            navigate(`/project/${nextId}`);
        }, 100);
    };

    if (!project) return <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center text-black dark:text-white">Loading Signal...</div>;

    const imageY = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <div className="bg-white dark:bg-[#050505] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen overflow-x-hidden transition-colors duration-500">
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-white/90 dark:from-black/80 to-transparent pointer-events-none">
                <Link to="/gallery" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive text-black dark:text-white">
                    <ArrowLeft size={18} />
                    Gallery
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block text-black dark:text-white">Detailed Log</span>
            </nav>

            <M.div 
                key={id} 
                initial={{ opacity: 0, y: -50 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 50 }} 
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
            >
                <header className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-200 dark:bg-[#050505] flex flex-col justify-end">
                    <M.div style={{ y: imageY }} className="absolute inset-0 z-0">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-[120%] object-cover opacity-90 dark:opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#050505]" />
                    </M.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 md:pb-20">
                        <M.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {project.tags && project.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-black/10 dark:border-white/20 rounded-full bg-white/70 dark:bg-black/40 text-black dark:text-white backdrop-blur-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-black dark:text-white leading-tight tracking-tight uppercase max-w-4xl drop-shadow-sm dark:drop-shadow-2xl mix-blend-hard-light dark:mix-blend-normal">
                                {project.title}
                            </h1>
                        </M.div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-black/10 dark:border-white/10 pb-16 md:pb-20">
                         <div className="md:col-span-8">
                            <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-300">
                                {project.description}
                            </p>
                         </div>
                         <div className="md:col-span-4 flex flex-col gap-6">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Data Points</h3>
                            <div className="flex flex-col gap-2">
                                {project.docUrl && (
                                    <a href={project.docUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive text-black dark:text-white">
                                        Documentation <FileText size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive text-black dark:text-white">
                                        Live Deployment <ExternalLink size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                {project.repoUrl && (
                                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive text-black dark:text-white">
                                        Source Code <Github size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                            </div>
                         </div>
                    </div>

                    {project.videoUrl && (
                        <div className="w-full aspect-video bg-gray-100 dark:bg-[#111] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl relative">
                            {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                                <iframe src={project.videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title="Showcase" />
                            ) : (
                                <video controls className="w-full h-full" poster={project.imageUrl}>
                                    <source src={project.videoUrl} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    )}

                    {/* Improved Challenge & Outcome Section with Visuals */}
                    <div className="space-y-24">
                        {/* Core Challenge */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 space-y-6">
                                <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Core Challenge</h2>
                                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                                    {project.challenge || "Solving complex performance bottlenecks while maintaining high visual fidelity. The architecture was designed to be modular and scalable across diverse platforms."}
                                </p>
                            </div>
                            <div className="order-1 md:order-2 relative aspect-[4/3] rounded-lg overflow-hidden border border-black/5 dark:border-white/10 group">
                                <img 
                                    src={project.challengeImage || project.imageUrl} 
                                    alt="Challenge Visual" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </section>

                        {/* Final Outcome */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="order-1 relative aspect-[4/3] rounded-lg overflow-hidden border border-black/5 dark:border-white/10 group">
                                <img 
                                    src={project.outcomeImage || project.imageUrl} 
                                    alt="Outcome Visual" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="order-2 space-y-6">
                                <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Final Outcome</h2>
                                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                                    {project.outcome || "Delivered a high-performance system utilizing modern frameworks and low-latency data processing, resulting in a 40% increase in user retention."}
                                </p>
                            </div>
                        </section>
                    </div>
                </main>

                {nextProject && (
                    <PullUpNavigationFooter key={`next-${nextProject.id || nextIndex}`} nextProject={nextProject} onNavigate={handleNavigate} />
                )}
            </M.div>
        </div>
    );
};

export default ProjectDetails;
