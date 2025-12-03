import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import type { Article } from '../types';

interface HeaderProps {
  articles: Article[];
}

const Header: React.FC<HeaderProps> = ({ articles }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();
  
  // Initialize theme state from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
  ];
  
  if (articles && articles.length > 0) {
    navLinks.push({ href: '#blog', label: 'Blog' });
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -80, duration: 1.5 });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 dark:bg-dark-off-black/90 backdrop-blur-md shadow-sm border-gray-200 dark:border-white/5 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
        <a 
          href="#home" 
          onClick={(e) => handleScrollTo(e, '#home')}
          className="font-heading font-semibold text-xl flex items-center gap-2 text-text dark:text-dark-text"
        >
          <span className="font-extrabold text-primary dark:text-dark-primary">HS.</span>
          <span className="font-medium text-lg hidden sm:inline">Harsh Sharma</span>
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-medium text-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-dark-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary dark:bg-dark-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="hidden md:block bg-primary text-white font-medium text-sm py-2.5 px-6 rounded-full hover:bg-blue-600 hover:scale-105 transform transition-all shadow-md hover:shadow-lg"
          >
            Contact Me
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;