
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const EliteCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Motion values for raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for the trailing ring
  const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices for performance
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements (links, buttons, or specific class)
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('elite-interactive') ||
        target.closest('.elite-interactive');
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* The Core Dot - Moves instantly */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      
      {/* The Magnetic Ring - Follows with physics */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className={`fixed top-0 left-0 border border-white pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out mix-blend-difference ${
          isHovering 
            ? 'w-12 h-12 bg-white/20 border-transparent scale-110 backdrop-blur-[1px]' 
            : 'w-8 h-8 rounded-full'
        }`}
        animate={{
            borderRadius: isHovering ? '30%' : '50%'
        }}
      />
    </>
  );
};

export default EliteCursor;
