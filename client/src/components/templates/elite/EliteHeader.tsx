import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';

interface EliteHeaderProps {
    name: string;
}

const EliteHeader: React.FC<EliteHeaderProps> = ({ name }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    lenis?.scrollTo(`#${id}`, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  };

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'Philosophy', id: 'philosophy' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center mix-blend-difference text-white"
    >
      <motion.div 
        className="absolute inset-0 z-[-1] pointer-events-none border-b border-white/10"
        style={{ opacity, backdropFilter: `blur(${blur}px)` }}
      />
      
      <div 
        onClick={() => handleScrollTo('hero')} 
        className="font-heading font-bold text-lg tracking-widest cursor-pointer elite-interactive uppercase"
      >
        {name || 'ARCHITECT'}
      </div>

      <nav className="flex gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)}
            className="text-xs uppercase tracking-widest font-medium hover:text-gray-400 transition-colors elite-interactive relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </button>
        ))}
      </nav>
    </motion.header>
  );
};

export default EliteHeader;