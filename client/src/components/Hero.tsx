import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroData } from '../types';
import { ArrowDown } from 'lucide-react';
import ShinyText from './ShinyText';
import './ShinyText.css';

interface HeroProps {
  data: HeroData;
  template?: string;
}

const Hero: React.FC<HeroProps> = ({ data, template = 'default' }) => {
    const taglines = ["AI Engineer.", "Machine Learning Enthusiast.", "Building intelligent systems."];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

  const isMinimalist = template === 'minimalist';
  const isRotating = template === 'default' || template === undefined;

  return (
    <section id="home" className="h-screen flex flex-col items-center justify-center text-center relative">
      <div className="max-w-4xl px-4">
        <motion.h1 
          className="font-heading font-extrabold text-text dark:text-dark-text"
          style={{ fontSize: 'clamp(40px, 8vw, 96px)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {template === 'dotgrid' || template === 'starrynight' ? (
            <ShinyText text={data.name} speed={3} />
          ) : (
            data.name
          )}
        </motion.h1>
        
        {isMinimalist ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <p className="text-xl md:text-2xl text-secondary dark:text-dark-secondary mt-4 font-medium">
              {data.title}
            </p>
            <motion.div
              className="h-1 bg-primary dark:bg-dark-primary mt-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '250px' }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
        ) : (
          <div className="h-24 mt-4 relative w-full overflow-hidden flex justify-center">
              <AnimatePresence mode="wait">
                  <motion.div
                      key={taglines[index]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute flex flex-col items-center justify-center w-full"
                  >
                      <p className="text-xl md:text-2xl text-secondary dark:text-dark-secondary font-medium">
                          {taglines[index]}
                      </p>
                      {/* Blue Underline for Default */}
                      <motion.div 
                          className="h-1 bg-primary dark:bg-dark-primary mt-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '180px' }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                  </motion.div>
              </AnimatePresence>
          </div>
        )}
      </div>

      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <a href="#about" aria-label="Scroll down">
          <ArrowDown className="w-6 h-6 text-secondary dark:text-dark-secondary animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;