
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Box, ArrowRight, FileText } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { Project } from '../types';

const M = motion as any;

interface ProjectDetailsProps {
    projects: Project[];
    template?: string;
}

const NextProjectPortal: React.FC<{ nextProject: Project; onNavigate: () => void }> = ({ nextProject, onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"] 
    });

    const progressMap = useTransform(scrollYProgress, [0.1, 0.9], [0, 100]);
    const smoothProgress = useSpring(progressMap, { stiffness: 60, damping: 20 });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            if (v >= 99 && !triggered) {
                setTriggered(true);
                onNavigate();
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, triggered, onNavigate]);

    return (
        <section ref={containerRef} className="relative h-[120vh] bg-[#050505] z-30">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-end pb-20 overflow-hidden pointer-events-none px-6">
                <div className="relative flex flex-col items-center gap-8 mb-8 z-10">
                    <M.div 
                        style={{ opacity: useTransform(scrollYProgress, [0.2, 0.6], [0, 1]), y: useTransform(scrollYProgress, [0.2, 0.6], [20, 0]) }}
                        className="text-center"
                    >
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600 mb-2 block">Next Up</span>
                        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase break-words max-w-[90vw] mx-auto">
                            {nextProject.title}
                        </h2>
                    </M.div>

                    <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="2" />
                            <M.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="2" pathLength="100" strokeDasharray="100 100"
                                style={{ strokeDashoffset: useTransform(smoothProgress, [0, 100], [100, 0]) }}
                            />
                        </svg>
                        <ArrowRight className="text-white w-6 h-6 md:w-8 md:h-8" />
                    </div>
                </div>
                
                <M.div style={{ opacity: useTransform(scrollYProgress, [0, 1], [0, 0.2]) }} className="absolute inset-0 z-0">
                    <img src={nextProject.imageUrl} alt="" className="w-full h-full object-cover filter grayscale blur-sm" />
                    <div className="absolute inset-0 bg-[#050505]/60" />
                </M.div>
            </div>
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
        navigate(`/project/${nextProject.id !== undefined ? nextProject.id : nextIndex}`);
    };

    if (!project) return <div className="min-h-screen bg-[#050505]" />;

    const imageY = useTransform(scrollY, [0, 1000], [0, 200]);

    return (
        <div className="bg-[#050505] text-white selection:bg-white selection:text-black min-h-screen overflow-x-hidden">
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
                <Link to="/gallery" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity group">
                    <ArrowLeft size={18} />
                    Gallery
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block">Archive v.01</span>
            </nav>

            <M.div key={id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                <header className="relative w-full h-[80vh] md:h-[85vh] overflow-hidden bg-[#050505] flex flex-col justify-end">
                    <M.div style={{ y: imageY }} className="absolute inset-0 z-0">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-[120%] object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </M.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
                        <M.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-white/20 rounded-full bg-black/40 text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-8xl font-black text-white leading-tight tracking-tight uppercase">
                                {project.title}
                            </h1>
                        </M.div>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-20 space-y-24 md:space-y-32 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10 pb-20">
                         <div className="md:col-span-8">
                            <p className="text-lg md:text-3xl font-light leading-relaxed text-gray-300">
                                {project.description}
                            </p>
                         </div>
                         <div className="md:col-span-4 flex flex-col gap-6">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Connections</h3>
                            <div className="flex flex-col gap-2">
                                {project.docUrl && (
                                    <a href={project.docUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest">
                                        Documentation <FileText size={14} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest">
                                        Launch Site <ExternalLink size={14} />
                                    </a>
                                )}
                                {project.repoUrl && (
                                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest">
                                        GitHub <Github size={14} />
                                    </a>
                                )}
                            </div>
                         </div>
                    </div>

                    {project.videoUrl && (
                        <div className="w-full aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/5">
                            {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                                <iframe src={project.videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title="Showcase" />
                            ) : (
                                <video controls className="w-full h-full" poster={project.imageUrl}>
                                    <source src={project.videoUrl} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    )}

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Core Challenge</h2>
                            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                                Solving complex performance bottlenecks while maintaining high visual fidelity. The architecture was designed to be modular and scalable across diverse platforms.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">Final Outcome</h2>
                            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                                Delivered a high-performance system utilizing modern frameworks and low-latency data processing, resulting in a 40% increase in user retention.
                            </p>
                        </div>
                    </section>
                </main>

                <NextProjectPortal key={nextProject.id || nextIndex} nextProject={nextProject} onNavigate={handleNavigate} />
            </M.div>
        </div>
    );
};

export default ProjectDetails;
