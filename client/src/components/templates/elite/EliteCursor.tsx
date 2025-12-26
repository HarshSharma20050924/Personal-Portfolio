
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const EliteCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth springs for movement
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Scale spring
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('elite-interactive') ||
        target.closest('.elite-interactive')
      ) {
        setIsHovered(true);
        scale.set(3); // Expand cursor
      } else {
        setIsHovered(false);
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, scale]);

  return (
    <motion.div
      className="elite-cursor fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        translateX: smoothX,
        translateY: smoothY,
        scale: scale,
        x: '-50%', // Center align
        y: '-50%',
      }}
    >
        {/* Optional inner dot for precision */}
        {!isHovered && <div className="absolute inset-0 bg-white rounded-full opacity-50" />}
    </motion.div>
  );
};

export default EliteCursor;
