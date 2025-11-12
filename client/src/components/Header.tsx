import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import type { Article } from '../types';


interface HeaderProps {
  articles: Article[];
}


const Header: React.FC<HeaderProps> = ({ articles }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-soft dark:shadow-soft-dark glass-blur' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`max-w-[1200px] mx-auto px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <a href="#" className="font-heading font-semibold text-xl flex items-center gap-2">
          <span className="font-extrabold">HS.</span>
          <span className="font-medium text-lg hidden sm:inline">Harsh Sharma</span>
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-secondary dark:text-dark-secondary hover:text-text dark:hover:text-dark-text transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <a
            href="#contact"
            className="hidden md:block bg-text dark:bg-dark-text text-background dark:text-dark-background font-medium py-2 px-5 rounded-full hover:bg-secondary dark:hover:bg-dark-secondary transition-colors"
          >
            Contact Me
          </a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
