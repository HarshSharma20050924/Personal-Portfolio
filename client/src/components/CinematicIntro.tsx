
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
    name: string;
    onComplete: () => void;
    loaded: boolean;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ name, onComplete, loaded }) => {
    const [phase, setPhase] = useState<'loading' | 'reveal'>('loading');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    if (loaded) setPhase('reveal');
                    return 100;
                }
                const diff = Math.random() * 10 + 2;
                return Math.min(prev + diff, 100);
            });
        }, 80);
        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        if (phase === 'reveal') {
            const timer = setTimeout(onComplete, 2500);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    const firstName = name.split(' ')[0] || "HARSH";
    const lastName = name.split(' ').slice(1).join(' ') || "SHARMA";

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {phase === 'loading' ? (
                    <motion.div
                        key="loading-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center gap-6"
                    >
                        <div className="w-64 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-mono tracking-[0.6em] text-white/50 uppercase">
                                Preparing Profile
                            </span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal-screen"
                        className="relative flex flex-col items-center text-center px-10"
                    >
                        <div className="overflow-hidden mb-4">
                            <motion.h1
                                initial={{ y: 200 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                                className="text-7xl md:text-[8rem] font-display font-bold text-white tracking-tighter uppercase"
                            >
                                {firstName}
                            </motion.h1>
                        </div>

                        <div className="overflow-hidden">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                                className="flex items-center gap-6"
                            >
                                <div className="h-px w-8 bg-blue-500/50" />
                                <span className="text-base font-display tracking-[0.8em] text-white/60 uppercase font-light">
                                    {lastName}
                                </span>
                                <div className="h-px w-8 bg-blue-500/50" />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{ opacity: [0, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CinematicIntro;
