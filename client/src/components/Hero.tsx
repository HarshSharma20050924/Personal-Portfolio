import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroData } from '../types';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  data: HeroData;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
    const taglines = ["AI Engineer.", "Machine Learning Enthusiast.", "Building intelligent systems."];
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [taglines.length]);


  return (
    <section id="home" className="h-screen flex flex-col items-center justify-center text-center relative">
      <div className="max-w-4xl">
        <motion.h1 
          className="font-heading font-extrabold text-text"
          style={{ fontSize: 'clamp(40px, 8vw, 96px)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {data.name}
        </motion.h1>
        
        <div className="h-16 mt-4 relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={taglines[index]}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                >
                    <p className="text-xl md:text-2xl text-secondary">
                        {taglines[index]}
                    </p>
                    <motion.div 
                        className="h-0.5 bg-primary mt-1"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="w-6 h-6 text-secondary animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};


export default Hero;