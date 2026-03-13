
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemLabsLogo } from './SystemLabsLogo';

interface FreelanceIntroProps {
    onComplete: () => void;
    loaded: boolean;
}

export const FreelanceIntro: React.FC<FreelanceIntroProps> = ({ onComplete, loaded }) => {
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
                const diff = Math.random() * 8 + 4;
                return Math.min(prev + diff, 100);
            });
        }, 100);
        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        if (phase === 'reveal') {
            const timer = setTimeout(onComplete, 2000);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#0D0D0D] flex items-center justify-center overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {phase === 'loading' ? (
                    <motion.div
                        key="loading-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center gap-8"
                    >
                        <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-mono tracking-[1em] text-blue-500 uppercase animate-pulse">
                                SYSTEM_LABS
                             </span>
                             <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_15px_#3b82f6]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear" }}
                                />
                             </div>
                        </div>
                        
                        <div className="flex gap-4">
                           {[...Array(4)].map((_, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: progress > (i * 25) ? 1 : 0.2 }}
                                className="w-1 h-1 bg-white rounded-full"
                             />
                           ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative flex flex-col items-center text-center px-10"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="mb-6"
                        >
                            <SystemLabsLogo className="w-20 h-20 text-white" />
                        </motion.div>

                        <motion.div
                            initial={{ letterSpacing: "1.5em", opacity: 0, filter: "blur(10px)" }}
                            animate={{ letterSpacing: "0.2em", opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="text-3xl md:text-6xl font-display font-medium text-white tracking-[0.2em] md:tracking-[0.5em] uppercase mb-4"
                        >
                            SYSTEMLABS
                        </motion.div>

                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent max-w-sm w-full mb-6"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.6, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="text-xs font-mono tracking-[0.4em] text-white/60 uppercase"
                        >
                            ENGINEERING OPERATIONAL AUTONOMY
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, times: [0, 0.5, 1], repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-10"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
