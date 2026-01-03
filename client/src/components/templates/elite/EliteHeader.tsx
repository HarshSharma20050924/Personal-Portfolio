
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import { Sun, Moon } from 'lucide-react';

interface EliteHeaderProps {
    name: string;
    isDark: boolean;
    toggleTheme: () => void;
}

const EliteHeader: React.FC<EliteHeaderProps> = ({ name, isDark, toggleTheme }) => {
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
      className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center mix-blend-difference text-white dark:text-gray-200"
    >
      <motion.div 
        className="absolute inset-0 z-[-1] pointer-events-none border-b border-black/5 dark:border-white/10"
        style={{ opacity, backdropFilter: `blur(${blur}px)` }}
      />
      
      <div 
        onClick={() => handleScrollTo('hero')} 
        className="font-heading font-bold text-lg tracking-widest cursor-pointer elite-interactive uppercase"
      >
        {name || 'ARCHITECT'}
      </div>

      <div className="flex items-center gap-8">
        <nav className="hidden md:flex gap-8">
            {navItems.map((item) => (
            <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className="text-xs uppercase tracking-widest font-medium hover:opacity-60 transition-opacity elite-interactive relative group"
            >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
            </button>
            ))}
        </nav>

        <button 
            onClick={toggleTheme}
            className="elite-interactive p-2 hover:opacity-60 transition-opacity"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </motion.header>
  );
};

export default EliteHeader;
