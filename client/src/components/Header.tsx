import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-soft glass-blur border-b border-black/10' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`max-w-[1200px] mx-auto px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <a href="#" className="font-heading font-semibold text-xl flex items-center gap-2">
          <span className="font-extrabold">HS.</span>
          <span className="font-medium text-lg hidden sm:inline">Harsh Sharma</span>
        </a>
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-secondary hover:text-text transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#projects"
          className="hidden md:block bg-text text-background font-medium py-2 px-5 rounded-full hover:bg-secondary transition-colors"
        >
          View My Work
        </a>
      </div>
    </motion.header>
  );
};

export default Header;