
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
    name: string;
    onComplete: () => void;
    loaded: boolean;
}

const words = ["VISION", "CRAFT", "SYSTEM", "DESIGN"];

const CinematicIntro: React.FC<CinematicIntroProps> = ({ name, onComplete, loaded }) => {
    const [count, setCount] = useState(0);
    const [index, setIndex] = useState(0);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    useEffect(() => {
        // Counter Animation
        const interval = setInterval(() => {
            setCount((prev) => {
                // Stall at 99 if data isn't loaded yet
                if (prev >= 99 && !loaded) {
                    return 99;
                }
                
                if (prev === 100) {
                    clearInterval(interval);
                    return 100;
                }
                
                // Non-linear increment for realism
                const jump = Math.floor(Math.random() * 10) + 1;
                return Math.min(prev + jump, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        // Word cycle animation
        if (count < 90) {
            const wordInterval = setInterval(() => {
                setIndex((prev) => (prev + 1) % words.length);
            }, 250);
            return () => clearInterval(wordInterval);
        }
    }, [count]);

    useEffect(() => {
        if (count === 100) {
            // Trigger completion
            const timer = setTimeout(() => {
                onComplete();
            }, 800); 
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    const firstName = name.split(' ')[0] || "ARCHITECT";
    const lastName = name.split(' ').slice(1).join(' ') || "DEV";

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#080808] text-white px-4 md:px-10 py-10 overflow-hidden cursor-wait"
            initial={{ opacity: 1 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="font-mono text-xs md:text-sm tracking-widest text-gray-500">
                    Portfolio &copy; {new Date().getFullYear()}
                </span>
                <span className="font-mono text-xs md:text-sm tracking-widest text-gray-500 hidden md:block">
                    EST. 2024
                </span>
            </div>

            {/* Center Content */}
            <div className="flex flex-col items-center justify-center relative z-10 w-full">
                <AnimatePresence mode="wait">
                    {count < 100 ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } }}
                            className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600 mix-blend-difference uppercase"
                        >
                            {words[index]}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="name"
                            className="text-center relative"
                        >
                            <motion.h1 
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                className="text-[12vw] leading-none font-black tracking-tighter text-white mix-blend-difference"
                            >
                                {firstName}
                            </motion.h1>
                            {lastName && (
                                <motion.h1 
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                                    className="text-[12vw] leading-none font-black tracking-tighter text-gray-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] blur-sm"
                                >
                                    {lastName}
                                </motion.h1>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end w-full">
                <div className="flex flex-col">
                    <span className="font-mono text-xs text-gray-500 mb-1">
                        {count < 100 ? "LOADING ASSETS" : "SYSTEM READY"}
                    </span>
                    <div className="w-24 h-[1px] bg-gray-800 relative overflow-hidden">
                        <motion.div 
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            animate={{ x: `${count - 100}%` }}
                        />
                    </div>
                </div>
                
                <h2 className="text-[10vw] md:text-[150px] leading-[0.8] font-black tracking-tighter text-white/10 select-none">
                    {count}%
                </h2>
            </div>
        </motion.div>
    );
};

export default CinematicIntro;
