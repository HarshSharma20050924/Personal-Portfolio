
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
    name: string;
    onComplete: () => void;
    loaded: boolean;
}

const techTerms = [
    "INITIALIZING SYSTEM",
    "LOADING ASSETS",
    "COMPILING SHADERS",
    "OPTIMIZING CORE",
    "ACCESS GRANTED"
];

const CinematicIntro: React.FC<CinematicIntroProps> = ({ name, onComplete, loaded }) => {
    const [progress, setProgress] = useState(0);
    const [termIndex, setTermIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Map progress to tech terms
        const totalTerms = techTerms.length;
        const newIndex = Math.min(Math.floor((progress / 100) * totalTerms), totalTerms - 1);
        setTermIndex(newIndex);
    }, [progress]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90 && !loaded) return 90; // Stall if data isn't ready
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsFinished(true);
                    return 100;
                }
                const jump = Math.random() > 0.5 ? 4 : 1; // Variable speed
                return Math.min(prev + jump, 100);
            });
        }, 40);
        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        if (isFinished) {
            const timer = setTimeout(() => {
                onComplete();
            }, 1500); // Hold the name for 1.5s
            return () => clearTimeout(timer);
        }
    }, [isFinished, onComplete]);

    const firstName = name.split(' ')[0] || "HARSH";
    const lastName = name.split(' ').slice(1).join(' ') || "SHARMA";

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden cursor-wait"
            exit={{ 
                opacity: 0,
                filter: "blur(20px)",
                transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
                     backgroundSize: '60px 60px' 
                 }} 
            />

            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div 
                        key="loader"
                        className="relative z-10 w-full max-w-md flex flex-col items-center"
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
                    >
                        {/* Large Background Counter */}
                        <div className="relative mb-12">
                            <motion.span 
                                className="text-[20vw] md:text-[150px] font-black text-white/5 leading-none tracking-tighter select-none"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {progress}
                            </motion.span>
                            
                            {/* Overlay Info */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.div 
                                    key={techTerms[termIndex]}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-xs md:text-sm font-mono text-white uppercase tracking-[0.4em] mb-2"
                                >
                                    {techTerms[termIndex]}
                                </motion.div>
                                <div className="w-24 h-[2px] bg-white/10 overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-white" 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 0.8, 
                                            ease: "easeInOut" 
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="name" 
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="overflow-hidden">
                            <motion.h1 
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                className="text-[12vw] md:text-8xl font-black text-white tracking-tighter leading-none mix-blend-difference"
                            >
                                {firstName}
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1 
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                                className="text-[12vw] md:text-8xl font-black text-gray-500 tracking-tighter leading-none"
                            >
                                {lastName}
                            </motion.h1>
                        </div>
                        
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "60px", opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="h-1 bg-blue-500 mt-8"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Tech Bar */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end opacity-40 mix-blend-difference">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                        Core.sys.v2
                    </span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
                    </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest">
                    {new Date().getFullYear()} © DEV
                </span>
            </div>
        </motion.div>
    );
};

export default CinematicIntro;
