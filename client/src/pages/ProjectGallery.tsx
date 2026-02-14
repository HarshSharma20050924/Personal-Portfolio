
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { Project } from '../types';

const M = motion as any;

interface ProjectGalleryProps {
    projects: Project[];
    template?: string;
}

// Clean Card Component - No swipe, just click
const GalleryCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    return (
        <M.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto mb-24 md:mb-32 relative group"
        >
            <Link to={`/project/${project.id !== undefined ? project.id : index}`} className="block relative elite-interactive">
                {/* Image Container */}
                <div className="relative aspect-[2/1] overflow-hidden bg-gray-100 dark:bg-[#111] border border-black/5 dark:border-white/5 group-hover:border-black/20 dark:group-hover:border-white/20 transition-colors duration-500">
                    <M.img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-[120%] object-cover absolute top-[-10%] left-0 filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Typography */}
                <div className="flex items-start justify-between mt-6 px-2">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-600">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h2 className="text-2xl md:text-5xl font-bold text-gray-400 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors tracking-tight">
                                {project.title}
                            </h2>
                        </div>
                        <p className="text-gray-500 text-sm max-w-md line-clamp-2 pl-8 hidden md:block">
                            {project.description}
                        </p>
                    </div>
                    
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-600 uppercase tracking-widest border border-black/10 dark:border-white/10 px-3 py-1 rounded-full group-hover:text-black dark:group-hover:text-white group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors">
                        {project.tags[0]}
                    </span>
                </div>
            </Link>
        </M.div>
    );
};

// Auto-Loop Footer Component (Vertical Scroll Reset)
const LoopBackPortal: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [triggered, setTriggered] = useState(false);
    const lenis = useLenis();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"] 
    });

    const progressMap = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const smoothProgress = useSpring(progressMap, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            if (v >= 99 && !triggered) {
                setTriggered(true);
                if (lenis) {
                    lenis.scrollTo(0, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) }); // Smooth scroll back to top
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                // Reset trigger after scroll
                setTimeout(() => setTriggered(false), 2000);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress, triggered, lenis]);

    return (
        <section ref={containerRef} className="h-[40vh] flex flex-col items-center justify-center opacity-50 relative">
             <div className="flex flex-col items-center gap-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-black dark:text-white">System Reset</span>
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth="2" className="text-black dark:text-white" />
                        <M.circle 
                            cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" pathLength="100" strokeDasharray="100 100"
                            className="text-black dark:text-white"
                            style={{ strokeDashoffset: useTransform(smoothProgress, [0, 100], [100, 0]) }}
                        />
                    </svg>
                    <ArrowUp size={16} className="text-black dark:text-white" />
                </div>
             </div>
        </section>
    );
};

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects, template }) => {
    const isElite = template === 'elite' || template === 'freelance';
    
    // Filter projects based on template
    const displayProjects = template === 'freelance' 
        ? projects.filter(p => p.showInFreelance)
        : projects;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const baseClasses = isElite 
        ? "bg-white dark:bg-[#050505] text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black min-h-screen transition-colors duration-500" 
        : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen";

    return (
        <M.div 
            className={baseClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-6 pt-10 md:pt-6 flex justify-between items-center bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-500">
                <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity elite-interactive text-black dark:text-white">
                    <ArrowLeft size={18} />
                    Back
                </Link>
                <h1 className="text-[10px] uppercase tracking-[0.3em] font-mono text-gray-400 dark:text-white/50">Full Archive</h1>
            </nav>

            {/* Increased padding-top for mobile to clear header */}
            <div className="pt-28 md:pt-40 pb-0 px-4 md:px-6">
                <M.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto mb-24 border-b border-black/10 dark:border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-black dark:text-white mb-2">WORKS</h1>
                        <p className="text-gray-500 text-sm max-w-md mt-4">
                            Curated digital experiences.
                        </p>
                    </div>
                    <div className="text-right hidden md:block">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-600 uppercase tracking-widest block">
                            Total Projects
                        </span>
                        <span className="text-2xl font-mono text-black dark:text-white">
                            {String(displayProjects.length).padStart(2, '0')}
                        </span>
                    </div>
                </M.div>

                {/* Render Projects */}
                <div className="flex flex-col gap-8 md:gap-12 min-h-[50vh]">
                    {displayProjects.length > 0 ? displayProjects.map((project, idx) => (
                        <GalleryCard key={project.id || idx} project={project} index={idx} />
                    )) : (
                        <div className="text-center text-gray-500 py-20">No projects visible in this archive.</div>
                    )}
                </div>
                
                {/* Loop Back Logic */}
                <LoopBackPortal />
            </div>
        </M.div>
    );
};

export default ProjectGallery;
