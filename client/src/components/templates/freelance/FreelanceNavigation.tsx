
import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const FreelanceNavigation = () => {
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const links = [
    { name: "Expertise", path: "/#services" },
    { name: "About", path: "/#about" },
    { name: "Work", path: "/work" },
  ];

  const handleNav = (path: string) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const hash = path.substring(1); 
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -20, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-8 px-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/5 rounded-full px-8 py-4 flex items-center gap-10 shadow-2xl transition-all hover:bg-black/60 hover:border-white/10">
          <button onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth'}); }} className="clickable font-display text-lg text-white font-bold tracking-tight bg-transparent border-none">
            Harsh.
          </button>
          
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button 
                key={link.name} 
                onClick={() => handleNav(link.path)}
                className="clickable text-xs font-medium text-elite-sub hover:text-white transition-colors uppercase tracking-widest bg-transparent border-none cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/contact')}
              className="clickable hidden md:block bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Consult
            </button>
            <button className="clickable md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div 
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, pointerEvents: "auto" },
          closed: { opacity: 0, pointerEvents: "none" }
        }}
        className="fixed inset-0 z-30 bg-black/95 backdrop-blur-lg pt-32 px-6 md:hidden flex flex-col items-center gap-8"
      >
        {links.map((link) => (
          <button 
            key={link.name} 
            onClick={() => handleNav(link.path)}
            className="text-3xl font-display font-medium text-white/80 hover:text-white bg-transparent border-none"
          >
            {link.name}
          </button>
        ))}
         <button 
            onClick={() => { handleNav('/contact'); }}
            className="text-3xl font-display font-medium text-white mt-4"
          >
            Start Project
          </button>
      </motion.div>
    </>
  );
};
