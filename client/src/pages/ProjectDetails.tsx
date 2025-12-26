
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Box, ArrowRight } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { Project } from '../types';

const M = motion as any;

interface ProjectDetailsProps {
    projects: Project[];
    template?: string;
}

// --- Force Scroll Footer Component ---
const NextProjectPortal: React.FC<{ nextProject: Project; onNavigate: () => void }> = ({ nextProject, onNavigate }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);

    // Track scroll progress specifically for this footer section
    // offset "start end" means when top of footer enters viewport
    // offset "end end" means when bottom of footer hits bottom of viewport
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Map progress (0 to 1) to circle completion (0 to 100)
    // We only start filling the circle when the user is 20% into the section to add "resistance"
    const progressMap = useTransform(scrollYProgress, [0.2, 1], [0, 100]);
    // Smooth the visual fill heavily for a liquid feel
    const smoothProgress = useSpring(progressMap, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Trigger navigation only when strictly 100% (value >= 1)
            // This prevents accidental triggers during quick scrolls
            if (latest >= 0.995 && !triggered) {
                setTriggered(true);
                // Optional: Add a tiny delay before navigating to let the user see the completion
                setTimeout(() => onNavigate(), 100);
            }
        });
        return () => unsubscribe();
    }, [scrollYProgress, triggered, onNavigate]);

    return (
        <section 
            ref={containerRef} 
            // Increased height to 150vh. This means the user must scroll 1.5x height of screen
            // to get from top of footer to bottom, creating a "robust" physical scroll feel.
            className="h-[150vh] w-full flex flex-col items-center justify-center relative bg-[#050505] border-t border-white/5 mt-0 z-20"
        >
            <div className="flex flex-col items-center gap-6 relative z-10 pointer-events-none sticky top-1/2 -translate-y-1/2">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500">
                    Next Project
                </span>

                {/* Circular Progress Indicator */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Track */}
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#222" strokeWidth="1" />
                        {/* Filling Indicator */}
                        <M.circle 
                            cx="50" 
                            cy="50" 
                            r="46" 
                            fill="none" 
                            stroke="#fff" 
                            strokeWidth="2" 
                            pathLength="100"
                            strokeDasharray="100 100"
                            style={{ strokeDashoffset: useTransform(smoothProgress, [0, 100], [100, 0]) }}
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ArrowRight className="text-white w-6 h-6" />
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{nextProject.title}</h2>
                    <p className="text-xs text-gray-600 mt-2 font-mono uppercase tracking-widest">Keep scrolling to enter</p>
                </div>
            </div>
        </section>
    );
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects, template }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const lenis = useLenis();
    const { scrollY } = useScroll();
    
    // --- 1. Immediate Data Retrieval (No Loading Flash) ---
    const projectIndex = projects.findIndex(p => String(p.id) === id || String(projects.indexOf(p)) === id);
    const project = projects[projectIndex];

    // --- 2. Infinite Loop Logic ---
    const nextIndex = projectIndex === -1 ? 0 : (projectIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];

    // --- 3. Instant Scroll Reset (Before Paint) ---
    useLayoutEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true, lock: true }); 
            setTimeout(() => lenis.start(), 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [id, lenis]);

    const handleNavigate = () => {
        navigate(`/project/${nextProject.id !== undefined ? nextProject.id : nextIndex}`);
    };

    if (!project) {
        return <div className="min-h-screen bg-[#050505]" />; 
    }

    const isElite = template === 'elite';
    const baseClasses = isElite 
        ? "bg-[#050505] text-white selection:bg-white selection:text-black min-h-screen font-sans overflow-x-hidden" 
        : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans";

    const imageY = useTransform(scrollY, [0, 1000], [0, 150]);
    const imageOpacity = useTransform(scrollY, [0, 600], [1, 0.3]);

    return (
        <div className={baseClasses}>
            {/* 
               CRITICAL: Nav must be OUTSIDE the motion.div.
            */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
                <Link to="/gallery" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity group pointer-events-auto">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </Link>
                {isElite && <span className="text-xs font-mono opacity-50 uppercase tracking-widest hidden md:block">Project Details</span>}
            </nav>

            {/* 
               Content Wrapper
               Slow down the duration to 1.2s for a "slow professional" landing.
            */}
            <M.div
                key={id} 
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
                className="w-full relative"
            >
                {/* Hero Section */}
                <header className="relative w-full h-[85vh] overflow-hidden bg-[#050505] flex flex-col justify-end">
                    <M.div style={{ y: imageY, opacity: imageOpacity }} className="absolute inset-0 z-0">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-[120%] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    </M.div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24">
                        <M.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="flex gap-4 mb-6">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs font-mono uppercase tracking-widest px-3 py-1 border border-white/20 rounded-full bg-black/40 backdrop-blur-md text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-2 leading-[0.95] tracking-tight">
                                {project.title.toUpperCase()}
                            </h1>
                        </M.div>
                    </div>
                </header>

                {/* Content Body */}
                <main className="max-w-6xl mx-auto px-6 py-24 space-y-32 relative z-20 bg-[#050505]">
                    {/* Description & Links */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-20">
                         <div className="md:col-span-8">
                            <M.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="text-xl md:text-3xl font-light leading-relaxed text-gray-300"
                            >
                                {project.description}
                            </M.p>
                         </div>
                         <div className="md:col-span-4 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Links</h3>
                                <div className="flex flex-col gap-3">
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors group text-white">
                                            <span>Live Demo</span> <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors group text-white">
                                            <span>Source Code</span> <Github size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    )}
                                    {project.huggingFaceUrl && (
                                        <a href={project.huggingFaceUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-white/10 hover:bg-white/5 transition-colors group text-yellow-500">
                                            <span>Hugging Face</span> <Box size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Media Showcase */}
                    {project.videoUrl && (
                        <div className="w-full aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/5 shadow-2xl">
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
                    )}

                    {/* Additional Text */}
                    <section className="grid md:grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">The Challenge</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Developing this solution required overcoming significant technical hurdles. We focused on optimizing performance while maintaining a high level of interactivity.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">The Solution</h2>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                We utilized a modern tech stack to ensure scalability. By implementing custom shaders and efficient state management, the application delivers a smooth experience.
                            </p>
                        </div>
                    </section>
                </main>

                {/* Force Scroll Footer */}
                {/* KEY PROP ENSURES SCROLL TRACKER RESETS ON NAVIGATION */}
                <NextProjectPortal 
                    key={nextProject.id || nextIndex} 
                    nextProject={nextProject} 
                    onNavigate={handleNavigate} 
                />
            </M.div>
        </div>
    );
};

export default ProjectDetails;
