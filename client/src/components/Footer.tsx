import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FooterProps {
  name: string;
}

const Footer: React.FC<FooterProps> = ({ name }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <footer className="bg-off-white dark:bg-dark-off-black mt-16">
      <motion.div 
        ref={ref}
        className="max-w-[1200px] mx-auto px-8 py-6 text-center text-secondary dark:text-dark-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <p>&copy; {new Date().getFullYear()} {name} | Built with ❤️ and React.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
