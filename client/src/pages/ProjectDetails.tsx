import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowRight, FileText } from 'lucide-react';
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

    const progressMap = useTransform(scrollYProgress, [0.15, 0.9], [0, 100]);
    const smoothProgress = useSpring(progressMap, { stiffness: 75, damping: 25, mass: 1 });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            if (v >= 98 && !triggered) {
                setTriggered(true);
                setTimeout(() => {
                    onNavigate();
                }, 50);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, triggered, onNavigate]);

    return (
        <section ref={containerRef} className="relative h-[60vh] md:h-[80vh] bg-white dark:bg-[#050505] z-30 flex items-center justify-center border-t border-black/5 dark:border-white/5 transition-colors duration-500">
            <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center sticky top-0">
                <M.div 
                    style={{ 
                        opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]), 
                        y: useTransform(scrollYProgress, [0, 0.5], [20, 0]) 
                    }}
                    className="relative z-10 flex flex-col items-center gap-6"
                >
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Next Project</span>
                    <h2 className="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase mb-4">
                        {nextProject.title}
                    </h2>
                    
                    <div className="relative w-24 h-24 flex items-center justify-center cursor-pointer elite-interactive" onClick={onNavigate}>
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth="2" className="text-black dark:text-white" />
                            <M.circle 
                                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" pathLength="100" strokeDasharray="100 100"
                                className="text-black dark:text-white"
                                style={{ strokeDashoffset: useTransform(smoothProgress, [0, 100], [100, 0]) }}
                            />
                        </svg>
                        <ArrowRight className="text-black dark:text-white w-6 h-6" />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-700 font-mono mt-4 uppercase tracking-widest">Keep scrolling</p>
                </M.div>

                <M.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.8], [0, 0.2]) }} 
                    className="absolute inset-0 z-0 pointer-events-none"
                >
                    <img src={nextProject.imageUrl} alt="" className="w-full h-full object-cover filter grayscale blur-sm" />
                    <div className="absolute inset-0 bg-white/80 dark:bg-[#050505]/70 transition-colors duration-500" />
                </M.div>
            </div>
        </section>
    );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects }) => {
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
        navigate(`/project/${nextId}`);
    };

    if (!project) return <div className="min-h-screen bg-white dark:bg-[#050505]" />;

    return (
        <div className="bg-white dark:bg-[#050505] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen overflow-x-hidden transition-colors duration-500">
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-6 pt-10 md:pt-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
                <Link to="/gallery" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:opacity-70 transition-opacity pointer-events-auto elite-interactive">
                    <ArrowLeft size={18} />
                    Gallery
                </Link>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest hidden sm:block">Detailed Log // {id}</span>
            </nav>

            <M.div 
                key={id} 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <header className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-white dark:bg-[#050505] flex flex-col justify-end transition-colors duration-500">
                    <M.div style={{ y: useTransform(scrollY, [0, 1000], [0, 200]) }} className="absolute inset-0 z-0">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-[120%] object-cover opacity-60 dark:opacity-40 filter grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050505] via-transparent to-transparent transition-colors duration-500" />
                    </M.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-20">
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 border border-black/10 dark:border-white/20 rounded-full bg-black/5 dark:bg-black/40 text-black dark:text-white">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-black dark:text-white leading-tight tracking-tight uppercase">
                            {project.title}
                        </h1>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-6 py-20 space-y-20 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-black/5 dark:border-white/10 pb-20">
                         <div className="md:col-span-8">
                            <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-600 dark:text-gray-300">
                                {project.description}
                            </p>
                         </div>
                         <div className="md:col-span-4 flex flex-col gap-6">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Connections</h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { url: project.docUrl, label: 'Documentation', icon: <FileText size={14} /> },
                                    { url: project.liveUrl, label: 'Launch Site', icon: <ExternalLink size={14} /> },
                                    { url: project.repoUrl, label: 'GitHub', icon: <Github size={14} /> }
                                ].map((link, i) => link.url && (
                                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-black/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors text-xs uppercase font-bold tracking-widest group elite-interactive text-black dark:text-white">
                                        {link.label} <span className="group-hover:-translate-y-0.5 transition-transform">{link.icon}</span>
                                    </a>
                                ))}
                            </div>
                         </div>
                    </div>

                    {project.videoUrl && (
                        <div className="w-full aspect-video bg-gray-100 dark:bg-[#111] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 transition-colors duration-500">
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
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Core Challenge</h2>
                            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                Solving complex performance bottlenecks while maintaining high visual fidelity. The architecture was designed to be modular and scalable across diverse platforms.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Final Outcome</h2>
                            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                                Delivered a high-performance system utilizing modern frameworks and low-latency data processing, resulting in a 40% increase in user retention.
                            </p>
                        </div>
                    </section>
                </main>

                <NextProjectPortal key={`next-${id}`} nextProject={nextProject} onNavigate={handleNavigate} />
            </M.div>
        </div>
    );
};

export default ProjectDetails;