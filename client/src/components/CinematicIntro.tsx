
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => {
                if (prev >= 99 && !loaded) return 99;
                if (prev === 100) {
                    clearInterval(interval);
                    return 100;
                }
                const jump = Math.floor(Math.random() * 15) + 5; // Slightly faster for responsiveness
                return Math.min(prev + jump, 100);
            });
        }, 80);
        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        if (count < 90) {
            const wordInterval = setInterval(() => {
                setIndex((prev) => (prev + 1) % words.length);
            }, 200);
            return () => clearInterval(wordInterval);
        }
    }, [count]);

    useEffect(() => {
        if (count === 100) {
            const timer = setTimeout(() => {
                onComplete();
            }, 600); 
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    const firstName = name.split(' ')[0] || "ARCHITECT";
    const lastName = name.split(' ').slice(1).join(' ') || "DEV";

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#080808] text-white px-6 py-10 overflow-hidden cursor-wait"
            initial={{ opacity: 1 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full opacity-40">
                <span className="font-mono text-[10px] tracking-widest uppercase">
                    Core_Kernel.v1
                </span>
                <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">
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
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-gray-600 mix-blend-difference uppercase">
                                {words[index]}
                            </div>
                            
                            {/* Centered Progress UI */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
                                    <motion.div 
                                        className="absolute inset-0 bg-white"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: `${count - 100}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                                <span className="font-mono text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                                    Loading Assets {count}%
                                </span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="name" className="text-center relative">
                            <motion.h1 
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                                className="text-[15vw] md:text-[12vw] leading-none font-black tracking-tighter text-white mix-blend-difference"
                            >
                                {firstName}
                            </motion.h1>
                            {lastName && (
                                <motion.h1 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
                                    className="text-[15vw] md:text-[12vw] leading-none font-black tracking-tighter text-gray-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] blur-md"
                                >
                                    {lastName}
                                </motion.h1>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Bar - Minimalism */}
            <div className="flex justify-between items-end w-full opacity-30">
                <span className="font-mono text-[10px] uppercase tracking-widest">System Ready</span>
                <span className="font-mono text-[10px] uppercase tracking-widest tracking-tighter">{new Date().toLocaleTimeString()}</span>
            </div>
        </motion.div>
    );
};

export default CinematicIntro;
