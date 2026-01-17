
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import { Sun, Moon, Menu, X, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface EliteHeaderProps {
    name: string;
    isDark: boolean;
    toggleTheme: () => void;
}

const EliteHeader: React.FC<EliteHeaderProps> = ({ name, isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const location = useLocation();

  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu on click
    if (location.pathname !== '/') {
        window.location.href = `/#${id}`;
    } else {
        lenis?.scrollTo(`#${id}`, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    }
  };

  const openChatbot = () => {
      const chatButton = document.querySelector('.chat-widget-container button');
      if (chatButton instanceof HTMLElement) {
          chatButton.click();
      }
  };

  const navItems = ['Work', 'Experience', 'Blog', 'Contact'];

  return (
    <>
        <motion.header
        className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-6 flex justify-between items-start mix-blend-difference text-white dark:text-gray-200"
        >
        <motion.div 
            className="absolute inset-0 z-[-1] pointer-events-none border-b border-black/5 dark:border-white/10"
            style={{ opacity, backdropFilter: `blur(${blur}px)` }}
        />
        
        {/* Left Side: Name & AI Trigger */}
        <div className="flex flex-col items-start gap-1">
            <div 
                onClick={() => handleScrollTo('hero')} 
                className="font-heading font-bold text-lg tracking-[0.2em] cursor-pointer elite-interactive uppercase"
            >
                {name || 'ARCHITECT'}
            </div>
            {/* AI Trigger Tab */}
           <button
  onClick={openChatbot}
  className="flex items-center gap-3 px-2 py-1 text-[13px] font-mono uppercase tracking-wide text-white/80 hover:text-blue-400 transition-all elite-interactive hover:scale-[1.05]"
>
  <Terminal size={14} />
  Portfolio AI
</button>






        </div>

        {/* Right Side: Nav & Theme */}
        <div className="flex items-center gap-6 md:gap-10 pt-1">
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8">
                {navItems.map((item) => {
                    if (item === 'Blog') {
                        return (
                            <Link key={item} to="/blogs" className="text-xs uppercase tracking-widest font-medium hover:opacity-60 transition-opacity elite-interactive relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
                            </Link>
                        );
                    }
                    return (
                        <button
                            key={item}
                            onClick={() => handleScrollTo(item.toLowerCase())}
                            className="text-xs uppercase tracking-widest font-medium hover:opacity-60 transition-opacity elite-interactive relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
                        </button>
                    )
                })}
            </nav>

            <div className="flex items-center gap-4 border-l border-white/20 pl-6 h-6">
                <button 
                    onClick={toggleTheme}
                    className="elite-interactive p-1 hover:text-yellow-400 transition-colors"
                    aria-label="Toggle Theme"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden elite-interactive p-1 hover:opacity-60 transition-opacity"
                    aria-label="Open Menu"
                >
                    <Menu size={20} />
                </button>
            </div>
        </div>
        </motion.header>

        {/* Mobile Full Screen Menu Overlay */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '-100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col p-6"
                >
                    <div className="flex justify-between items-start mb-20">
                        <div className="font-heading font-bold text-lg tracking-[0.2em] uppercase text-white/50">
                            MENU
                        </div>
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-8 px-4">
                        {navItems.map((item, idx) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                            >
                                {item === 'Blog' ? (
                                    <Link 
                                        to="/blogs" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-5xl font-black tracking-tighter hover:text-gray-400 transition-colors"
                                    >
                                        {item}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleScrollTo(item.toLowerCase())}
                                        className="text-5xl font-black tracking-tighter hover:text-gray-400 transition-colors uppercase"
                                    >
                                        {item}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-white/10 pt-6 flex justify-between items-center text-xs font-mono text-gray-500 uppercase tracking-widest">
                        <span>© {new Date().getFullYear()}</span>
                        <span>{name}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};

export default EliteHeader;
