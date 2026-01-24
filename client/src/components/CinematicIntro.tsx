import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
    name: string;
    onComplete: () => void;
    loaded: boolean;
}

const statusMessages = [
    "INITIALIZING",
    "CHECKING SYSTEMS",
    "ESTABLISHING UPLINK",
    "READY"
];

const NAME_HOLD_MS = 1000;

const CinematicIntro: React.FC<CinematicIntroProps> = ({ name, onComplete, loaded }) => {
    const [progress, setProgress] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const totalMessages = statusMessages.length;
        const newIndex = Math.min(
            Math.floor((progress / 100) * totalMessages),
            totalMessages - 1
        );
        setMessageIndex(newIndex);
    }, [progress]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90 && !loaded) return 90;
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsFinished(true);
                    return 100;
                }
                const jump = Math.random() > 0.5 ? 4 : 2;
                return Math.min(prev + jump, 100);
            });
        }, 30);

        return () => clearInterval(interval);
    }, [loaded]);

    useEffect(() => {
        if (isFinished) {
            const timer = setTimeout(onComplete, NAME_HOLD_MS);
            return () => clearTimeout(timer);
        }
    }, [isFinished, onComplete]);

    const firstName = name.split(' ')[0] || "PORTFOLIO";
    const lastName = name.split(' ').slice(1).join(' ');

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden h-[100svh]"
            exit={{
                opacity: 0,
                transition: { duration: 1.2, ease: "easeInOut" }
            }}
        >
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key="loader"
                        className="w-full max-w-sm px-6"
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                    >
                        <div className="flex justify-between text-[10px] font-mono text-gray-500 tracking-widest mb-2">
                            <motion.span
                                key={statusMessages[messageIndex]}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {statusMessages[messageIndex]}
                            </motion.span>
                            <span>{progress.toString().padStart(3, '0')}%</span>
                        </div>

                        <div className="w-full h-px bg-white/10 overflow-hidden">
                            <motion.div
    className="h-full bg-white origin-left"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: progress / 100 }}
    transition={{ ease: "linear", duration: 0.1 }}
/>

                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal"
                        className="text-center"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-2">
                            {firstName} {lastName}
                        </h1>
                        <p className="text-xs font-mono text-gray-500 tracking-[0.3em] uppercase">
                            Portfolio Loaded
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CinematicIntro;
