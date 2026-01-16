
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
    const y = useMotionValue(0);
    const [triggered, setTriggered] = useState(false);
    
    // Map drag distance (negative Y) to progress 0-100
    const progress = useTransform(y, [0, -150], [0, 100]);
    const opacity = useTransform(y, [0, -100], [0.5, 1]);
    const scale = useTransform(y, [0, -150], [1, 1.1]);
    const arrowY = useTransform(y, [0, -150], [0, -10]);
    
    const handleDragEnd = () => {
        if (y.get() <= -120) {
            setTriggered(true);
            onNavigate();
        }
    };

    return (
        <section className="h-[50vh] bg-[#050505] border-t border-white/5 relative overflow-hidden flex flex-col justify-end pb-12 md:pb-20 touch-none">
            {/* Hint Text */}
            <M.div style={{ opacity: useTransform(y, [0, -50], [1, 0]) }} className="absolute top-10 w-full text-center pointer-events-none z-10">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest animate-pulse">
                    Pull Up to Continue
                </p>
            </M.div>

            <M.div 
                className="w-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing relative z-20"
                drag="y"
                dragConstraints={{ top: -250, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ y }}
            >
                <div className="flex flex-col items-center gap-6 p-4">
                     {/* Interactive Circle */}
                     <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-white/10 bg-[#111] shadow-2xl">
                        <M.div style={{ y: arrowY }}>
                            <ArrowUp size={24} className="text-white" />
                        </M.div>
                        {/* Progress Ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                            <M.circle 
                                cx="50" cy="50" r="48" 
                                stroke="#fff" strokeWidth="2" 
                                fill="none"
                                pathLength="100"
                                strokeDasharray="100 100"
                                style={{ strokeDashoffset: useTransform(progress, p => 100 - p) }}
                            />
                        </svg>
                     </div>

                     <M.div style={{ opacity, scale }} className="text-center space-y-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Next Project</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter max-w-lg leading-none">
                            {nextProject.title}
                        </h2>
                     </M.div>
                </div>
            </M.div>
            
            {/* Background Preview */}
             <M.div 
                style={{ opacity: useTransform(progress, [0, 100], [0.1, 0.5]) }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <img src={nextProject.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-50 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            </M.div>
        </section>
    );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects, template }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const lenis = useLenis();
    const { scrollY } = useScroll();
    
    const projectIndex = projects.findIndex(p => String(p.id) === id || String(projects.indexOf(p)) === id);
    const project = projects[projectIndex];
    
    const nextIndex = projectIndex === -1 ? 0 : (projectIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
        if (lenis) lenis.scrollTo(0, { immediate: true });
    }, [id, lenis]);

    const handleNavigate = () => {
        const nextId = nextProject.id !== undefined ? nextProject.id : nextIndex;
        setTimeout(() => {
            navigate(`/project/${nextId}`);
        }, 100);
    };

    if (!project) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Signal...</div>;

    const imageY = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <div className="bg-[#050505] text-white selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link to="/gallery" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto elite-interactive mix-blend-difference">
                    <ArrowLeft size={18} />
                    Gallery
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block mix-blend-difference">Detailed Log</span>
            </nav>

            <M.div 
                key={id} 
                initial={{ opacity: 0, y: -100 }} // Appears from upper head
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 100 }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Smooth easeOutExpo-like curve
            >
                <header className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[#050505] flex flex-col justify-end">
                    <M.div style={{ y: imageY }} className="absolute inset-0 z-0">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-[120%] object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </M.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12 md:pb-20">
                        <M.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 rounded-full bg-black/40 text-white backdrop-blur-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight uppercase max-w-4xl drop-shadow-2xl">
                                {project.title}
                            </h1>
                        </M.div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-16 md:pb-20">
                         <div className="md:col-span-8">
                            <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-300">
                                {project.description}
                            </p>
                         </div>
                         <div className="md:col-span-4 flex flex-col gap-6">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Data Points</h3>
                            <div className="flex flex-col gap-2">
                                {project.docUrl && (
                                    <a href={project.docUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive">
                                        Documentation <FileText size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive">
                                        Live Deployment <ExternalLink size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                                {project.repoUrl && (
                                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive">
                                        Source Code <Github size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    </a>
                                )}
                            </div>
                         </div>
                    </div>

                    {project.videoUrl && (
                        <div className="w-full aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/5 shadow-2xl relative">
                            {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                                <iframe src={project.videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title="Showcase" />
                            ) : (
                                <video controls className="w-full h-full" poster={project.imageUrl}>
                                    <source src={project.videoUrl} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    )}

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Core Challenge</h2>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                                Solving complex performance bottlenecks while maintaining high visual fidelity. The architecture was designed to be modular and scalable across diverse platforms.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Final Outcome</h2>
                            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                                Delivered a high-performance system utilizing modern frameworks and low-latency data processing, resulting in a 40% increase in user retention.
                            </p>
                        </div>
                    </section>
                </main>

                <PullUpNavigationFooter key={`next-${nextProject.id || nextIndex}`} nextProject={nextProject} onNavigate={handleNavigate} />
            </M.div>
        </div>
    );
};

export default ProjectDetails;
